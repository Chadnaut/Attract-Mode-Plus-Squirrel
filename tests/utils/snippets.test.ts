import { loadSnippets } from './../../src/utils/snippets';
import { describe, expect, it } from "@jest/globals";
import { dump, parseExtra as parse } from "../utils";
import * as path from 'path';

describe("Snippets", () => {

    it("loadSnippets", () => {
        const filename = path.join(__dirname, "../samples/snippets/sample.code-snippets");
        const snippets = loadSnippets(filename);
        expect(snippets.length).toBeGreaterThan(0);
    });

    it("loadSnippets, none", () => {
        const filename = path.join(__dirname, "../samples/snippets/bad-filename.code-snippets");
        const snippets = loadSnippets(filename);
        expect(snippets.length).toBe(0);
    });

});
