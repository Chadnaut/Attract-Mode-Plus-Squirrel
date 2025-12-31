import { describe, expect, it } from "@jest/globals";
import { getNodeChildren, createNodeMaps } from "../../src/utils/map";
import { parseForce as parse, parseExtra, pos } from "../utils";
import * as path from "path";
import { getBranchAtPos } from "../../src/utils/find";
import { forwardSlash } from "../../src/utils/file";
import { AST, SQTree as qt } from "../../src/ast";
import { getProgramImportNames } from '../../src/utils/program';
import { getNodeDec } from "../../src/utils/definition";

describe("Map", () => {
    it("createNodeMaps, undefined", () => {
        expect(createNodeMaps(undefined)).toBeUndefined();
    });

    it("filename", () => {
        const filename = forwardSlash(path.join(__dirname, "../samples/format/home.src.nut"));
        const program = parse(`/** @param {string($nut)} a */ function add(a) {}; add("${filename}")`);
        createNodeMaps(program);
        const names = getProgramImportNames(program);
        expect(names).toHaveLength(1);
        expect(forwardSlash(names[0])).toEqual(filename);
    });

    it("sequence", () => {
        const program = parse("x+1, y+2");
        expect(createNodeMaps(program)).toBe(program);
    });

    it("definition", () => {
        const program = parse("function foo() {}");
        createNodeMaps(program);
        const b = getBranchAtPos(program, pos(10));
        expect(getNodeDec(<AST.Identifier>b.at(-1)).at(-1)).toBe(b.at(-2));
    });

    it("definition, undefined", () => {
        expect(getNodeDec(undefined)).toEqual([]);
    });

    it("namespace", () => {
        const program = parseExtra("class foo {} function foo::bar() {}");
        const n = getBranchAtPos(program, pos(8)).slice(0, -1);
        const c = getNodeChildren(n);
        expect(c).toHaveLength(1); // foo contains bar
    });

    it("namespace missing", () => {
        const program = parseExtra("class foo {} function who::bar() {}");
        const n = getBranchAtPos(program, pos(8)).slice(0, -1);
        const c = getNodeChildren(n);
        expect(c).toHaveLength(0); // foo does not contain bar
    });

    it("namespace program", () => {
        const program = parseExtra("class foo {} function foo::bar() {} ");
        const n = getBranchAtPos(program, pos(36));
        const c = getNodeChildren(n);
        expect(c).toHaveLength(1); // program contains foo, not foo::bar
    });

    it("incomplete", () => {
        expect(() => createNodeMaps(parse("function foo()"))).not.toThrow();
        expect(() => createNodeMaps(parse("local foo = function()"))).not.toThrow();
        expect(() => createNodeMaps(parse("class foo"))).not.toThrow();
        expect(() => createNodeMaps(parse("class foo { function bar }"))).not.toThrow();
        expect(() => createNodeMaps(parse("local foo = class"))).not.toThrow();

        const n = parse("local foo = class");
        n.body[0]["declarations"][0]["init"]["body"] = null;
        expect(() => createNodeMaps(n)).not.toThrow();
    });

    it("createNodeMaps, brute", () => {
        expect(() => createNodeMaps(qt.FunctionDeclaration(null, null, null))).not.toThrow();
        expect(() => createNodeMaps(qt.Identifier(null, null))).not.toThrow();
    });

    it("getNodeChildren, brute", () => {
        expect(() => getNodeChildren([qt.FunctionDeclaration(null, null, null)])).not.toThrow();
        expect(() => getNodeChildren([qt.FunctionExpression(null, null)])).not.toThrow();
        expect(() => getNodeChildren([qt.MethodDefinition(null, null, null)])).not.toThrow();
        expect(() => getNodeChildren([qt.LambdaExpression(null, null)])).not.toThrow();
        expect(() => getNodeChildren([qt.ClassDeclaration(null, null)])).not.toThrow();
        expect(() => getNodeChildren([qt.ClassExpression(null)])).not.toThrow();

        expect(() => getNodeChildren([qt.BlockStatement([qt.FunctionDeclaration(null, null, null)])])).not.toThrow();
        expect(() => getNodeChildren([qt.BlockStatement([qt.FunctionExpression(null, null)])])).not.toThrow();
        expect(() => getNodeChildren([qt.BlockStatement([qt.MethodDefinition(null, null, null)])])).not.toThrow();
        expect(() => getNodeChildren([qt.BlockStatement([qt.LambdaExpression(null, null)])])).not.toThrow();
        expect(() => getNodeChildren([qt.BlockStatement([qt.ClassDeclaration(null, null)])])).not.toThrow();
        expect(() => getNodeChildren([qt.BlockStatement([qt.ClassExpression(null)])])).not.toThrow();
    });
});
