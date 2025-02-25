import { AST } from "../ast";
import { NodeType } from "../ast/ast";
import { getNodeVal } from "./definition";
import { getBranchId } from "./find";
import { SquirrelType } from "./kind";
import { getNodeToken } from "./token";

export const getEnumType = (branch: AST.Node[]): SquirrelType => {
    switch (getEnumMemberType(branch)) {
        case "StringLiteral":
            return SquirrelType.STRING;
        case "FloatLiteral":
            return SquirrelType.FLOAT;
        case "BooleanLiteral":
            return SquirrelType.BOOLEAN;
        case undefined:
            return SquirrelType.ANY;
        default:
            return SquirrelType.INTEGER;
    }
};

/**
 * Get enum member NodeType
 * - Returns type if all members of the same type
 * - Returns undefined if multiple types
 * - Returns integer if no types
 */
export const getEnumMemberType = (branch: AST.Node[]): NodeType | undefined => {
    const node = branch.at(-1);
    let types: NodeType[] = [];
    switch (node.type) {
        case "EnumDeclaration":
            types = (<AST.EnumDeclaration>node).members.map(
                ({ init }) => init?.type,
            );
            break;
        case "ObjectExpression":
            types = (<AST.ObjectExpression>node).properties.map(
                ({ value }) => value?.type,
            );
            break;
    }

    types = types.filter((type) => type);
    types = [...new Set(types)];

    if (types.length === 0) return "IntegerLiteral";
    if (types.length > 1) return;
    return types[0];
};

/**
 * Returns enum member type if node is returning an enum declaration, or undefined if not
 * - This means a property or return {type} is defined as an enum
 * - The actual node type should be a ScalarLiteral instead
 */
export const getNodeEnumType = (branch: AST.Node[]): NodeType | undefined => {
    const node = branch.at(-1);
    if (!node) return;
    if (node.type === "Identifier") return;

    const nodeValue = getNodeVal(branch);
    if (!nodeValue.length) return;

    // basic type is EnumDeclaration, or token of parent id is enum (ie, doc @enum)
    let isEnum =
        nodeValue.at(-1).type === "EnumDeclaration" ||
        getNodeToken(getBranchId(nodeValue.slice(0, -1))) === "enum";

    if (isEnum) return getEnumMemberType(nodeValue) ?? "Undefined";
};
