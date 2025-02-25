import { getNodeCallParamInfo, getNodeParamInfo, getNodeParams, getParamCompletionItems, isRestNode, setRestNode } from '../../src/utils/params';
import { describe, expect, it } from "@jest/globals";
import { dump, parseExtra as parse, pos } from "../utils";
import { SQTree as qt } from "../../src/ast";
import { getBranchAtPos } from '../../src/utils/find';

describe("Params", () => {

    it("getNodeParams, None", () => {
        const program = parse('function foo() {}');
        const n = getBranchAtPos(program, pos(0));
        const params = getNodeParams(n);
        expect(params.length).toBe(0);

        expect(getNodeParams([]).length).toBe(0);
    });

    it("getNodeParams, FunctionDeclaration", () => {
        const program = parse('function foo(a) {}');
        const n = getBranchAtPos(program, pos(0));
        const params = getNodeParams(n);
        expect(params.length).toBe(1);
        expect(params[0].at(-1)['name']).toBe('a');
    });

    it("getNodeParams, FunctionDeclaration, defaults", () => {
        const program = parse('function foo(a, b = 1) {}');
        const n = getBranchAtPos(program, pos(0));
        const params = getNodeParams(n);
        expect(params.length).toBe(2);
        expect(params[0].at(-1)['name']).toBe('a');
        expect(params[1].at(-1)['left']['name']).toBe('b');
    });

    it("getNodeParams, FunctionExpression", () => {
        const program = parse('local x = function(a) {}');
        const n = getBranchAtPos(program, pos(14));
        const params = getNodeParams(n);
        expect(params.length).toBe(1);
        expect(params[0].at(-1)['name']).toBe('a');
    });

    it("getNodeParams, FunctionExpression, none", () => {
        const params = getNodeParams([qt.FunctionExpression(null, null)]);
        expect(params.length).toBe(0);
    });

    it("getNodeParams, FunctionExpression inherits constructor", () => {
        const program = parse('local foo = class { constructor(a) {} }');
        const n = getBranchAtPos(program, pos(14));
        const params = getNodeParams(n);
        expect(params.length).toBe(1);
    });

    it("getNodeParams, FunctionExpression, root", () => {
        const program = parse('x <- function(a) {}');
        const n = getBranchAtPos(program, pos(8));
        const params = getNodeParams(n);
        expect(params.length).toBe(1);
        expect(params[0].at(-1)['name']).toBe('a');
    });

    it("getNodeParams, LambdaExpression", () => {
        const program = parse('@(a) {}');
        const n = getBranchAtPos(program, pos(0));
        const params = getNodeParams(n);
        expect(params.length).toBe(1);
        expect(params[0].at(-1)['name']).toBe('a');
    });

    it("getNodeParams, LambdaExpression, none", () => {
        const params = getNodeParams([qt.LambdaExpression(null, null)]);
        expect(params.length).toBe(0);
    });

    it("getNodeParams, ClassDeclaration inherits constructor", () => {
        const program = parse('class foo { constructor(a) {} }');
        const n = getBranchAtPos(program, pos(0));
        const params = getNodeParams(n);
        expect(params.length).toBe(1);
    });

    it("getNodeParams, ClassDeclaration, constructor", () => {
        const program = parse('class foo { constructor(a) {} }');
        const n = getBranchAtPos(program, pos(18)).slice(0, -1);
        const params = getNodeParams(n);
        expect(params.length).toBe(1);
        expect(params[0].at(-1)['name']).toBe('a');
    });

    it("getNodeParams, MethodDefinition", () => {
        const program = parse('class foo { function bar(a) {} }');
        const n = getBranchAtPos(program, pos(22)).slice(0, -1);
        const params = getNodeParams(n);
        expect(params.length).toBe(1);
        expect(params[0].at(-1)['name']).toBe('a');
    });

    it("getNodeParams, MethodDefinition, rest", () => {
        const program = parse('class foo { function bar(a, ...) {} }');
        const n = getBranchAtPos(program, pos(22)).slice(0, -1);
        const params = getNodeParams(n);
        expect(params.length).toBe(2);
        expect(params[0].at(-1)['name']).toBe('a');
        expect(params[1].at(-1)['type']).toBe('Identifier');
        expect(isRestNode(params[1])).toBe(true);
    });

    it("getNodeCallParamInfo, invalid", () => {
        expect(getNodeCallParamInfo([]).length).toBe(0);
    });

    // -------------------------------------------------------------------------

    it("getNodeParamInfo, lambda", () => {
        const program = parse('local foo = @(x, y) 123;');
        const n = getBranchAtPos(program, pos(15));
        const info = getNodeParamInfo(n);
        expect(info?.label.length).toBe(2);
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

    it("getParamCompletionItems, invalid", () => {
        const text = "identifier";
        const program = parse(text);
        const items = getParamCompletionItems(text, program, pos(5));
        expect(items.length).toBe(0);
    });

    it("getParamCompletionItems, array", () => {
        const text = `local arr=["a","b","c"]; /** @param {string(=arr)} a */ function foo(a) {}; foo("");`;
        const program = parse(text);
        const items = getParamCompletionItems(text, program, pos(81));
        expect(items.length).toBe(3);
    });

    it("getParamCompletionItems, array missing", () => {
        const text = `/** @param {string(=arr)} a */ function foo(a) {}; foo("");`;
        const program = parse(text);
        const items = getParamCompletionItems(text, program, pos(56));
        expect(items.length).toBe(0);
    });

    it("getParamCompletionItems, FunctionDeclaration, none", () => {
        const text = "function foo(a) {}; foo(10);";
        const program = parse(text);
        const items = getParamCompletionItems(text, program, pos(25));
        expect(items.length).toBe(0);
    });

    it("getParamCompletionItems, FunctionExpression, none", () => {
        const text = "local foo = function(a) {}; foo(10);";
        const program = parse(text);
        const items = getParamCompletionItems(text, program, pos(33));
        expect(items.length).toBe(0);
    });

    it("getParamCompletionItems, FunctionDeclaration, options", () => {
        const text = "/** @param {(z|y|x)} a */ function foo(a) {}; foo(10);";
        const program = parse(text);
        const items = getParamCompletionItems(text, program, pos(51));
        expect(items.length).toBe(3);
        expect(items[0].label).toEqual({ label: "z" });
        expect(items[1].label).toEqual({ label: "y" });
        expect(items[2].label).toEqual({ label: "x" });
    });

    it("getParamCompletionItems, FunctionExpression, options", () => {
        const text = "/** @param {(z|y|x)} a */ local foo = function(a) {}; foo(10);";
        const program = parse(text);
        const items = getParamCompletionItems(text, program, pos(59));
        expect(items.length).toBe(3);
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
