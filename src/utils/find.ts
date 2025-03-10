import { AST } from "../ast";
import { locContainsPos, posAfterOrEqual, posBeforeOrEqual } from "./location";
import { isNewSlotAssignment } from "./root";
import { getNodeChildren, getNodeVisitors } from "./map";
import { NodeType } from "../ast/ast";
import { addBranchId } from "./identifier";
import { getNodeDisplayType } from "./signature";

/**
 * Returns true when branch is id of declarator
 * - Used by member provider when branch may be invalid
 */
export const getNodeIsDecId = (branch: AST.Node[]): boolean => {
    switch (branch.at(-1)?.type) {
        case "VariableDeclaration":
        case "FunctionDeclaration":
            return true;
        case "Identifier":
            switch (branch.at(-3)?.type) {
                case "ClassDeclaration":
                case "PropertyDefinition":
                case "Property":
                    return true;
                default:
                    return false;
            }
        default:
            return false;
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

/** Return branch with added init node */
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
 * Return branch with init value, empty array if none
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
            if (
                getBranchWithInitValue(branch).at(-1)?.type ===
                "ClassExpression"
            )
                return branch;
            return getBranchClassDef(branch.slice(0, -1));
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
            return true;
        default:
            return false;
    }
};

/**
 * Return node branch (including node) where end node is a block element
 * - Pops branch end node until valid block branch found
 */

export const getBranchBlock = (branch: AST.Node[]): AST.Node[] => {
    let i = branch.length - 1;
    while (i >= 0 && !isNodeBlock(branch.at(i))) i--;
    return branch.slice(0, i + 1);
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
): AST.Node => getBranchEndingAtType(branch, type).at(-1);

/**
 * Returns branch slice ending at given type if it exists in the branch, or an empty branch if it doesn't
 */
export const getBranchEndingAtType = (
    branch: AST.Node[],
    type: NodeType,
): AST.Node[] => {
    let i = branch.length - 1;
    while (i >= 0 && branch.at(i).type !== type) i--;
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
