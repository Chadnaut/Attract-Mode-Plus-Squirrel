import { describe, expect, it } from "@jest/globals";
import { parseExtra as parse, dump, pos } from "../utils";
import { resolveIdDef, getNodeVal } from "../../src/utils/definition";
import { AST, SQTree as qt } from "../../src/ast";
import { getBranchAtPos } from "../../src/utils/find";
import { addProgramText, getProgram } from "../../src/utils/program";
import constants from '../../src/constants';

const getValue = (code: string, index: number) => {
    const node = parse(code);
    const pos = qt.Position(1, index, index);
    return getNodeVal(getBranchAtPos(node, pos)).at(-1);
}

describe("NodeValue", () => {

    it("Undefined, does not throw", () => {
        const b = [];
        expect(getNodeVal(b).at(-1)).toBeUndefined();
    });

    it("Loop, catch assignment to self", () => {
        const val = getValue("local id = id", 12);
        expect(val["name"]).toBe("id");
        expect(val.range).toEqual([11,13]);
    });

    it("Outer", () => {
        const text = "local id = 123; function foo() { local id = id; }";
        expect(getValue(text, 40)["value"]).toBe(123);
        expect(getValue(text, 45)["value"]).toBe(123);
    });

    it("Literal", () => {
        const val = getValue("123;", 1);
        expect(val.type).toBe("IntegerLiteral");
        expect(val["value"]).toBe(123);
    });

    it("Local", () => {
        const val = getValue("local xxx = 123;", 7);
        expect(val.type).toBe("IntegerLiteral");
        expect(val["value"]).toBe(123);
    });

    it("Resolved", () => {
        const val = getValue("local xxx = 123; local yyy = xxx;", 24);
        expect(val.type).toBe("IntegerLiteral");
        expect(val["value"]).toBe(123);
    });

    it("AssignmentExpression", () => {
        const program = parse("x = ( y += z );")
        const n = getBranchAtPos(program, pos(1)).slice(0, -1);
        const val = getNodeVal(n).at(-1);
        expect(val?.type).toBe("AssignmentExpression");
    });

    it("Array", () => {
        const program = parse("local x = [1]; x[0]")
        const n = getBranchAtPos(program, pos(19));
        const val = getNodeVal(n).at(-1);
        expect(val?.type).toBe("IntegerLiteral");
    });

    it("getParamCompletionItems, array sabotage", () => {
        const program = parse("local x = [1]; x[0]")
        delete program.body[0]["declarations"][0]["init"]["elements"];
        const n = getBranchAtPos(program, pos(19));
        const val = getNodeVal(n).at(-1);
        expect(val).toBeUndefined();
    });

    // fit("AssignmentExpression newslot", () => {
    //     const program = parse("x <- ( y <- z );")
    //     const n = getBranchAtPos(program, pos(1)).at(-2);
    //     const val = getNodeVal(n);
    //     expect(val?.type).toBe("AssignmentExpression");
    // });

    it("Base", () => {
        const program = parse("class foo { xxx = 123 } class bar extends foo { function moo() { return base } } bar().moo().xxx ");
        const n = getBranchAtPos(program, pos(94));
        const val = getNodeVal(n).at(-1);
        expect(val?.type).toBe("IntegerLiteral");
    });

    it("Base, missing", () => {
        const program = parse("base");
        const n = getBranchAtPos(program, pos(2));
        const val = getNodeVal(n);
        expect(val.length).toBe(0);
    });

    it("ObjectExpression", () => {
        const val = getValue("local obj = { x = 123 }; obj;", 26);
        expect(val.type).toBe("ObjectExpression");
    });

    it("ObjectExpression, self", () => {
        const val = getValue("local obj = { x = 123 }; obj;", 7);
        expect(val.type).toBe("ObjectExpression");
    });

    it("Property", () => {
        const val = getValue("local obj = { prop = 123 }; obj.prop;", 34);
        expect(val.type).toBe("IntegerLiteral");
    });

    it("Property, self", () => {
        const val = getValue("local obj = { prop = 123 }; obj.prop;", 16);
        expect(val.type).toBe("IntegerLiteral");
    });

    it("EnumDeclaration", () => {
        const val = getValue("enum myenum { xxx = 123 }; myenum.xxx;", 30);
        expect(val.type).toBe("EnumDeclaration");
    });

    it("EnumDeclaration, self", () => {
        const val = getValue("enum myenum { xxx = 123 }; myenum.xxx;", 7);
        expect(val.type).toBe("EnumDeclaration");
    });

    it("EnumMember", () => {
        const val = getValue("enum myenum { xxx = 123 }; myenum.xxx;", 35);
        expect(val.type).toBe("IntegerLiteral");
    });

    it("EnumMember, self", () => {
        const val = getValue("enum myenum { xxx = 123 }; myenum.xxx;", 15);
        expect(val.type).toBe("IntegerLiteral");
    });

    it("FunctionDeclaration", () => {
        const val = getValue("function foo() {}; foo;", 20);
        expect(val.type).toBe("FunctionDeclaration");
    });

    it("FunctionDeclaration, call", () => {
        const val = getValue("function foo() {}; foo();", 20);
        expect(val).toBeUndefined();
    });

    it("FunctionDeclaration, call response", () => {
        const val = getValue("function foo() { return 123; }; foo();", 33);
        expect(val.type).toBe("IntegerLiteral");
    });

    it("FunctionDeclaration, self", () => {
        const val = getValue("function foo() {}; foo;", 11);
        expect(val.type).toBe("FunctionDeclaration");
    });

    it("FunctionExpression", () => {
        const val = getValue("local foo = function() {}; foo;", 29);
        expect(val.type).toBe("FunctionExpression");
    });

    it("FunctionExpression, call", () => {
        const val = getValue("local foo = function() {}; foo();", 29);
        expect(val).toBeUndefined();
    });

    it("FunctionExpression, call response", () => {
        const val = getValue("local foo = function() { return 123; }; foo();", 42);
        expect(val.type).toBe("IntegerLiteral");
    });

    it("FunctionExpression, call exp", () => {
        const val = getValue("local foo = function() { return function() { return 123; }; }; foo();", 65);
        expect(val?.type).toBe("FunctionExpression");
    });

    it("FunctionExpression, self", () => {
        const val = getValue("local foo = function() {}; foo;", 7);
        expect(val.type).toBe("FunctionExpression");
    });

    it("ClassDeclaration", () => {
        const val = getValue("class foo {}; foo;", 16);
        expect(val.type).toBe("ClassDeclaration");
    });

    it("ClassDeclaration, call", () => {
        const val = getValue("class foo {}; foo();", 16);
        expect(val.type).toBe("ClassDeclaration");
    });

    it("ClassDeclaration, self", () => {
        const val = getValue("class foo {}; foo;", 7);
        expect(val.type).toBe("ClassDeclaration");
    });

    it("ClassExpression", () => {
        const val = getValue("local foo = class {}; foo;", 22);
        expect(val.type).toBe("ClassExpression");
    });

    it("ClassExpression, call", () => {
        const val = getValue("local foo = class {}; foo();", 22);
        expect(val.type).toBe("ClassExpression");
    });

    it("ClassExpression, self", () => {
        const val = getValue("local foo = class {}; foo;", 7);
        expect(val.type).toBe("ClassExpression");
    });

    it("This", () => {
        const val = getValue("class foo { function bar() { this; } };", 31);
        expect(val.type).toBe("ClassDeclaration");
        expect(val["id"].name).toBe("foo");
    });

    it("Base", () => {
        const val = getValue("class ext {}; class foo extends ext { function bar() { base; } };", 57);
        expect(val.type).toBe("ClassDeclaration");
        expect(val["id"].name).toBe("ext");
    });

    it("getIdentifier", () => {
        const program = parse("local var = 123; var;");
        const id = getBranchAtPos(program, pos(7)).at(-2); // declarator
        const n = getBranchAtPos(program, pos(18));
        expect(resolveIdDef(n).at(-1).range).toEqual(id.range);
    });

    it("getIdentifier, undefined", () => {
        expect(resolveIdDef([]).length).toBe(0);
        expect(resolveIdDef([<AST.Identifier>(qt.StringLiteral(null) as unknown)]).length).toBe(0);
    });

    it("getIdentifier, already defined", () => {
        const program = parse("class foo {};");
        const n = getBranchAtPos(program, pos(7));
        expect(resolveIdDef(n).at(-1)?.type).toBe("ClassDeclaration");
    });

    it("getIdentifier, ancestor", () => {
        const program = parse("class foo {}; class bar extends foo {}");
        const id = getBranchAtPos(program, pos(8)).at(-2); // classDef
        const n = getBranchAtPos(program, pos(33));
        expect(resolveIdDef(n).at(-1).range).toEqual(id.range);
    });

    it("getIdentifier, global", () => {
        jest.replaceProperty(constants, "ASSETS_PATH", "assetPath");
        addProgramText("glob", "/** @package \n @global */ class foo {}");
        const glob = getProgram("glob");
        glob.sourceName = "assetPath/file";

        addProgramText("prog", "class bar extends foo {}");
        const prog = getProgram("prog");
        const n = getBranchAtPos(prog, pos(20));
        const id = resolveIdDef(n).at(-1);

        expect(id.type).toBe("ClassDeclaration");
        expect(id["id"].name).toBe("foo");
    });

    it("getIdentifier, not global", () => {
        jest.replaceProperty(constants, "ASSETS_PATH", "assetPath");
        addProgramText("glob", "/** @package \n @global */ class foo {}");
        const glob = getProgram("glob");
        glob.sourceName = "wrongPath/file";

        addProgramText("prog", "class bar extends foo {}");
        const prog = getProgram("prog");
        const n = getBranchAtPos(prog, pos(20));
        const id = resolveIdDef(n).at(-1);

        expect(id.type).not.toBe("ClassDeclaration");
    });

    it("Double-dip, class method returns same class different method", () => {
        const val = getValue("class foo { function bar() { return 123; } function moo() { return foo().bar(); }}; foo().moo()", 95);
        expect(val.type).toBe("IntegerLiteral");
        expect(val["value"]).toBe(123);
    });
});
