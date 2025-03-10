import { SymbolKind } from "vscode";
import { AST, visitorKeys, valueKeys } from "../ast";
import { getNodeVal, setNodeDec } from "./definition";
import { addBranchId } from "./identifier";
import { getNodeParams, setRestNode } from "./params";
import { updateNodeSymbol } from "./symbol";
import { setNodeToken } from "./token";
import { getBranchFunctionDef, getBranchId, getBranchProgram } from "./find";
import { getNewSlotAssignment } from "./root";
import { addImportCalls } from "./program";
import { computeNode } from "./meta";
import { addColorCalls } from "./color";
import { setDocNodeType, updateNodeDoc } from "../doc/create";
import { addArtworkCalls, addMediaCalls } from "./media";
import { addProgramString, clearProgramStrings } from "./string";


// -----------------------------------------------------------------------------
/** Similar to strings, calls are stored to later infer external file links */

const programCallMap = new WeakMap<AST.Program, AST.Node[][]>();

const clearProgramCalls = (program: AST.Program) =>
    programCallMap.set(program, []);

const deleteProgramCalls = (program: AST.Program) =>
    programCallMap.delete(program);

const addProgramCall = (program: AST.Program, callBranch: AST.Node[]) =>
    programCallMap.get(program).push(callBranch);

const getProgramCalls = (program: AST.Program): AST.Node[][] =>
    programCallMap.get(program);

// -----------------------------------------------------------------------------

const nodeTypeMap = new WeakMap<
    AST.Program,
    { branch: AST.Node[]; type: string }[]
>();

const clearNodeTypes = (program: AST.Program) => nodeTypeMap.set(program, []);

const deleteNodeTypes = (program: AST.Program) => nodeTypeMap.delete(program);

const addNodeType = (program: AST.Program, branch: AST.Node[], type: string) =>
    nodeTypeMap.get(program).push({ branch, type });

const getNodeTypes = (
    program: AST.Program,
): { branch: AST.Node[]; type: string }[] => nodeTypeMap.get(program);

// -----------------------------------------------------------------------------
/**
 * Namespace node such as `function foo::bar` should belong to `foo`
 * - Store them until program traversal is complete, and then link them and delete the store
 */

const programNsMap = new WeakMap<AST.Program, AST.Node[][]>();

const clearProgramNamespace = (program: AST.Program) =>
    programNsMap.set(program, []);

const deleteProgramNamespace = (program: AST.Program) =>
    programNsMap.delete(program);

const addProgramNamespace = (branch: AST.Node[]) =>
    programNsMap.get(getBranchProgram(branch)).push(branch);

const getProgramNamespace = (program: AST.Program): AST.Node[][] =>
    programNsMap.get(program);

// -----------------------------------------------------------------------------
/** Store the actual node namespace lookup value */

const nodeNsMap = new WeakMap<AST.Node, AST.Node[][]>();

export const setNodeNamespace = (node: AST.Node[], parent: AST.Node) => {
    if (!nodeNsMap.has(parent)) nodeNsMap.set(parent, []);
    nodeNsMap.get(parent).push(node);
};

export const getNodeNamespace = (node: AST.Node): AST.Node[][] =>
    nodeNsMap.has(node) ? nodeNsMap.get(node) : [];

// -----------------------------------------------------------------------------

/**
 * Set param nodes tokenType to "parameter"
 * - Assists providers since params are not declared like other vars
 */
const updateParamsToken = (branch: AST.Node[]) => {
    getNodeParams(branch).forEach((paramBranch) => {
        const param = paramBranch.at(-1);
        switch (param.type) {
            case "RestElement": {
                // RestElement is a special case, re-type as Identifier for simpler use
                const id = <AST.Identifier>param;
                id.type = "Identifier";
                id.name = "...";
                setRestNode(paramBranch); // track this is a rest node
                setNodeDec(id, [...branch, id]);
                setNodeToken(id, "parameter");
                break;
            }
            case "Identifier": {
                const id = <AST.Identifier>param;
                setNodeDec(id, [...branch, id]);
                setNodeToken(id, "parameter");
                break;
            }
            case "AssignmentPattern": {
                const id = <AST.Identifier>(<AST.AssignmentPattern>param).left;
                setNodeDec(id, [...branch, id]);
                setNodeToken(id, "parameter");
                break;
            }
        }
    });
};

