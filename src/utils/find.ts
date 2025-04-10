import { AST } from "../ast";
import { locContainsPos, posAfterOrEqual, posBeforeOrEqual } from "./location";
import { isNewSlotAssignment } from "./root";
import { getNodeChildren, getNodeVisitors } from "./map";
import { NodeType } from "../ast/ast";
import { addBranchId } from "./identifier";
import { getNodeDisplayType } from "./signature";

/**
 * Returns target branch for member completions
 * - Returns undefined when branch invalid for completions
 * - Handles weird AST's that result from "in-progress/invalid" code
 */
export const getMemberCompletionBranch = (
    branch: AST.Node[],
): AST.Node[] | undefined => {
    const node = branch.at(-1);
    if (!node) return;

    if (node.type === "MemberExpression") {
        const m = <AST.MemberExpression>node;
        return m.computed ? branch : [...branch, m.property];
    }

    if (node.type !== "Identifier") return;

    const parent = <AST.MemberExpression>branch.at(-2);
    if (parent?.type !== "MemberExpression") return;
    if (parent.object === node) return branch;
    if (parent.property !== node) return;

    const b = branch.slice(0, -2);
    const id = addBranchId(b).at(-1);
    if (id === parent) return;
    if (id === node) return;

    const obj = parent.object;
    if (!obj) return;

    switch (obj.type) {
        case "VariableDeclaration":
            return;
        case "MemberExpression":
            const m = <AST.MemberExpression>obj;
            return m.computed ? [...b, m] : [...b, m, m.property];
        default:
            return [...b, obj];
    }
};

/**
 * Returns true if node has an init value
 */
export const nodeHasInit = (node: AST.Node): boolean => {
    switch (node?.type) {
        case "VariableDeclarator":
        case "PropertyDefinition":
        case "Property":
            return true;
        case "AssignmentExpression":
            return isNewSlotAssignment([node]);
        default:
            return false;
    }
};

/** Return branch with init node removed */
export const getBranchWithInitKey = (branch: AST.Node[]): AST.Node[] => {
    const node = branch.at(-1);
    switch (node?.type) {
        case "Identifier":
        case "CallExpression":
        case "ClassExpression":
        case "MemberExpression":
            return getBranchWithInitKey(branch.slice(0, -1));
        case undefined:
            return [];
        default:
            return nodeHasInit(node) ? branch : [];
    }
};

/**
 * Return branch with init node added, empty array if none
 * - NOTE: fails if branch already has init value...
 * - VariableDeclarator -> init
 * - PropertyDefinition -> value
 * - Property -> value
 * - AssignmentExpression -> right (for newslots)
 */
export const getBranchWithInitValue = (branch: AST.Node[]): AST.Node[] => {
    const node = branch.at(-1);
    switch (node?.type) {
        case "VariableDeclarator":
            return [...branch, (<AST.VariableDeclarator>node).init];
        case "PropertyDefinition":
            return [...branch, (<AST.PropertyDefinition>node).value];
        case "Property":
            return [...branch, (<AST.Property>node).value];
        case "AssignmentExpression":
            return isNewSlotAssignment(branch)
                ? [...branch, (<AST.AssignmentExpression>node).right]
                : [];
        default:
            return [];
    }
};

/**
 * Return callable node, or undefined
 * - NOTE: Class returns undefined, since members can be called statically
 */
export const getBranchCallable = (branch: AST.Node[]): AST.Node[] => {
    const node = branch.at(-1);
    switch (node?.type) {
        case "FunctionDeclaration":
        case "MethodDefinition":
        case "FunctionExpression":
        case "LambdaExpression":
            return branch;
        case undefined:
            return [];
        default:
            return getBranchCallable(getBranchWithInitValue(branch));
    }
};

const classTypes = ["ClassDeclaration", "ClassExpression"];
export const isNodeClass = (node: AST.Node): boolean =>
    classTypes.includes(node?.type);

/**
 * Return branch trimmed to Function ancestor, or empty array
 */
export const getBranchFunctionDef = (branch: AST.Node[]): AST.Node[] => {
    let i = branch.length;
    while (i > 0) {
        const node = branch[--i];
        switch (node.type) {
            case "LambdaExpression":
            case "FunctionExpression":
                return branch.slice(0, i);
            case "MethodDefinition":
            case "FunctionDeclaration":
                return branch.slice(0, i + 1);
        }
    }
    return [];
};

/** Return branch with class def as tail */
export const getBranchClassDef = (branch: AST.Node[]): AST.Node[] => {
    const node = branch.at(-1);
    if (!node) return [];
    switch (node.type) {
        case "ClassExpression":
            return branch.slice(0, -1);
        case "ClassDeclaration":
            return branch;
        default:
            return getBranchWithInitValue(branch).at(-1)?.type ===
                "ClassExpression"
                ? branch
                : getBranchClassDef(branch.slice(0, -1));
    }
};

export const getBranchWithSuperClass = (branch: AST.Node[]): AST.Node[] => {
    const superVal = (<AST.ClassDeclaration>branch.at(-1))?.superClass;
    return superVal ? [...branch, superVal] : [];
};

