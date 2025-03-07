import { CompletionItemLabel } from "vscode";
import { AST, SQTree as qt } from "../ast";
import { SourceLocation } from "../ast/ast";
import { DocAttr } from "../doc/kind";
import { squirrelToNodeType, squirrelToNodeTypeMaybe, SquirrelType } from "./kind";
import { updateNodeTokenFromType } from "./token";

/**
 * Attempt to create a node representing the given string
 * - Returns a single node - string cannot be multi-node `a | b`
 * - Does NOT attach the new node to the program
 * - Used for doc @type returns, which informs definition, which is used for completions
 */
export const stringToNode = (
    value: string,
    loc?: SourceLocation,
): AST.Node | undefined => {
    if (!value) return;
    const members = value.trim().split(".");
    let member;
    let node: AST.Node;

    while (( member = members.shift() )) {
        const type = squirrelToNodeType(<SquirrelType>member);
        const prop = type ? <AST.Node>{ type } : qt.Identifier(member);
        if (type) updateNodeTokenFromType(prop, <SquirrelType>member);
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
