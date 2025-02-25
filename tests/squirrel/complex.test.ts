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

describe("Complex", () => {
    it("Complex Statement", () => {
        const response = parse("function foo(x, ...) { local x = 1; { x = 3 * (x + 1); } }");
        // dump(response);
        expect(response).toEqual(qt.Program(
            [qt.FunctionDeclaration(
                qt.Identifier('foo', lineLoc(9, 12)),
                [
                    qt.Identifier('x', lineLoc(13, 14)),
                    qt.RestElement(lineLoc(16, 19))
                ],
                qt.BlockStatement([
                    qt.VariableDeclaration(
                        'local',
                        [
                            qt.VariableDeclarator(
                                qt.Identifier('x', lineLoc(29, 30)),
                                qt.IntegerLiteral(1, "1", lineLoc(33, 34)),
                                lineLoc(29, 34)
                            )
                        ],
                        lineLoc(23, 34)
                    ),
                    qt.BlockStatement(
                        [
                            qt.ExpressionStatement(
                                qt.AssignmentExpression(
                                    '=',
                                    qt.Identifier('x', lineLoc(38, 39)),
                                    qt.BinaryExpression(
                                        '*',
                                        qt.IntegerLiteral(3, "3", lineLoc(42, 43)),
                                        {
                                            ...qt.BinaryExpression(
                                                '+',
                                                qt.Identifier('x', lineLoc(47, 48)),
                                                qt.IntegerLiteral(1, "1", lineLoc(51, 52)),
                                            ),
                                            extra: { parenthesized: true }
                                        },
                                        lineLoc(42, 53)
                                    ),
                                ),
                                lineLoc(38, 53)
                            )
                        ],
                        lineLoc(36, 56)
                    )
                ], lineLoc(21, 58)),
                false,
                lineLoc(0, 58)
            )],
            [],
            lineLoc(0, 58)
        ));
    });

});
