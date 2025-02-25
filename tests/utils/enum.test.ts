import {
    beforeEach,
    describe,
    fdescribe,
    expect,
    it,
    fit,
} from "@jest/globals";
import { parseExtra as parse, pos, dump } from "../utils";
import { getNodeAtPos, getBranchAtPos } from "../../src/utils/find";
import { SquirrelType } from "../../src/utils/kind";
import { getEnumMemberType, getEnumType, getNodeEnumType } from "../../src/utils/enum";
import { getNodeReturn } from "../../src/utils/return";
import { AST, SQTree as qt } from "../../src/ast";

describe("Enum", () => {

    it("getEnumType", () => {
        expect(getEnumType(getBranchAtPos(parse('enum e { a = "string" }'), pos(6)).slice(0, -1))).toBe(SquirrelType.STRING);
        expect(getEnumType(getBranchAtPos(parse('enum e { a = 1.0 }'), pos(6)).slice(0, -1))).toBe(SquirrelType.FLOAT);
        expect(getEnumType(getBranchAtPos(parse('enum e { a = "string", b = 1.0 }'), pos(6)).slice(0, -1))).toBe(SquirrelType.ANY);
        expect(getEnumType(getBranchAtPos(parse('enum e { a = 1 }'), pos(6)).slice(0, -1))).toBe(SquirrelType.INTEGER);
        expect(getEnumType(getBranchAtPos(parse('enum e { a }'), pos(6)).slice(0, -1))).toBe(SquirrelType.INTEGER);
        expect(getEnumType(getBranchAtPos(parse('enum e { a = true }'), pos(6)).slice(0, -1))).toBe(SquirrelType.BOOLEAN);
    });

    // -------------------------------------------------------------------------

    it("getEnumMemberType", () => {
        const program = parse('local obj = { x = "1" }');
        const n = getBranchAtPos(program, pos(15)).at(-2);
        delete n["value"]; // bad node
        const m = getBranchAtPos(program, pos(23));
        expect(getEnumMemberType(m)).toBe("IntegerLiteral"); // fallback
    });

    // -------------------------------------------------------------------------

    it("getNodeEnumType, undefined", () => {
        expect(getNodeEnumType([])).toBeUndefined();
        expect(getNodeEnumType([qt.Identifier("name")])).toBeUndefined();
    });

    it("getNodeEnumType, object", () => {
        const program = parse('/** @enum */ local obj = { x = "1" }; /** @returns {obj} */ function foo() {}; foo()');

        const n = getBranchAtPos(program, pos(71)).slice(0, -1);
        expect(getNodeReturn(n).at(-1)["name"]).toBe("obj");

        const m = getBranchAtPos(program, pos(81)).slice(0, -1);
        expect(getNodeEnumType(m)).toBe("StringLiteral");
    });

    it("getNodeEnumType, object multiple", () => {
        const program = parse('/** @enum */ local obj = { x = "1", y = 2 }; /** @returns {obj} */ function foo() {}; foo()');

        const n = getBranchAtPos(program, pos(77)).slice(0, -1);
        expect(getNodeReturn(n).at(-1)["name"]).toBe("obj");

        const m = getBranchAtPos(program, pos(87)).slice(0, -1);
        expect(getNodeEnumType(m)).toBe("Undefined");
    });

    it("getNodeEnumType, enum", () => {
        const program = parse('enum myen { x = "1" } /** @returns {myen} */ function foo() {}; foo()');
        const n = getBranchAtPos(program, pos(55)).slice(0, -1);
        expect(getNodeReturn(n).at(-1)["name"]).toBe("myen");

        const m = getBranchAtPos(program, pos(65)).slice(0, -1);
        expect(getNodeEnumType(m)).toBe("StringLiteral");
    });

    it("getNodeEnumType, enum default", () => {
        const program = parse('enum myen { x } /** @returns {myen} */ function foo() {}; foo()');
        const n = getBranchAtPos(program, pos(49)).slice(0, -1);
        expect(getNodeReturn(n).at(-1)["name"]).toBe("myen");

        const m = getBranchAtPos(program, pos(59)).slice(0, -1);
        expect(getNodeEnumType(m)).toBe("IntegerLiteral");
    });

    it("getNodeEnumType, enum multiple", () => {
        const program = parse('enum myen { x = 1, x = "1" } /** @returns {myen} */ function foo() {}; foo()');
        const n = getBranchAtPos(program, pos(62)).slice(0, -1);
        expect(getNodeReturn(n).at(-1)["name"]).toBe("myen");

        const m = getBranchAtPos(program, pos(72)).slice(0, -1);
        expect(getNodeEnumType(m)).toBe("Undefined");
    });

});
