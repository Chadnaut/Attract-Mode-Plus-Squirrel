import { describe, expect, it } from "@jest/globals";
import { parseForce as parse, pos } from "../utils";
import { getBranchAtPos } from "../../src/utils/find";
import { addProgramString, clearProgramStrings, getProgramStrings, ucfirst } from "../../src/utils/string";

describe("Map", () => {

    it("ucfirst", () => {
        expect(ucfirst("hello")).toBe("Hello");
    });

    it("addProgramString, undefined", () => {
        expect(() => addProgramString([])).not.toThrow();
    });

    it("getProgramString", () => {
        const program = parse(`"string"`);
        const n = getBranchAtPos(program, pos(4));
        clearProgramStrings(program);
        addProgramString(n);
        expect(getProgramStrings(program).length).toBe(1);
    });

    it("getProgramString, undefined", () => {
        expect(getProgramStrings(undefined)).toEqual([]);
    });
});
