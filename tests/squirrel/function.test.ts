import {
    beforeEach,
    describe,
    fdescribe,
    expect,
    it,
    fit,
} from "@jest/globals";
import { parse, lineLoc, dump, errors } from "../utils";
import { SQTree as qt } from "../../src/ast";

describe("Function", () => {
    it("FunctionDeclaration", () => {
        const response = parse(" function foo() { x = 1; } ");
        expect(response).toEqual(qt.Program(
            [qt.FunctionDeclaration(
                qt.Identifier('foo', lineLoc(10, 13)),
                [],
                qt.BlockStatement([
                    qt.ExpressionStatement(
                        qt.AssignmentExpression(
                            "=",
                            qt.Identifier('x', lineLoc(18, 19)),
                            qt.IntegerLiteral(1, "1", lineLoc(22, 23)),
                        )
                    )
                ], lineLoc(16, 26)),
                false,
                lineLoc(1, 26)
            )],
            [],
            lineLoc(0, 27)
        ));
    });

    it("Function, member id", () => {
        const response = parse("function foo::bar::who() { x = 1; }");
        // dump(response);
        expect(response).toEqual(qt.Program(
            [qt.FunctionDeclaration(
                qt.MemberExpression(
                    qt.MemberExpression(
                        qt.Identifier('foo', lineLoc(9, 12)),
                        qt.Identifier('bar', lineLoc(14, 17)),
                        false,
                        true,
                        lineLoc(9, 17)
                    ),
                    qt.Identifier('who', lineLoc(19, 22)),
                    false,
                    true,
                    lineLoc(9, 22)
                ),
                [],
                qt.BlockStatement([
                    qt.ExpressionStatement(
                        qt.AssignmentExpression(
                            "=",
                            qt.Identifier('x', lineLoc(27, 28)),
                            qt.IntegerLiteral(1, "1", lineLoc(31, 32)),
                        )
                    )
                ], lineLoc(25, 35)),
                false,
                lineLoc(0, 35)
            )],
            [],
            lineLoc(0, 35)
        ));
    });

    it("Local", () => {
        const response = parse("local function foo() { x = 1; }");
        // dump(response);
        expect(response).toEqual(qt.Program(
            [qt.FunctionDeclaration(
                qt.Identifier('foo', lineLoc(15, 18)),
                [],
                qt.BlockStatement([
                    qt.ExpressionStatement(
                        qt.AssignmentExpression(
                            "=",
                            qt.Identifier('x', lineLoc(23, 24)),
                            qt.IntegerLiteral(1, "1", lineLoc(27, 28)),
                        )
                    )
                ], lineLoc(21, 31)),
                true,
                lineLoc(0, 31)
            )],
            [],
            lineLoc(0, 31)
        ));
    });

    it("FunctionExpression", () => {
        const response = parse("local x = function() { x = 1; }");
        // dump(response);
        expect(response).toEqual(qt.Program(
            [qt.VariableDeclaration(
                'local',
                [
                    qt.VariableDeclarator(
                        qt.Identifier('x', lineLoc(6, 7)),
                        qt.FunctionExpression(
                            [],
                            qt.BlockStatement([
                                qt.ExpressionStatement(
                                    qt.AssignmentExpression(
                                        "=",
                                        qt.Identifier('x', lineLoc(23, 24)),
                                        qt.IntegerLiteral(1, "1", lineLoc(27, 28)),
                                    )
                                )
                            ], lineLoc(21, 31)),
                            lineLoc(10, 31)
                        ),
                        lineLoc(6, 31)
                    )
                ],
                lineLoc(0, 31)
            )],
            [],
            lineLoc(0, 31)
        ));
    });

    it("Lambda", () => {
        const response = parse("local x = @(y) y+1;");
        // dump(response);
        expect(response).toEqual(qt.Program(
            [qt.VariableDeclaration(
                'local',
                [
                    qt.VariableDeclarator(
                        qt.Identifier('x', lineLoc(6, 7)),
                        qt.LambdaExpression(
                            [
                                qt.Identifier('y', lineLoc(12, 13))
                            ],
                            qt.BinaryExpression(
                                '+',
                                qt.Identifier('y', lineLoc(15, 16)),
                                qt.IntegerLiteral(1, "1", lineLoc(17, 18)),
                            ),
                            lineLoc(10, 18)
                        ),
                        lineLoc(6, 18)
                    )
                ],
                lineLoc(0, 18)
            )],
            [],
            lineLoc(0, 19)
        ));
    });

    it("CallExpression", () => {
        const response = parse(" func(a, b) ");
        // dump(response);
        expect(response).toEqual(qt.Program(
            [qt.ExpressionStatement(qt.CallExpression(
                qt.Identifier('func', lineLoc(1, 5)),
                [
                    qt.Identifier('a', lineLoc(6, 7)),
                    qt.Identifier('b', lineLoc(9, 10)),
                ],
                lineLoc(1, 11)
            ))],
            [],
            lineLoc(0, 12)
        ));
    });

    it("Params", () => {
        const response = parse("function foo(x, y) {}");
        // dump(response);
        expect(response).toEqual(qt.Program(
            [qt.FunctionDeclaration(
                qt.Identifier('foo', lineLoc(9, 12)),
                [
                    qt.Identifier('x', lineLoc(13, 14)),
                    qt.Identifier('y', lineLoc(16, 17))
                ],
                qt.BlockStatement([], lineLoc(19, 21)),
                false,
                lineLoc(0, 21)
            )],
            [],
            lineLoc(0, 21)
        ));
    });

    it("Param Defaults", () => {
        const response = parse("function foo(x = 1, y = 2) {}");
        // dump(response);
        expect(response).toEqual(qt.Program(
            [qt.FunctionDeclaration(
                qt.Identifier('foo', lineLoc(9, 12)),
                [
                    qt.AssignmentPattern(
                        qt.Identifier('x', lineLoc(13, 14)),
                        qt.IntegerLiteral(1, "1", lineLoc(17, 18)),
                    ),
                    qt.AssignmentPattern(
                        qt.Identifier('y', lineLoc(20, 21)),
                        qt.IntegerLiteral(2, "2", lineLoc(24, 25)),
                    )
                ],
                qt.BlockStatement([], lineLoc(27, 29)),
                false,
                lineLoc(0, 29)
            )],
            [],
            lineLoc(0, 29)
        ));
    });

    it("Param Rest", () => {
        const response = parse("function foo(...) {}");
        // dump(response);
        expect(response).toEqual(qt.Program(
            [qt.FunctionDeclaration(
                qt.Identifier('foo', lineLoc(9, 12)),
                [
                    qt.RestElement(lineLoc(13, 16))
                ],
                qt.BlockStatement([], lineLoc(18, 20)),
                false,
                lineLoc(0, 20)
            )],
            [],
            lineLoc(0, 20)
        ));
    });
});
