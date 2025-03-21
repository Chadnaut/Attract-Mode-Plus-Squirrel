import { getNodeCallParamInfo, getNodeParamInfo, getNodeParams, getParamSuggestions, getParamSymbols, isRestNode, limitParamIndex, ParameterInformationExtra, setRestNode } from '../../src/utils/params';
import { describe, expect, it } from "@jest/globals";
import { dump, parseExtra as parse, parseForce, pos } from "../utils";
import { SQTree as qt } from "../../src/ast";
import { getBranchAtPos } from '../../src/utils/find';

describe("Params", () => {

    it("limitParamIndex, no params", () => {
        expect(limitParamIndex(10, [])).toBe(10);
    });

    it("limitParamIndex, valid", () => {
        expect(limitParamIndex(10, [<ParameterInformationExtra>{}])).toBe(10);
    });

    it("limitParamIndex, rest", () => {
        expect(limitParamIndex(10, [<ParameterInformationExtra>{}, <ParameterInformationExtra>{ rest: true }])).toBe(1);
    });

    it("getParamSymbols", () => {
        const program = parse('function foo(a) {}');
        const n = getBranchAtPos(program, pos(14));
        const params = getParamSymbols(n);
        expect(params).toHaveLength(1);
        expect(params[0].documentation).toBeUndefined();
    });

    it("getParamSymbols, incomplete", () => {
        const program = parseForce('function foo(a)');
        const n = getBranchAtPos(program, pos(14));
        const params = getParamSymbols(n);
        expect(params).toHaveLength(1);
        expect(params[0].documentation).toBeUndefined();
    });

    it("getParamSymbols, info", () => {
        const program = parse('/** @param {integer} a Here */ function foo(a) {}');
        const n = getBranchAtPos(program, pos(45));
        const params = getParamSymbols(n);
        expect(params).toHaveLength(1);
        expect(params[0].documentation).toBe("Here");
    });

    it("getNodeParams, None", () => {
        const program = parse('function foo() {}');
        const n = getBranchAtPos(program, pos(0));
        const params = getNodeParams(n);
        expect(params).toHaveLength(0);

        expect(getNodeParams([])).toHaveLength(0);
    });

    it("getNodeParams, FunctionDeclaration", () => {
        const program = parse('function foo(a) {}');
        const n = getBranchAtPos(program, pos(0));
        const params = getNodeParams(n);
        expect(params).toHaveLength(1);
        expect(params[0].at(-1)['name']).toBe('a');
    });

    it("getNodeParams, FunctionDeclaration, defaults", () => {
        const program = parse('function foo(a, b = 1) {}');
        const n = getBranchAtPos(program, pos(0));
        const params = getNodeParams(n);
        expect(params).toHaveLength(2);
        expect(params[0].at(-1)['name']).toBe('a');
        expect(params[1].at(-1)['left']['name']).toBe('b');
    });

    it("getNodeParams, FunctionExpression", () => {
        const program = parse('local x = function(a) {}');
        const n = getBranchAtPos(program, pos(14));
        const params = getNodeParams(n);
        expect(params).toHaveLength(1);
        expect(params[0].at(-1)['name']).toBe('a');
    });

    it("getNodeParams, FunctionExpression, none", () => {
        const params = getNodeParams([qt.FunctionExpression(null, null)]);
        expect(params).toHaveLength(0);
    });

    it("getNodeParams, FunctionExpression inherits constructor", () => {
        const program = parse('local foo = class { constructor(a) {} }');
        const n = getBranchAtPos(program, pos(14));
        const params = getNodeParams(n);
        expect(params).toHaveLength(1);
    });

    it("getNodeParams, FunctionExpression, root", () => {
        const program = parse('x <- function(a) {}');
        const n = getBranchAtPos(program, pos(8));
        const params = getNodeParams(n);
        expect(params).toHaveLength(1);
        expect(params[0].at(-1)['name']).toBe('a');
    });

    it("getNodeParams, LambdaExpression", () => {
        const program = parse('@(a) {}');
        const n = getBranchAtPos(program, pos(0));
        const params = getNodeParams(n);
        expect(params).toHaveLength(1);
        expect(params[0].at(-1)['name']).toBe('a');
    });

    it("getNodeParams, LambdaExpression, none", () => {
        const params = getNodeParams([qt.LambdaExpression(null, null)]);
        expect(params).toHaveLength(0);
    });

    it("getNodeParams, ClassDeclaration inherits constructor", () => {
        const program = parse('class foo { constructor(a) {} }');
        const n = getBranchAtPos(program, pos(0));
        const params = getNodeParams(n);
        expect(params).toHaveLength(1);
    });

    it("getNodeParams, ClassDeclaration, constructor", () => {
        const program = parse('class foo { constructor(a) {} }');
        const n = getBranchAtPos(program, pos(18)).slice(0, -1);
        const params = getNodeParams(n);
        expect(params).toHaveLength(1);
        expect(params[0].at(-1)['name']).toBe('a');
    });

    it("getNodeParams, MethodDefinition", () => {
        const program = parse('class foo { function bar(a) {} }');
        const n = getBranchAtPos(program, pos(22)).slice(0, -1);
        const params = getNodeParams(n);
        expect(params).toHaveLength(1);
        expect(params[0].at(-1)['name']).toBe('a');
    });

    it("getNodeParams, MethodDefinition, rest", () => {
        const program = parse('class foo { function bar(a, ...) {} }');
        const n = getBranchAtPos(program, pos(22)).slice(0, -1);
        const params = getNodeParams(n);
        expect(params).toHaveLength(2);
        expect(params[0].at(-1)['name']).toBe('a');
        expect(params[1].at(-1)['type']).toBe('Identifier');
        expect(isRestNode(params[1])).toBe(true);
    });

    it("getNodeCallParamInfo, invalid", () => {
        expect(getNodeCallParamInfo([])).toHaveLength(0);
    });

    // -------------------------------------------------------------------------

    it("getNodeParamInfo, lambda", () => {
        const program = parse('local foo = @(x, y) 123;');
        const n = getBranchAtPos(program, pos(15));
        const info = getNodeParamInfo(n);
        expect(info?.label).toHaveLength(2);
    });

    it("getNodeParamInfo, inline lambda undefined", () => {
        // There is no param info for inline lambda
        // since it attaches to an ID, which this does not have
        const program = parse('arr.sort(@(xxx, yyy) xxx <=> yyy)');
        const n = getBranchAtPos(program, pos(12));
        const info = getNodeParamInfo(n);
        expect(info).toBe(undefined);
    });

    // -------------------------------------------------------------------------

    it("getParamSuggestions, invalid", () => {
        const text = "identifier";
        const program = parse(text);
        const items = getParamSuggestions(text, program, pos(5));
        expect(items).toHaveLength(0);
    });

    it("getParamSuggestions, array", () => {
        const text = `local arr=["a","b","c"]; /** @param {string(=arr)} a */ function foo(a) {}; foo("");`;
        const program = parse(text);
        const items = getParamSuggestions(text, program, pos(81));
        expect(items).toHaveLength(3);
    });

    it("getParamSuggestions, array missing", () => {
        const text = `/** @param {string(=arr)} a */ function foo(a) {}; foo("");`;
        const program = parse(text);
        const items = getParamSuggestions(text, program, pos(56));
        expect(items).toHaveLength(0);
    });

    it("getParamSuggestions, FunctionDeclaration, none", () => {
        const text = "function foo(a) {}; foo(10);";
        const program = parse(text);
        const items = getParamSuggestions(text, program, pos(25));
        expect(items).toHaveLength(0);
    });

    it("getParamSuggestions, FunctionExpression, none", () => {
        const text = "local foo = function(a) {}; foo(10);";
        const program = parse(text);
        const items = getParamSuggestions(text, program, pos(33));
        expect(items).toHaveLength(0);
    });

    it("getParamSuggestions, FunctionDeclaration, options", () => {
        const text = "/** @param {(z|y|x)} a */ function foo(a) {}; foo(10);";
        const program = parse(text);
        const items = getParamSuggestions(text, program, pos(51));
        expect(items).toHaveLength(3);
        expect(items[0].label).toEqual({ label: "z" });
        expect(items[1].label).toEqual({ label: "y" });
        expect(items[2].label).toEqual({ label: "x" });
    });

    it("getParamSuggestions, FunctionExpression, options", () => {
        const text = "/** @param {(z|y|x)} a */ local foo = function(a) {}; foo(10);";
        const program = parse(text);
        const items = getParamSuggestions(text, program, pos(59));
        expect(items).toHaveLength(3);
        expect(items[0].label).toEqual({ label: "z" });
        expect(items[1].label).toEqual({ label: "y" });
        expect(items[2].label).toEqual({ label: "x" });
    });

    it("isRestNode", () => {
        const id = qt.Identifier("id");

        expect(isRestNode([])).toBe(false);
        expect(isRestNode([id])).toBe(false);

        setRestNode([id]);
        expect(isRestNode([id])).toBe(true);
    });

});
