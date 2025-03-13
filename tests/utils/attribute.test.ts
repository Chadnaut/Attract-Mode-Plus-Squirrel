import { describe, expect, it } from "@jest/globals";
import { parseExtra as parse, pos } from "../utils";
import { getBranchAtPos } from "../../src/utils/find";
import { getAttributeCompletions, getClassAttributeCompletions, getMethodAttributeCompletions, nodeIsAttribute } from "../../src/utils/attribute";
import { SQTree as qt } from "../../src/ast";
import constants from "../../src/constants";

let spacing = false;
jest.mock('../../src/utils/config.ts', () => ({
    ...jest.requireActual('../../src/utils/config.ts'),
    getConfigValue: (configSection, defaultValue) => {
        switch (configSection) {
            case constants.CODE_FORMATTING_ATTR_SPACING:
                return spacing;
            default:
                return false;
        }
    }
}));

beforeEach(() => {
    spacing = false;
})

describe("Attribute", () => {

    it("nodeIsAttribute, invalid", () => {
        expect(nodeIsAttribute([])).toBe(false);
    });

    it("nodeIsAttribute, false", () => {
        const program = parse(`class foo {}`);
        const branch = getBranchAtPos(program, pos(7));
        expect(nodeIsAttribute(branch)).toBe(false);
    });

    it("nodeIsAttribute", () => {
        const program = parse(`class foo <//> {}`);
        const branch = getBranchAtPos(program, pos(12));
        expect(nodeIsAttribute(branch)).toBe(true);
    });

    it("getAttributeCompletions, invalid branch", () => {
        expect(getAttributeCompletions([qt.ObjectExpression(null, true)])).toEqual([]);
    });

    it("getAttributeCompletions, invalid node", () => {
        const program = parse(`class foo <//> { <//> key = 1 }`);
        const branch = getBranchAtPos(program, pos(7));
        const items = getAttributeCompletions(branch);
        expect(items).toHaveLength(0);
    });

    it("getAttributeCompletions, class", () => {
        spacing = false;
        const program = parse(`class foo <//> { <//> key = 1 }`);
        const branch = getBranchAtPos(program, pos(12));
        const items = getAttributeCompletions(branch);
        expect(items).toHaveLength(1);
        expect(items[0].insertText["value"]).toContain("help=");
        expect(items[0].insertText["value"]).not.toContain("label=");
    });

    it("getAttributeCompletions, class, space", () => {
        spacing = true;
        const program = parse(`class foo <//> { <//> key = 1 }`);
        const branch = getBranchAtPos(program, pos(12));
        const items = getAttributeCompletions(branch);
        expect(items).toHaveLength(1);
        expect(items[0].insertText["value"]).toContain("help = ");
        expect(items[0].insertText["value"]).not.toContain("label = ");
    });

    it("getAttributeCompletions, method", () => {
        spacing = false;
        const program = parse(`class foo <//> { <//> key = 1 }`);
        const branch = getBranchAtPos(program, pos(19));
        const items = getAttributeCompletions(branch);
        expect(items).toHaveLength(1);
        expect(items[0].insertText["value"]).toContain("help=");
        expect(items[0].insertText["value"]).toContain("label=");
    });

    it("getAttributeCompletions, method, space", () => {
        spacing = true;
        const program = parse(`class foo <//> { <//> key = 1 }`);
        const branch = getBranchAtPos(program, pos(19));
        const items = getAttributeCompletions(branch);
        expect(items).toHaveLength(1);
        expect(items[0].insertText["value"]).toContain("help = ");
        expect(items[0].insertText["value"]).toContain("label = ");
    });

    it("getClassAttributeCompletions", () => {
        expect(getClassAttributeCompletions()).toHaveLength(1);
    });

    it("getMethodAttributeCompletions", () => {
        const items = getMethodAttributeCompletions();
        expect(items).toHaveLength(1);
        expect(items[0].insertText["value"]).toContain(':0}');
    });

    it("getMethodAttributeCompletions, index", () => {
        const items = getMethodAttributeCompletions(5);
        expect(items).toHaveLength(1);
        expect(items[0].insertText["value"]).toContain(":5}");
    });

});