/** Return flat array of node visitor objects */
const getNodeChildrenVisitorsFlat = (branch: AST.Node[]): AST.Node[][] => {
    const node = branch.at(-1);
    let body = [];

    switch (node.type) {
        case "FunctionDeclaration": {
            const n = <AST.FunctionDeclaration>node;
            body = [n.params, n.body?.body].flat(1);
            break;
        }
        case "FunctionExpression": {
            const n = <AST.FunctionExpression>node;
            body = [n.params, n.body?.body].flat(1);
            break;
        }
        case "MethodDefinition": {
            const n = <AST.MethodDefinition>node;
            body = [n.value?.params, n.value?.body?.body].flat(1);
            break;
        }
        case "LambdaExpression": {
            const n = <AST.LambdaExpression>node;
            body = [n.params, n.body].flat(1);
            break;
        }
        case "ClassDeclaration": {
            const n = <AST.ClassDeclaration>node;
            body = [n.body?.body].flat(1);
            break;
        }
        case "ClassExpression": {
            const n = <AST.ClassExpression>node;
            body = [n.body?.body].flat(1);
            break;
        }
        default: {
            const k = valueKeys[node.type];
            if (k) body = k.flatMap((key) => node[key]);
            break;
        }
    }

    return body.filter((n) => !!n).map((n) => [...branch, n]);
};

/** Returns branch containing ALL children nodes */
export const getNodeVisitors = (node: AST.Node): AST.Node[] =>
    visitorKeys[node?.type]?.flatMap((key) => node[key]).filter((n) => n) ?? [];

/**
 * Returns an array of node children, with some caveats
 * - Class and Function "body" is ignored, the nodes within the body are elevated
 * - Class and Function "params" are elevated
 * - VariableDeclaration declarators are elevated
 * - Child Namespaced declarations are IGNORED
 * - Lookup Namespaced declarations are ADDED
 */
export const getNodeChildren = (branch: AST.Node[]): AST.Node[][] => {
    const node = branch.at(-1);
    if (!node) return [];
    const children = getNodeChildrenVisitorsFlat(branch).flatMap(
        (childBranch) => {
            const child = childBranch.at(-1);
            switch (child.type) {
                case "VariableDeclaration":
                    // promote value to higher level
                    return (<AST.VariableDeclaration>child).declarations.map(
                        (d) => {
                            return [...childBranch, d];
                        },
                    );
                case "ExpressionStatement":
                    // promote value to higher level
                    return [
                        [
                            ...childBranch,
                            (<AST.ExpressionStatement>child).expression,
                        ],
                    ];
                case "FunctionDeclaration": {
                    // exclude namespaced declaration
                    const n = <AST.FunctionDeclaration>child;
                    if (n.id?.type === "MemberExpression") return [];
                    return [childBranch];
                }
                case "ClassDeclaration": {
                    // exclude namespaced declaration
                    const n = <AST.ClassDeclaration>child;
                    if (n.id?.type === "MemberExpression") return [];
                    return [childBranch];
                }
                default:
                    return [childBranch];
            }
        },
    );

    // add namespaced children
    children.push(...getNodeNamespace(node));

    // ensure non-null (such as enum members with no value)
    return children.filter((child) => child.length);
};

/**
 * Update node tree in-place with extra properties
 * - Parent, children, body, imports, tokens, params, docBlocks
 * - Requires program to be cached first since the last pass uses getNodeDef
 */
