import { describe, expect, it } from "@jest/globals";
import { parse, lineLoc, dump } from "../utils";
import { SQTree as qt } from "../../src/ast";

describe("Table", () => {
    it("BlockStatement", () => {
        const response = parse(" { x = 1; y = 2; } ");
        expect(response).toEqual(qt.Program(
            [qt.BlockStatement(
                [
                    qt.ExpressionStatement(
                        qt.AssignmentExpression(
                            '=',
                            qt.Identifier('x', lineLoc(3, 4)),
                            qt.IntegerLiteral(1, "1", lineLoc(7, 8)),
                        ),
                    ),
                    qt.ExpressionStatement(
                        qt.AssignmentExpression(
                            '=',
                            qt.Identifier('y', lineLoc(10, 11)),
                            qt.IntegerLiteral(2, "2", lineLoc(14, 15)),
                        )
                    )
                ],
                lineLoc(1, 18)
            )],
            [],
            lineLoc(0, 19)
        ));
    });

    it("BlockStatement, Empty", () => {
        const response = parse(" {  } ");
        expect(response).toEqual(qt.Program(
            [qt.BlockStatement(
                [],
                lineLoc(1, 5)
            )],
            [],
            lineLoc(0, 6)
        ));
    });

    it("BlockStatement, Nested", () => {
        const response = parse(" { { x = 1; } } ");
        expect(response).toEqual(qt.Program(
            [qt.BlockStatement(
                [
                    qt.BlockStatement(
                        [
                            qt.ExpressionStatement(
                                qt.AssignmentExpression(
                                    '=',
                                    qt.Identifier('x', lineLoc(5, 6)),
                                    qt.IntegerLiteral(1, "1", lineLoc(9, 10)),
                                ),
                            )
                        ],
                        lineLoc(3, 13)
                    )
                ],
                lineLoc(1, 15)
            )],
            [],
            lineLoc(0, 16)
        ));
    });

    it("Table", () => {
        const response = parse(" local x = { y = 1 } ");
        expect(response).toEqual(qt.Program(
            [qt.VariableDeclaration(
                'local',
                [
                    qt.VariableDeclarator(
                        qt.Identifier('x', lineLoc(7, 8)),
                        qt.ObjectExpression([
                            qt.Property(
                                'init',
                                qt.Identifier('y', lineLoc(13, 14)),
                                qt.IntegerLiteral(1, "1", lineLoc(17, 18)),
                                false,
                                false,
                                lineLoc(13, 18)
                            )
                        ], false, lineLoc(11, 20)),
                        lineLoc(7, 20)
                    )
                ],
                lineLoc(1, 20)
            )],
            [],
            lineLoc(0, 21)
        ));
    });

    it("Table, Empty", () => {
        const response = parse(" local x = {  } ");
        expect(response).toEqual(qt.Program(
            [qt.VariableDeclaration(
                'local',
                [
                    qt.VariableDeclarator(
                        qt.Identifier('x', lineLoc(7, 8)),
                        qt.ObjectExpression([
                        ], false, lineLoc(11, 15)),
                        lineLoc(7, 15)
                    )
                ],
                lineLoc(1, 15)
            )],
            [],
            lineLoc(0, 16)
        ));
    });

    it("JSON", () => {
        const response = parse(' local x = {"y": 1 } ');
        // dump(response);
        expect(response).toEqual(qt.Program(
            [qt.VariableDeclaration(
                'local',
                [
                    qt.VariableDeclarator(
                        qt.Identifier('x', lineLoc(7, 8)),
                        qt.ObjectExpression([
                            qt.Property(
                                'init',
                                qt.StringLiteral('y', '"y"', lineLoc(12, 15)),
                                qt.IntegerLiteral(1, "1", lineLoc(17, 18)),
                                false,
                                true,
                                lineLoc(12, 18)
                            )
                        ], false, lineLoc(11, 20)),
                        lineLoc(7, 20)
                    )
                ],
                lineLoc(1, 20)
            )],
            [],
            lineLoc(0, 21)
        ));
    });

    it("Computed", () => {
        const response = parse(' local x = { ["x"+"y"] = 1 } ');
        // dump(response);
        expect(response).toEqual(qt.Program(
            [qt.VariableDeclaration(
                'local',
                [
                    qt.VariableDeclarator(
                        qt.Identifier('x', lineLoc(7, 8)),
                        qt.ObjectExpression([
                            qt.Property(
                                'init',
                                qt.BinaryExpression(
                                    '+',
                                    qt.StringLiteral('x', '"x"', lineLoc(14, 17)),
                                    qt.StringLiteral('y', '"y"', lineLoc(18, 21)),
                                ),
                                qt.IntegerLiteral(1, "1", lineLoc(25, 26)),
                                true,
                                false,
                                lineLoc(13, 26)
                            )
                        ], false, lineLoc(11, 28)),
                        lineLoc(7, 28)
                    )
                ],
                lineLoc(1, 28)
            )],
            [],
            lineLoc(0, 29)
        ));
    });
});
