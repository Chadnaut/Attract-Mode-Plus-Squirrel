import { describe, expect, it } from "@jest/globals";
import { dump, parseExtra as parse, pos } from "../utils";
import { getNodeDisplayType, getNodeSignature, getSignatureHelp, getSignatureSuffix, updateNodeSignature } from '../../src/utils/signature';
import { getNodeAtPos, getBranchAtPos } from "../../src/utils/find";
import { getNodeDef } from "../../src/utils/definition";
import { AST, SQTree as qt } from "../../src/ast";
import { getNodeReturn } from "../../src/utils/return";

/** Get node DECLARATION as pos, which is how hover works */
const getNodeDefAtPos = (program, pos) => {
    const n = getBranchAtPos(program, pos);
    const def = getNodeDef(n);
    return def.length ? def : n;
}

describe("Signature", () => {

    it("getNodeSignature, undefined", () => {
        expect(getNodeSignature([])).toBeUndefined();
    });

    // it("getNodeSignature, without id", () => {
    //     const program = parse("function foo(a) {};");
    //     const n = getBranchAtPos(program, pos(11)).at(-2);

    //     const f = <AST.FunctionDeclaration>n
    //     f.extra.id.extra.definition = null; // bad id
    //     f.extra.id = null;
    //     f.id = null;

    //     expect(getNodeSignature(f)).toBe("function(a: any): null");
    // });

    it("getNodeSignature, param without info", () => {
        const program = parse("function foo(a) {};");
        const n = getNodeDefAtPos(program, pos(14));
        (<AST.FunctionDeclaration>n.at(-1)).params = [];
        expect(getNodeSignature(n)).toBe("(parameter) a: any");
    });

    it("getNodeSignature, table", () => {
        const program = parse('local x = { a = 123 };');
        const n = getNodeDefAtPos(program, pos(7));
        expect(getNodeSignature(n)).toBe("local x: table");
    });

    it("getNodeSignature, table prop class", () => {
        const program = parse('local x = { a = class {} };');
        const n = getNodeDefAtPos(program, pos(13));
        expect(getNodeSignature(n)).toBe("(property) a: class");
    });

    it("getNodeSignature, const", () => {
        const program = parse('const x = 123;');
        const n = getNodeDefAtPos(program, pos(7));
        expect(getNodeSignature(n)).toContain("const x: integer");
    });

    it("getNodeSignature, property", () => {
        const program = parse('local x = { a = 123 };');
        const n = getNodeDefAtPos(program, pos(13));
        expect(getNodeSignature(n)).toBe("(property) a: integer");
    });

    it("getNodeSignature, property RAW", () => {
        const program = parse('local x = { ["a b"] = 123 };');
        const n = getNodeDefAtPos(program, pos(15));
        expect(getNodeSignature(n)).toBe('(property) ["a b"]: integer');
    });

    it("getNodeSignature, constructor", () => {
        const program = parse('class foo { constructor() {} }');
        const n = getNodeDefAtPos(program, pos(19));
        expect(getNodeSignature(n)).toBe("constructor foo(): foo")
    });

    it("getNodeSignature, class alias", () => {
        const program = parse('/** @alias here */ class foo {};');
        const n = getNodeDefAtPos(program, pos(26));
        expect(getNodeSignature(n)).toBe("class here");
    });

    it("getNodeSignature, class alias method", () => {
        const program = parse('/** @alias here */ class foo { bar = 123; };');
        const n = getNodeDefAtPos(program, pos(32));
        expect(getNodeSignature(n)).toBe("(property) here.bar: integer");
    });

    // it("getNodeSignature, property alias", () => {
    //     const program = parse('foo <- { /** @alias here */ bar = 123 };');
    //     const n = getNodeDefAtPos(program, pos(29));
    //     expect(getNodeSignature(n)).toBe("(property) here: integer");
    // });

    it("getNodeSignature, class def", () => {
        const program = parse('class foo {}');
        const n = getNodeDefAtPos(program, pos(8));
        expect(getNodeSignature(n)).toBe("class foo");
    });

    it("getNodeSignature, class def this", () => {
        const program = parse('class foo { function bar() { this }};');
        const n = getNodeDefAtPos(program, pos(31));
        expect(getNodeSignature(n)).toBe("class foo");
    });

    it("getNodeSignature, class def base", () => {
        const program = parse('class bar {}; class foo extends bar { function bar() { base }};');
        const n = getNodeDefAtPos(program, pos(57));
        expect(getNodeSignature(n)).toBe("class bar");
    });

    it("getNodeSignature, class def base not declared", () => {
        const program = parse('class foo extends bar { function bar() { base }};');
        const n = getNodeDefAtPos(program, pos(43));
        expect(getNodeSignature(n)).toBe("bar: any");
    });

    it("getNodeSignature, class def base none", () => {
        const program = parse('class foo { function bar() { base }};');
        const n = getNodeDefAtPos(program, pos(31));
        expect(getNodeSignature(n)).toBe("any");
    });

    it("getNodeSignature, class def method", () => {
        const program = parse('class foo { function bar() {} };');
        const n = getNodeDefAtPos(program, pos(22));
        expect(getNodeSignature(n)).toBe("(method) foo.bar(): null");
    });

    it("getNodeSignature, class def prop", () => {
        const program = parse('class foo { bar = 123; };');
        const n = getNodeDefAtPos(program, pos(13));
        expect(getNodeSignature(n)).toBe("(property) foo.bar: integer");
    });

    it("getNodeSignature, class def method param rest named", () => {
        const program = parse('class foo { /** @param {integer} ...rest */ function bar(...) {} }');
        const n = getNodeDefAtPos(program, pos(54));
        expect(getNodeSignature(n)).toBe("(method) foo.bar(...rest: integer): null");
    });

    it("getNodeSignature, class def instance", () => {
        const program = parse('class foo {}; local xxx = foo();');
        const n = getNodeDefAtPos(program, pos(21));
        expect(getNodeSignature(n)).toBe("local xxx: foo");
    });

    it("getNodeSignature, class exp", () => {
        const program = parse('local foo = class {}');
        const n = getNodeDefAtPos(program, pos(8));
        expect(getNodeSignature(n)).toBe("local foo: class");
    });

    it("getNodeSignature, class exp no id", () => {
        const program = parse('function foo() { return class {} }');
        const n = getNodeDefAtPos(program, pos(26));
        expect(getNodeSignature(n)).toBe("class");
    });

    it("getNodeSignature, class exp this", () => {
        const program = parse('local foo = class { function bar() { this }};');
        const n = getNodeDefAtPos(program, pos(39));
        expect(getNodeSignature(n)).toBe("local foo: class");
    });

    it("getNodeSignature, class exp base", () => {
        const program = parse('local bar = class {}; local foo = class extends bar { function bar() { base }};');
        const n = getNodeDefAtPos(program, pos(73));
        expect(getNodeSignature(n)).toBe("local bar: class");
    });

    it("getNodeSignature, class exp base none", () => {
        const program = parse('local foo = class { function bar() { base }};');
        const n = getNodeDefAtPos(program, pos(39));
        expect(getNodeSignature(n)).toBe("any");
    });

    it("getNodeSignature, class exp method", () => {
        const program = parse('local foo = class { function bar() {} };');
        const n = getNodeDefAtPos(program, pos(30));
        expect(getNodeSignature(n)).toBe("(method) foo.bar(): null");
    });

    it("getNodeSignature, class exp prop", () => {
        const program = parse('local foo = class { bar = 123; };');
        const n = getNodeDefAtPos(program, pos(21));
        expect(getNodeSignature(n)).toBe("(property) foo.bar: integer");
    });

    it("getNodeSignature, class def extends def", () => {
        const program = parse('class foo { function moo() {} }; class bar extends foo {}; bar().moo();');
        const n = getNodeDefAtPos(program, pos(66));
        expect(getNodeSignature(n)).toBe("(method) foo.moo(): null");
    });

    it("getNodeSignature, class def extends exp", () => {
        const program = parse('local foo = class { function moo() {} }; class bar extends foo {}; bar().moo();');
        const n = getNodeDefAtPos(program, pos(74));
        expect(getNodeSignature(n)).toBe("(method) foo.moo(): null");
    });

    it("getNodeSignature, class exp extends exp", () => {
        const program = parse('local foo = class { function moo() {} }; local bar = class extends foo {}; bar().moo();');
        const n = getNodeDefAtPos(program, pos(82));
        expect(getNodeSignature(n)).toBe("(method) foo.moo(): null");
    });

    it("getNodeSignature, class exp extends def", () => {
        const program = parse('class foo { function moo() {} }; local bar = class extends foo {}; bar().moo();');
        const n = getNodeDefAtPos(program, pos(74));
        expect(getNodeSignature(n)).toBe("(method) foo.moo(): null");
    });

    it("getNodeSignature, enum", () => {
        const program = parse('enum foo {}');
        const n = getNodeDefAtPos(program, pos(6));
        expect(getNodeSignature(n)).toBe("enum foo");
    });

    it("getNodeSignature, enum member defined", () => {
        const program = parse('enum foo { bar = 123 }');
        const n = getNodeDefAtPos(program, pos(12));
        expect(getNodeSignature(n)).toBe("(enum member) foo.bar = 123");
    });

    it("getNodeSignature, enum member unknown", () => {
        const program = parse('enum foo { bar }');
        const n = getNodeDefAtPos(program, pos(12));
        expect(getNodeSignature(n)).toBe("(enum member) foo.bar: any");
    });

    it("getNodeSignature, param any", () => {
        const program = parse('function foo (a) {}');
        const n = getNodeDefAtPos(program, pos(15));
        expect(getNodeSignature(n)).toBe("(parameter) a: any");
    });

    it("getNodeSignature, param any default", () => {
        const program = parse('function foo (a = 1) {}');
        const n = getNodeDefAtPos(program, pos(15));
        expect(getNodeSignature(n)).toBe("(parameter) a: integer");
    });

    it("getNodeSignature, param docblock", () => {
        const program = parse('/** @param {integer} a */ function foo (a) {}');
        const n = getNodeDefAtPos(program, pos(41));
        expect(getNodeSignature(n)).toBe("(parameter) a: integer");
    });

    it("getNodeSignature, rest", () => {
        const program = parse('function foo (...) {}');
        const n = getNodeDefAtPos(program, pos(15));
        expect(getNodeSignature(n)).toBe("(parameter) ...: any");
    });

    it("getNodeSignature, rest docblock", () => {
        const program = parse('/** @param {integer} ... */ function foo (...) {}');
        const n = getNodeDefAtPos(program, pos(44));
        expect(getNodeSignature(n)).toBe("(parameter) ...: integer");
    });

    it("getNodeSignature, rest docblock named", () => {
        const program = parse('/** @param {integer} ...name */ function foo (...) {}');
        const n = getNodeDefAtPos(program, pos(47));
        expect(getNodeSignature(n)).toBe("(parameter) ...name: integer");
    });

    it("getNodeSignature, param inner", () => {
        const program = parse("/** @param {integer} a info */ local foo = function(a) { a };");
        const n = getNodeDefAtPos(program, pos(58));
        expect(getNodeSignature(n)).toBe("(parameter) a: integer");
    });

    it("getNodeSignature, block statement", () => {
        const program = parse('{}');
        const n = getNodeDefAtPos(program, pos(1));
        expect(getNodeSignature(n)).toBe("any");
    });

    it("getNodeSignature, array", () => {
        const program = parse('local arr = [];');
        const n = getNodeDefAtPos(program, pos(7));
        expect(getNodeSignature(n)).toBe("local arr: any[]");
    });

    it("getNodeSignature, array with value", () => {
        const program = parse('local arr = ["string"];');
        const n = getNodeDefAtPos(program, pos(7));
        expect(getNodeSignature(n)).toBe("local arr: string[]");
    });

    it("getNodeSignature, array with multiple values", () => {
        const program = parse('local arr = ["a", "b"];');
        const n = getNodeDefAtPos(program, pos(7));
        expect(getNodeSignature(n)).toBe("local arr: string[]");
    });

    it("getNodeSignature, array with different values", () => {
        const program = parse('local arr = ["a", 1];');
        const n = getNodeDefAtPos(program, pos(7));
        expect(getNodeSignature(n)).toBe("local arr: any[]");
    });

    it("getNodeSignature, func def", () => {
        const program = parse('function foo() {}');
        const n = getNodeDefAtPos(program, pos(11));
        expect(getNodeSignature(n)).toBe("function foo(): null");
    });

    it("getNodeSignature, func def param", () => {
        const program = parse('function foo(a) {}');
        const n = getNodeDefAtPos(program, pos(11));
        expect(getNodeSignature(n)).toBe("function foo(a: any): null");
    });

    it("getNodeSignature, func def param default", () => {
        const program = parse('function foo(a = 123) {}');
        const n = getNodeDefAtPos(program, pos(11));
        expect(getNodeSignature(n)).toBe("function foo(a?: integer): null");
    });

    it("getNodeSignature, func def param integer", () => {
        const program = parse('/** @param {integer} a */ function foo(a) {}');
        const n = getNodeDefAtPos(program, pos(37));
        expect(getNodeSignature(n)).toBe("function foo(a: integer): null");
    });

    it("getNodeSignature, func def param array", () => {
        const program = parse('/** @param {array} a */ function foo(a) {}');
        const n = getNodeDefAtPos(program, pos(35));
        expect(getNodeSignature(n)).toBe("function foo(a: any[]): null");
    });

    it("getNodeSignature, func def param array type", () => {
        const program = parse('/** @param {array(string)} a */ function foo(a) {}');
        const n = getNodeDefAtPos(program, pos(43));
        expect(getNodeSignature(n)).toBe("function foo(a: string[]): null");
    });

    it("getNodeSignature, func def param rest", () => {
        const program = parse('function foo(...) {}');
        const n = getNodeDefAtPos(program, pos(11));
        expect(getNodeSignature(n)).toBe("function foo(...: any): null");
    });

    it("getNodeSignature, func def param rest named", () => {
        const program = parse('/** @param {integer} ...rest */ function foo(...) {}');
        const n = getNodeDefAtPos(program, pos(43));
        expect(getNodeSignature(n)).toBe("function foo(...rest: integer): null");
    });

    it("getNodeSignature, func def return", () => {
        const program = parse('function foo() { return 123; }');
        const n = getNodeDefAtPos(program, pos(11));
        expect(getNodeSignature(n)).toBe("function foo(): integer");
    });

    it("getNodeSignature, func def docblock", () => {
        const program = parse('/** @returns {integer} */ function foo() {}');
        const n = getNodeDefAtPos(program, pos(36));
        expect(getNodeSignature(n)).toBe("function foo(): integer");
    });

    it("getNodeSignature, func def docblock class", () => {
        const program = parse('class bar {} /** @returns {bar} */ function foo() {}');
        const n = getNodeDefAtPos(program, pos(46));
        expect(getNodeSignature(n)).toBe("function foo(): bar");
    });

    it("getNodeSignature, func def docblock classdef", () => {
        const program = parse('/** @returns {class} */ function foo() {}');
        const n = getNodeDefAtPos(program, pos(35));
        expect(getNodeSignature(n)).toBe("function foo(): class");
    });

    it("getNodeSignature, func def generator", () => {
        const program = parse('function foo() { yield 123; }');
        const n = getNodeDefAtPos(program, pos(11));
        expect(getNodeSignature(n)).toBe("function foo(): Generator");
    });

    it("getNodeSignature, func def generator instance", () => {
        const program = parse('class Generator{} function foo() { yield 123; }; local bar = foo();');
        const n = getNodeDefAtPos(program, pos(56));
        expect(getNodeSignature(n)).toBe("local bar: Generator");
    });

    it("getNodeSignature, func exp", () => {
        const program = parse('local foo = function() {}');
        const n = getNodeDefAtPos(program, pos(7));
        expect(getNodeSignature(n)).toBe("local foo: function(): null");
    });

    it("getNodeSignature, func exp return", () => {
        const program = parse('local foo = function() { return 123; }');
        const n = getNodeDefAtPos(program, pos(7));
        expect(getNodeSignature(n)).toBe("local foo: function(): integer");
    });

    it("getNodeSignature, func exp returns array", () => {
        const program = parse('/** @returns {array} */ local foo = function() {}');
        const n = getNodeDefAtPos(program, pos(32));
        expect(getNodeSignature(n)).toBe("local foo: function(): any[]");
    });

    it("getNodeSignature, func exp returns array type", () => {
        const program = parse('/** @returns {array(string)} */ local foo = function() {}');
        const n = getNodeDefAtPos(program, pos(40));
        expect(getNodeSignature(n)).toBe("local foo: function(): string[]");
    });

    it("getNodeSignature, func exp returns integer", () => {
        const program = parse('/** @returns {integer} */ local foo = function() {}');
        const n = getNodeDefAtPos(program, pos(33));
        expect(getNodeSignature(n)).toBe("local foo: function(): integer");
    });

    it("getNodeSignature, func exp returns classexp", () => {
        const program = parse('class bar {} /** @returns {bar} */ local foo = function() {}');
        const n = getNodeDefAtPos(program, pos(43));
        expect(getNodeSignature(n)).toBe("local foo: function(): bar");
    });

    it("getNodeSignature, func exp docblock classdef", () => {
        const program = parse('/** @returns {class} */ local foo = function() {}');
        const n = getNodeDefAtPos(program, pos(32));
        expect(getNodeSignature(n)).toBe("local foo: function(): class");
    });

    it("getNodeSignature, member exp obj", () => {
        const program = parse('a.b');
        const n = getNodeDefAtPos(program, pos(1));
        expect(getNodeSignature(n)).toBe("a: any");
    });

    it("getNodeSignature, member exp prop", () => {
        const program = parse('a.b');
        const n = getNodeDefAtPos(program, pos(3));
        expect(getNodeSignature(n)).toBe("b: any");
    });

    it("getNodeSignature, computed", () => {
        const program = parse('local x = { ["y"] = 1 }');
        const n = getNodeDefAtPos(program, pos(15));
        expect(getNodeSignature(n)).toBe('(property) ["y"]: integer');
    });

    it("getNodeSignature, meta property", () => {
        const program = parse('/** @property {integer} meta */ class foo {}; foo().meta');
        const n = getNodeDefAtPos(program, pos(54));
        expect(getNodeSignature(n)).toBe('(property) foo.meta: integer');
    });

    it("getNodeSignature, meta getter", () => {
        const program = parse('class foo { /** @property {integer} meta */ function _get() {} }; foo().meta');
        const n = getNodeDefAtPos(program, pos(74));
        expect(getNodeSignature(n)).toBe('(readonly) foo.meta: integer');
    });

    it("getNodeSignature, meta setter", () => {
        const program = parse('class foo { /** @property {integer} meta */ function _set() {} }; foo().meta');
        const n = getNodeDefAtPos(program, pos(74));
        expect(getNodeSignature(n)).toBe('(writeonly) foo.meta: integer');
    });

    it("getNodeSignature, property table type", () => {
        const program = parse('OBJ <- {}; /** @property {OBJ} meta */ class foo {}; foo().meta');
        const n = getNodeDefAtPos(program, pos(61));
        expect(getNodeSignature(n)).toBe('(property) foo.meta: table');
    });

    it("getNodeSignature, return table type", () => {
        const program = parse('OBJ <- {}; /** @returns {OBJ} */ function foo() {};');
        const n = getNodeDefAtPos(program, pos(44));
        expect(getNodeSignature(n)).toBe('function foo(): table');
    });

    it("getNodeSignature, property object enum type", () => {
        const program = parse('/** @enum */ OBJ <- {}; /** @property {OBJ} meta */ class foo {}; foo().meta');
        const n = getNodeDefAtPos(program, pos(74));
        expect(getNodeSignature(n)).toBe('(property) foo.meta: OBJ');
    });

    it("getNodeSignature, return object enum type", () => {
        const program = parse('/** @enum */ OBJ <- {}; /** @returns {OBJ} */ function foo() {};');
        const n = getNodeDefAtPos(program, pos(57));
        expect(getNodeSignature(n)).toBe('function foo(): OBJ');
    });

    it("getNodeSignature, property enum type", () => {
        const program = parse('enum myen {a,b,c}; /** @property {myen} meta */ class foo {}; foo().meta');
        const n = getNodeDefAtPos(program, pos(70));
        expect(getNodeSignature(n)).toBe('(property) foo.meta: myen');
    });

    it("getNodeSignature, return enum type", () => {
        const program = parse('enum myen {a,b,c}; /** @returns {myen} */ function foo() {};');
        const n = getNodeDefAtPos(program, pos(53));
        expect(getNodeSignature(n)).toBe('function foo(): myen');
    });

    it("getNodeSignature, property prop doc class", () => {
        const program = parse('local foo = { bar = class {}, /** @returns {foo.bar} */ moo = function() {} }');
        const n = getNodeDefAtPos(program, pos(57));
        expect(getNodeSignature(n)).toBe("(property) moo: function(): bar");
    });

    it("getNodeSignature, property returns prop class", () => {
        const program = parse('local foo = { bar = class {}, moo = function() { return foo.bar; } }');
        const n = getNodeDefAtPos(program, pos(32));
        expect(getNodeSignature(n)).toBe("(property) moo: function(): bar");
    });

    it("getNodeSignature, property returns prop class call", () => {
        const program = parse('local foo = { bar = class {}, moo = function() { return foo.bar(); } }');
        const n = getNodeDefAtPos(program, pos(32));
        expect(getNodeSignature(n)).toBe("(property) moo: function(): bar");
    });

    it("getNodeSignature, property doc class", () => {
        const program = parse('class bar {} local foo = { /** @returns {bar} */ moo = function() {} }');
        const n = getNodeDefAtPos(program, pos(50));
        expect(getNodeSignature(n)).toBe("(property) moo: function(): bar");
    });

    it("getNodeSignature, property returns class", () => {
        const program = parse('class bar {} local foo = { moo = function() { return bar; } }');
        const n = getNodeDefAtPos(program, pos(28));
        expect(getNodeSignature(n)).toBe("(property) moo: function(): bar");
    });

    it("getNodeSignature, property doc returns class", () => {
        const program = parse('class bar {} local foo = { /** @returns {bar} */ moo = function() {} }');
        const n = getNodeDefAtPos(program, pos(50));
        expect(getNodeSignature(n)).toBe("(property) moo: function(): bar");
    });

    // -------------------------------------------------------------------------

    it("getSignatureHelp, FunctionDeclaration", () => {
        const text = "function foo(a) {}; foo(10);";
        const program = parse(text);
        const help = getSignatureHelp(text, program, pos(25));
        expect(help.signatures).toHaveLength(1);
        expect(help.signatures[0].parameters).toHaveLength(1);
    });

    it("getSignatureHelp, FunctionExpression", () => {
        const text = "local foo = function(a) {}; foo(10);";
        const program = parse(text);
        const help = getSignatureHelp(text, program, pos(33));
        expect(help.signatures).toHaveLength(1);
        expect(help.signatures[0].parameters).toHaveLength(1);
    });

    it("getSignatureHelp, FunctionExpression Root", () => {
        const text = "foo <- function(a) {}; foo(10);";
        const program = parse(text);
        const help = getSignatureHelp(text, program, pos(28));
        expect(help.signatures).toHaveLength(1);
        expect(help.signatures[0].parameters).toHaveLength(1);
    });

    it("getSignatureHelp, no data", () => {
        const text = "local foo = function() {}; foo(10);";
        const program = parse(text);
        const help = getSignatureHelp(text, program, pos(32));
        expect(help).toBeUndefined();
    });

    it("getSignatureHelp, doc", () => {
        const text = "/** info */ local foo = function(a) {}; foo(10);";
        const program = parse(text);
        const help = getSignatureHelp(text, program, pos(45));
        expect(help.signatures).toHaveLength(1);
        expect(help.signatures[0].documentation["value"]).toBe("info");
    });

    it("getSignatureHelp, param doc", () => {
        const text = "/** @param a info */ local foo = function(a) {}; foo(10);";
        const program = parse(text);
        const help = getSignatureHelp(text, program, pos(54));
        expect(help.signatures).toHaveLength(1);
        expect(help.signatures[0].parameters).toHaveLength(1);
        expect(help.signatures[0].parameters[0].documentation).toBe("info");
    });

    it("getSignatureHelp, class overloads", () => {
        const text = "class foo { function bar(a){} function bar(b, c) {} }; foo().bar(10);";
        const program = parse(text);
        const help = getSignatureHelp(text, program, pos(66));
        expect(help.activeSignature).toBe(0);
        expect(help.signatures).toHaveLength(2);
        expect(help.signatures[0].parameters).toHaveLength(1);
        expect(help.signatures[1].parameters).toHaveLength(2);
    });

    it("getSignatureHelp, class overloads more", () => {
        const text = "class foo { function bar(a){} function bar(b, c) {} }; foo().bar(10, 10);";
        const program = parse(text);
        const help = getSignatureHelp(text, program, pos(70));
        expect(help.activeSignature).toBe(1);
        expect(help.signatures).toHaveLength(2);
        expect(help.signatures[0].parameters).toHaveLength(1);
        expect(help.signatures[1].parameters).toHaveLength(2);
    });

    it("getSignatureHelp, object overloads", () => {
        const text = "local foo = { bar = function(a){}, bar = function(x, y) {} }; foo.bar(10);";
        const program = parse(text);
        const help = getSignatureHelp(text, program, pos(71));
        expect(help.activeSignature).toBe(0);
        expect(help.signatures).toHaveLength(2);
        expect(help.signatures[0].parameters).toHaveLength(1);
        expect(help.signatures[1].parameters).toHaveLength(2);
    });

    it("getSignatureHelp, object overloads version", () => {
        const text = "local foo = { bar = function(a){}, /** @version x */ bar = function(x, y) {} }; foo.bar(10);";
        const program = parse(text);
        const help = getSignatureHelp(text, program, pos(89));
        expect(help.activeSignature).toBe(0);
        expect(help.signatures).toHaveLength(2);
        expect(help.signatures[0].parameters).toHaveLength(1);
        expect(help.signatures[1].parameters).toHaveLength(2);
        expect(help.signatures[1].documentation['value']).toContain('version');
    });

    it("getSignatureHelp, object overloads version special", () => {
        const text = "local foo = { bar = function(a){}, /** @version 🔶x */ bar = function(x, y) {} }; foo.bar(10);";
        const program = parse(text);
        const help = getSignatureHelp(text, program, pos(90));
        expect(help.activeSignature).toBe(0);
        expect(help.signatures).toHaveLength(2);
        expect(help.signatures[0].parameters).toHaveLength(1);
        expect(help.signatures[1].parameters).toHaveLength(2);
        expect(help.signatures[1].documentation['value']).toContain('version');
        expect(help.signatures[1].documentation['value']).toContain('🔶');
    });

    it("getSignatureHelp, active auto", () => {
        const text = "local foo = { bar = function(a){}, bar = function(x, y) {} }; foo.bar(10, 10);";
        const program = parse(text);
        const help = getSignatureHelp(text, program, pos(71));
        expect(help.activeSignature).toBe(1);
        expect(help.signatures).toHaveLength(2);
        expect(help.signatures[0].parameters).toHaveLength(1);
        expect(help.signatures[1].parameters).toHaveLength(2);
    });

    it("getSignatureHelp, active forced", () => {
        const text = "local foo = { bar = function(a){}, bar = function(x, y) {} }; foo.bar(10, 10);";
        const program = parse(text);
        const help = getSignatureHelp(text, program, pos(71), 0);
        expect(help.activeSignature).toBe(0);
        expect(help.signatures).toHaveLength(2);
        expect(help.signatures[0].parameters).toHaveLength(1);
        expect(help.signatures[1].parameters).toHaveLength(2);
    });

    // -------------------------------------------------------------------------

    it("updateNodeSignature, undefined", () => {
        expect(updateNodeSignature([])).toBeUndefined();
    });

    // -------------------------------------------------------------------------

    it("getNodeDisplayType, undefined", () => {
        expect(getNodeDisplayType([])).toBe("null");
    });

    it("getNodeDisplayType, instance", () => {
        const program = parse("/** @lends */ class Instance { /** @returns {class} */ function getclass() {} }; class foo {}; local x = foo(); x.getclass();");
        const n = getNodeDefAtPos(program, pos(117));
        expect(getNodeDisplayType(n)).toBe("method");
        expect(getNodeDisplayType(getNodeReturn(n))).toBe("class");
    });

    it("getNodeDisplayType, class alias", () => {
        const program = parse('/** @alias here */ class foo {};');
        const n = getBranchAtPos(program, pos(26));
        expect(getNodeDisplayType(n)).toBe("here");
    });

    it("getNodeDisplayType, enum", () => {
        const program = parse('enum myen {}');
        const n = getBranchAtPos(program, pos(6));
        expect(getNodeDisplayType(n)).toBe("myen");

        delete program.body[0]["id"];
        expect(getNodeDisplayType(n)).toBe("enum");
    });

    it("getNodeDisplayType, table", () => {
        const program = parse('local mytable = { a = 1 }');
        const n = getBranchAtPos(program, pos(9));
        expect(getNodeDisplayType(n)).toBe("table");
    });

    it("getNodeDisplayType, table enum", () => {
        const program = parse('/** @enum */ local mytable = { a = 1 }');
        const n = getBranchAtPos(program, pos(22));
        expect(getNodeDisplayType(n)).toBe("mytable");

        delete program.body[0]["declarations"][0]["id"];
        expect(getNodeDisplayType(n)).toBe("table");
    });

    it("getSignatureSuffix, param", () => {
        const program = parse('function foo (a = 123) {}');
        const n = getBranchAtPos(program, pos(15));
        expect(getSignatureSuffix(n)).toBeTruthy();
    });

});
