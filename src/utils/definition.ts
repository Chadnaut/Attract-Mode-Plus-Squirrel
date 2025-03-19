import { getNodeChildren } from './map';
import { getNodeReturn } from "./return";
import { AST } from "../ast";
import {
    getBranchWithInitValue,
    getBranchBlock,
    getBranchProgram,
    isSameBranch,
    getBranchClassDef,
    getBranchWithSuperClass,
    getBranchWithInitKey,
    getBranchId,
} from "./find";
import { getProgramImports } from "./program";
import { addBranchId } from "./identifier";
import { getNodeExtendedClasses } from "./super";
import { getNodeParams, isRestNode } from "./params";
import { getNodeTypeDef } from "./type";
import { getNodeAugmentVal } from './augment';

// -----------------------------------------------------------------------------
/*

DEFINITION
- Finds the definition of the target identifier - the point it was created
- Will contain an "id + value" pairing
- Some nodes CONTAIN their ID (ClassDeclaration)
- Some nodes LINK their ID through a declarator (ClassExpression)

Examples finding definition of `abc`:

    local abc = 123;
          ^-------^ VariableDeclarator `abc`

    local obj = { abc = 123; }
                  ^-------^ Property `obj.abc`

    local abc = function() {}
          ^-----------------^ VariableDeclarator `abc`

    function abc() {}
    ^---------------^ Function declaration `abc()`

    enum abc { x = 123 }
    ^------------------^ Enum `abc.x`

    enum my { abc = 123 }
              ^-------^ EnumMember `my.abc`

    local abc = class {}
          ^------------^ VariableDeclarator `abc`

    class abc {}
    ^----------^ Class `abc`

    class foo { abc = 123 }
                ^-------^ PropertyDefinition `foo.abc`

    class foo { function bar() {} }
                ^---------------^ MethodDefinition `foo.bar()`

VALUE
- Returns the definition value
- Usually the right side of the equation

    local abc = 123
                ^-^ IntegerLiteral `abc`

    local abc = { prop = 123 }
                ^------------^ Object Expression `abc`

    local obj = { abc = 123 }
                        ^-^ IntegerLiteral `obj.abc`

    enum abc = { xxx = 123 }
    ^----------------------^ Enum `abc`

    enum my = { abc = 123 }
                      ^-^ IntegerLiteral `my.abc`

    function abc() {};
    ^---------------^ FunctionDeclaration `abc`

    local abc = function() {};
                ^-----------^ FunctionExpression `abc`

    class abc() {};
    ^------------^ ClassDeclaration `abc`

    local abc = class {};
                ^------^ ClassExpression `abc`
*/

// -----------------------------------------------------------------------------
/*
Node declarations - mot to be confused with node definitions!
 - `local x = 123` is a declaration, where x is declared
 - `x` when used later gets resolved to the above, which is a definition
*/

const nodeDecMap = new WeakMap<AST.Identifier, AST.Node[]>();

/** Gets an id's declaration value */
export const getNodeDec = (id: AST.Identifier): AST.Node[] =>
    nodeDecMap.has(id) ? nodeDecMap.get(id) : [];

/** True if given id is a declaration, such as `local x = 123` */
export const hasNodeDec = (id: AST.Identifier): boolean => nodeDecMap.has(id);

/** Sets an id's declaration value */
export const setNodeDec = (id: AST.Identifier, definition: AST.Node[]) => {
    if (id) nodeDecMap.set(id, definition);
};

// -----------------------------------------------------------------------------

const nodeDefMap = new WeakMap<AST.Node, AST.Node[]>();

/** Gets an id's definition */
export const getNodeDefMap = (id: AST.Node): AST.Node[] =>
    nodeDefMap.has(id) ? nodeDefMap.get(id) : undefined;

/** True if given id has had its definition resolved */
export const hasNodeDefMap = (id: AST.Node): boolean => nodeDefMap.has(id);

/** Sets an id's definition */
export const setNodeDefMap = (id: AST.Node, definition: AST.Node[]) => {
    if (id) nodeDefMap.set(id, definition);
};

// -----------------------------------------------------------------------------

const nodeValMap = new WeakMap<AST.Node, AST.Node[]>();

export const getNodeValMap = (id: AST.Node): AST.Node[] =>
    nodeValMap.has(id) ? nodeValMap.get(id) : undefined;

export const hasNodeValMap = (id: AST.Node): boolean => nodeValMap.has(id);

