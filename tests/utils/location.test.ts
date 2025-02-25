import { describe, expect, it } from "@jest/globals";
import { AST, SQTree as qt } from "../../src/ast";
import { docRangeToLoc, docPosToPos, locContainsLoc, locContainsPos, locOverlapsLoc, posToDocPos, nodeToDocRange, nodeToDocSelRange, posAfterOrEqual, posBeforeOrEqual, posBefore, posAfter, locToDocRange } from "../../src/utils/location";
import { dump, lineLoc } from "../utils";
import { Position, Range, TextDocument } from "vscode";

const doc = { offsetAt: (p: Position) => p.character } as unknown as TextDocument;

describe("Location", () => {
    it("nodeToDocRange", () => {
        const startLine = 1;
        const startColumn = 10;
        const endLine = 2;
        const endColumn = 20;
        const range = nodeToDocRange(
            qt.Identifier(
                "x",
                qt.SourceLocation(
                    qt.Position(startLine, startColumn, 0),
                    qt.Position(endLine, endColumn, 1),
                ),
            ),
        );
        expect(range.start.line).toBe(startLine - 1);
        expect(range.start.character).toBe(startColumn);
        expect(range.end.line).toBe(endLine - 1);
        expect(range.end.character).toBe(endColumn);
    });

    it("locToDocRange, None", () => {
        expect(locToDocRange(null)).toBeUndefined();
        const start = qt.Position(1,0,0);
        const end = qt.Position(2,1,1);
        expect(locToDocRange({ start: null, end: null })).toBeUndefined();
        expect(locToDocRange({ start, end: null })).toBeUndefined();
        expect(locToDocRange({ start: null, end })).toBeUndefined();
        expect(locToDocRange({ start, end })).toEqual(new Range(0, 0, 1, 1));
    });

    it("nodeToDocRange, None", () => {
        expect(nodeToDocRange(null)).toBeUndefined();
        expect(nodeToDocRange(<AST.Node>{})).toBeUndefined();
    });

    it("nodeToDocSelRange, None", () => {
        expect(nodeToDocSelRange(null)).toBeUndefined();
        expect(nodeToDocSelRange(<AST.Node>{})).toBeUndefined();
    });

    it("nodeToDocSelRange, regular", () => {
        const n = qt.Identifier("value", lineLoc(0, 5));
        expect(nodeToDocSelRange(n)).toEqual(new Range(0,0,0,5));
    });

    it("nodeToDocSelRange, case", () => {
        const n = qt.SwitchCase(qt.Identifier("case_test_value"), [], lineLoc(0, 100));
        expect(nodeToDocSelRange(n)).toEqual(new Range(0,0,0,4));
    });

    it("nodeToDocSelRange, default", () => {
        const n = qt.SwitchCase(null, [], lineLoc(0, 100));
        expect(nodeToDocSelRange(n)).toEqual(new Range(0,0,0,7));
    });

    it("nodeToDocSelRange, return", () => {
        const n = qt.ReturnStatement(qt.Identifier("value"), lineLoc(0, 100));
        expect(nodeToDocSelRange(n)).toEqual(new Range(0,0,0,6));
    });

    it("posToDocPos", () => {
        const n = qt.Position(1, 0, 0);
        expect(posToDocPos(n)).toEqual(new Position(0, 0));
        expect(posToDocPos(undefined)).toEqual(undefined);
    });

    it("docPosToPos", () => {
        const p = new Position(0, 0);
        expect(docPosToPos(doc, p)).toEqual(qt.Position(1, 0, 0));
    });

    it("docRangeToLoc", () => {
        const n = new Range(0, 0, 0, 4);
        expect(docRangeToLoc(doc, n)).toEqual(qt.SourceLocation(qt.Position(1,0,0), qt.Position(1,4,4)));
    });

    it("posAfter", () => {
        expect(posAfter(qt.Position(1,10,0), qt.Position(1,9,0))).toBe(true);
        expect(posAfter(qt.Position(1,10,0), qt.Position(1,10,0))).toBe(false);
        expect(posAfter(qt.Position(2,10,0), qt.Position(1,10,0))).toBe(true);
        expect(posAfter(qt.Position(1,10,0), qt.Position(2,10,0))).toBe(false);
        expect(posAfter(qt.Position(1,10,0), qt.Position(1,11,0))).toBe(false);

        expect(posAfter(qt.Position(1,10,0), undefined)).toBe(false);
        expect(posAfter(undefined, qt.Position(1,10,0))).toBe(false);
        expect(posAfter(undefined, undefined)).toBe(false);
    });

    it("posAfterOrEqual", () => {
        expect(posAfterOrEqual(qt.Position(1,10,0), qt.Position(1,9,0))).toBe(true);
        expect(posAfterOrEqual(qt.Position(1,10,0), qt.Position(1,10,0))).toBe(true);
        expect(posAfterOrEqual(qt.Position(2,10,0), qt.Position(1,10,0))).toBe(true);
        expect(posAfterOrEqual(qt.Position(1,10,0), qt.Position(2,10,0))).toBe(false);
        expect(posAfterOrEqual(qt.Position(1,10,0), qt.Position(1,11,0))).toBe(false);

        expect(posAfterOrEqual(undefined, qt.Position(1,11,0))).toBe(false);
        expect(posAfterOrEqual(qt.Position(1,10,0), undefined)).toBe(false);
        expect(posAfterOrEqual(undefined, undefined)).toBe(false);
    });

    it("posBefore", () => {
        expect(posBefore(qt.Position(1,10,0), qt.Position(1,9,0))).toBe(false);
        expect(posBefore(qt.Position(1,10,0), qt.Position(1,10,0))).toBe(false);
        expect(posBefore(qt.Position(2,10,0), qt.Position(1,10,0))).toBe(false);
        expect(posBefore(qt.Position(1,10,0), qt.Position(2,10,0))).toBe(true);
        expect(posBefore(qt.Position(1,10,0), qt.Position(1,11,0))).toBe(true);

        expect(posBefore(qt.Position(1,10,0), undefined)).toBe(false);
        expect(posBefore(undefined, qt.Position(1,10,0))).toBe(false);
        expect(posBefore(undefined, undefined)).toBe(false);
    });

    it("posBeforeOrEqual", () => {
        expect(posBeforeOrEqual(qt.Position(1,10,0), qt.Position(1,9,0))).toBe(false);
        expect(posBeforeOrEqual(qt.Position(1,10,0), qt.Position(1,10,0))).toBe(true);
        expect(posBeforeOrEqual(qt.Position(2,10,0), qt.Position(1,10,0))).toBe(false);
        expect(posBeforeOrEqual(qt.Position(1,10,0), qt.Position(2,10,0))).toBe(true);
        expect(posBeforeOrEqual(qt.Position(1,10,0), qt.Position(1,11,0))).toBe(true);

        expect(posBeforeOrEqual(undefined, qt.Position(1,11,0))).toBe(false);
        expect(posBeforeOrEqual(qt.Position(1,10,0), undefined)).toBe(false);
        expect(posBeforeOrEqual(undefined, undefined)).toBe(false);
    });

    it("locContainsPos", () => {
        expect(locContainsPos(qt.SourceLocation(qt.Position(1,5,0),qt.Position(1,10,0)), qt.Position(1,0,0))).toBe(false);
        expect(locContainsPos(qt.SourceLocation(qt.Position(1,5,0),qt.Position(1,10,0)), qt.Position(1,5,0))).toBe(true);
        expect(locContainsPos(qt.SourceLocation(qt.Position(1,5,0),qt.Position(1,10,0)), qt.Position(1,6,0))).toBe(true);
        expect(locContainsPos(qt.SourceLocation(qt.Position(1,5,0),qt.Position(1,10,0)), qt.Position(1,10,0))).toBe(true);
        expect(locContainsPos(qt.SourceLocation(qt.Position(1,5,0),qt.Position(1,10,0)), qt.Position(1,11,0))).toBe(false);

        expect(locContainsPos(undefined, qt.Position(1,11,0))).toBe(false);
        expect(locContainsPos(qt.SourceLocation(qt.Position(1,5,0),qt.Position(1,10,0)), undefined)).toBe(false);
        expect(locContainsPos(undefined, undefined)).toBe(false);
    });

    it("locContainsLoc", () => {
        expect(locContainsLoc(qt.SourceLocation(qt.Position(1,5,0),qt.Position(1,10,0)), qt.SourceLocation(qt.Position(1,5,0),qt.Position(1,10,0)))).toBe(true);
        expect(locContainsLoc(qt.SourceLocation(qt.Position(1,5,0),qt.Position(1,10,0)), qt.SourceLocation(qt.Position(1,4,0),qt.Position(1,10,0)))).toBe(false);
        expect(locContainsLoc(qt.SourceLocation(qt.Position(1,5,0),qt.Position(1,10,0)), qt.SourceLocation(qt.Position(1,5,0),qt.Position(1,11,0)))).toBe(false);
        expect(locContainsLoc(qt.SourceLocation(qt.Position(1,5,0),qt.Position(1,10,0)), qt.SourceLocation(qt.Position(1,5,0),qt.Position(1,6,0)))).toBe(true);
        expect(locContainsLoc(qt.SourceLocation(qt.Position(1,5,0),qt.Position(1,10,0)), qt.SourceLocation(qt.Position(1,9,0),qt.Position(1,10,0)))).toBe(true);

        expect(locContainsLoc(undefined, qt.SourceLocation(qt.Position(1,9,0),qt.Position(1,10,0)))).toBe(false);
        expect(locContainsLoc(qt.SourceLocation(qt.Position(1,5,0),qt.Position(1,10,0)), undefined)).toBe(false);
        expect(locContainsLoc(undefined, undefined)).toBe(false);
    });

    it("locOverlapsLoc", () => {
        expect(locOverlapsLoc(qt.SourceLocation(qt.Position(1,5,0),qt.Position(1,10,0)), qt.SourceLocation(qt.Position(1,5,0),qt.Position(1,10,0)))).toBe(true);
        expect(locOverlapsLoc(qt.SourceLocation(qt.Position(1,5,0),qt.Position(1,10,0)), qt.SourceLocation(qt.Position(1,4,0),qt.Position(1,10,0)))).toBe(true);
        expect(locOverlapsLoc(qt.SourceLocation(qt.Position(1,5,0),qt.Position(1,10,0)), qt.SourceLocation(qt.Position(1,5,0),qt.Position(1,11,0)))).toBe(true);
        expect(locOverlapsLoc(qt.SourceLocation(qt.Position(1,5,0),qt.Position(1,10,0)), qt.SourceLocation(qt.Position(1,5,0),qt.Position(1,6,0)))).toBe(true);
        expect(locOverlapsLoc(qt.SourceLocation(qt.Position(1,5,0),qt.Position(1,10,0)), qt.SourceLocation(qt.Position(1,9,0),qt.Position(1,10,0)))).toBe(true);
        expect(locOverlapsLoc(qt.SourceLocation(qt.Position(1,5,0),qt.Position(1,10,0)), qt.SourceLocation(qt.Position(1,4,0),qt.Position(1,5,0)))).toBe(true);
        expect(locOverlapsLoc(qt.SourceLocation(qt.Position(1,5,0),qt.Position(1,10,0)), qt.SourceLocation(qt.Position(1,3,0),qt.Position(1,4,0)))).toBe(false);
        expect(locOverlapsLoc(qt.SourceLocation(qt.Position(1,5,0),qt.Position(1,10,0)), qt.SourceLocation(qt.Position(1,10,0),qt.Position(1,11,0)))).toBe(true);
        expect(locOverlapsLoc(qt.SourceLocation(qt.Position(1,5,0),qt.Position(1,10,0)), qt.SourceLocation(qt.Position(1,11,0),qt.Position(1,12,0)))).toBe(false);

        expect(locOverlapsLoc(undefined, qt.SourceLocation(qt.Position(1,11,0),qt.Position(1,12,0)))).toBe(false);
        expect(locOverlapsLoc(qt.SourceLocation(qt.Position(1,5,0),qt.Position(1,10,0)), undefined)).toBe(false);
        expect(locOverlapsLoc(undefined, undefined)).toBe(false);
    });
});
