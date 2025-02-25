import { AST } from "../ast";
import { getNodeVal, getNodeDef } from "./definition";
import { getBranchWithInitValue } from "./find";

/** Return true if given DEF is ClassDeclaration or ClassExpression */
export const isClassDef = (branch: AST.Node[]): boolean =>
    (branch.at(-1)?.type === "ClassDeclaration") ||
    (getBranchWithInitValue(branch).at(-1)?.type === "ClassExpression");

/**
 * Return super class declaration
 * - ClassDeclaration
 * - Variable Declarator for ClassExpression
 */
export const getSuperDef = (
    branch: AST.Node[],
    stack: AST.Node[] = [],
): AST.Node[] => {
    const nodeDef = getNodeDef(branch);
    if (!isClassDef(nodeDef)) return [];
    const nodeVal = getNodeVal(nodeDef);
    const superBranch = nodeVal.concat([(<AST.ClassDeclaration>nodeVal.at(-1)).superClass]);
    const superDef = getNodeDef(superBranch, stack);
    if (!isClassDef(superDef)) return [];
    return superDef;
};

/**
 * Return array of superClasses defs all the way up, closest ancestor first
 * - Does NOT include passed node
 */
export const getSuperDefs = (
    branch: AST.Node[],
    stack: AST.Node[] = [],
): AST.Node[][] => {
    const branches = [];
    const defs = [];
    let b = getSuperDef(branch, stack);
    while (b.length && !defs.includes(b.at(-1))) {
        branches.push(b);
        defs.push(b.at(-1))
        b = getSuperDef(b, stack);
    }
    return branches;
};

/**
 * Return array containing Class and SuperClass VALUES, starting from node
 * - Accepts Class def or value
 * - Returns [ClassDeclaration, ClassExpression]
 * - Returns array containing itself if NOT a class
 */
export const getNodeExtendedClasses = (branch: AST.Node[]): AST.Node[][] => {
    const node = branch.at(-1);
    if (!node) return [];
    const nodeDef = getNodeDef(branch);
    if (!isClassDef(nodeDef)) return [branch];
    return [nodeDef, ...getSuperDefs(nodeDef)].map((def) => getNodeVal(def));
};
