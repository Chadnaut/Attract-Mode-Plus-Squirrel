import { describe, expect, it } from "@jest/globals";
import { parseExtra as parse, pos, dump } from "../utils";
import constants from "../../src/constants";
import { CompletionItemKind, CompletionItemLabel } from "vscode";
import {
    createDocSnippetCompletion,
    createDocSnippetCompletions,
    getDocBlockSnippets,
    getSnippetCompletions,
} from "../../src/doc/snippets";
import { DocBlock } from "../../src/doc/kind";
import { getCommentBlockAtPosition, getCommentDocBlock } from "../../src/doc/find";

jest.replaceProperty(constants, "FE_MODULES_PATH", "mock");

describe("Doc Snippet", () => {
    it("getSnippetCompletions, invalid", () => {
        expect(getSnippetCompletions(null)).toHaveLength(0);
    });

    it("getDocBlockSnippets", () => {
        expect(getDocBlockSnippets(undefined).length).toBeGreaterThan(0);
    });

    it("getDocBlockSnippets, not inject", () => {
        const program = parse(`/* */`);
        const n = getCommentBlockAtPosition(program, pos(3));
        const s = getDocBlockSnippets(n);
        expect(s.length).toBeGreaterThan(0);
        const r = s.find((snippet) => (<CompletionItemLabel>snippet.label).label === "requires");
        expect(r.insertText).not.toContain("snap");
    });

    it("getDocBlockSnippets, inject", () => {
        const program = parse(`/** */ fe.add_artwork("snap");`);
        const n = getCommentBlockAtPosition(program, pos(3));
        const b = getCommentDocBlock(n);
        b.branch = [program];
        const s = getDocBlockSnippets(n);
        expect(s.length).toBeGreaterThan(0);
        const r = s.find((snippet) => (<CompletionItemLabel>snippet.label).label === "requires");
        expect(r.insertText).toContain("snap");
    });

    it("keyword, parses", () => {
        const program = parse("/** @keyword test */");
        const completions = getSnippetCompletions(program);
        expect(completions).toHaveLength(1);
    });

    it("keyword, kind", () => {
        const program = parse("/** @keyword test \n @kind property */");
        const completions = getSnippetCompletions(program);
        expect(completions).toHaveLength(1);
        expect(completions[0].kind).toBe(CompletionItemKind.Property);
    });

    it("magic", () => {
        const program = parse(`/**
            * @magic name1 desc
            * @magic name2 desc
            * @another
            * @magic name3 desc
            */`);
        const completions = getSnippetCompletions(program);
        expect(completions).toHaveLength(3);
        expect(completions[0].kind).toBe(CompletionItemKind.Event);
        expect(completions[1].kind).toBe(CompletionItemKind.Event);
        expect(completions[2].kind).toBe(CompletionItemKind.Event);
    });

    it("createDocSnippetCompletions, undefined", () => {
        expect(createDocSnippetCompletion(null)).toBe(undefined);
        expect(createDocSnippetCompletions(null, null)).toHaveLength(0);
    });

    it("createDocSnippetCompletions, ignores description", () => {
        const docBlock: DocBlock = {
            branch: [],
            attributes: [
                { kind: "description", documentation: "desc" },
                { kind: "keyword", name: "test", documentation: "here" },
            ],
        };
        const c = createDocSnippetCompletions(docBlock, null);
        expect(c).toHaveLength(1);
        expect(c[0].label["label"]).toBe("test");
        expect(c[0].insertText["value"]).toBe("test");
        expect(c[0].documentation["value"]).toBe("here");
        expect(c[0].kind).toBe(CompletionItemKind.Keyword);
    });

    it("createDocSnippetCompletions, keyword", () => {
        const docBlock: DocBlock = {
            branch: [],
            attributes: [
                { kind: "keyword", name: "test", documentation: "here" },
            ],
        };
        const c = createDocSnippetCompletions(docBlock, null);
        expect(c).toHaveLength(1);
        expect(c[0].label["label"]).toBe("test");
        expect(c[0].insertText["value"]).toBe("test");
        expect(c[0].documentation["value"]).toBe("here");
        expect(c[0].kind).toBe(CompletionItemKind.Keyword);
    });

    it("createDocSnippetCompletions, multiple keyword", () => {
        const docBlock: DocBlock = {
            branch: [],
            attributes: [
                { kind: "keyword", name: "test1", documentation: "here" },
                { kind: "keyword", name: "test2", documentation: "there" },
            ],
        };
        const c = createDocSnippetCompletions(docBlock, null);
        expect(c).toHaveLength(2);
        expect(c[0].label["label"]).toBe("test1");
        expect(c[0].insertText["value"]).toBe("test1");
        expect(c[0].documentation["value"]).toBe("here");
        expect(c[0].kind).toBe(CompletionItemKind.Keyword);
        expect(c[1].label["label"]).toBe("test2");
        expect(c[1].insertText["value"]).toBe("test2");
        expect(c[1].documentation["value"]).toBe("there");
        expect(c[1].kind).toBe(CompletionItemKind.Keyword);
    });

    it("createDocSnippetCompletions, this", () => {
        const docBlock: DocBlock = {
            branch: [],
            attributes: [{ kind: "keyword", name: "this" }],
        };
        const c = createDocSnippetCompletions(docBlock, null);
        expect(c).toHaveLength(1);
        expect(c[0].label["label"]).toBe("this");
        expect(c[0].insertText["value"]).toBe("this");
        expect(c[0].commitCharacters).toEqual(["."]);
        expect(c[0].kind).toBe(CompletionItemKind.Keyword);
    });

    it("createDocSnippetCompletions, snippet", () => {
        const docBlock: DocBlock = {
            branch: [],
            attributes: [
                { kind: "keyword", name: "test" },
                { kind: "snippet", documentation: "snippet" },
            ],
        };
        const c = createDocSnippetCompletions(docBlock, null);
        expect(c).toHaveLength(1);
        expect(c[0].label["label"]).toBe("test");
        expect(c[0].insertText["value"]).toBe("snippet");
        expect(c[0].kind).toBe(CompletionItemKind.Snippet);
    });

    it("createDocSnippetCompletions, magic", () => {
        const docBlock: DocBlock = {
            branch: [],
            attributes: [{ kind: "magic", name: "test" }],
        };
        const c = createDocSnippetCompletions(docBlock, null);
        expect(c).toHaveLength(1);
        expect(c[0].label["label"]).toBe("test");
        expect(c[0].insertText["value"]).toBe("test");
        expect(c[0].kind).toBe(CompletionItemKind.Event);
    });
});
