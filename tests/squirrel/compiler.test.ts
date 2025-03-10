import { describe, expect, it } from "@jest/globals";
import { SQCompiler } from "../../src/squirrel/squirrel/sqcompiler.cpp";
import { SQVM } from "../../src/squirrel/squirrel/sqvm.cpp";
import { parse, lineLoc, dump } from "../utils";
import { SquirrelParser } from "../../src/squirrel/parser";
import { SQSharedState } from "../../src/squirrel/squirrel/sqstate.cpp";
import { SQTree as qt } from "../../src/ast/create";

jest.mock('../../src/squirrel/squirrel/sqopcodes.h.ts', () => ({
    ...jest.requireActual('../../src/squirrel/squirrel/sqopcodes.h.ts'),
    MAX_FUNC_STACKSIZE: 4, // 255
    MAX_LITERALS: 4 // 2147483647
}));

describe("SQCompiler", () => {
    it("Creates", () => {
        const c = new SQCompiler(new SQVM(new SQSharedState()), ()=>"", "", "", true, null, true);
        expect(c).toBeInstanceOf(SQCompiler);
    });

    it("Returns false on error", () => {
        let readIndex = 0;
        const text = "base = 1"; // erroneous code
        const readf = (t) => t[readIndex++];
        const efunc = () => { throw "err"; };
        const raiseerror = false;
        const c = new SQCompiler(new SQVM(new SQSharedState()), readf, text, "src", raiseerror, efunc, true);
        let o: any = qt.Program();
        expect(c.Compile(o)).toBe(false);
    });

    it("Creates Parser, no options", () => {
        const p = new SquirrelParser();
        expect(p).toBeInstanceOf(SquirrelParser);
    });

    it("Compiles", () => {
        expect(() => parse("")).not.toThrow();
    });

    it("Throws: internal compiler error: too many literals", () => {
        expect(() => {
            parse('local x = ["1", "2", "3", "4", "5"];');
        }).toThrow("internal compiler error: too many literals");
    });

    it("Throws: internal compiler error: too many locals", () => {
        expect(() => {
            parse('local a, b, c, d;');
        }).toThrow("internal compiler error: too many locals");
    });

    it("Throws: internal compiler assertion: invalid command", () => {
        expect(() => {
            parse("delete base");
        }).toThrow("internal compiler assertion: invalid command");
    });
});
