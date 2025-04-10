import { describe, expect, it } from "@jest/globals";
import { DocAttr } from "../../src/doc/kind";
import { printDocAttr, printDocNewline } from "../../src/doc/print";

describe("Doc Print", () => {
    it("printDocAttr, author link", () => {
        expect(printDocAttr(<DocAttr>{ kind: "author", link: "link" })).toBe(" * @author <link>\n");
        expect(printDocAttr(<DocAttr>{ kind: "author", name: "name", link: "link" })).toBe(" * @author name<link>\n");
    });

    it("printDocAttr, url link", () => {
        expect(printDocAttr(<DocAttr>{ kind: "url", link: "link" })).toBe(" * @url link\n");
    });

    it("printDocAttr, description", () => {
        expect(printDocAttr(<DocAttr>{ kind: "description", documentation: "one\ntwo" })).toBe(" * one\n * two\n");
    });

    it("printDocNewline", () => {
        expect(printDocNewline()).toBe(" *\n");
    });
});
