import { describe, expect, it } from "@jest/globals";
import { SQTree as qt } from "../../src/ast";
import { getNewSlotAssignment, isNewSlotAssignment, nodeHasRootPrefix } from '../../src/utils/root';
import { parseExtra as parse, pos } from "../utils";
import { getBranchAtPos } from "../../src/utils/find";

describe("Root", () => {

    it("nodeHasRootPrefix", () => {
        expect(nodeHasRootPrefix(undefined)).toBe(false);
        const id = qt.Identifier("id");
        expect(nodeHasRootPrefix(id)).toBe(false);
        id.extra = { root: true };
        expect(nodeHasRootPrefix(id)).toBe(true);
    });

    it("isNewSlotAssignment", () => {
        expect(isNewSlotAssignment([])).toBe(false);
        expect(isNewSlotAssignment([qt.Identifier("name")])).toBe(false);
        expect(isNewSlotAssignment([qt.AssignmentExpression("<-", qt.MemberExpression(qt.Identifier("obj"), qt.Identifier("prop")), qt.StringLiteral("123"))])).toBe(false);
        expect(isNewSlotAssignment([qt.AssignmentExpression("=", qt.Identifier("name"), qt.StringLiteral("123"))])).toBe(false);
        expect(isNewSlotAssignment([qt.AssignmentExpression("<-", null, qt.StringLiteral("123"))])).toBe(false);
        expect(isNewSlotAssignment([qt.AssignmentExpression("<-", qt.Identifier("name"), qt.StringLiteral("123"))])).toBe(true);
    });

    it("getNewSlotAssignment, undefined", () => {
        expect(getNewSlotAssignment([])).toEqual([]);
        expect(getNewSlotAssignment([qt.Identifier("")])).toEqual([]);
    });

    it("getNewSlotAssignment, false", () => {
        const program = parse("name = 123");
        const n = getBranchAtPos(program, pos(2));
        expect(getNewSlotAssignment(n)).toEqual([]);
    });

    it("getNewSlotAssignment, true", () => {
        const program = parse("name <- 123");
        const n = getBranchAtPos(program, pos(2));
        expect(getNewSlotAssignment(n).length).toBeGreaterThan(0);
    });

});
