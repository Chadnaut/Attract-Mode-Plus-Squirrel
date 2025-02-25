import {
    beforeEach,
    describe,
    fdescribe,
    expect,
    it,
    fit,
} from "@jest/globals";
import { parse, lineLoc, dump } from "../utils";
import { SQTree as qt } from "../../src/ast";

describe("Class", () => {

    it("ClassExpression", () => {
        const response = parse("local x = class {}");
        // dump(response);
        expect(response).toEqual(qt.Program(
            [qt.VariableDeclaration('local', [
                qt.VariableDeclarator(
                    qt.Identifier('x', lineLoc(6, 7)),
                    qt.ClassExpression(
                        qt.ClassBody([], lineLoc(16, 18)),
                        null,
                        null,
                        lineLoc(10, 18)
                    ),
                    lineLoc(6, 18)
                ),
            ], lineLoc(0, 18))],
            [],
            lineLoc(0, 18)
        ));
    });

    it("ClassDeclaration", () => {
        const response = parse(" class foo {} ");
        // dump(response);
        expect(response).toEqual(qt.Program(
            [qt.ClassDeclaration(
                qt.Identifier('foo', lineLoc(7, 10)),
                qt.ClassBody([], lineLoc(11, 13)),
                null,
                null,
                lineLoc(1, 13)
            )],
            [],
            lineLoc(0, 14)
        ));
    });

    it("ClassDeclaration, whitespace", () => {
        const response = parse("\n class foo {} \n");
        // dump(response);
        expect(response).toEqual(qt.Program(
            [qt.ClassDeclaration(
                qt.Identifier('foo', qt.SourceLocation(qt.Position(2,7,8), qt.Position(2,10,11))),
                qt.ClassBody([], qt.SourceLocation(qt.Position(2,11,12), qt.Position(2,13,14))),
                null,
                null,
                qt.SourceLocation(qt.Position(2,1,2), qt.Position(2,13,14))
            )],
            [],
            qt.SourceLocation(qt.Position(1,0,0), qt.Position(3,0,16))
        ));
    });

    it("Extends", () => {
        const response = parse(" class foo extends bar {} ");
        // dump(response);
        expect(response).toEqual(qt.Program(
            [qt.ClassDeclaration(
                qt.Identifier('foo', lineLoc(7, 10)),
                qt.ClassBody([], lineLoc(23, 25)),
                qt.Identifier('bar', lineLoc(19, 22)),
                null,
                lineLoc(1, 25)
            )],
            [],
            lineLoc(0, 26)
        ));
    });

    it("Namespace", () => {
        const response = parse(" class foo.bar {} ");
        // dump(response);
        expect(response).toEqual(qt.Program(
            [qt.ClassDeclaration(
                qt.MemberExpression(
                    qt.Identifier('foo', lineLoc(7, 10)),
                    qt.Identifier('bar', lineLoc(11, 14))
                ),
                qt.ClassBody([], lineLoc(15, 17)),
                null,
                null,
                lineLoc(1, 17)
            )],
            [],
            lineLoc(0, 18)
        ));
    });

    it("MethodDefinition", () => {
        const response = parse(" class foo { function x(a) {b} } ");
        // dump(response);
        expect(response).toEqual(qt.Program(
            [qt.ClassDeclaration(
                qt.Identifier('foo', lineLoc(7, 10)),
                qt.ClassBody([
                    qt.MethodDefinition(
                        "method",
                        qt.Identifier('x', lineLoc(22, 23)),
                        qt.FunctionExpression(
                            [
                                qt.Identifier('a', lineLoc(24, 25)),
                            ],
                            qt.BlockStatement([
                                qt.ExpressionStatement(qt.Identifier('b', lineLoc(28, 29))),
                            ], lineLoc(27, 30)),
                            lineLoc(23, 30)
                        ),
                        false,
                        null,
                        lineLoc(13, 30)
                    )
                ], lineLoc(11, 32)),
                null,
                null,
                lineLoc(1, 32)
            )],
            [],
            lineLoc(0, 33)
        ));
    });

    it("MethodDefinition, static", () => {
        const response = parse(" class foo { static function x(a) {b} } ");
        // dump(response);
        expect(response).toEqual(qt.Program(
            [qt.ClassDeclaration(
                qt.Identifier('foo', lineLoc(7, 10)),
                qt.ClassBody([
                    qt.MethodDefinition(
                        "method",
                        qt.Identifier('x', lineLoc(29, 30)),
                        qt.FunctionExpression(
                            [
                                qt.Identifier('a', lineLoc(31, 32)),
                            ],
                            qt.BlockStatement([
                                qt.ExpressionStatement(qt.Identifier('b', lineLoc(35, 36))),
                            ], lineLoc(34, 37)),
                            lineLoc(30, 37)
                        ),
                        true,
                        null,
                        lineLoc(13, 37)
                    )
                ], lineLoc(11, 39)),
                null,
                null,
                lineLoc(1, 39)
            )],
            [],
            lineLoc(0, 40)
        ));
    });

    it("PropertyDefinition", () => {
        const response = parse(" class foo { x = 1 } ");
        // dump(response);
        expect(response).toEqual(qt.Program(
            [qt.ClassDeclaration(
                qt.Identifier('foo', lineLoc(7, 10)),
                qt.ClassBody([
                    qt.PropertyDefinition(
                        qt.Identifier('x', lineLoc(13, 14)),
                        qt.IntegerLiteral(1, "1", lineLoc(17, 18)),
                        false,
                        false,
                        null,
                        lineLoc(13, 18)
                    )
                ], lineLoc(11, 20)),
                null,
                null,
                lineLoc(1, 20)
            )],
            [],
            lineLoc(0, 21)
        ));
    });

    it("PropertyDefinition, Function", () => {
        const response = parse(" class foo { x = function() {} } ");
        // dump(response);
        expect(response).toEqual(qt.Program(
            [qt.ClassDeclaration(
                qt.Identifier('foo', lineLoc(7, 10)),
                qt.ClassBody([
                    qt.PropertyDefinition(
                        qt.Identifier('x', lineLoc(13, 14)),
                        qt.FunctionExpression(
                            [],
                            qt.BlockStatement([], lineLoc(28, 30)),
                            lineLoc(17, 30)
                        ),
                        false,
                        false,
                        null,
                        lineLoc(13, 30)
                    )
                ], lineLoc(11, 32)),
                null,
                null,
                lineLoc(1, 32)
            )],
            [],
            lineLoc(0, 33)
        ));
    });

    it("PropertyDefinition, computed", () => {
        const response = parse(' class foo { ["x"] = 1 } ');
        // dump(response);
        expect(response).toEqual(qt.Program(
            [qt.ClassDeclaration(
                qt.Identifier('foo', lineLoc(7, 10)),
                qt.ClassBody([
                    qt.PropertyDefinition(
                        qt.StringLiteral('x', '"x"', lineLoc(14, 17)),
                        qt.IntegerLiteral(1, "1", lineLoc(21, 22)),
                        true,
                        false,
                        null,
                        lineLoc(13, 22)
                    )
                ], lineLoc(11, 24)),
                null,
                null,
                lineLoc(1, 24)
            )],
            [],
            lineLoc(0, 25)
        ));
    });

    it("PropertyDefinition, static", () => {
        const response = parse(" class foo { static x = 1 } ");
        // dump(response);
        expect(response).toEqual(qt.Program(
            [qt.ClassDeclaration(
                qt.Identifier('foo', lineLoc(7, 10)),
                qt.ClassBody([
                    qt.PropertyDefinition(
                        qt.Identifier('x', lineLoc(20, 21)),
                        qt.IntegerLiteral(1, "1", lineLoc(24, 25)),
                        false,
                        true,
                        null,
                        lineLoc(13, 25)
                    )
                ], lineLoc(11, 27)),
                null,
                null,
                lineLoc(1, 27)
            )],
            [],
            lineLoc(0, 28)
        ));
    });

    it("Constructor", () => {
        const response = parse(" class foo { constructor(x) {} } ");
        // dump(response);
        expect(response).toEqual(qt.Program(
            [qt.ClassDeclaration(
                qt.Identifier('foo', lineLoc(7, 10)),
                qt.ClassBody([
                    qt.MethodDefinition(
                        "constructor",
                        qt.Identifier('constructor', lineLoc(13, 24)),
                        qt.FunctionExpression(
                            [
                                qt.Identifier('x', lineLoc(25, 26)),
                            ],
                            qt.BlockStatement([], lineLoc(28, 30)),
                            lineLoc(24, 30)
                        ),
                        false,
                        null,
                        lineLoc(13, 30)
                    )
                ], lineLoc(11, 32)),
                null,
                null,
                lineLoc(1, 32)
            )],
            [],
            lineLoc(0, 33)
        ));
    });
});