export const setNodeValMap = (id: AST.Node, value: AST.Node[]) => {
    nodeValMap.set(id, value);
};

/**
 * Returns the definition of node, an "id + value" pairing
 * - literals, identifiers, this, base, expressions
 */
export const getNodeDef = (
    branch: AST.Node[],
    stack: AST.Node[] = [],
): AST.Node[] => {
    switch (branch.at(-1)?.type) {
        case "Base":
        case "ThisExpression": {
            return resolveNodeDef(branch, stack);
        }
        case "MemberExpression": {
            const { computed } = <AST.MemberExpression>branch.at(-1);
            return !computed ? resolveNodeDef(branch, stack) : [];
        }
        case "CallExpression": {
            return resolveNodeDef(resolveNodeVal(branch), stack);
        }
        case "Identifier": {
            branch = getNodeMemberExpressionIfTail(branch);
            return resolveNodeDef(branch, stack);
        }
        case "ClassExpression":
        case "FunctionExpression":
        case "LambdaExpression": {
            return resolveNodeDef(addBranchId(branch), stack);
        }
        default: {
            return branch;
        }
    }
};

export const getNodeMemberExpressionIfTail = (
    branch: AST.Node[],
): AST.Node[] => {
    const parent = <AST.MemberExpression>branch.at(-2);
    if (parent?.type !== "MemberExpression") return branch;
    if (parent.computed) return branch;
    if (parent.property === branch.at(-1)) return branch.slice(0, -1);
    return branch;
};

export const getNodeCallIfCallee = (branch: AST.Node[]): AST.Node[] => {
    const call = <AST.CallExpression>branch.at(-2);
    if (call?.type !== "CallExpression") return branch;
    if (call.callee === branch.at(-1)) return branch.slice(0, -1);
    return branch;
};

/**
 * Return resolved node value
 * - If (callable AND called) return resolved node, otherwise return func
 */
export const getNodeVal = (
    branch: AST.Node[],
    stack: AST.Node[] = [],
): AST.Node[] => {
    branch = getNodeMemberExpressionIfTail(branch);
    branch = getNodeCallIfCallee(branch);
    return resolveNodeVal(branch, stack);
};

/**
 * Find the original id definition
 */
export const resolveIdDef = (
    idBranch: AST.Node[],
    stack: AST.Node[] = [],
): AST.Node[] => {
    const id = idBranch.at(-1);
    if (!id) return [];
    if (id.type !== "Identifier") return [];

    const disallow: AST.Node[] = [id];
    const init = getBranchWithInitKey(idBranch);
    if (init.length) disallow.push(init.at(-1));

    // look for definition in current program, start outside the current declaration
    const blockBranch = getBranchBlock(idBranch);
    let i = blockBranch.length;
    while (i-- > 0) {
        const child = resolveNodeChild(blockBranch.slice(0, i+1), idBranch, stack);
        if (child.length && !disallow.includes(child.at(-1))) {
            return child;
        }
    }

    // look for definition in imported programs
    const program = getBranchProgram(idBranch);
    for (const p of getProgramImports(program)) {
        const child = resolveNodeChild([p], idBranch, stack);
        if (child.length) {
            return child; // don't cache imports
        }
    }

    // there is no further definition, return original node
    return idBranch;
};

// ------------------------------------------------------

/**
 * Return the child Node that has a definition ID matching the passed id
 * - Checks the entire extended class
 * - If multiple matches are found attempt to find one with correct parameter count
 * - Returns undefined if match not found
 */
