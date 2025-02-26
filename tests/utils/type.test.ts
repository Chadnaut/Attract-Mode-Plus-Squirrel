import { describe, expect, it } from "@jest/globals";
import { AST, SQTree as qt } from "../../src/ast";
import { getNodeInstanceType, getNodeTypeDef } from "../../src/utils/type";
import { parseForceExtra as parse, pos } from "../utils";
import { getNodeAtPos, getBranchAtPos } from "../../src/utils/find";
import { getNodeDef, getNodeVal } from "../../src/utils/definition";
import { getTypeMemberCompletions } from "../../src/utils/completion";
import { getNodeSignature } from "../../src/utils/signature";
import { getNodeReturn } from "../../src/utils/return";

describe("Type", () => {

    it("ReturnArgument, override class", () => {
        const program = parse('/** @returns {class} */ function foo() {};');
        const n = getBranchAtPos(program, pos(28));
        const response = getNodeReturn(n).at(-1);
        expect(response.type).toBe("ClassDeclaration");
        expect(getNodeInstanceType([program, response]).at(-1)["name"]).toBe("ClassDeclaration");
    });

    it("getNodeInstanceType, None", () => {
        expect(getNodeInstanceType([])).toEqual([]);
    });

    it("getNodeInstanceType, StringLiteral", () => {
        const program = parse('local node = "string"');
        const n = getBranchAtPos(program, pos(8));
        expect(getNodeInstanceType(n).at(-1)["name"]).toEqual("StringLiteral");
    });

    it("getNodeInstanceType, IntegerLiteral", () => {
        const program = parse('local node = 123');
        const n = getBranchAtPos(program, pos(8));
        expect(getNodeInstanceType(n).at(-1)["name"]).toEqual("IntegerLiteral");
    });

    it("getNodeInstanceType, ClassDeclaration", () => {
        const program = parse('class foo {}');
        const n = getBranchAtPos(program, pos(8));
        expect(getNodeInstanceType(n).at(-1)["name"]).toEqual("ClassDeclaration");
    });

    it("getNodeInstanceType, ClassDeclaration, Instance", () => {
        const program = parse('class foo {}; local node = foo();');
        const n = getBranchAtPos(program, pos(22));
        expect(getNodeInstanceType(n).at(-1)["name"]).toEqual("Instance");
    });

    it("getNodeInstanceType, ClassDeclaration, type Instance", () => {
        const program = parse('/** @type {foo} */ class foo {}; local node = foo();');
        const n = getBranchAtPos(program, pos(41));
        expect(getNodeInstanceType(n).at(-1)["name"]).toEqual("foo");
    });

    it("getNodeInstanceType, ClassExpression", () => {
        const program = parse('local foo = class {}');
        const n = getBranchAtPos(program, pos(8));
        expect(getNodeInstanceType(n).at(-1)["name"]).toEqual("ClassExpression");
    });

    it("getNodeInstanceType, ClassExpression, Instance", () => {
        const program = parse('local foo = class {}; local node = foo();');
        const n = getBranchAtPos(program, pos(30));
        expect(getNodeInstanceType(n).at(-1)["name"]).toEqual("Instance");
    });

    it("getNodeInstanceType, ClassExpression, type Instance", () => {
        const program = parse('/** @type {foo} */ local foo = class {}; local node = foo();');
        const n = getBranchAtPos(program, pos(49));
        expect(getNodeInstanceType(n).at(-1)["name"]).toEqual("foo");
    });

    it("getNodeInstanceType, FunctionDeclaration", () => {
        const program = parse('function foo() {}');
        const n = getBranchAtPos(program, pos(11));
        expect(getNodeInstanceType(n).at(-1)["name"]).toEqual("FunctionDeclaration");
    });

    it("getNodeInstanceType, FunctionExpression", () => {
        const program = parse('local foo = function() {}');
        const n = getBranchAtPos(program, pos(7));
        expect(getNodeInstanceType(n).at(-1)["name"]).toEqual("FunctionExpression");
    });

    it("getNodeInstanceType, FunctionExpression Orphan", () => {
        const program = parse('local foo = function() {}');
        const n = getBranchAtPos(program, pos(7));
        // getNodeVal(n).extra.parent = null;
        expect(getNodeInstanceType(n).at(-1)["name"]).toEqual("FunctionExpression");
    });

    it("getNodeInstanceType, Generator", () => {
        const program = parse('function foo() { yield 123; }');
        const n = getBranchAtPos(program, pos(11));
        expect(getNodeInstanceType(n).at(-1)["name"]).toEqual("Generator");
    });

    it("getNodeInstanceType, Generator instance", () => {
        const program = parse('function foo() { yield 123; } local x = foo();');
        const n = getBranchAtPos(program, pos(37));
        expect(getNodeInstanceType(n).at(-1)["name"]).toEqual("Generator");
    });

    it("getNodeInstanceType, FunctionExpression Generator", () => {
        const program = parse('local foo = function() { yield 123; }');
        const n = getBranchAtPos(program, pos(7));
        expect(getNodeInstanceType(n).at(-1)["name"]).toEqual("Generator");
    });

    it("getNodeInstanceType, doc enum", () => {
        const program = parse('/** @enum */ local foo = { x };');
        const n = getBranchAtPos(program, pos(20));
        expect(getNodeInstanceType(n).at(-1)["name"]).toEqual("EnumDeclaration");
    });

    it("getNodeInstanceType, doc enum", () => {
        const program = parse('/** @enum */ local foo = { x };');
        const n = getBranchAtPos(program, pos(20));
        expect(getNodeInstanceType(n).at(-1)["name"]).toEqual("EnumDeclaration");
    });

    it("getNodeInstanceType, enum", () => {
        const program = parse("enum myen { x = 123 } /** @returns {myen} */ function foo() {}; foo()");
        const n = getBranchAtPos(program, pos(65)).slice(0, -1);
        expect(getNodeInstanceType(n).at(-1)["name"]).toBe("IntegerLiteral");
    });

    it("getNodeInstanceType, param", () => {
        const program = parse("/** @param {integer} x */ function foo(x) { x };");
        const n = getBranchAtPos(program, pos(45));
        expect(getNodeInstanceType(n).at(-1)["name"]).toBe("IntegerLiteral");
    });

    it("getNodeInstanceType, param other", () => {
        const program = parse("/** @param {bar} x */ function foo(x) { x };");
        const n = getBranchAtPos(program, pos(41));
        expect(getNodeInstanceType(n).at(-1)["name"]).toBe("bar");
    });

    // -------------------------------------------------------------------------

    it("getNodeTypeDef", () => {
        const program = parse('/** @lends */ class StringLiteral {}; local str = "string";');
        const n = getBranchAtPos(program, pos(45));
        const def = getNodeTypeDef(n).at(-1);
        expect(def.type).toBe("ClassDeclaration");
        expect(def["id"].name).toBe("StringLiteral");
    });

    it("getNodeTypeDef, generator", () => {
        const program = parse('/** @type {Generator} */ class Generator {} /** @type {Generator} */ local gen = function() { yield 1; }; local xxx = gen();');
        const n = getBranchAtPos(program, pos(119));
        const type = getNodeInstanceType(n).at(-1)["name"];
        expect(type).toBe("Generator");
    });

    it("getNodeTypeDef, no type", () => {
        const program = parse('call();');
        const n = getBranchAtPos(program, pos(2));
        expect(getNodeTypeDef(n).length).toBe(0);
        expect(getNodeTypeDef([]).length).toBe(0);
    });

    it("getNodeTypeDef, no def", () => {
        const program = parse('local str = "string";');
        const n = getBranchAtPos(program, pos(7));
        const def = getNodeTypeDef(n);
        expect(def.length).toBe(0);
    });

    // -------------------------------------------------------------------------

    it("getTypeMemberCompletions, undefined", () => {
        expect(getTypeMemberCompletions([])).toEqual([]);
    });

    it("getTypeMemberCompletions, type self", () => {
        const program = parse("/** @type {foo} */ class foo { bar = 123 }; foo()");
        const items = getTypeMemberCompletions(getBranchAtPos(program, pos(49)));
        expect(items.length).toBe(0);
    });

    it("getTypeMemberCompletions, type self overload class", () => {
        const program = parse("/** @type {foo} */ class foo { bar = 123; bar = 456; bar = 789; }; foo()");
        const items = getTypeMemberCompletions(getBranchAtPos(program, pos(72)));
        expect(items.length).toBe(0);
    });

    it("getTypeMemberCompletions, type self overload table", () => {
        const program = parse("/** @type {foo} */ local foo = { bar = 123, bar = 456, bar = 789 }; foo");
        const items = getTypeMemberCompletions(getBranchAtPos(program, pos(71)));
        expect(items.length).toBe(0);
    });

    it("getTypeMemberCompletions, type lends", () => {
        const program = parse('/** @lends */ class StringLiteral { function len() {} }; local x = "string"; x');
        const items = getTypeMemberCompletions(getBranchAtPos(program, pos(78)));
        expect(items.length).toBe(1);
        expect(items[0].insertText).toBe('len');
    });

    it("getTypeMemberCompletions, type lends overload", () => {
        const program = parse('/** @lends */ class StringLiteral { function len() {} function len() {} }; local x = "string"; x');
        const items = getTypeMemberCompletions(getBranchAtPos(program, pos(96)));
        expect(items.length).toBe(1);
        expect(items[0].insertText).toBe('len');
    });

    it("getTypeMemberCompletions, type empty ignores completions", () => {
        const program = parse('/** @lends */ class StringLiteral { function len() {} }; /** @type */ local x = "string"; x');
        const items = getTypeMemberCompletions(getBranchAtPos(program, pos(91)));
        expect(items.length).toBe(0);
    });

    it("getTypeMemberCompletions, type override", () => {
        const program = parse('/** @lends */ class StringLiteral { function len() {} }; /** @type {string} */ local x = 123; x');
        const items = getTypeMemberCompletions(getBranchAtPos(program, pos(95)));
        expect(items.length).toBe(1);
        expect(items[0].insertText).toBe('len');
    });

    it("getTypeMemberCompletions, type array elements", () => {
        const program = parse('/** @lends */ class ArrayExpression { function len1() {} }; /** @lends */ class StringLiteral { function len2() {} }; /** @type {array(string)} */ local x = []; x; x[0]');
        const items1 = getTypeMemberCompletions(getBranchAtPos(program, pos(162)));
        expect(items1.length).toBe(1);
        expect(items1[0].insertText).toBe('len1');

        const items2 = getTypeMemberCompletions(getBranchAtPos(program, pos(168)));
        expect(items2.length).toBe(1);
        expect(items2[0].insertText).toBe('len2');
    });

    it("getTypeMemberCompletions, type array", () => {
        const program = parse('/** @lends */ class ArrayExpression { function len1() {} }; /** @type {array} */ local x = []; x; x[0]');
        const items1 = getTypeMemberCompletions(getBranchAtPos(program, pos(98)));
        expect(items1.length).toBe(1);
        expect(items1[0].insertText).toBe('len1');

        const items2 = getTypeMemberCompletions(getBranchAtPos(program, pos(104)));
        expect(items2.length).toBe(0);
    });

    // -------------------------------------------------------------------------

    it("getTypeMemberCompletions, completion", () => {
        const program = parse('/** @lends */ class StringLiteral { function len() {} }; "string";');
        const items = getTypeMemberCompletions(getBranchAtPos(program, pos(65)));
        expect(items.length).toBe(1);
        expect(items[0].insertText).toBe("len");
    });

    it("getTypeMemberCompletions, extended completion", () => {
        const program = parse('class foo { function len() { return ""; } } /** @lends */ class StringLiteral extends foo {}; "string";');
        const items = getTypeMemberCompletions(getBranchAtPos(program, pos(102)));
        expect(items.length).toBe(1);
        expect(items[0].insertText).toBe("len");
    });

    it("getTypeMemberCompletions, type completion", () => {
        const program = parse('/** @lends */ class StringLiteral { function len() { return ""; } }; "string".len();');
        const items = getTypeMemberCompletions(getBranchAtPos(program, pos(83)));
        expect(items.length).toBe(1);
        expect(items[0].insertText).toBe("len");
    });

    it("getTypeMemberCompletions, extended type completion", () => {
        const program = parse('class foo { function len() { return ""; } } /** @lends */ class StringLiteral extends foo {}; "string".len();');
        const items = getTypeMemberCompletions(getBranchAtPos(program, pos(108)));
        expect(items.length).toBe(1);
        expect(items[0].insertText).toBe("len");
    });

    it("getTypeMemberCompletions, prevents missing loop", () => {
        const program = parse('local a = b(); a.c.d()');
        const items = getTypeMemberCompletions(getBranchAtPos(program, pos(22)));
        expect(items.length).toBe(0);
    });

    // // -------------------------------------------------------------------------

    it("getTypeMemberCompletions, returns docblock", () => {
        const program = parse('class foo { function bar() {} } /** @lends */ class StringLiteral { /** @returns {integer} */ function len() {} }; "string".len()');
        const n = getBranchAtPos(program, pos(125));
        const d = getNodeDef(n);
        const r = getNodeReturn(d);
        const v = getNodeVal(r);

        expect(n.at(-1).type).toBe("Identifier");
        expect(d.at(-1).type).toBe("MethodDefinition");
        expect(r.at(-1).type).toBe("IntegerLiteral");
        expect(v.at(-1).type).toBe("IntegerLiteral");
    });

    it("getTypeMemberCompletions, returns actual", () => {
        const program = parse('class foo { function bar() {} } /** @lends */ class StringLiteral { function len() { return 123; } }; "string".len()');
        const n = getBranchAtPos(program, pos(112));
        const d = getNodeDef(n);
        const r = getNodeReturn(d);
        const v = getNodeVal(r);

        expect(n.at(-1).type).toBe("Identifier");
        expect(d.at(-1).type).toBe("MethodDefinition");
        expect(r.at(-1).type).toBe("IntegerLiteral");
        expect(v.at(-1).type).toBe("IntegerLiteral");
    });

    it("getTypeMemberCompletions, returns class", () => {
        const program = parse('class foo { function bar() {} } /** @lends */ class StringLiteral { function len() { return foo; } }; "string".len()');
        const n = getBranchAtPos(program, pos(112));
        const d = getNodeDef(n);
        const r = getNodeReturn(d);
        const v = getNodeVal(r);

        expect(n.at(-1).type).toBe("Identifier");
        expect(d.at(-1).type).toBe("MethodDefinition");
        expect(r.at(-1).type).toBe("Identifier");
        expect(v.at(-1).type).toBe("ClassDeclaration");
    });

    it("getTypeMemberCompletions, returns nodeVal", () => {
        const program = parse('class foo {} /** @lends */ class StringLiteral { function bar() { return foo; } } local x = "string".bar();');
        const n = getBranchAtPos(program, pos(89));

        expect(n.at(-1).type).toBe("Identifier");
        expect(getNodeVal(n).at(-1)?.type).toBe("ClassDeclaration");
    });

    // -------------------------------------------------------------------------

    it("getTypeMemberCompletions, integer", () => {
        const program = parse('/** @lends */ class IntegerLiteral { function len() { return 0 } }; local x = 123; x.len()');

        const t = getBranchAtPos(program, pos(86));
        const def = getNodeDef(t);
        const sig = getNodeSignature(def);
        expect(sig).toEqual("(method) IntegerLiteral.len(): integer");

        const items = getTypeMemberCompletions(getBranchAtPos(program, pos(90)));
        expect(items.length).toBe(1);
        expect(items[0].insertText).toBe("len");
    });

    it("getTypeMemberCompletions, integer recurse", () => {
        const program = parse('/** @lends */ class IntegerLiteral { function len() { return 0 } }; local x = 123; x.len().len().len().len().len().len().len().len().len().len()');

        const t = getBranchAtPos(program, pos(140));
        const def = getNodeDef(t);
        const sig = getNodeSignature(def);
        expect(sig).toEqual("(method) IntegerLiteral.len(): integer");

        const items = getTypeMemberCompletions(getBranchAtPos(program, pos(144)));
        expect(items.length).toBe(1);
        expect(items[0].insertText).toBe("len");
    });

    it("Param type", () => {
        const program = parse("local x = { y = 1 }; /** @param {x} a */ function foo (a) { a }");
        const items = getTypeMemberCompletions(getBranchAtPos(program, pos(61)));
        expect(items.length).toBe(1);
        expect(items[0].insertText).toBe("y");
    });

    it("Param array element array element type", () => {
        const program = parse("/** @lends */ class StringLiteral { function len() {} }; /** @param {array(string)} a */ function foo (a) { a[0] }");
        const items = getTypeMemberCompletions(getBranchAtPos(program, pos(112)));
        expect(items.length).toBe(1);
        expect(items[0].insertText).toBe("len");
    });

    it("Param array element array", () => {
        const program = parse("/** @lends */ class StringLiteral { function len() {} }; /** @param {array} a */ function foo (a) { a[0] }");
        const items = getTypeMemberCompletions(getBranchAtPos(program, pos(104)));
        expect(items.length).toBe(0);
    });

    it("Param type, invalid", () => {
        const program = parse("local x = { y = 1 }; /** @param {z} a */ function foo (a) { a }");
        const items = getTypeMemberCompletions(getBranchAtPos(program, pos(61)));
        expect(items.length).toBe(0);
    });

    it("ReturnArgument, override array element", () => {
        const program = parse("/** @lends */ class StringLiteral { function len() {} }; /** @returns {array(string)} */ function foo() {}; foo()[0]");
        const items = getTypeMemberCompletions(getBranchAtPos(program, pos(116)));
        expect(items.length).toBe(1);
        expect(items[0].insertText).toBe('len');
    });

    // -------------------------------------------------------------------------

    it("getNodeDef Type", () => {
        const program = parse('/** @lends */ class StringLiteral { function len() {} }; "string".len();');
        const n = getBranchAtPos(program, pos(68));
        const def = getNodeDef(n).at(-1);
        expect(def.type).toBe("MethodDefinition");
        expect(def["key"].name).toBe("len");
    });

    it("getNodeDef Type, no member", () => {
        const program = parse('/** @lends */ class StringLiteral {}; "string".len();');
        const n = getBranchAtPos(program, pos(48));
        const def = getNodeDef(n).at(-1);
        expect(def).toBeUndefined();
    });

    it("getNodeDef Type, no def", () => {
        const program = parse('switch.len();');
        const n = getBranchAtPos(program, pos(8));
        const def = getNodeDef(n).at(-1);
        expect(def).toBeUndefined();
    });

    // -------------------------------------------------------------------------

});
