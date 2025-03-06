import { describe, expect, it } from "@jest/globals";
import { parseExtra as parse, parseForceExtra, pos } from "../utils";
import { getMemberCompletions, getTypeMemberCompletions } from "../../src/utils/completion";
import { getNodeAtPos, getBranchAtPos } from "../../src/utils/find";
import { AST, SQTree as qt } from "../../src/ast";
import { attachMeta, createMetaNode, getMetaNode } from "../../src/utils/meta";
import { getDeprecateNodes } from "../../src/utils/deprecated";

describe("Meta", () => {
    it("undefined", () => {
        const p1 = parse("/** @property */ class foo {}; foo()");
        expect(getMemberCompletions(getBranchAtPos(p1, pos(33))).length).toEqual(0);

        const p2 = parse("/** @property {integer{}} */ class foo {}; foo()");
        expect(getMemberCompletions(getBranchAtPos(p2, pos(45))).length).toEqual(0);
    });

    it("attachMeta, undefined", () => {
        expect(() => attachMeta([], null)).not.toThrow();
    });

    it("Package", () => {
        const program = parse("/** @package Main */ /** @property {integer} bar here */ class foo {}; foo()");
        const items = getMemberCompletions(getBranchAtPos(program, pos(73)));
        expect(items.length).toEqual(1);
        expect(items[0].detail).toBe("(property) foo.bar: integer");
        expect(items[0].insertText).toBe("bar");
        expect(items[0].label["description"]).toBe("Main");
    });

    // fit("Module override", () => {
    //     const program = parse("/** @package\n@module Main */ /** @module Over\n@property {integer} bar here */ class foo {}; foo()");
    //     const items = getMemberCompletions(getBranchAtPos(program, qt.Position(3, 48, 0)));
    //     expect(items.length).toEqual(1);
    //     expect(items[0].detail).toBe("(property) foo.bar: integer");
    //     expect(items[0].label["description"]).toBe("Over");
    //     expect(items[0].insertText).toBe("bar");
    // });

    it("ClassDef", () => {
        const program = parse("/** @property {integer} bar here */ class foo {}; foo()");
        const items = getMemberCompletions(getBranchAtPos(program, pos(52)));
        expect(items.length).toEqual(1);
        expect(items[0].detail).toBe("(property) foo.bar: integer");
        expect(items[0].insertText).toBe("bar");
    });

    it("ClassDef, deprecated", () => {
        const program = parse(`
        /**
        * @property {integer} bar here
        * @deprecated
        */
        class foo {};
        foo()
        `);
        const items = getMemberCompletions(getBranchAtPos(program, qt.Position(6, 10, 0)));
        expect(items.length).toEqual(1);
        expect(items[0].detail).toBe("(property) foo.bar: integer");
        expect(items[0].insertText).toBe("bar");
        expect(getDeprecateNodes(program)).toHaveLength(1);
    });

    it("ClassExp", () => {
        const program = parse("/** @property {integer} bar here */ local foo = class {}; foo()");
        const items = getMemberCompletions(getBranchAtPos(program, pos(60)));
        expect(items.length).toEqual(1);
        expect(items[0].detail).toBe("(property) foo.bar: integer");
        expect(items[0].insertText).toBe("bar");
    });

    it("Getter", () => {
        const program = parse("class foo { /** @property {integer} bar here */ function _get() {} }; foo()");
        const items = getMemberCompletions(getBranchAtPos(program, pos(72)));
        expect(items.length).toEqual(1);
        expect(items[0].detail).toContain("(readonly)");
        expect(items[0].insertText).toBe("bar");
    });

    it("Setter", () => {
        const program = parse("class foo { /** @property {integer} bar here */ function _set() {} }; foo()");
        const items = getMemberCompletions(getBranchAtPos(program, pos(72)));
        expect(items.length).toEqual(1);
        expect(items[0].detail).toContain("(writeonly)");
        expect(items[0].insertText).toEqual("bar");
    });

    it("Getter Setter", () => {
        const program = parse("class foo { /** @property {integer} bar here */ function _set() /** @property {integer} bar here */ function _get() {} }; foo()");
        const items = getMemberCompletions(getBranchAtPos(program, pos(123)));
        expect(items.length).toEqual(1);
        expect(items[0].detail).toBe("(property) foo.bar: integer");
        expect(items[0].insertText).toBe("bar");
    });

    it("Class Setter Extended", () => {
        const program = parse("/** @property {integer} bar here */ class foo { /** @property {integer} bar here */ function _set() {} }; foo()");
        const items = getMemberCompletions(getBranchAtPos(program, pos(108)));
        expect(items.length).toEqual(1);
        expect(items[0].detail).toBe("(property) foo.bar: integer");
        expect(items[0].insertText).toBe("bar");
    });

    it("Class Setter", () => {
        const program = parse("/** @setter {integer} bar here */ class foo {}; foo()");
        const items = getMemberCompletions(getBranchAtPos(program, pos(49)));
        expect(items.length).toEqual(1);
        expect(items[0].detail).toBe("(writeonly) foo.bar: integer");
        expect(items[0].insertText).toBe("bar");
    });

    it("Class Getter Extended", () => {
        const program = parse("/** @property {integer} bar here */ class foo { /** @property {integer} bar here */ function _get() {} }; foo()");
        const items = getMemberCompletions(getBranchAtPos(program, pos(108)));
        expect(items.length).toEqual(1);
        expect(items[0].detail).toBe("(property) foo.bar: integer");
        expect(items[0].insertText).toBe("bar");
    });

    it("Class Getter", () => {
        const program = parse("/** @getter {integer} bar here */ class foo {}; foo()");
        const items = getMemberCompletions(getBranchAtPos(program, pos(49)));
        expect(items.length).toEqual(1);
        expect(items[0].detail).toBe("(readonly) foo.bar: integer");
        expect(items[0].insertText).toBe("bar");
    });

    it("Ignore", () => {
        const program = parse("class foo { /** @property {integer} bar here */ function who() {} }; foo()");
        const items = getMemberCompletions(getBranchAtPos(program, pos(70)));
        expect(items).toHaveLength(1);
        expect(items[0].detail).toBe("(method) foo.who(): null");
        expect(items[0].insertText).toBe("who");
    });

    // -------------------------------------------------------------------------

    it("Description", () => {
        const program = parse("class foo { /** @property {integer} bar here */ function _get() {} }; foo()");
        const items = getMemberCompletions(getBranchAtPos(program, pos(72)));
        expect(items.length).toEqual(1);
        expect(items[0].detail).toBe("(readonly) foo.bar: integer");
        expect(items[0].insertText).toBe("bar");
        expect(items[0].documentation["value"]).toBe("here");
    });

    // -------------------------------------------------------------------------

    it("getMetaNode, undefined", () => {
        expect(getMetaNode([], undefined)).toBeUndefined();
    });

    it("getMetaNode, broken", () => {
        const program = parseForceExtra("class foo {};");
        const n = getBranchAtPos(program, pos(7)).slice(0, -1);
        // c.extra.body.push(<AST.Node>{ type: "BlockStatement" });
        expect(getMetaNode(n, "x")).toBeUndefined();
    });

    it("getMetaNode, none", () => {
        const program = parse("class foo { function bar() {} };");
        const n = getBranchAtPos(program, pos(7)).slice(0, -1);
        expect(getMetaNode(n, "x")).toBeUndefined();
    });

    it("getMetaNode, meta", () => {
        const program = parse("class foo { /** @property {*} x */ function _get() {} };");
        const n = getBranchAtPos(program, pos(7)).slice(0, -1);
        const m = getMetaNode(n, "x");
        expect(m.at(-1).range).toEqual([30, 31]);
    });

    // -------------------------------------------------------------------------

    it("createMetaNode, undefined", () => {
        expect(createMetaNode(null, null, null)).toBeUndefined();
    });

});
