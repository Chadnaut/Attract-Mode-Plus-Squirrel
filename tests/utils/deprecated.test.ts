import { describe, expect, it } from "@jest/globals";
import { SQTree as qt } from "../../src/ast";
import { dump, parseExtra as parse, pos } from "../utils";
import { getDeprecateNodes, getNodeDeprecated, inheritDeprecation, setNodeDeprecated } from "../../src/utils/deprecated";
import { getBranchAtPos } from "../../src/utils/find";

describe("Deprecated", () => {

    it("getDeprecateNodes", () => {
        const n = parse("/** @deprecated */ function foo() {};");
        const nodes = getDeprecateNodes(n);
        expect(nodes.length).toEqual(1);
    });

    it("getDeprecateNodes, none", () => {
        const n = parse("local x = 123;");
        const nodes = getDeprecateNodes(n);
        expect(nodes.length).toEqual(0);
        expect(getDeprecateNodes(undefined)).toHaveLength(0);
    });

    it("inheritDeprecation", () => {
        const program = parse("a; b;");
        const a = getBranchAtPos(program, pos(1)).at(-1);
        const b = getBranchAtPos(program, pos(4)).at(-1);
        setNodeDeprecated([program, b]);

        inheritDeprecation([program, a], [null]);
        expect(getNodeDeprecated([program, a])).toBe(false);

        inheritDeprecation([program, a], [program, a]);
        expect(getNodeDeprecated([program, a])).toBe(false);

        inheritDeprecation([program, a], [program, b]);
        expect(getNodeDeprecated([program, a])).toBe(true);
    });

    it("setNodeDeprecated, undefined", () => {
        expect(setNodeDeprecated([])).toBeUndefined();
    });

    it("setNodeDeprecated, Identifier", () => {
        const program = parse("a;");
        const a = getBranchAtPos(program, pos(1)).at(-1);
        setNodeDeprecated([program, a]);
        expect(getNodeDeprecated([program, a])).toBe(true);
    });

    it("setNodeDeprecated, VariableDeclarator", () => {
        const program = parse("local a = 1;");
        const b = getBranchAtPos(program, pos(7));
        const id = b.at(-1);
        const vd = b.at(-2);

        setNodeDeprecated([program, vd]);
        expect(getNodeDeprecated([program, id])).toBeFalsy();
        expect(getNodeDeprecated([program, vd])).toBeFalsy();

        setNodeDeprecated([program, id]);
        expect(getNodeDeprecated([program, id])).toBe(true);
        expect(getNodeDeprecated([program, vd])).toBeFalsy();
    });

});
