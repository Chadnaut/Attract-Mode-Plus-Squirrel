import { describe, expect, it } from "@jest/globals";
import { Position, Range, TabGroups, TabInputText, TextDocument, Uri, window, workspace } from "vscode";
import {  fullRange, getOpenTabPaths, getWordPrefix } from "../../src/utils/document";
import { MockTextDocument } from "../utils";

describe("Document", () => {
    it("fullRange", () => {
        const doc = new MockTextDocument("text");
        expect(fullRange(doc)).toEqual(new Range(0, 0, 0, 4));
    });

    it("getOpenTabPaths", () => {
        jest.replaceProperty(window, "tabGroups", {
            all: [
                { tabs: [{ input: new TabInputText(Uri.file("p1")) }]},
                { tabs: [{ input: new TabInputText(Uri.file("p2")) }]},
            ]
        } as unknown as TabGroups);
        expect(getOpenTabPaths()).toEqual(["\\p1", "\\p2"]);
    });

    it("getWordPrefix", () => {
        const doc = new MockTextDocument(".text ");
        expect(doc.getWordRangeAtPosition(new Position(0, 3))).toEqual(new Range(0,1,0,5));
        expect(getWordPrefix(doc, undefined)).toBe("");
        expect(getWordPrefix(doc, new Position(0, 0))).toBe("");
        expect(getWordPrefix(doc, new Position(0, 3), 1)).toBe(".");
    });

    it("getWordPrefix, invalid", () => {
        const doc = new MockTextDocument("");
        doc.undefRange = true; // simulate getWordRangeAtPosition returning undefined
        expect(getWordPrefix(doc as unknown as TextDocument, new Position(1, 2), 3)).toBe("");
    });

});
