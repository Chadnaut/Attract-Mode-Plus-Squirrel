import { CompletionItemLabel } from "vscode";
import { AST, SQTree as qt } from "../ast";
import { SourceLocation } from "../ast/ast";
import { DocAttr } from "../doc/kind";
import { squirrelToNodeType, squirrelToNodeTypeMaybe, SquirrelType } from "./kind";
import { updateNodeTokenFromType } from "./token";

/**
 * Attempt to create a node representing the given string
 * - Does NOT attach it to the program
 */
export const stringToNode = (
    value: string,
    loc?: SourceLocation,
): AST.Node | undefined => {
    if (!value) return;
    const parts = value.split(".");
    let node: AST.Node;

    while (parts.length) {
        const name = parts.shift();
        const type = squirrelToNodeType(<SquirrelType>name);
        const prop = type ? <AST.Node>{ type } : qt.Identifier(name);
        if (type) updateNodeTokenFromType(prop, <SquirrelType>name);
        node = node ? qt.MemberExpression(node, prop) : prop;
    }

    node.loc = loc;
    return node;
};

/** Create a node from doc attr type */
export const attrToNode = (attr: DocAttr, asId = false): AST.Node | undefined => {
    if (!attr) return;
    const attrType = <SquirrelType>attr.type;
    const node = stringToNode(asId ? squirrelToNodeTypeMaybe(attrType) : attrType);

    if (attrType === SquirrelType.ARRAY) {
        const elemType = (<CompletionItemLabel>attr.expected?.[0]?.label)?.label;
        (<AST.ArrayExpression>node).elements = elemType ? [stringToNode(asId ? squirrelToNodeTypeMaybe(elemType) : elemType)] : [];
    }

    return node;
};
