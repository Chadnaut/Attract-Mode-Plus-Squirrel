import { AST } from "../ast";
import { getNodeDoc, getDocAttr } from "../doc/find";
import { getNodeVal, getNodeDef } from "./definition";
import { getNodeEnumType } from "./enum";
import { getBranchProgram } from "./find";
import { addBranchId } from "./identifier";
import { isNodeType } from "./kind";
import { getNodeIsParameter, getNodeParamInfo } from "./params";
import { getNodeToken } from "./token";
import { attrToNode, stringToNode } from "./create";

// -----------------------------------------------------------------------------

/**
 * Return evaluated node type
 * - "Instance" if node is class instance
 * - type if node extra contains @type, used for Generators
 * - Node AST type for others
 */
export const getNodeInstanceType = (
    branch: AST.Node[],
    stack: AST.Node[] = [],
): AST.Node[] => {
    const node = branch.at(-1);
    if (!node) return [];
    const program = getBranchProgram(branch);

    const nodeVal = getNodeVal(branch, stack);
    let nodeId = [];
    let isArr = false;

    // nodes with complex types `@param {array(string)}` wont be found using getNodeDef
    // attempt to use the member object
    if (node.type === "MemberExpression") {
        nodeId = addBranchId(
            getNodeDef(branch.concat([(<AST.MemberExpression>node).object])),
        );
        isArr = !!nodeId.length;
    }

    // if (!nodeId.length) nodeId = addBranchId(getNodeDef(nodeVal));
    if (!nodeId.length) nodeId = addBranchId(getNodeDef(branch));

    // @param {type}, and @type force the type
    let attr =
        getNodeParamInfo(nodeId)?.attribute ??
        getDocAttr(getNodeDoc(nodeId), "type") ??
        getDocAttr(getNodeDoc(addBranchId(nodeVal)), "type");

    if (attr) {
        const n = attrToNode(attr, true);
        if (n) {
            const attrBranch = [program, n];
            if (isArr) attrBranch.push(n["elements"]?.[0]);
            return attrBranch;
        }
    }

    const enumType = getNodeEnumType(branch);
    if (enumType) return [program, stringToNode(enumType)];

    // @enum
    const token = getNodeToken(node);
    if (token === "enum") return [program, stringToNode("EnumDeclaration")];

    // @class
    let type: string = nodeVal.at(-1)?.type;
    if (type === "ClassDeclaration" || type === "ClassExpression") {
        return [program, stringToNode(token !== "class" ? "Instance" : type)];
    }

    if (type) return [program, stringToNode(type)];

    return [];
};

/**
 * Get node type definition-node
 * - Used to provide type members, such as "string".len()
 * - Type-def declaration must @lend itself for use
 */
export const getNodeTypeDef = (branch: AST.Node[]): AST.Node[] => {
    const type = getNodeInstanceType(branch);
    if (!type.length) return [];

    const def = getNodeDef(type);
    const n = <AST.Identifier>def.at(-1);
    if (
        n?.type === "Identifier" &&
        isNodeType(n.name) &&
        !getNodeIsParameter(branch) &&
        !getDocAttr(getNodeDoc(def), "lends")
    ) {
        return [];
    }

    return def;
};
