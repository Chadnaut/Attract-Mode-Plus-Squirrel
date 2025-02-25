import { AST } from "../ast";

/** Adds root :: prefix to the name */
export const addRootPrefix = (name: string): string =>
    `::${removeRootPrefix(name)}`;

/** Removes root :: prefix from the name */
export const removeRootPrefix = (name: string): string =>
    name.replace(/^::/, "");

/** Returns true if ID is flagged as root, which means it was parsed with the :: prefix */
export const nodeHasRootPrefix = (id: AST.Node): boolean => {
    if (id?.type !== "Identifier") return false;
    return !!id.extra?.root;
}

/**
 * Return AssignmentExpression if id is being created as a newslot
 * - id <- 123;
 */
export const getNewSlotAssignment = (
    branch: AST.Node[],
): AST.Node[] => {
    const id = branch.at(-1);
    if (id?.type !== "Identifier") return [];

    const a = <AST.AssignmentExpression>branch.at(-2);
    if (a?.left !== id) return [];
    if (a.type === "AssignmentExpression" && a.operator === "<-") return branch.slice(0, -1);
    return [];
};

/** Returns true if given slot is newslot assignment */
export const isNewSlotAssignment = (branch: AST.Node[]): boolean => {
    const node = branch.at(-1);
    if (!node) return false;

    const a = <AST.AssignmentExpression>node;
    if (a.type !== "AssignmentExpression") return false;
    if (a.operator !== "<-") return false;
    if (a.left?.type === "Identifier") return true;
    return false;
}
