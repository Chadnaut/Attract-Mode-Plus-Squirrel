import { describe, expect, it } from "@jest/globals";
import { parseExtra as parse, dump, pos } from "../utils";
import { getNodeCallIfCallee, getNodeDef, getNodeDefMap, getNodeMemberExpressionIfTail, getNodeVal, getNodeValMap, resolveNodeChild } from "../../src/utils/definition";
import { SQTree as qt } from "../../src/ast";
import { getNodeAtPos, getBranchAtPos } from "../../src/utils/find";
import { addBranchId } from "../../src/utils/identifier";



const getDef = (code: string, index: number) => {
    const program = parse(code);
    const pos = qt.Position(1, index, index);
    const n = getBranchAtPos(program, pos);
    return getNodeDef(n).at(-1);
}

describe("Definition", () => {
    it("getNodeDefMap, invalid", () => {
        expect(getNodeDefMap(undefined)).toBeUndefined();
    });

    it("getNodeValMap, invalid", () => {
        expect(getNodeValMap(undefined)).toBeUndefined();
    });

    it("Out of range", () => {
        const def = getDef("local x = foo();", 24);
        expect(def).toBeUndefined();
    });

    it("Object, No Member", () => {
        const def = getDef("local y = { a = 123}; local x = y.bar;", 35);
        expect(def).toBeUndefined();
    });

    it("Identifier", () => {
        const def = getDef("id", 1);
        expect(def?.type).toBe("Identifier");
        expect(def["name"]).toBe("id");
    });

    it("Sibling", () => {
        const def = getDef("id", 1);
        expect(def?.type).toBe("Identifier");
        expect(def["name"]).toBe("id");
    });

    it("Outer, find def outside current declarator", () => {
        const text = "local id = 123; function foo() { local id = id; }";
        const d1 = getDef(text, 40);
        const d2 = getDef(text, 45);
        expect(d1?.type).toBe("VariableDeclarator");
        expect(d1?.range).toEqual([39,46]);
        expect(d2?.type).toBe("VariableDeclarator");
        expect(d2?.range).toEqual([6,14]);
    });

    it("No Def, Self", () => {
        const def = getDef("local x = foo();", 12);
        expect(def?.type).toBe("Identifier");
        expect(def["name"]).toBe("foo");
    });

    it("New Slot, Instance", () => {
        const def = getDef("foo <- 1; foo", 11);
        expect(def?.type).toBe("AssignmentExpression");
        const b = [def];
        expect(getNodeVal(b).at(-1).type).toBe("IntegerLiteral");
    });

    it("New Slot, Ref", () => {
        const def = getDef("local bar = 1; foo <- bar", 23);
        expect(def?.type).toBe("VariableDeclarator");
        const b = [def];
        expect(getNodeVal(b).at(-1).type).toBe("IntegerLiteral");
    });

    it("New Slot, Self", () => {
        const def = getDef("foo <- 1;", 2);
        expect(def?.type).toBe("AssignmentExpression");
    });

    it("Lambda", () => {
        const program = parse("local foo = @(aa, bb) aa <=> bb;");
        const n = getBranchAtPos(program, pos(23));
        const def = getNodeDef(n).at(-1);
        expect(def.type).toBe("Identifier");
        expect(def.range).toEqual([14, 16]);
    });

    it("MemberExpression", () => {
        const program = parse("object[100]");
        const n = getBranchAtPos(program, pos(9)).slice(0, -1);
        const def = getNodeDef(n).at(-1);
        expect(n.at(-1).type).toBe("MemberExpression");
        expect(n.at(-1)["computed"]).toBe(true);
        expect(def).toBeUndefined();
    });

    it("VariableDeclarator", () => {
        const def = getDef("local abc = 123; abc;", 18);
        expect(def?.type).toBe("VariableDeclarator");
        expect(def["id"].name).toBe("abc");
    });

    it("VariableDeclarator, Self", () => {
        const def = getDef("local abc = 123;", 7);
        expect(def?.type).toBe("VariableDeclarator");
        expect(def["id"].name).toBe("abc");
    });

    it("Overloads", () => {
        const def = getDef("class foo { function bar(a){} function bar(b, c) {} }; foo.bar;", 60);
        expect(def?.type).toBe("MethodDefinition");
    });

    it("ObjectExpression", () => {
        const def = getDef("local abc = { xyz = 123 }; abc.xyz;", 32);
        expect(def?.type).toBe("Property");
        expect(def["key"].name).toBe("xyz");
    });

    it("ObjectExpression, computed prop", () => {
        const def = getDef('local abc = { "xyz": 123 }; abc.xyz;', 33);
        expect(def?.type).toBe("Property");
        expect(def["key"].name).toBe("xyz");
    });

    it("ObjectExpression, computed member", () => {
        const def = getDef('local abc = { xyz = 123 }; abc["xyz"];', 33);
        expect(def?.type).toBe("Property");
        expect(def["key"].name).toBe("xyz");
    });

    it("ObjectExpression, computed prop and member", () => {
        const def = getDef('local abc = { "xyz": 123 }; abc["xyz"];', 34);
        expect(def?.type).toBe("Property");
        expect(def["key"].name).toBe("xyz");
    });

    it("FunctionExpression", () => {
        const def = getDef("local foo = function(){}; foo();", 27);
        expect(def?.type).toBe("VariableDeclarator");
        expect(def["id"].name).toBe("foo");
    });

    it("FunctionExpression, self", () => {
        const def = getDef("local foo = function(){};", 8);
        expect(def?.type).toBe("VariableDeclarator");
        expect(def["id"].name).toBe("foo");
    });

    it("FunctionDeclaration", () => {
        const def = getDef("function foo(){}; foo", 19);
        expect(def?.type).toBe("FunctionDeclaration");
        expect(def["id"].name).toBe("foo");
    });

    it("FunctionDeclaration, Keyword", () => {
        const def = getDef("function foo(){};", 4);
        expect(def?.type).toBe("FunctionDeclaration");
    });

    it("FunctionDeclaration, Self", () => {
        const def = getDef("function foo(){};", 10);
        expect(def?.type).toBe("FunctionDeclaration");
        expect(def["id"].name).toBe("foo");
    });

    it("FunctionDeclaration, Return", () => {
        const def = getDef("function foo(){ return { bar = 123 }; }; foo().bar;", 48);
        expect(def?.type).toBe("Property");
        expect(def["key"].name).toBe("bar");
    });

    it("FunctionDeclaration, Return FunctionExpression", () => {
        const def = getDef("function foo(a){ return function(b) {}; }; foo(111)", 51);
        expect(def?.type).toBe("FunctionExpression");
    });

    it("FunctionDeclaration, Return Var FunctionExpression", () => {
        const def = getDef("function foo(a){ local n = function(b) {}; return n; }; foo(111)", 64);
        expect(def?.type).toBe("FunctionExpression");
    });

    it("CallExpression", () => {
        const def = getDef("function foo() { return 123 }; foo()", 36);
        expect(def?.type).toBe("IntegerLiteral");
    });

    it("CallExpression, nested", () => {
        const def = getDef("function foo() { return 123 }; function bar() { return foo(); } bar()", 69);
        expect(def?.type).toBe("IntegerLiteral");
    });

    it("FunctionDeclaration, Call Loop", () => {
        const def = getDef("function foo(){ return bar() }; function bar() { return foo(); } foo().bar;", 72);
        expect(def).toBeUndefined();
    });

    it("FunctionDeclaration, Extends Loop", () => {
        const def = getDef("class foo extends bar {}; class bar extends foo {}; local xxx = foo();", 59);
        expect(def?.type).toBe("VariableDeclarator");
    });

    it("FunctionDeclaration, Extends Missing", () => {
        const def = getDef("class foo extends bar {}; local xxx = foo();", 33);
        expect(def?.type).toBe("VariableDeclarator");
    });

    it("EnumDeclaration", () => {
        const def = getDef("enum myenum { abc = 123 }; myenum.abc;", 29);
        expect(def?.type).toBe("EnumDeclaration");
        expect(def["id"].name).toBe("myenum");
    });

    it("EnumDeclaration, Keyword", () => {
        const def = getDef("enum myenum { abc = 123 };", 2);
        expect(def?.type).toBe("EnumDeclaration");
    });

    it("EnumDeclaration, Self", () => {
        const def = getDef("enum myenum { abc = 123 };", 7);
        expect(def?.type).toBe("EnumDeclaration");
        expect(def["id"].name).toBe("myenum");
    });

    it("EnumMember", () => {
        const def = getDef("enum myenum { xyz = 456, abc = 123 }; myenum.abc;", 46);
        expect(def?.type).toBe("EnumMember");
        expect(def["id"].name).toBe("abc");
    });

    it("EnumMember, Self", () => {
        const def = getDef("enum myenum { xyz = 456, abc = 123 };", 26);
        expect(def?.type).toBe("EnumMember");
        expect(def["id"].name).toBe("abc");
    });

    it("ClassExpression", () => {
        const def = getDef("local foo = class {}; foo();", 23);
        expect(def?.type).toBe("VariableDeclarator");
        expect(def["id"].name).toBe("foo");
    });

    it("ClassExpression, Self", () => {
        const def = getDef("local foo = class {};", 7);
        expect(def?.type).toBe("VariableDeclarator");
        expect(def["id"].name).toBe("foo");
    });

    it("ClassDeclaration", () => {
        const def = getDef("class foo {}; foo", 15);
        expect(def?.type).toBe("ClassDeclaration");
        expect(def["id"].name).toBe("foo");
    });

    it("ClassDeclaration, Keyword", () => {
        const def = getDef("class foo {};", 2);
        expect(def?.type).toBe("ClassDeclaration");
    });

    it("ClassDeclaration, Self", () => {
        const def = getDef("class foo {};", 7);
        expect(def?.type).toBe("ClassDeclaration");
        expect(def["id"].name).toBe("foo");
    });

    it("ClassDeclaration, Extends", () => {
        const def = getDef("class foo {}; class bar extends foo {};", 33);
        expect(def?.type).toBe("ClassDeclaration");
        expect(def["id"].name).toBe("foo");
    });

    it("ClassDeclaration, Extends not self", () => {
        const def = getDef("class foo {}; local x = { foo = class extends foo {} }", 47);
        expect(def?.type).toBe("ClassDeclaration");
        expect(def["id"].name).toBe("foo");
        expect(def["id"].loc.start.index).toBe(6);
    });

    it("ClassDeclaration, Def Extends Def Method", () => {
        const def = getDef("class foo { function moo() {} }; class bar extends foo {}; bar().moo()", 66);
        expect(def?.type).toBe("MethodDefinition");
        expect(def["key"].name).toBe("moo");
    });

    it("ClassDeclaration, Exp Extends Def Method", () => {
        const def = getDef("class foo { function moo() {} }; local bar = class extends foo {}; bar().moo()", 74);
        expect(def?.type).toBe("MethodDefinition");
        expect(def["key"].name).toBe("moo");
    });

    it("ClassDeclaration, Def Extends Exp Method", () => {
        const def = getDef("local foo = class { function moo() {} }; class bar extends foo {}; bar().moo()", 74);
        expect(def?.type).toBe("MethodDefinition");
        expect(def["key"].name).toBe("moo");
    });

    it("ClassDeclaration, Exp Extends Exp Method", () => {
        const def = getDef("local foo = class { function moo() {} }; local bar = class extends foo {}; bar().moo()", 82);
        expect(def?.type).toBe("MethodDefinition");
        expect(def["key"].name).toBe("moo");
    });

    it("ClassDeclaration, Def Extends Exp Method", () => {
        const def = getDef("local foo = class { function moo() {} }; class bar extends foo {}; bar().moo()", 74);
        expect(def?.type).toBe("MethodDefinition");
        expect(def["key"].name).toBe("moo");
    });

    it("ClassDeclaration, Exp Extends Exp Method", () => {
        const def = getDef("local foo = class { function moo() {} }; local bar = class extends foo {}; bar().moo()", 82);
        expect(def?.type).toBe("MethodDefinition");
        expect(def["key"].name).toBe("moo");
    });

    it("ClassDeclaration, This", () => {
        const def = getDef("class foo { constructor() { this }};", 30);
        expect(def?.type).toBe("ClassDeclaration");
        expect(def["id"].name).toBe("foo");
    });

    it("ClassDeclaration, Base", () => {
        const def = getDef("class foo {}; class bar extends foo { constructor() { base } };", 56);
        expect(def?.type).toBe("ClassDeclaration");
        expect(def["id"].name).toBe("foo");
    });

    it("ClassDeclaration, Namespace", () => {
        const def = getDef("class foo {}; class foo.bar {}; foo().bar()", 39);
        expect(def?.type).toBe("ClassDeclaration");
    });

    it("PropertyDefinition", () => {
        const def = getDef("class foo { no = 456; bar = 123; }; local x = foo(); x.bar;", 56);
        expect(def?.type).toBe("PropertyDefinition");
        expect(def["key"].name).toBe("bar");
    });

    it("PropertyDefinition, Identifier", () => {
        const def = getDef("class foo { bar = 123; };", 13);
        expect(def?.type).toBe("PropertyDefinition");
        expect(def["key"].name).toBe("bar");
    });

    it("PropertyDefinition, Value", () => {
        const def = getDef("class foo { bar = 123; };", 19);
        expect(def?.type).toBe("IntegerLiteral");
        expect(def["value"]).toBe(123);
    });

    it("PropertyDefinition, Not Property", () => {
        const def = getDef("local y = 1; local x = { y = y }", 30);
        expect(def?.type).toBe("VariableDeclarator");
        expect(def["init"]?.value).toBe(1);
    });

    it("MethodDefinition", () => {
        const def = getDef("class foo { function no() {}; function bar() {} }; class who { function bar() {} }; local x = foo(); x.bar();", 104);
        expect(def?.type).toBe("MethodDefinition");
        expect(def["key"].name).toBe("bar");
        expect(def?.range).toEqual([30, 47]);
    });

    it("MethodDefinition, Namespace", () => {
        const def = getDef("class foo {}; function foo::bar () {};", 25);
        expect(def?.type).toBe("ClassDeclaration");
        expect(def["id"].name).toBe("foo");
    });

    it("MethodDefinition, Namespace deep", () => {
        const def = getDef("class foo { moo = {} }; function foo::moo::bar () {};", 39);
        expect(def?.type).toBe("PropertyDefinition");
        expect(def["key"].name).toBe("moo");
    });

    it("MethodDefinition, Namespace called", () => {
        const def = getDef("class foo {}; function foo::bar () {}; foo().bar();", 46);
        expect(def?.type).toBe("FunctionDeclaration");
    });

    it("MethodDefinition, Keyword", () => {
        const def = getDef("class foo { function bar() {} }; class who { function bar() {} }; local x = foo(); x.bar();", 17);
        expect(def?.type).toBe("MethodDefinition");
    });

    it("MethodDefinition, Identifier", () => {
        const def = getDef("class foo { function bar() {} }; class who { function bar() {} }; local x = foo(); x.bar();", 22);
        expect(def?.type).toBe("MethodDefinition");
        expect(def["key"].name).toBe("bar");
        expect(def?.range).toEqual([12, 29]);
    });

    it("MethodDefinition, Return", () => {
        const def = getDef("class foo { function bar() { return { x = 123 }; } }; local x = foo(); x.bar();", 74);
        expect(def?.type).toBe("MethodDefinition");
        expect(def["key"].name).toBe("bar");
    });

    it("MethodDefinition, Skip FunctionExpression", () => {
        const def = getDef("class foo { function bar() { local x = function() { return { no = 456 }; }; return { who = 123 }; } }; local x = foo(); x.bar().who;", 129);
        expect(def?.type).toBe("Property");
        expect(def["key"].name).toBe("who");
    });

    it("MethodDefinition, ThisExpression", () => {
        const def = getDef("class foo { function bar() { return this; } function who() {} }; local x = foo(); x.bar().who();", 91);
        expect(def?.type).toBe("MethodDefinition");
        expect(def["key"].name).toBe("who");
    });

    it("MethodDefinition, PropertyDefinition", () => {
        const def = getDef("class foo { who = 123; function bar() { return this; } }; local x = foo(); x.bar().who;", 84);
        expect(def?.type).toBe("PropertyDefinition");
        expect(def["key"].name).toBe("who");
    });

    it("MethodDefinition, ObjectExpression", () => {
        const def = getDef("class foo { function bar() { return { who = 123 }; } }; local x = foo(); x.bar().who;", 82);
        expect(def?.type).toBe("Property");
        expect(def["key"].name).toBe("who");
    });

    it("MethodDefinition, ClassDeclaration", () => {
        const def = getDef("class foo { function bar() { return car(); } }; class car { who = 123; }; local x = foo(); x.bar().who;", 100);
        expect(def?.type).toBe("PropertyDefinition");
        expect(def["key"].name).toBe("who");
    });

    it("Property", () => {
        const def = getDef("local x = { y = { z = 123 } }; x.y.z", 36);
        expect(def?.type).toBe("Property");
        expect(def["key"].name).toBe("z");
    });

    it("Root", () => {
        const program = parse("::root <- 123; ::root");
        const n = getBranchAtPos(program, pos(19));
        const def = getNodeDef(n);
        expect(def.at(-1)?.type).toBe("AssignmentExpression");
        expect(addBranchId(def).at(-1)["name"]).toBe("root");
    });

    it("Root, undeclared", () => {
        const def = getDef("::root = 123; ::root", 18); // undeclared!
        expect(def?.type).toBe("Identifier");
    });

    // it("CallExpression undefined", () => {
    //     const def = getDef("local aa = bb()", 7);
    //     expect(def?.type).toBe("VariableDeclarator");
    // });

    it("Return base", () => {
        const def = getDef("class bbb { moo = 123; } class foo extends bbb { function bar() { return base; } } local aa = foo().bar().moo", 107);
        expect(def?.type).toBe("PropertyDefinition");
    });

    it("Nested", () => {
        const def = getDef("function foo(){}; function bar() { local x = foo(); }", 46);
        expect(def?.type).toBe("FunctionDeclaration");
        expect(def["id"].name).toBe("foo");
    });

    it("Switch", () => {
        const def = getDef("switch (x) { case 1: break; }", 15);
        expect(def?.type).toBe("SwitchCase");
    });

    it("Return", () => {
        const def = getDef("function foo() { return 123; }", 20);
        expect(def?.type).toBe("ReturnStatement");
    });

    it("getNodeMemberExpressionIfTail", () => {
        expect(getNodeMemberExpressionIfTail([]).length).toBe(0);
    });

    it("getNodeCallIfCallee, undefined", () => {
        expect(getNodeCallIfCallee([]).length).toBe(0);
    });

    it("getNodeCallIfCallee, invalid", () => {
        const program = parse("value");
        const n = getBranchAtPos(program, pos(3));
        expect(getNodeCallIfCallee(n)).toEqual(n);
        // expect(getNodeCallIfCallee([program])).toEqual(program);
    });

    it("getNodeCallIfCallee, valid", () => {
        const program = parse("call(arg)");
        const b = getBranchAtPos(program, pos(2));
        expect(getNodeCallIfCallee(b)).toEqual(b.slice(0, -1));
    });

    it("getNodeCallIfCallee, arg invalid", () => {
        const program = parse("call(arg)");
        const n = getBranchAtPos(program, pos(6));
        expect(getNodeCallIfCallee(n)).toEqual(n);
    });

    it("resolveNodeChild, undefined", () => {
        const program = parse(`local name = "name";`);
        const id = getNodeAtPos(program, pos(8));
        const str = getNodeAtPos(program, pos(16));
        expect(resolveNodeChild([], [id]).length).toBe(0);
        expect(resolveNodeChild([id], []).length).toBe(0);
        expect(resolveNodeChild([id], [str]).length).toBe(0);
    });

    it("ancestor", () => {
        const program = parse("local x = 456; class foo { x = 123; } class bar extends foo { function moo() { x } }");
        const n = getBranchAtPos(program, pos(80));
        const def = getNodeDef(n).at(-1);
        expect(def.type).toBe("PropertyDefinition");
        expect(def["value"]["value"]).toBe(123);
    });

    it("Param", () => {
        const program = parse("function foo (p1) { p1 }");
        const n = getBranchAtPos(program, pos(21));
        const def = getNodeDef(n).at(-1);
        expect(def?.type).toBe("Identifier");
        expect(def?.range).toEqual([14, 16]);
    });

    it("Param, override", () => {
        const program = parse("function foo (p1) { local p1 = 123; }");
        const n = getBranchAtPos(program, pos(27));
        const def = getNodeDef(n).at(-1);
        expect(def?.type).toBe("VariableDeclarator");
        expect(def?.range).toEqual([26, 34]);
    });

    it("Param, outer", () => {
        const program = parse("function foo (p1) { function bar() { p1 } }");
        const n = getBranchAtPos(program, pos(38));
        const def = getNodeDef(n).at(-1);
        expect(def?.type).toBe("Identifier");
        expect(def?.range).toEqual([14, 16]);
    });

    it("Param, computed", () => {
        const program = parse("function foo (p1) { local x = y[p1] }");
        const n = getBranchAtPos(program, pos(33));
        const def = getNodeDef(n).at(-1);
        expect(def?.type).toBe("Identifier");
        expect(def?.range).toEqual([14, 16]);
    });

    it("Param, member", () => {
        const program = parse("function foo (p1) { local x = y.p1 }");
        const n = getBranchAtPos(program, pos(33));
        const def = getNodeDef(n).at(-1);
        expect(def).toBeUndefined();
    });

    it("Param, rest", () => {
        const program = parse('function foo (...) { vargv }');
        const n = getBranchAtPos(program, pos(23));
        const def = getNodeDef(n).at(-1);
        expect(def?.type).toBe("Identifier");
        // expect(def?.type).toBe("RestElement");
        expect(def?.range).toEqual([14, 17]);
    });

});
