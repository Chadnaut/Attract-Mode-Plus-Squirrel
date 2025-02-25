import { describe, expect, it } from "@jest/globals";
import { DocAttr } from "../../src/doc/kind";
import { printDocAttr, printDocNewline } from "../../src/doc/print";

describe("Doc Print", () => {
    it("printDocAttr, author", () => {
        expect(printDocAttr(<DocAttr>{ kind: "author", link: "link" })).toBe(" * @author<link>\n");
    });

    it("printDocNewline", () => {
        expect(printDocNewline()).toBe(" *\n");
    });
});
