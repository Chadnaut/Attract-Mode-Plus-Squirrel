import { describe, expect, it } from "@jest/globals";
import { parseExtra as parse, pos, dump } from "../utils";
import { getBranchAtPos } from "../../src/utils/find";
import { getDocAttr, getNodeDoc } from "../../src/doc/find";
import { AST, SQTree as qt } from "../../src/ast";
import { createParamAttr } from "../../src/doc/attribute";

describe("Doc Attribute", () => {

    it("createParamAttr, invalid", () => {
        expect(createParamAttr([])).toBeUndefined();
    });

    it("createParamAttr, assignment", () => {
        expect(createParamAttr([<AST.AssignmentPattern>{ type: "AssignmentPattern" }])).toBeTruthy();
    });

    it("Param get by kind", () => {
        const response = parse(
            "/** @param {integer} foo Hello */ function foo() {}",
        );
        const node = getBranchAtPos(response, pos(45));
        const doc = getNodeDoc(node);
        const attr = getDocAttr(doc, "param");
        expect(attr.kind).toBe("param");
        expect(attr.type).toBe("integer");
        expect(attr.name).toBe("foo");
        expect(attr.documentation).toBe("Hello");
    });

    it("Param get by kind and name", () => {
        const response = parse(
            "/** @param {integer} foo Hello\n * @param {integer} bar World\n */\nfunction foo() {}",
        );
        const node = getBranchAtPos(response, qt.Position(4, 10, 75));
        const doc = getNodeDoc(node);
        const attr = getDocAttr(doc, "param", "bar");
        expect(attr.kind).toBe("param");
        expect(attr.type).toBe("integer");
        expect(attr.name).toBe("bar");
        expect(attr.documentation).toBe("World");
    });

    it("Returns get", () => {
        const response = parse(
            "/** @returns {integer} Hello */ function foo() {}",
        );
        const node = getBranchAtPos(response, pos(43));
        const doc = getNodeDoc(node);
        const attr = getDocAttr(doc, "returns");
        expect(attr.kind).toBe("returns");
        expect(attr.type).toBe("integer");
        expect(attr.name).toBeUndefined();
        expect(attr.documentation).toBe("Hello");
    });

    it("Other get", () => {
        const response = parse("/** @enum Hello */ function foo() {}");
        const node = getBranchAtPos(response, pos(30));
        const doc = getNodeDoc(node);
        const attr = getDocAttr(doc, "enum");
        expect(attr.kind).toBe("enum");
        expect(attr.type).toBeUndefined();
        expect(attr.name).toBeUndefined();
        expect(attr.documentation).toBe("Hello");
    });
});
