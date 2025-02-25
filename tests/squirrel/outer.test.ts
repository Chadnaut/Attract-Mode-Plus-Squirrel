import {
    beforeEach,
    describe,
    fdescribe,
    expect,
    it,
    fit,
} from "@jest/globals";
import { parseForce as parse, lineLoc, dump } from "../utils";
import { SQTree as qt } from "../../src/ast";

// const EXPR = 1;
// const OBJECT = 2;
// const BASE = 3;
// const LOCAL = 4;
// const OUTER = 5;

describe("Outer", () => {

    it("MINUSEQ", () => {
        expect(() => {
            parse("x -= 1"); // 2 = object
            parse("base -= x"); // 3 = base (error)
            parse("local x = 1; x -= 1;"); // 4 = local
            parse("local x = 1; function foo() { x -= 1; }"); // 5 = outer
        }).not.toThrow();
    });

    it("PLUSEQ", () => {
        expect(() => {
            parse("x += 1"); // 2 = object
            parse("base += x"); // 3 = base (error)
            parse("local x = 1; x += 1;"); // 4 = local
            parse("local x = 1; function foo() { x += 1; }"); // 5 = outer
        }).not.toThrow();
    });

    it("MULEQ", () => {
        expect(() => {
            parse("x *= 1"); // 2 = object
            parse("base *= x"); // 3 = base (error)
            parse("local x = 1; x *= 1;"); // 4 = local
            parse("local x = 1; function foo() { x *= 1; }"); // 5 = outer
        }).not.toThrow();
    });

    it("DIVEQ", () => {
        expect(() => {
            parse("x /= 1"); // 2 = object
            parse("base /= x"); // 3 = base (error)
            parse("local x = 1; x /= 1;"); // 4 = local
            parse("local x = 1; function foo() { x /= 1; }"); // 5 = outer
        }).not.toThrow();
    });

    it("MODEQ", () => {
        expect(() => {
            parse("x %= 1"); // 2 = object
            parse("base %= x"); // 3 = base (error)
            parse("local x = 1; x %= 1;"); // 4 = local
            parse("local x = 1; function foo() { x %= 1; }"); // 5 = outer
        }).not.toThrow();
    });

    it("Assign", () => {
        expect(() => {
            parse("local x; function() { x = 2; }"); // outer
        }).not.toThrow();
    });

    it("Computed Base", () => {
        expect(() => {
            parse('base["prop"] = 1;'); // base
        }).not.toThrow();
    });

    it("Increment", () => {
        expect(() => {
            parse("x++; x--; ++x; --x;"); //  2 = object
            parse("base++; base--; ++base; --base; }"); // 3 = base
            parse("local x; x++; x--; ++x; --x;"); // 4 = local
            parse("local x; function() { x++; x--; ++x; --x; }"); // 5 = outer
        }).not.toThrow();
    });

    it("Bracket", () => {
        expect(() => {
            parse("call()"); // 2 = object
            parse("base()"); // 3 = base
            parse("local call = function(); call()"); // 4 = local
            parse("local call = function(); function foo() { call(); }"); // 5 = outer
        }).not.toThrow();
    });

    it("Constructor call", () => {
        expect(() => {
            parse("class foo { function bar() { constructor(); } }");
        }).not.toThrow();
    });

    it("EmitLoad Constant", () => {
        expect(() => {
            parse("const x = true; local y = x;");
            parse("const x = 1; local y = x;");
            parse("const x = 1.0; local y = x;");
        }).not.toThrow();
    });

    it("Sequence", () => {
        expect(() => {
            parse("(a, b, c)");
        }).not.toThrow();
    });

});
