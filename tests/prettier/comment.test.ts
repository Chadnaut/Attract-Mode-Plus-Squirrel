import { describe, expect, it } from "@jest/globals";
import { format, dump } from "../utils";

describe("Comment", () => {
    it("Line", async () => {
        const response = await format('  123 // comment ');
        expect(response).toBe('123; // comment\n');
    });

    it("Line, hash", async () => {
        const response = await format('  123 # comment ');
        expect(response).toBe('123; # comment\n');
    });

    it("Block", async () => {
        const response = await format('  123 /* comment */ ');
        expect(response).toBe('123; /* comment */\n');
    });

    it("Block, multiline", async () => {
        const response = await format('  123 /* com\nment */ ');
        expect(response).toBe('123; /* com\nment */\n');
    });

    it("Block, indent", async () => {
        const response = await format('  123\n/*\n   * com\n   * ment\n*/ ');
        expect(response).toBe('123;\n/*\n * com\n * ment\n */\n');
    });

    it("Block, head", async () => {
        const response = await format('/* comment */   123  ');
        expect(response).toBe('/* comment */ 123;\n');
    });

    it("Block, between", async () => {
        const response = await format('[1,2, /* comment */   3]');
        expect(response).toBe('[1, 2, /* comment */ 3];\n');
    });

    it("Block, next", async () => {
        const response = await format('123\n/* comment */   456  ');
        expect(response).toBe('123;\n/* comment */ 456;\n');
    });

    it("Block, tail", async () => {
        const response = await format('123    // comment  ');
        expect(response).toBe('123; // comment\n');
    });

    it("Block inside root", async () => {
        const response = await format("::/*comment*/root");
        expect(response).toBe('::/*comment*/root;\n');
    });
});
