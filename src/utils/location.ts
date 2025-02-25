import { Position, Range, TextDocument } from "vscode";
import { AST } from "../ast";
import { SQTree as qt } from "../ast/create";

// ------------------------------------------------------
// VSCode Position

/** Adjust document position character by offset */
export const adjustDocPos = (position: Position, offset: number): Position =>
    new Position(position.line, Math.max(0, position.character + offset));

// ------------------------------------------------------
// Convert

export const branchSpanLoc = (branch: AST.Node[]): AST.SourceLocation =>
    <AST.SourceLocation>{
        start: branch.at(0).loc.start,
        end: branch.at(-1).loc.end,
    };

/** Location to vscode Range (vscode lines are 0-based) */
export const locToDocRange = (loc: AST.SourceLocation): Range | undefined => {
    if (!loc) return;
    const start = posToDocPos(loc.start);
    if (!start) return;
    const end = posToDocPos(loc.end);
    if (!end) return;
    return new Range(start, end);
};

/** Node Location to vscode Range (vscode lines are 0-based) */
export const nodeToDocRange = (node: AST.Node): Range | undefined =>
    locToDocRange(node?.loc);

/**
 * Node location to vscode range
 * - Used for hover ranges
 * - Special handling for switch and return to cover the keyword
 */
export const nodeToDocSelRange = (node: AST.Node): Range | undefined => {
    if (!node || !node.loc) return;
    const start = node.loc.start;
    const { line, column, index } = start;
    switch (node.type) {
        case "SwitchCase": {
            const n = (<AST.SwitchCase>node).test ? 4 : 7;
            return new Range(
                posToDocPos(start),
                posToDocPos(qt.Position(line, column + n, index + n)),
            );
        }
        case "ReturnStatement": {
            const n = 6;
            return new Range(
                posToDocPos(start),
                posToDocPos(qt.Position(line, column + n, index + n)),
            );
        }
        default:
            return nodeToDocRange(node);
    }
};

/** Node Position to vscode Position (vscode lines are 0-based) */
export const posToDocPos = (position: AST.Position): Position | undefined => {
    if (!position) return;
    const { line, column } = position;
    return new Position(line - 1, column);
};

/** Document to node position */
export const docPosToPos = (
    document: TextDocument,
    position: Position,
): AST.Position => {
    return qt.Position(
        position.line + 1,
        position.character,
        document.offsetAt(position),
    );
};

/** Document to node location */
export const docRangeToLoc = (
    document: TextDocument,
    range: Range,
): AST.SourceLocation =>
    qt.SourceLocation(
        docPosToPos(document, range.start),
        docPosToPos(document, range.end),
    );

// ------------------------------------------------------
// Compare Pos

/** True if target > source */
export const posAfter = (target: AST.Position, source: AST.Position): boolean =>
    !!target &&
    !!source &&
    (target.line > source.line ||
        (target.line === source.line && target.column > source.column));

/** True if target >= source */
export const posAfterOrEqual = (
    target: AST.Position,
    source: AST.Position,
): boolean =>
    !!target &&
    !!source &&
    (target.line > source.line ||
        (target.line === source.line && target.column >= source.column));

/** True if target < source */
export const posBefore = (
    target: AST.Position,
    source: AST.Position,
): boolean =>
    !!target &&
    !!source &&
    (target.line < source.line ||
        (target.line === source.line && target.column < source.column));

/** True if target <= source */
export const posBeforeOrEqual = (
    target: AST.Position,
    source: AST.Position,
): boolean =>
    !!target &&
    !!source &&
    (target.line < source.line ||
        (target.line === source.line && target.column <= source.column));

// ------------------------------------------------------
// Compare Loc

/** loc fully contains (or equals) pos */
export const locContainsPos = (
    loc: AST.SourceLocation,
    pos: AST.Position,
): boolean =>
    !!pos &&
    !!loc &&
    posAfterOrEqual(pos, loc.start) &&
    posBeforeOrEqual(pos, loc.end);

/** loc1 fully contains (or equals) loc2 */
export const locContainsLoc = (
    loc1: AST.SourceLocation,
    loc2: AST.SourceLocation,
): boolean =>
    !!loc1 &&
    !!loc2 &&
    posAfterOrEqual(loc2.start, loc1.start) &&
    posBeforeOrEqual(loc2.end, loc1.end);

/** loc1 overlaps (or equals) loc2 */
export const locOverlapsLoc = (
    loc1: AST.SourceLocation,
    loc2: AST.SourceLocation,
): boolean =>
    !!loc1 &&
    !!loc2 &&
    posAfterOrEqual(loc1.end, loc2.start) &&
    posBeforeOrEqual(loc1.start, loc2.end);