export const createNodeMaps = (
    node: AST.Node,
    branch?: AST.Node[],
): AST.Node => {
    if (!node) return;

    branch = branch ?? [];
    const program = <AST.Program>(branch[0] ?? node);
    const parent = branch.at(-1);

    if (!branch.length) {
        clearProgramStrings(program);
        clearProgramNamespace(program);
        clearProgramCalls(program);
        clearNodeTypes(program);
    }

    branch = [...branch, node];

    switch (node.type) {
        case "MemberExpression": {
            const { property } = <AST.MemberExpression>node;
            computeNode(property, node);
            break;
        }
        case "Identifier": {
            const b = addBranchId(branch);
            const id = getBranchId(b);
            const newBranch = getNewSlotAssignment(b);
            if (newBranch.length) {
                setNodeDec(id, newBranch);
                updateNodeSymbol(b, SymbolKind.Field);
            }
            break;
        }

        case "CallExpression": {
            addProgramCall(program, branch);
            break;
        }
        case "FunctionDeclaration": {
            const n = <AST.FunctionDeclaration>node;
            const b = addBranchId(branch);
            const id = getBranchId(b);
            setNodeDec(id, branch);
            setNodeToken(id, "function");
            updateParamsToken(branch);
            updateNodeSymbol(b, SymbolKind.Function);
            if (n.id?.type === "MemberExpression") {
                addProgramNamespace([
                    ...branch,
                    (<AST.MemberExpression>n.id).object,
                ]);
            }
            break;
        }
        case "FunctionExpression": {
            setNodeToken(node, "function");
            updateParamsToken(branch);
            break;
        }
        case "LambdaExpression": {
            updateParamsToken(branch);
            break;
        }
        case "VariableDeclarator": {
            const b = addBranchId(branch);
            const id = getBranchId(b);
            const p = <AST.VariableDeclaration>parent;
            const c = p?.kind === "const";
            const kind = c ? SymbolKind.Constant : SymbolKind.Variable;
            setNodeDec(id, branch);
            updateNodeSymbol(b, kind);
            break;
        }
        case "AssignmentPattern": {
            const n = <AST.AssignmentPattern>node;
            // Occurs when the param is assigned a default value
            // - Left side is alway identifier?
            setNodeDec(<AST.Identifier>n.left, branch);
            break;
        }
        case "EnumDeclaration": {
            const b = addBranchId(branch);
            const id = getBranchId(b);
            setNodeDec(id, branch);
            setNodeToken(id, "enum");
            updateNodeSymbol(b, SymbolKind.Enum);
            break;
        }
        case "EnumMember": {
            const b = addBranchId(branch);
            const id = getBranchId(b);
            setNodeDec(id, branch);
            updateNodeSymbol(b, SymbolKind.EnumMember);
            break;
        }
        case "Property": {
            const { key } = <AST.Property>node;
            computeNode(key, node);
            const b = addBranchId(branch);
            const id = getBranchId(b);
            setNodeDec(id, branch);
            updateNodeSymbol(b, SymbolKind.Property);
            break;
        }
        case "PropertyDefinition": {
            const { key } = <AST.PropertyDefinition>node;
            computeNode(key, node);
            const b = addBranchId(branch);
            const id = getBranchId(b);
            setNodeDec(id, branch);
            updateNodeSymbol(b, SymbolKind.Property);
            break;
        }
        case "MethodDefinition": {
            const n = <AST.MethodDefinition>node;
            const b = addBranchId(branch);
            const id = getBranchId(b);
            setNodeDec(id, branch);
            setNodeToken(id, "function");
            updateParamsToken(branch);

            if (n.kind === "constructor") {
                updateNodeSymbol(b, SymbolKind.Constructor, "constructor");
            } else {
                updateNodeSymbol(b, SymbolKind.Method);
            }
            break;
        }
        case "ClassDeclaration": {
            const n = <AST.ClassDeclaration>node;
            const b = addBranchId(branch);
            const id = getBranchId(b);
            setNodeDec(id, branch);
            setNodeToken(id, "class");
            updateNodeSymbol(b, SymbolKind.Class);
            if (n.id?.type === "MemberExpression") {
                addProgramNamespace([
                    ...branch,
                    (<AST.MemberExpression>n.id).object,
                ]);
            }
            break;
        }
        case "ClassExpression": {
            setNodeToken(node, "class");
            break;
        }
        case "StringLiteral": {
            addProgramString(branch);
            break;
        }
        case "YieldExpression": {
            // flag the function a yield appears in as a Generator
            const b = addBranchId(getBranchFunctionDef(branch));
            if (b.length) addNodeType(program, b, "Generator");
            break;
        }
    }

    // Process all node children
    visitorKeys[node.type]?.forEach((key) => {
        [node[key]].flat(1).forEach((childNode) => {
            createNodeMaps(childNode, branch);
        });
    });

    // Top level node (Program)
    if (node.type === "Program") {
        // check imports after extras added
        // - may use extra features to resolve filename
        // - update import array on program so subsequent imports can use it
        const calls = getProgramCalls(program);
        addImportCalls(calls);
        addArtworkCalls(calls);
        addMediaCalls(calls);
        addColorCalls(calls);

        // add docs to nodes
        // - also adds meta-nodes to extra body/children (getters / setters)
        updateNodeDoc(program);

        getNodeTypes(program).forEach(({ branch, type }) => {
            setDocNodeType(branch, type);
        });

        // Patch namespace items onto their owner class
        // - may use getImports if moved nodes need to find referenced owners
        getProgramNamespace(program).forEach((n) => {
            setNodeNamespace(n.slice(0, -1), getNodeVal(n).at(-1));
        });

        // cleanup
        deleteProgramCalls(program);
        deleteProgramNamespace(program);
        deleteNodeTypes(program);
    }

    return node;
};
