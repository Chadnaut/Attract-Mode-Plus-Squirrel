import { InlayHint, InlayHintKind } from "vscode";
import { getNodeDef, getNodeVal } from "./definition";
import { locOverlapsLoc, nodeToDocRange } from "./location";
import { getNodeParams, isRestNode } from "./params";
import { AST } from "../ast";
import { getNodeName } from "./identifier";
import { getNodeVisitors } from "./map";

// -----------------------------------------------------------------------------

const nodeHintMap = new WeakMap<AST.Node, InlayHint[]>();

export const setNodeHints = (node: AST.Node, hints: InlayHint[]) =>
    nodeHintMap.set(node, hints);

export const hasNodeHints = (node: AST.Node): boolean =>
    nodeHintMap.has(node);

export const getNodeHints = (node: AST.Node): InlayHint[] =>
    nodeHintMap.has(node) ? nodeHintMap.get(node) : undefined;

// -----------------------------------------------------------------------------

/**
 * Return inlay hints for all nodes overlapping requested location
 */
export const getInlayHints = (
    branch: AST.Node[],
    loc: AST.SourceLocation,
): InlayHint[] => {
    const node = branch.at(-1);
    if (!node) return [];
    if (!locOverlapsLoc(node.loc, loc)) return [];

    const hints: InlayHint[] = [];

    // only CallExpressions have parameter hints
    // - aborting if error within causes previous hints to toggle on/off
    // - may be more distracting than an invalid hint?
    if (node.type === "CallExpression") { // && !getNodeHasError(node)) {
        const call = <AST.CallExpression>node;
        const { callee, arguments: args } = call;
        if (args.length) {
            const calleeBranch = [...branch, callee];
            const nodeDef = getNodeDef(calleeBranch);
            if (nodeDef.length) {
                // Cache since this is called every scroll tick
                if (!hasNodeHints(node)) {
                    const nodeHints = [];
                    const kind = InlayHintKind.Parameter;
                    const params = getNodeParams(getNodeVal(nodeDef));
                    const rest = isRestNode(params.at(-1) ?? []);
                    const lastIndex = params.length - 1;

                    // NOTE: The hint may be from a different program
                    // - The referenced hint wont update until the program changes
                    args.forEach((arg, index) => {
                        if (arg.type === "Undefined") return;
                        const i = (index > lastIndex && rest) ? lastIndex : index;
                        const name = getNodeName(params[i] ?? []);
                        if (!name) return;
                        const pos = nodeToDocRange(arg).start;
                        const hint = new InlayHint(pos, `${name}:`, kind);
                        nodeHints.push(hint);
                    });

                    setNodeHints(node, nodeHints);
                }
                hints.push(...getNodeHints(node));
            }
        }
    }

    return hints.concat(
        getNodeVisitors(node).flatMap((child) => getInlayHints([...branch, child], loc)),
    );
};
