import { describe, expect, it } from "@jest/globals";
import { dump, parseForceExtra as parse, pos } from "../utils";
import { attrToNode, stringToNode } from "../../src/utils/create";

describe("Create", () => {

    it("stringToNode, undefined", () => {
        expect(stringToNode(null)).toBe(undefined);
    });

    it("stringToNode, identifier", () => {
        const n = stringToNode("a");
        expect(n.type).toBe("Identifier");
        expect(n["name"]).toBe("a");
    });

    it("stringToNode, memberExpression", () => {
        const n = stringToNode("a.b");
        expect(n.type).toBe("MemberExpression");
        expect(n["object"]["type"]).toBe("Identifier");
        expect(n["object"]["name"]).toBe("a");
        expect(n["property"]["type"]).toBe("Identifier");
        expect(n["property"]["name"]).toBe("b");
    });

    it("stringToNode, recursion", () => {
        expect(() => {
            // bad `/` at beginning
            parse('/ class foo {} class bar extends foo { /** @property {integer} x */ function _get() {} } x <- ""; y <- {}');
        }).not.toThrow();
    });

    it("stringToNode, undefined", () => {
        expect(stringToNode(undefined)).toBeUndefined();
    });

    it("attrToNode, undefined", () => {
        expect(attrToNode(undefined)).toBeUndefined();
    });

    it("attrToNode, undefined", () => {
        expect(attrToNode(undefined)).toBeUndefined();
    });

    it("attrToNode, string", () => {
        const n = attrToNode({ kind: "type", type: "string" });
        expect(n.type).toBe("StringLiteral");
    });

    it("attrToNode, array", () => {
        const n = attrToNode({ kind: "type", type: "array" });
        expect(n.type).toBe("ArrayExpression");
        expect(n["elements"]).toHaveLength(0);
    });

    it("attrToNode, array", () => {
        const n = attrToNode({ kind: "type", type: "array", expected: [{ label: { label: "string" }}] });
        expect(n.type).toBe("ArrayExpression");
        expect(n["elements"]).toHaveLength(1);
        expect(n["elements"][0].type).toBe("StringLiteral");
    });

});
