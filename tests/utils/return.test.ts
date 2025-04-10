import { describe, expect, it } from "@jest/globals";
import { parseForceExtra as parse, dump, pos } from "../utils";
import { getNodeReturn } from "../../src/utils/return";
import { getBranchAtPos } from "../../src/utils/find";
import { AST, SQTree as qt } from "../../src/ast";
import { getNodeInstanceType } from "../../src/utils/type";

describe("ReturnArgument", () => {

    it("ReturnArgument FuncDec Parameter", () => {
        const program = parse("function foo(a) { return a; }; local bar = foo(123);");
        const n = getBranchAtPos(program, pos(38));
        expect(getNodeInstanceType(n).at(-1)["name"]).toEqual("IntegerLiteral")
    });

    it("ReturnArgument FuncExp Parameter", () => {
        const program = parse("local foo = function(a) { return a; }; local bar = foo(123);");
        const n = getBranchAtPos(program, pos(46));
        expect(getNodeInstanceType(n).at(-1)["name"]).toEqual("IntegerLiteral")
    });

    it("ReturnArgument Var Parameter", () => {
        const program = parse("function foo(a) { return a; }; local x = 123; local bar = foo(x);");
        const n = getBranchAtPos(program, pos(53));
        expect(getNodeInstanceType(n).at(-1)["name"]).toEqual("IntegerLiteral")
    });

    it("ReturnArgument", () => {
        const program = parse("function foo() { return 123; }");
        const n = getBranchAtPos(program, pos(0));
        const response = getNodeReturn(n).at(-1);
        expect(response.type).toBe("IntegerLiteral");
        expect(response["value"]).toBe(123);
    });

    it("ReturnArgument, invalid", () => {
        expect(getNodeReturn([])).toHaveLength(0);
    });

    it("ReturnArgument, ignore child", () => {
        const program = parse('function foo() { local x = function() { return "x"; }; return 123; }');
        const n = getBranchAtPos(program, pos(0));
        const response = getNodeReturn(n).at(-1);
        expect(response.type).toBe("IntegerLiteral");
        expect(response["value"]).toBe(123);
    });

    it("ReturnArgument, lambda", () => {
        const program = parse("@() 123;");
        const n = getBranchAtPos(program, pos(0));
        const response = getNodeReturn(n).at(-1);
        expect(response.type).toBe("IntegerLiteral");
        expect(response["value"]).toBe(123);
    });

    it("ReturnArgument, self", () => {
        const program = parse("return 123;");
        const n = getBranchAtPos(program, pos(0));
        const response = getNodeReturn(n).at(-1);
        expect(response.type).toBe("IntegerLiteral");
        expect(response["value"]).toBe(123);
    });

    it("ReturnArgument, override", () => {
        const program = parse("/** @returns {string} */ function foo() { return 123; }");
        const n = getBranchAtPos(program, pos(35));
        const response = getNodeReturn(n).at(-1);
        expect(response.type).toBe("StringLiteral");
    });

    it("ReturnArgument, override array", () => {
        const program = parse("/** @returns {array} */ function foo() { return 123; }");
        const n = getBranchAtPos(program, pos(34));
        const response = getNodeReturn(n).at(-1);
        expect(response.type).toBe("ArrayExpression");
    });

    it("ReturnArgument, override custom", () => {
        const program = parse('/** @returns {custom} */ function foo() {};');
        const n = getBranchAtPos(program, pos(28));
        const response = getNodeReturn(n).at(-1);
        expect(response.type).toBe("Identifier");
        expect(response["name"]).toBe("custom");
    });

    it("ReturnArgument, function dec", () => {
        const program = parse(`function foo() {}`);
        const n = getBranchAtPos(program, pos(11));
        expect(getNodeReturn(n)).toHaveLength(0);
    });

    it("ReturnArgument, function exp", () => {
        const program = parse(`local foo = function() {}`);
        const n = getBranchAtPos(program, pos(16));
        expect(getNodeReturn(n)).toHaveLength(0);
    });

    it("ReturnArgument, method", () => {
        const program = parse(`class foo { function bar() {} }`);
        const n = getBranchAtPos(program, pos(22)).slice(0, -1);
        expect(getNodeReturn(n)).toHaveLength(0);
    });

    it("ReturnArgument, generator", () => {
        const program = parse("function foo() { yield 123; }");
        const n = getBranchAtPos(program, pos(10)).slice(0, -1);
        const response = getNodeReturn(n).at(-1);
        expect(response.type).toBe("Identifier");
        expect(response["name"]).toBe("Generator");
    });

    it("ReturnArgument, method", () => {
        const program = parse("class foo { function bar() { return 123 }; }");
        const n = getBranchAtPos(program, pos(22)).slice(0, -1);
        const response = getNodeReturn(n).at(-1);
        expect(response.type).toBe("IntegerLiteral");
    });

    it("ReturnArgument, constructor", () => {
        const program = parse("class foo { constructor() { return 123 }; }");
        const n = getBranchAtPos(program, pos(18)).slice(0, -1);
        const response = getNodeReturn(n).at(-1);
        expect(response.type).toBe("ClassDeclaration"); // constructor returns class, not return!
    });

    it("ReturnArgument, function expression", () => {
        const program = parse("function foo() { return function() {}; }");
        const n = getBranchAtPos(program, pos(0));
        const response = getNodeReturn(n).at(-1);
        expect(response.type).toBe("FunctionExpression");
    });

    it("getNodeReturn, brute", () => {
        expect(getNodeReturn([qt.FunctionDeclaration(null, null, null)])).toEqual([]);
        expect(getNodeReturn([qt.FunctionExpression(null, null)])).toEqual([]);
        expect(getNodeReturn([qt.MethodDefinition(null, null, null)])).toEqual([]);
    });

});
