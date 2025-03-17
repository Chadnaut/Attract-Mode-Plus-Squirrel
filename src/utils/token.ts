import { getNodeIsParameter, isRestNode } from "./params";
import {
    SemanticTokens,
    SemanticTokensBuilder,
    SemanticTokensLegend,
    Range,
} from "vscode";
import { positionTranslate, nodeToDocRange } from "./location";
import { getNodeDef, hasNodeDec } from "./definition";
import { addBranchId } from "./identifier";
import { AST, SQTree as qt } from "../ast";
import { inheritDeprecation } from "./deprecated";
import { isNewSlotAssignment } from "./root";
import { SquirrelType } from "./kind";
import { getNodeVisitors } from "./map";

/*
    Semantic tokens are used to highlight syntax impossible for regex to detect.
    Examples: Parameters, Classes, Methods, Functions
    NOTE: Only the first *DECLARATION* is used for the token.

    The same caveats as the JS implementation apply:

    1. Re-assigning / re-declaring does NOT change the tokenType.

        ```js
        var foo = () => {}; // foo styled as a function
        foo = 123; // foo remains styled, even though re-assigned
        ```

    2. Assignments / newslots do NOT create tokenTypes.

        ```js
        var a = { foo: () => {}}; // foo declared as function
        a.foo; // foo IS styled, since it was declared above

        var b = {}; // declared as empty object
        b.foo = () => {}; // foo assigned afterwards
        b.foo; // foo NOT styled
        ```
*/

const nodeTokenMap = new WeakMap<AST.Node, TokenType>();

export const setNodeToken = (node: AST.Node, token: TokenType) => {
    if (!node) return;
    nodeTokenMap.set(node, token);
};

export const hasNodeToken = (node: AST.Node): boolean => nodeTokenMap.has(node);

export const getNodeToken = (node: AST.Node): TokenType =>
    nodeTokenMap.get(node);

export const TOKEN_TYPES = ["link", "parameter", "function", "class", "enum"] as const;

export type TokenType = (typeof TOKEN_TYPES)[number];

export const tokenLegend = new SemanticTokensLegend(TOKEN_TYPES.slice(0));

export const updateNodeTokenFromType = (
    node: AST.Node,
    type: SquirrelType,
): AST.Node => {
    switch (type) {
        case SquirrelType.PARAMETER:
            setNodeToken(node, "parameter");
            break;
        case SquirrelType.CLASS:
            setNodeToken(node, "class");
            break;
        case SquirrelType.FUNCTION:
            setNodeToken(node, "function");
            break;
        case SquirrelType.ENUM:
            setNodeToken(node, "enum");
            break;
    }
    return node;
};

const semanticTokenMap = new WeakMap<AST.Program, SemanticTokens>();

/**
 * Build and return semantic tokens for node tree
 * - Require createNodeMaps and add to have been called
 */
export const getSemanticTokens = (
    program: AST.Program,
): SemanticTokens | undefined => {
    if (!program) return;
    if (semanticTokenMap.has(program)) return semanticTokenMap.get(program);

    const builder = new SemanticTokensBuilder(tokenLegend);
    tokenizeNode(builder, [program]);
    const semanticTokens = builder.build();
    semanticTokenMap.set(program, semanticTokens);

    return semanticTokens;
};

/** Create token at node position and add to the builder */
export const applyToken = (
    builder: SemanticTokensBuilder,
    branch: AST.Node[], // Node,
    tokenType: TokenType,
) => {
    const node = branch.at(-1);
    if (!node) return;
    if (!TOKEN_TYPES.includes(tokenType)) return;
    let range = nodeToDocRange(node);

    if (node.extra?.root) {
        // adjust range for root identifiers to skip "::"
        range = new Range(positionTranslate(range.start, 2), range.end);
    }

    if (!range) return;
    if (!range.isSingleLine) return;
    if (range.isEmpty) return;

    tokenizedNodes.add(node);
    // node.extra.tokenized = true;
    setNodeToken(node, tokenType);
    builder.push(range, tokenType);
};

/** Apply node token to id */
export const inheritToken = (
    builder: SemanticTokensBuilder,
    targetBranch: AST.Node[], // target node
    inheritBranch: AST.Node[], // node to inherit from
    force: boolean = false,
) => {
    const node = inheritBranch.at(-1);
    if (!node) return;
    if (targetBranch.at(-1)?.type !== "Identifier") return;
    if (node.type === "CallExpression") return;

    tokenizeNode(builder, inheritBranch);

    // NOTE: function/class expressions don't have ID
    const nodeId = addBranchId(inheritBranch); // ?? node;

    // inherit deprecated status
    inheritDeprecation(targetBranch, nodeId);

    // tokenType will be on either definition, or identifier
    const tokenType = getNodeToken(node) ?? getNodeToken(nodeId.at(-1));
    if (!tokenType) return;

    // Cannot inherit enum token (unless forced - ie: applying to the original enum)
    if (!force && tokenType === "enum") return;

    // Only inherit parameter token if source is definition (param tokens are not inherited)
    if (
        !hasNodeDec(<AST.Identifier>nodeId.at(-1)) &&
        getNodeIsParameter(inheritBranch)
    )
        return;

    applyToken(builder, targetBranch, tokenType);
};

/** Flags if node has been tokenized, entry will get removed when node deleted */
const tokenizedNodes = new WeakSet<AST.Node>();

/**
 * Process ALL node tokens, inheriting and applying as necessary
 * - Since we're traversing all nodes and docBlocks have been attached...
 * - Also caches deprecated nodes!
 */
export const tokenizeNode = (
    builder: SemanticTokensBuilder,
    branch: AST.Node[],
): AST.Node => {
    const node = branch.at(-1);
    if (!node) return;
    if (tokenizedNodes.has(node)) return;

    tokenizedNodes.add(node);

    switch (node.type) {
        case "Identifier": {
            if (isRestNode(branch)) break; // don't style REST element as a parameter

            // getNodeDef makes this SLOW
            // - effectively ALL identifiers call getNodeDef...

            inheritToken(
                builder,
                branch,
                hasNodeToken(node) ? branch : getNodeDef(branch),
                true,
            );
            break;
        }
        case "AssignmentExpression": {
            if (isNewSlotAssignment(branch)) {
                const { left, right } = <AST.AssignmentExpression>node;
                inheritToken(
                    builder,
                    [...branch, left],
                    [...branch, right],
                );
            }
            break;
        }
        case "Property": {
            const { key, value } = <AST.Property>node;
            inheritToken(builder, [...branch, key], [...branch, value]);
            break;
        }
        case "PropertyDefinition": {
            const { key, value } = <AST.PropertyDefinition>node;
            inheritToken(builder, [...branch, key], [...branch, value]);
            break;
        }
        case "VariableDeclarator": {
            const { id, init } = <AST.VariableDeclarator>node;
            inheritToken(builder, [...branch, id], [...branch, init]);
            break;
        }
    }

    getNodeVisitors(node).forEach((child) =>
        tokenizeNode(builder, [...branch, child]),
    );
    return node;
};
