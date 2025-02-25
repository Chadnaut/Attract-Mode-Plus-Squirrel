import {
    beforeEach,
    describe,
    fdescribe,
    expect,
    it,
    fit,
    xit,
} from "@jest/globals";
import { format, dump } from "../utils";

describe("Comment", () => {
    it("Line", () => {
        const response = format('  123 // comment ');
        expect(response).toBe('123; // comment\n');
    });

    it("Line, hash", () => {
        const response = format('  123 # comment ');
        expect(response).toBe('123; # comment\n');
    });

    it("Block", () => {
        const response = format('  123 /* comment */ ');
        expect(response).toBe('123; /* comment */\n');
    });

    it("Block, multiline", () => {
        const response = format('  123 /* com\nment */ ');
        expect(response).toBe('123; /* com\nment */\n');
    });

    it("Block, indent", () => {
        const response = format('  123\n/*\n   * com\n   * ment\n*/ ');
        expect(response).toBe('123;\n/*\n * com\n * ment\n */\n');
    });

    it("Block, head", () => {
        const response = format('/* comment */   123  ');
        expect(response).toBe('/* comment */ 123;\n');
    });

    it("Block, between", () => {
        const response = format('[1,2, /* comment */   3]');
        expect(response).toBe('[1, 2, /* comment */ 3];\n');
    });

    it("Block, next", () => {
        const response = format('123\n/* comment */   456  ');
        expect(response).toBe('123;\n/* comment */ 456;\n');
    });

    it("Block, tail", () => {
        const response = format('123    // comment  ');
        expect(response).toBe('123; // comment\n');
    });

    it("Block inside root", () => {
        const response = format("::/*comment*/root");
        expect(response).toBe('::/*comment*/root;\n');
    });
});