export const resolveNodeChild = (
    branch: AST.Node[],
    idBranch: AST.Node[],
    stack: AST.Node[] = [],
): AST.Node[] => {
    const node = branch.at(-1);
    const id = idBranch.at(-1);
    if (!node || !id) return [];

    // return array element at index, or last element if out-of-range
    if (node.type === "ArrayExpression") {
        const arr = (<AST.ArrayExpression>node).elements ?? [];
        let index = (id.type === "IntegerLiteral") ? (<AST.IntegerLiteral>id).value : arr.length-1;
        index = Math.min(Math.max(0, index), arr.length-1);
        return [...branch, arr[index]];
    }

    const name = getBranchId(idBranch)?.name;
    if (!name) return [];

    for (const classBranch of getNodeExtendedClasses(branch)) {
        // get all children with matching id
        // - may return multiple if variations are found (same name, different params)
        const matches = getNodeChildren(classBranch)
            .reduce((results: AST.Node[][], childBranch: AST.Node[]): AST.Node[][] => {
                const childId = getBranchId(childBranch);
                if (
                    hasNodeDec(childId) &&
                    (childId.name === name || (isRestNode(childBranch) && name === "vargv"))
                ) {
                    results.push(childBranch);
                }
                return results;
            }, <AST.Node[][]>[]);

        // for regular scripts there will usually be a single match
        if (matches.length === 1) {
            return matches[0];
        }

        // variations are intended for language completions
        // - attempt to find correct match by checking the call expression arg count
        if (matches.length > 1) {

            const matchBranch = idBranch.slice(0, -1);
            let i = matchBranch.length - 1;
            while (i > 0 && matchBranch.at(i).type === "MemberExpression") i--;
            const p = <AST.CallExpression>matchBranch.at(i);

            const callArgsLen = (p.type === "CallExpression") ? p.arguments.length : 0;

            if (callArgsLen) {
                for (const match of matches) {
                    if (
                        getNodeParams(getNodeVal(match)).length >= callArgsLen
                    ) {
                        return match;
                    }
                }
            }

            // no good match
            return matches[0];
        }
    }

    return [];
};

/** Recursively resolve return values to find the final node value */
const resolveNodeVal = (
    branch: AST.Node[],
    stack: AST.Node[] = [],
): AST.Node[] => {
    const node = branch.at(-1);
    if (!node) return [];
    if (hasNodeValMap(node)) return getNodeValMap(node);
    if (stack.includes(node)) return [];
    stack.push(node);

    switch (node.type) {
        case "AssignmentPattern":
            return resolveNodeVal([...branch, (<AST.AssignmentPattern>node).right], stack);
        case "EnumMember":
            return resolveNodeVal([...branch, (<AST.EnumMember>node).init], stack);
        case "CallExpression": {
            // getNodeReturn may return @return nodes
            const callBranch = [...branch, (<AST.CallExpression>node).callee];
            return resolveNodeVal(getNodeReturn(resolveNodeVal(callBranch)), stack);
        }
        default: {
            // if node has an init value then resolve it, ie: VariableDeclarator.init
            const v = getBranchWithInitValue(branch);
            if (v.length) return resolveNodeVal(v, stack);
            const nodeDef = resolveNodeDef(branch, stack);
            const nodeVal = isSameBranch(nodeDef, branch) ? branch : resolveNodeVal(nodeDef, stack);
            setNodeValMap(node, nodeVal);
            return nodeVal;
        }
    }
};


/**
 * Find nodes source definition
 * - Returns undefined if member cannot be resolved
 */
const resolveNodeDef = (
    branch: AST.Node[],
    stack: AST.Node[],
): AST.Node[] => {
    const node = branch.at(-1);
    if (!node) return [];
    if (node.type === "Identifier") {
        const id = <AST.Identifier>node;
        stack.push(id);
        if (hasNodeDec(id)) return getNodeDec(id);
    }
    if (hasNodeDefMap(node)) return getNodeDefMap(node);
    switch (node.type) {
        case "MemberExpression": {
            const { object, property } = <AST.MemberExpression>node;
            const objBranch = [...branch, object];
            const propBranch = [...branch, property];
            const obj = resolveNodeVal(objBranch, stack);
            let objProp = resolveNodeChild(obj, propBranch, stack);
            if (!objProp.length) {
                // @type or @lends nodes
                objProp = resolveNodeChild(getNodeTypeDef(obj), propBranch, stack);
            }
            if (!objProp.length) {
                // @augments node
                const augObj = getNodeAugmentVal(objBranch);
                objProp = resolveNodeChild(augObj, propBranch, stack);
            }
            setNodeDefMap(node, objProp);
            return objProp;
        }
        case "ThisExpression": {
            const classDef = getBranchClassDef(branch);
            const def = resolveNodeDef(classDef, stack);
            setNodeDefMap(node, def);
            return def;
        }
        case "Base": {
            const classVal = resolveNodeVal(getBranchClassDef(branch));
            const superVal = getBranchWithSuperClass(classVal);
            const def = resolveNodeDef(superVal, stack);
            setNodeDefMap(node, def);
            return def;
        }
        case "Identifier": {
            const idDef = resolveIdDef(branch, stack);
            const def = isSameBranch(idDef, branch) ? branch : resolveNodeDef(idDef, stack);
            setNodeDefMap(node, def);
            return def;
        }
        default: {
            setNodeDefMap(node, branch);
            return branch;
        }
    }
};
