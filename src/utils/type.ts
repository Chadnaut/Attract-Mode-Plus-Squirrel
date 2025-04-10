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
 * - type if node extra contains "type" (used for Generators)
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
        const m = <AST.MemberExpression>node;
        nodeId = addBranchId(getNodeDef([...branch, m.object]));
        isArr = !!nodeId.length && m.property.type === "IntegerLiteral";
    }

    if (!nodeId.length) nodeId = addBranchId(getNodeDef(branch));

    // @param {type}, and @type force the type
    let attr =
        getNodeParamInfo(nodeId)?.attribute ??
        getDocAttr(getNodeDoc(nodeId), "type") ??
        getDocAttr(getNodeDoc(addBranchId(nodeVal)), "type");

    if (!attr) {
        // PropertyDefinition
        const propBranch =
            branch.at(-2)?.type === "PropertyDefinition" ? branch : nodeVal;
        const propDef = <AST.PropertyDefinition>propBranch.at(-2);
        if (propDef?.type === "PropertyDefinition") {
            attr = getDocAttr(
                getNodeDoc([...propBranch.slice(0, -1), propDef.key]),
                "type",
            );
        }
    }

    if (attr) {
        // create a node, used to find typedef classes
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

    let nodeValType: string = nodeVal.at(-1)?.type;
    switch (nodeValType) {
        case "ClassDeclaration":
        case "ClassExpression":
            return [program, stringToNode(token !== "class" ? "Instance" : nodeValType)];
        case "ConditionalExpression":
            return getNodeInstanceType(
                [...nodeVal, (<AST.ConditionalExpression>nodeVal.at(-1)).consequent],
                stack,
            );
        default:
            return [program, stringToNode(nodeValType)];
        case undefined:
            return [];
    }
};

/**
 * Get node type definition-node
 * - Used to provide type members, such as "string".len()
 * - Class must lend itself for use
 * - Class id must match the node its defining (simpler to find)
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
