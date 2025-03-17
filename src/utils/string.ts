import { AST } from "../ast";
import { getBranchProgram } from "./find";

export const ucfirst = (value: string): string => {
    if (!value) return "";
    return value.charAt(0).toUpperCase() + value.slice(1);
}

// -----------------------------------------------------------------------------
/** Store StringLiteral nodes to check them for file paths */

const programStringMap = new WeakMap<AST.Program, AST.Node[][]>();

export const clearProgramStrings = (program: AST.Program) => {
    programStringMap.set(program, []);
};

export const addProgramString = (branch: AST.Node[]) => {
    programStringMap.get(getBranchProgram(branch))?.push(branch);
};

export const getProgramStrings = (
    program: AST.Program,
): readonly AST.Node[][] =>
    programStringMap.has(program) ? programStringMap.get(program) : [];