export const getBranchWithConstructor = (branch: AST.Node[]): AST.Node[] =>
    getNodeChildren(branch).find(
        (child) =>
            child.at(-1).type === "MethodDefinition" &&
            (<AST.MethodDefinition>child.at(-1)).kind === "constructor",
    ) ?? [];

/**
 * Returns true is block-style node
 * - Program, ClassBody, BlockStatement, LambdaExpression, FunctionExpression
 */
export const isNodeBlock = (node: AST.Node): boolean => {
    switch (node?.type) {
        case "Program":
        case "ClassBody":
        case "BlockStatement":
        case "SwitchCase":
        case "ObjectExpression":
        case "LambdaExpression":
        case "FunctionExpression":

        // SPECIAL
        // - getNodeChildrenVisitorsFlat removes body blocks from these
        // - class them as "blocks" instead
        case "FunctionDeclaration":
        case "MethodDefinition":
            return true;
        default:
            return false;
    }
};

/**
 * Return branch where end node is a block-type element (includes current node)
 * - A block-type element is one that contains child nodes
 * - Pops branch end node until valid block branch found
 */
export const getBranchBlock = (branch: AST.Node[]): AST.Node[] => {
    const b = [...branch];
    while (b.length && !isNodeBlock(b.at(-1))) b.pop();
    return b;
};

export const getBranchProgram = (branch: AST.Node[]): AST.Program =>
    <AST.Program>branch.at(0);

export const getBranchId = (branch: AST.Node[]): AST.Identifier =>
    <AST.Identifier>addBranchId(branch).at(-1);

export const isSameBranch = (a: AST.Node[], b: AST.Node[]): boolean =>
    a.at(-1) === b.at(-1);

/**
 * Returns end node matching type, pops until found
 */
export const getBranchNodeByType = (
    branch: AST.Node[],
    type: NodeType,
): AST.Node => getBranchEndingAtType(branch, [type]).at(-1);

/**
 * Returns branch slice ending at given type if it exists in the branch, or an empty branch if it doesn't
 */
export const getBranchEndingAtType = (
    branch: AST.Node[],
    types: NodeType[],
): AST.Node[] => {
    let i = branch.length - 1;
    while (i >= 0 && !types.includes(branch.at(i).type)) i--;
    return branch.slice(0, i + 1);
};

/**
 * Returns branch slice NOT ending at given type
 */
export const getBranchNotEndingAtType = (
    branch: AST.Node[],
    types: NodeType[],
): AST.Node[] => {
    let i = branch.length - 1;
    while (i >= 0 && types.includes(branch.at(i).type)) i--;
    return branch.slice(0, i + 1);
};

/** Return array of nodes from program, up to and including node at position */
export const getBranchAtPos = (
    program: AST.Program,
    pos: AST.Position,
): AST.Node[] => {
    if (!locContainsPos(program?.loc, pos)) return [];
    const branch: AST.Node[] = [program];
    let visitors: AST.Node[];
    let n: AST.Node = program;
    let child;
    while (n) {
        visitors = getNodeVisitors(n);
        n = null;
        for (child of visitors) {
            if (locContainsPos(child.loc, pos)) {
                branch.push(child);
                n = child;
                break;
            }
        }
    }
    return branch;
};

/** Return end node at position */
export const getNodeAtPos = (
    program: AST.Program,
    pos: AST.Position,
): AST.Node | undefined => getBranchAtPos(program, pos).at(-1);

/** Return child node after position */
export const getNodeAfterPos = (
    program: AST.Program,
    pos: AST.Position,
): AST.Node[] => {
    const branch = getBranchAtPos(program, pos);
    const children = getNodeVisitors(branch.at(-1));
    for (const child of children) {
        if (posAfterOrEqual(child.loc?.start, pos)) {
            return [
                ...branch,
                child.type === "ExpressionStatement"
                    ? (<AST.ExpressionStatement>child).expression
                    : child,
            ];
        }
    }
    return [];
};

/** Return child node before position */
export const getNodeBeforePos = (
    program: AST.Program,
    pos: AST.Position,
): AST.Node[] => {
    const branch = getBranchAtPos(program, pos);
    const children = getNodeVisitors(branch.at(-1)).reverse();
    for (const child of children) {
        if (posBeforeOrEqual(child.loc?.start, pos)) {
            return [
                ...branch,
                child.type === "ExpressionStatement"
                    ? (<AST.ExpressionStatement>child).expression
                    : child,
            ];
        }
    }
    return [];
};

/** Get node siblings with the same name (overloads) */
export const getNodeOverloads = (branch: AST.Node[]): AST.Node[][] => {
    const name = getBranchId(branch)?.name;
    if (!name) return [];
    return getNodeChildren(branch.slice(0, -1)).filter(
        (child) => getBranchId(child)?.name === name,
    );
};

/** Return node type covering all array elements, "any" if none or multiple */
export const getNodeArrayElementType = (branch: AST.Node[]): string => {
    const node = <AST.ArrayExpression>branch.at(-1);
    const elements = node.elements ?? [];
    const types = [];

    // quick test for multiple types
    for (const element of elements) {
        if (!types.includes(element.type)) types.push(element.type);
        if (types.length > 1) return "any";
    }

    return types.length === 1
        ? getNodeDisplayType([...branch, elements[0]])
        : "any";
};
