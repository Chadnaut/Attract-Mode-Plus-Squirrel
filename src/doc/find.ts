import { locContainsPos } from "../utils/location";
import { AST } from "../ast";
import { getBranchId } from "../utils/find";
import { DocBlock, DocAttr } from "./kind";

// -----------------------------------------------------------------------------

const commentDockMap = new WeakMap<AST.CommentBlock, DocBlock>();

export const setCommentDocBlock = (node: AST.CommentBlock, doc: DocBlock) =>
    commentDockMap.set(node, doc);

export const hasCommentDocBlock = (node: AST.CommentBlock): boolean =>
    commentDockMap.has(node);

export const getCommentDocBlock = (node: AST.CommentBlock): DocBlock =>
    commentDockMap.has(node) ? commentDockMap.get(node) : undefined;

// -----------------------------------------------------------------------------

const docBlockMap = new WeakMap<AST.Node, DocBlock>();

export const setNodeDocBlock = (node: AST.Node, doc: DocBlock) =>
    docBlockMap.set(node, doc);

export const hasNodeDocBlock = (node: AST.Node): boolean =>
    docBlockMap.has(node);

export const getNodeDocBlock = (node: AST.Node): DocBlock =>
    docBlockMap.has(node) ? docBlockMap.get(node) : undefined;

// -----------------------------------------------------------------------------

/** Return comment at position */
export const getCommentAtPosition = (
    program: AST.Program,
    pos: AST.Position,
): AST.CommentBlock | AST.CommentLine | undefined => {
    if (!program) return;
    for (const comment of program.comments) {
        if (locContainsPos(comment.loc, pos)) return comment;
    }
};

/** Return docblock comment node at position */
export const getCommentBlockAtPosition = (
    program: AST.Program,
    pos: AST.Position,
): AST.CommentBlock | undefined => {
    if (!program) return;
    const comment = getCommentAtPosition(program, pos);
    if (!comment) return;
    if (comment.type === "CommentBlock" && comment.docBlock) {
        return comment;
    }
};

/**
 * Get docBlock object for node, or undefined
 * - docBlock is stored on the ID
 */
export const getNodeDoc = (
    branch: AST.Node[],
    stack: AST.Node[] = [],
): DocBlock | undefined => {
    const node = branch.at(-1);
    const id = node?.type === "Program" ? node : getBranchId(branch);

    if (!id) return;
    if (stack.includes(id)) return;
    stack.push(id);

    if (hasNodeDocBlock(id)) return getNodeDocBlock(id);

    // No docblock, set undefined to prevent future lookups
    setNodeDocBlock(id, undefined);
    return;
};

/**
 * If given node is a declaration return the first declarator, otherwise return the given node
 */
export const getDocTargetBranch = (branch: AST.Node[]): AST.Node[] => {
    const node = branch.at(-1);
    return node?.type === "VariableDeclaration"
        ? branch.concat([(<AST.VariableDeclaration>node).declarations[0]])
        : branch;
};

// -----------------------------------------------------------------------------

export const getAttrByKind = (
    attrs: DocAttr[],
    kind: string,
    name?: string,
): DocAttr | undefined => {
    if (!attrs) return;
    if (!name) return attrs.find((attr) => attr.kind === kind);
    return attrs.find((attr) => attr.kind === kind && attr.name === name);
};

/** Return the first matching docBlock attribute */
export const getDocAttr = (
    docBlock: DocBlock,
    kind: string,
    name?: string,
): DocAttr | undefined => getAttrByKind(docBlock?.attributes, kind, name);
