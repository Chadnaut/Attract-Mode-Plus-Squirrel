import { AST } from "../ast";
import { getDocAttr, getNodeDoc } from "../doc/find";
import { attrToNode } from "./create";
import { createNodeMaps } from "./map";
import { getBranchClassDef, getBranchProgram } from "./find";
import { addBranchId } from "./identifier";
import { setDocNodeType } from "../doc/create";

/**
 * Create node described by doc to override return node
 */
const getDocReturnNode = (branch: AST.Node[]): AST.Node[] => {
    const docBlock = getNodeDoc(branch);
    const attr = getDocAttr(docBlock, "returns");
    if (!attr) return [];

    const node = attrToNode(attr);
    createNodeMaps(node, branch);
    return [...branch, node];
};

/**
 * Return a functions return node, or undefined
 * - Does not resolve the value
 * - May be forced using @return or @type
 */
export const getNodeReturn = (
    branch: AST.Node[]
): AST.Node[] => {
    const node = branch.at(-1);
    if (!node) return [];

    // SPECIAL: docBlock @return overrides actual return
    const returnNode = getDocReturnNode(addBranchId(branch));
    if (returnNode.length) return returnNode;

    // SPECIAL: returns an identifier that leads to type class (Generator)
    const attr = getDocAttr(getNodeDoc(addBranchId(branch)), "type");
    if (attr) {
        const nodeBranch = [getBranchProgram(branch), attrToNode(attr)];
        setDocNodeType(nodeBranch, attr.type);
        return nodeBranch;
    }

    switch (node.type) {
        case "ClassExpression":
        case "ClassDeclaration": {
            return branch;
        }
        case "FunctionDeclaration": {
            const children = (<AST.FunctionDeclaration>node).body?.body ?? [];
            for (const child of children) {
                const n = getNodeReturn([...branch, child]);
                if (n.length) return n;
            }
            break;
        }
        case "FunctionExpression": {
            const children = (<AST.FunctionExpression>node).body?.body ?? [];
            for (const child of children) {
                const n = getNodeReturn([...branch, child]);
                if (n.length) return n;
            }
            break;
        }
        case "MethodDefinition": {
            const n = <AST.MethodDefinition>node;
            if (n.kind === "constructor") {
                return getBranchClassDef(branch);
            }
            const children = n.value?.body?.body ?? [];
            for (const child of children) {
                const n = getNodeReturn([...branch, child]);
                if (n.length) return n;
            }
            break;
        }
        case "LambdaExpression": {
            return [...branch, (<AST.LambdaExpression>node).body];
        }
        case "ReturnStatement": {
            return [...branch, (<AST.ReturnStatement>node).argument];
        }
    }
    return [];
};
