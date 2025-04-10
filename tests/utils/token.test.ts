import { applyToken, getNodeToken, getSemanticTokens, inheritToken, tokenizeNode, tokenLegend, updateNodeTokenFromType } from "../../src/utils/token";
import { describe, it } from "@jest/globals";
import { dump, lineLoc, parseExtra as parse, parseForceExtra, pos } from "../utils";
import { getNodeAtPos, getBranchAtPos } from "../../src/utils/find";
import { SemanticTokensBuilder, SemanticTokensLegend, SymbolKind } from "vscode";
import { AST, SQTree as qt } from "../../src/ast";
import { SquirrelType } from '../../src/utils/kind';
import { getNodeSymbol } from '../../src/utils/symbol';

describe("Token", () => {

    it("Legend", () => {
        expect(tokenLegend).toBeInstanceOf(SemanticTokensLegend);
    });

    // SemanticTokensBuilder unsupported in jest, just check it doesnt fail
    it("getSemanticTokens, undefined", () => {
        expect(getSemanticTokens(undefined)).toBeUndefined();
    });

    it("getSemanticTokens, valid", () => {
        const program = parse(" function foo(a,b,c) {} ");
        expect(getSemanticTokens(program)).not.toBeUndefined();
    });

    it("applyToken, valid", () => {
        const arr = [];
        const builder = arr as unknown as SemanticTokensBuilder;
        const n = qt.Identifier("name", lineLoc(0, 4));
        applyToken(builder, [n], "class");
        expect(arr).toHaveLength(2);
    });

    it("applyToken, undefined", () => {
        const arr = [];
        const builder = arr as unknown as SemanticTokensBuilder;
        applyToken(builder, [], "class");
        expect(arr).toHaveLength(0);
    });

    it("applyToken, invalid token", () => {
        const arr = [];
        const builder = arr as unknown as SemanticTokensBuilder;
        const n = qt.Identifier("name", lineLoc(0, 4));
        applyToken(builder, [n], null);
        expect(arr).toHaveLength(0);
    });

    it("applyToken, zero range", () => {
        const arr = [];
        const builder = arr as unknown as SemanticTokensBuilder;
        const n = qt.Identifier("name", lineLoc(0, 0));
        applyToken(builder, [n], "class");
        expect(arr).toHaveLength(0);
    });

    it("applyToken, multiline", () => {
        const arr = [];
        const builder = arr as unknown as SemanticTokensBuilder;
        const n = qt.Identifier("name", qt.SourceLocation(qt.Position(1,0,0), qt.Position(2,2,2)));
        applyToken(builder, [n], "class");
        expect(arr).toHaveLength(0);
    });

    it("applyToken, null range", () => {
        const arr = [];
        const builder = arr as unknown as SemanticTokensBuilder;
        const n = qt.Identifier("name", null);
        applyToken(builder, [n], "class");
        expect(arr).toHaveLength(0);
    });

    it("None", () => {
        const program = parse("local foo = 123;");
        const n = getNodeAtPos(program, pos(7));
        expect(n.type).toBe("Identifier");
        expect(getNodeToken(n)).toBeUndefined();
    });

    it("Method, forced", () => {
        const program = parse("/** @method */ ::root <- {}");
        const n = getBranchAtPos(program, pos(19));
        expect(n.at(-1).type).toBe("Identifier");
        expect(getNodeSymbol(n).kind).toBe(SymbolKind.Method);
    });

    it("Enum", () => {
        const program = parse("enum myEnum {}");
        const n = getBranchAtPos(program, pos(8));
        expect(n.at(-1).type).toBe("Identifier");
        expect(getNodeToken(n.at(-1))).toBe("enum");
        expect(getNodeSymbol(n).kind).toBe(SymbolKind.Enum);
    });

    it("Enum, forced root", () => {
        const program = parse("/** @enum */ ::root <- {}");
        const n = getBranchAtPos(program, pos(17));
        expect(n.at(-1).type).toBe("Identifier");
        expect(getNodeToken(n.at(-1))).toBe("enum");
        expect(getNodeSymbol(n).kind).toBe(SymbolKind.Enum);
    });

    it("Enum, forced local", () => {
        const program = parse("/** @enum */ local var = {}, two = {}");
        const n1 = getNodeAtPos(program, pos(20));
        const n2 = getNodeAtPos(program, pos(30));
        expect(n1.type).toBe("Identifier");
        expect(getNodeToken(n1)).toBe("enum");
        expect(n2.type).toBe("Identifier");
        expect(getNodeToken(n2)).not.toBe("enum");
    });

    it("Param", () => {
        const program = parse("function foo(param) {}");
        const n = getNodeAtPos(program, pos(15));
        expect(n.type).toBe("Identifier");
        expect(getNodeToken(n)).toBe("parameter");
    });

    it("Param, inner", () => {
        const program = parse("function foo(param) { param }");
        const n = getNodeAtPos(program, pos(24));
        expect(n.type).toBe("Identifier");
        expect(getNodeToken(n)).toBe("parameter");
    });

    it("Param, return", () => {
        const program = parse("function foo(param) { return param }");
        const n = getNodeAtPos(program, pos(31));
        expect(n.type).toBe("Identifier");
        expect(getNodeToken(n)).toBe("parameter");
    });

    it("Param, is not transitive", () => {
        const program = parse("function foo(param) { local bar = param }");
        const n = getNodeAtPos(program, pos(29));
        expect(n.type).toBe("Identifier");
        expect(getNodeToken(n)).toBeUndefined();
    });

    it("Param, no semantic token for rest", () => {
        const program = parse("function foo(...) {}");
        expect((getSemanticTokens(program) as unknown as object[]).map((n) => n["tokenType"]).includes('parameter')).toBe(false);
    });

    it("FunctionDeclaration", () => {
        const program = parse("function foo() {}");
        const n = getNodeAtPos(program, pos(11));
        expect(n.type).toBe("Identifier");
        expect(getNodeToken(n)).toBe("function");
    });

    it("FunctionDeclaration, inherit", () => {
        const program = parse("function foo() {}; local bar = foo;");
        const n = getNodeAtPos(program, pos(26));
        expect(n.type).toBe("Identifier");
        expect(getNodeToken(n)).toBe("function");
    });

    it("FunctionExpression", () => {
        const program = parse("local foo = function() {}");
        const n = getNodeAtPos(program, pos(7));
        expect(n.type).toBe("Identifier");
        expect(getNodeToken(n)).toBe("function");
    });

    it("FunctionExpression, inherit", () => {
        const program = parse("local foo = function() {}; local bar = foo;");
        const n = getNodeAtPos(program, pos(34));
        expect(n.type).toBe("Identifier");
        expect(getNodeToken(n)).toBe("function");
    });

    it("FunctionExpression, root", () => {
        const program = parse("::root <- function () {};");
        const n = getNodeAtPos(program, pos(4));
        expect(n.type).toBe("Identifier");
        expect(getNodeToken(n)).toBe("function");
    });

    it("ClassDeclaration", () => {
        const program = parse("class foo {}");
        const n = getNodeAtPos(program, pos(7));
        expect(n.type).toBe("Identifier");
        expect(getNodeToken(n)).toBe("class");
    });

    it("ClassDeclaration, inherit", () => {
        const program = parse("class foo {}; local bar = foo;");
        const n = getNodeAtPos(program, pos(27));
        expect(n.type).toBe("Identifier");
        expect(getNodeToken(n)).toBe("class");
    });

    it("ClassExpression", () => {
        const program = parse("local foo = class {}");
        const n = getNodeAtPos(program, pos(7));
        expect(n.type).toBe("Identifier");
        expect(getNodeToken(n)).toBe("class");
    });

    it("ClassExpression, inherit", () => {
        const program = parse("local foo = class {}; local bar = foo;");
        const n = getNodeAtPos(program, pos(29));
        expect(n.type).toBe("Identifier");
        expect(getNodeToken(n)).toBe("class");
    });

    it("ClassExpression, root", () => {
        const program = parse("::root <- class {};");
        const n = getNodeAtPos(program, pos(4));
        expect(n.type).toBe("Identifier");
        expect(getNodeToken(n)).toBe("class");
    });

    it("inheritToken, invalid id", () => {
        const arr = [];
        const builder = arr as unknown as SemanticTokensBuilder;
        const id = <AST.Identifier>qt.Identifier(null);
        const str = <AST.StringLiteral>qt.StringLiteral(null);
        const blk = <AST.BlockStatement>qt.BlockStatement(null);
        inheritToken(builder, [null], [null]);
        inheritToken(builder, [null], [str]);
        inheritToken(builder, [str as unknown as AST.Identifier], [str]);
        inheritToken(builder, [id], [blk]);
        expect(arr).toHaveLength(0);
    });

    it("tokenize, invalid", () => {
        const arr = [];
        const builder = arr as unknown as SemanticTokensBuilder;
        expect(tokenizeNode(builder, [])).toBeUndefined();
        expect(arr).toHaveLength(0);
    });

    // it("tokenize, exclude method def", () => {
    //     const program = parse("class foo { function bar () {}; }");
    //     expect(getSemanticTokens(program)["length"]).toBe(1);
    // });

    // -------------------------------------------------------------------------

    it("updateNodeTokenFromType", () => {
        let n = <AST.Node>{ type: "Identifier" };
        expect(getNodeToken(updateNodeTokenFromType(n, SquirrelType.ARRAY))).toBeUndefined();
        expect(getNodeToken(updateNodeTokenFromType(n, SquirrelType.PARAMETER))).toBe("parameter");
        expect(getNodeToken(updateNodeTokenFromType(n, SquirrelType.CLASS))).toBe("class");
        expect(getNodeToken(updateNodeTokenFromType(n, SquirrelType.FUNCTION))).toBe("function");
        expect(getNodeToken(updateNodeTokenFromType(n, SquirrelType.ENUM))).toBe("enum");
    });
});
