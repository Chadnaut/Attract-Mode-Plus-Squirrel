import { SymbolTag } from "vscode";
import { AST } from "../ast";
import { getNodeSymbol, hasNodeSymbol } from "./symbol";
import { getBranchProgram, isSameBranch } from "./find";

// -----------------------------------------------------------------------------

const deprecatedMap = new WeakSet<AST.Node>();
const programDeprecatedMap = new WeakMap<AST.Program, AST.Node[]>();

/** Flag the node as deprecated, and update its symbol accordingly */
export const setNodeDeprecated = (branch: AST.Node[]) => {
    const node = branch.at(-1);
    if (node?.type !== "Identifier") return;
    if (hasNodeSymbol(branch)) getNodeSymbol(branch).tags = [SymbolTag.Deprecated];
    deprecatedMap.add(node);

    // additionally store in program-based map
    const program = getBranchProgram(branch);
    if (program) {
        if (!programDeprecatedMap.has(program)) programDeprecatedMap.set(program, []);
        programDeprecatedMap.get(program).push(node);
    }
}

/** Returns true if a node has been flagged as deprecated */
export const getNodeDeprecated = (branch: AST.Node[]) =>
    deprecatedMap.has(branch.at(-1));

// -----------------------------------------------------------------------------

/** Return array of deprecated node ids (recurses ALL nodes) */
export const getDeprecateNodes = (program: AST.Program): AST.Node[] =>
    programDeprecatedMap.has(program) ? programDeprecatedMap.get(program) : [];

/** If fromNode is deprecated, make node deprecated too (requires doc change to update state) */
// export const inheritDeprecation = (program: AST.Program, node: AST.Node, fromNode: AST.Node) => {
export const inheritDeprecation = (toBranch: AST.Node[], fromBranch: AST.Node[]) => {
    if (isSameBranch(toBranch, fromBranch)) return;
    if (getNodeDeprecated(fromBranch)) setNodeDeprecated(toBranch);
}
