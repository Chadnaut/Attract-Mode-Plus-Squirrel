import { describe, expect, it } from "@jest/globals";
import { AST, SQTree as qt } from "../../src/ast";
import { dump, parseExtra as parse, pos } from "../utils";
import { getNodeAfterPos, getNodeAtPos, getBranchCallable, getBranchFunctionDef, getBranchClassDef, getNodeBeforePos, nodeHasInit, isNodeBlock, getBranchBlock, getBranchAtPos, getBranchWithInitKey, getBranchWithInitValue, getNodeOverloads, getNodeArrayElementType, getNodeIsDecId } from "../../src/utils/find";
import { addBranchId } from "../../src/utils/identifier";

describe("Find", () => {

    it("getNodeIsDecId", () => {
        expect(getNodeIsDecId([])).toBe(false);
        expect(getNodeIsDecId([qt.Identifier(null)])).toBe(false);
        expect(getNodeIsDecId([qt.Identifier(null), null, qt.Identifier(null)])).toBe(false);

        expect(getNodeIsDecId([qt.VariableDeclaration()])).toBe(true);
        expect(getNodeIsDecId([qt.FunctionDeclaration(null, null, null)])).toBe(true);
        expect(getNodeIsDecId([qt.ClassDeclaration(null, null), null, qt.Identifier(null)])).toBe(true);
        expect(getNodeIsDecId([qt.PropertyDefinition(null), null, qt.Identifier(null)])).toBe(true);
        expect(getNodeIsDecId([qt.Property(null, null, null), null, qt.Identifier(null)])).toBe(true);
    });

    // -------------------------------------------------------------------------

    it("getBranchWithInitKey, invalid", () => {
        expect(getBranchWithInitKey([])).toEqual([]);
    });

    it("getBranchWithInitValue, invalid", () => {
        expect(getBranchWithInitValue([])).toEqual([]);
    });

    // -------------------------------------------------------------------------

    it("getNodeAfterPos", () => {
        const program = parse("function foo() {    local bar = 123   }");
        expect(getNodeAfterPos(program, pos(17)).at(-1).type).toEqual("VariableDeclaration");
        expect(getNodeAfterPos(undefined, undefined)).toHaveLength(0);
        expect(getNodeAfterPos(program, pos(100)).at(-1)).toBeUndefined();

        getNodeAfterPos(program, pos(17)).at(-1).loc = undefined;
        expect(getNodeAfterPos(program, pos(17))).toHaveLength(0);
    });

    it("getNodeAfterPos, promote expression", () => {
        const program = parse("    bar   ");
        expect(getNodeAfterPos(program, pos(2)).at(-1).type).toEqual("Identifier");
    });

    it("getNodeBeforePos", () => {
        const program = parse("function foo() {    local bar = 123   }");
        expect(getNodeBeforePos(program, pos(37)).at(-1).type).toEqual("VariableDeclaration");
        expect(getNodeBeforePos(undefined, undefined)).toHaveLength(0);
        expect(getNodeBeforePos(program, pos(0)).at(-1)).toBeUndefined();

        getNodeBeforePos(program, pos(37)).at(-1).loc = undefined;
        expect(getNodeBeforePos(program, pos(37))).toHaveLength(0);
    });

    it("getNodeBeforePos, promote expression", () => {
        const program = parse("    bar   ");
        expect(getNodeBeforePos(program, pos(8)).at(-1).type).toEqual("Identifier");
    });

    it("getNodeAtPos", () => {
        const text = "enum myEnum { b };";
        const program = parse(text);
        const types = [];
        for (let i=0; i<=text.length+1; i++) {
            types.push(getNodeAtPos(program, pos(i))?.type);
        }
        // Uses word boundaries
        expect(types).toEqual([
            "EnumDeclaration",
            "EnumDeclaration",
            "EnumDeclaration",
            "EnumDeclaration",
            "EnumDeclaration",
            "Identifier",
            "Identifier",
            "Identifier",
            "Identifier",
            "Identifier",
            "Identifier",
            "Identifier",
            "EnumDeclaration",
            "EnumDeclaration",
            "Identifier",
            "Identifier",
            "EnumDeclaration",
            "EnumDeclaration",
            "EmptyStatement",
            undefined,
        ]);
    });

    it("getNodeAtPos, computed member", () => {
        const program = parse('""; x[""]; x["a"]');
        expect(getNodeAtPos(program, pos(1))?.type).toBe("StringLiteral");

        // member strings get "computed" into an identifier
        // expect(getNodeAtPos(program, pos(7))?.type).toBe("MemberExpression"); // invalid identifier is "see through"
        expect(getNodeAtPos(program, pos(7))?.type).toBe("Identifier"); // invalid identifier
        expect(getNodeAtPos(program, pos(14))?.type).toBe("Identifier");
    });

    it("getBranchCallable, undefined", () => {
        expect(getBranchCallable([])).toHaveLength(0);
    });

    it("getBranchCallable, FunctionDeclaration", () => {
        const n = qt.FunctionDeclaration(qt.Identifier("name"), [], qt.BlockStatement());
        expect(getBranchCallable([n]).at(-1).type).toBe("FunctionDeclaration");
    });

    it("getBranchCallable, MethodDefinition", () => {
        const n = qt.MethodDefinition("method", qt.Identifier("name"), qt.FunctionExpression([], qt.BlockStatement()));
        expect(getBranchCallable([n]).at(-1).type).toBe("MethodDefinition");
    });

    it("getBranchCallable, VariableDeclarator FunctionExpression", () => {
        const def = qt.VariableDeclarator(qt.Identifier("name"), qt.FunctionExpression([], qt.BlockStatement()));
        expect(getBranchCallable([def]).at(-1).type).toBe("FunctionExpression");
    });

    it("getBranchCallable, VariableDeclarator LambdaExpression", () => {
        const def = qt.VariableDeclarator(qt.Identifier("name"), qt.LambdaExpression([], qt.BlockStatement()));
        expect(getBranchCallable([def]).at(-1).type).toBe("LambdaExpression");
    });

    it("getBranchCallable, False", () => {
        const n = qt.StringLiteral("123");
        expect(getBranchCallable([n])).toHaveLength(0);
    });

    it("getBranchFunctionDef, undefined", () => {
        expect(getBranchFunctionDef([])).toHaveLength(0);
    });

    it("getBranchFunctionDef, FunctionDeclaration", () => {
        const program = parse("function foo () { local id }");
        const id = getBranchAtPos(program, pos(25));
        const node = getBranchFunctionDef(id);
        expect(node.at(-1).type).toEqual("FunctionDeclaration");
        expect(addBranchId(node).at(-1)["name"]).toEqual("foo");
    });

    it("getBranchFunctionDef, FunctionExpression", () => {
        const program = parse("local foo = function () { local id }");
        const id = getBranchAtPos(program, pos(33));
        const node = getBranchFunctionDef(id);
        expect(node.at(-1).type).toEqual("VariableDeclarator");
        expect(addBranchId(node).at(-1)["name"]).toEqual("foo");
    });

    it("getBranchFunctionDef, MethodDefinition", () => {
        const program = parse("class foo { function bar() { local id } }");
        const id = getBranchAtPos(program, pos(36));
        const node = getBranchFunctionDef(id);
        expect(node.at(-1).type).toEqual("MethodDefinition");
        expect(addBranchId(node).at(-1)["name"]).toEqual("bar");
    });

    // it("getNodeAncestorByType", () => {
    //     const program = parse("function foo () { local id }");
    //     const id = getNodeAtPos(program, pos(25));
    //     const node = getNodeAncestorByType(id, "FunctionDeclaration");
    //     expect(node.type).toEqual("FunctionDeclaration");
    //     expect(node["id"]["name"]).toEqual("foo");
    // });

    it("getBranchClassDef, ClassDeclaration", () => {
        const program = parse("class foo { function bar () { local id } }");
        const n = getBranchAtPos(program, pos(37));
        const node = getBranchClassDef(n);
        expect(node.at(-1).type).toEqual("ClassDeclaration");
        expect(addBranchId(node).at(-1)["name"]).toEqual("foo");
    });

    it("getBranchClassDef, ClassDeclaration Id", () => {
        const program = parse("class foo {}");
        const n = getBranchAtPos(program, pos(8));
        const node = getBranchClassDef(n);
        expect(node.at(-1).type).toEqual("ClassDeclaration");
        expect(addBranchId(node).at(-1)["name"]).toEqual("foo");
    });

    it("getBranchClassDef, ClassExpression", () => {
        const program = parse("local foo = class { function bar () { local id } }");
        const n = getBranchAtPos(program, pos(45));
        const node = getBranchClassDef(n);
        expect(node.at(-1).type).toEqual("VariableDeclarator");
        expect(addBranchId(node).at(-1)["name"]).toEqual("foo");
    });

    it("getBranchClassDef, ClassExpression Id", () => {
        const program = parse("local foo = class {}");
        const n = getBranchAtPos(program, pos(8));
        const node = getBranchClassDef(n);
        expect(node.at(-1).type).toEqual("VariableDeclarator");
        expect(addBranchId(node).at(-1)["name"]).toEqual("foo");
    });

    it("getBranchClassDef, undefined", () => {
        const program = parse("local foo");
        const n = getBranchAtPos(program, pos(8));
        const node = getBranchClassDef(n).at(-1);
        expect(node).toBeUndefined();
    });

    it("getBranchBlock, undefined", () => {
        expect(getBranchBlock([])).toEqual([]);
    });

    it("getBranchBlock, function def", () => {
        const program = parse("function foo () { local id }");
        const n = getBranchAtPos(program, pos(25));
        expect(getBranchBlock(n).at(-1).range).toEqual([16, 28]);
    });

    it("getBranchBlock, function exp", () => {
        const program = parse("local foo = function () { local id }");
        const n = getBranchAtPos(program, pos(33));
        expect(getBranchBlock(n).at(-1).range).toEqual([24, 36]);
    });

    it("getBranchBlock, program", () => {
        const program = parse(" local id ");
        const n = getBranchAtPos(program, pos(8));
        expect(getBranchBlock(n).at(-1).range).toEqual([0, 10]);
    });

    it("getBranchBlock, class def", () => {
        const program = parse("class foo { id = 123 }");
        const n = getBranchAtPos(program, pos(13));
        expect(getBranchBlock(n).at(-1).range).toEqual([10, 22]);
    });

    it("getBranchBlock, class exp", () => {
        const program = parse("local foo = class { id = 123 }");
        const n = getBranchAtPos(program, pos(21));
        expect(getBranchBlock(n).at(-1).range).toEqual([18, 30]);
    });

    it("getBranchBlock, method", () => {
        const program = parse("class foo { function bar() { id = 123 } }");
        const n = getBranchAtPos(program, pos(30));
        expect(getBranchBlock(n).at(-1).range).toEqual([27, 39]);
    });

    it("getBranchBlock, for", () => {
        const program = parse("for (;;) { id = 123 }");
        const n = getBranchAtPos(program, pos(12));
        expect(getBranchBlock(n).at(-1).range).toEqual([9, 21]);
    });

    it("getBranchBlock, while", () => {
        const program = parse("while(1) { id = 123 }");
        const n = getBranchAtPos(program, pos(12));
        expect(getBranchBlock(n).at(-1).range).toEqual([9, 21]);
    });

    it("getBranchBlock, try", () => {
        const program = parse("try { id = 123 } catch(err) {}");
        const n = getBranchAtPos(program, pos(7));
        expect(getBranchBlock(n).at(-1).range).toEqual([4, 16]);
    });

    it("nodeHasInit", () => {
        expect(nodeHasInit(qt.VariableDeclarator(null))).toBe(true);
        expect(nodeHasInit(qt.PropertyDefinition(null))).toBe(true);
        expect(nodeHasInit(qt.Property(null, null, null))).toBe(true);

        const program = parse("x <- 123");
        const n = program.body[0]["expression"];
        expect(nodeHasInit(n)).toBe(true);

        expect(nodeHasInit(undefined)).toBe(false);
        expect(nodeHasInit(qt.BlockStatement(null))).toBe(false);
    });

    it("isNodeBlock", () => {
        expect(isNodeBlock(qt.Program(null))).toBe(true);
        expect(isNodeBlock(qt.ClassBody(null))).toBe(true);
        expect(isNodeBlock(qt.BlockStatement(null))).toBe(true);
        expect(isNodeBlock(qt.LambdaExpression(null, null))).toBe(true);
        expect(isNodeBlock(qt.FunctionExpression(null, null))).toBe(true);

        expect(isNodeBlock(undefined)).toBe(false);
        expect(isNodeBlock(qt.Identifier(null))).toBe(false);
    });

    // -------------------------------------------------------------------------

    it("getNodeOverloads, undefined", () => {
        expect(getNodeOverloads([])).toEqual([]);
    });

    it("getNodeArrayElementType, invalid", () => {
        const n = [qt.ArrayExpression(null)];
        expect(getNodeArrayElementType(n)).toEqual("any");
    });

    it("getNodeArrayElementType, single", () => {
        const n = [qt.ArrayExpression([qt.StringLiteral("string")])];
        expect(getNodeArrayElementType(n)).toEqual("string");
    });

    it("getNodeArrayElementType, multiple same", () => {
        const n = [qt.ArrayExpression([
            qt.StringLiteral("one"),
            qt.StringLiteral("two")
        ])];
        expect(getNodeArrayElementType(n)).toEqual("string");
    });

    it("getNodeArrayElementType, multiple different", () => {
        const n = [qt.ArrayExpression([
            qt.StringLiteral("string"),
            qt.IntegerLiteral(1)
        ])];
        expect(getNodeArrayElementType(n)).toEqual("any");
    });

});
