import { describe, expect, it } from "@jest/globals";
import { AST, SQTree as qt } from "../../src/ast";
import { parseCommentAttrs } from "../../src/doc/parse";

describe("Doc Parse", () => {
    it("parseCommentAttrs works", () => {
        expect(parseCommentAttrs(undefined).length).toBe(0);
        expect(
            parseCommentAttrs(<AST.CommentBlock>(qt.Identifier("name") as unknown))
                .length,
        ).toBe(0);
        expect(parseCommentAttrs(qt.CommentBlock("")).length).toBe(0);
    });

    it("parseCommentAttrs expected values", () => {
        const db = qt.CommentBlock("@param {(a|b|c)} name Desc", true);
        const attrs = parseCommentAttrs(db);
        expect(attrs.length).toBe(1);
        expect(attrs[0].expected.length).toBe(3);
        expect(attrs[0].expected[0].label).toEqual({ label: "a" });
        expect(attrs[0].expected[1].label).toEqual({ label: "b" });
        expect(attrs[0].expected[2].label).toEqual({ label: "c" });
    });

    it("parseCommentAttrs type name with expected values", () => {
        const db = qt.CommentBlock("@param {name(a|b|c)} name Desc", true);
        const attrs = parseCommentAttrs(db);
        expect(attrs.length).toBe(1);
        expect(attrs[0].type).toBe("name");
        expect(attrs[0].expected.length).toBe(3);
        expect(attrs[0].expected[0].label).toEqual({ label: "a" });
        expect(attrs[0].expected[1].label).toEqual({ label: "b" });
        expect(attrs[0].expected[2].label).toEqual({ label: "c" });
    });
});
