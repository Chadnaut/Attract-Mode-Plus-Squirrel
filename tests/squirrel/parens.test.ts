import { describe, expect, it } from "@jest/globals";
import { parse, lineLoc, dump } from "../utils";
import { SQTree as qt } from "../../src/ast";

describe("Parenthesis", () => {

    it("Single", () => {
        const response = parse("(1)");
        expect(response).toEqual(qt.Program(
            [qt.ExpressionStatement({
                ...qt.IntegerLiteral(1, "1", lineLoc(1, 2)),
                extra: { parenthesized: true },
            }, lineLoc(0, 3))],
            [],
            lineLoc(0, 3)
        ));
    });

    it("Nested", () => {
        const response = parse("(((1)+2)+3)");
        expect(response).toEqual(qt.Program(
            [qt.ExpressionStatement(
                {...qt.BinaryExpression("+",
                    {...qt.BinaryExpression("+",
                        {...qt.IntegerLiteral(1, "1", lineLoc(3, 4)),
                            extra: { parenthesized: true }},
                        qt.IntegerLiteral(2, "2", lineLoc(6, 7)),
                        lineLoc(2, 7)
                    ), extra: { parenthesized: true }},
                    qt.IntegerLiteral(3, "3", lineLoc(9, 10)),
                    lineLoc(1, 10)
                ), extra: { parenthesized: true }},
                lineLoc(0, 11)
            )],
            [],
            lineLoc(0, 11)
        ));
    });

    it("Sequential", () => {
        const response = parse("((1+2)+(3+4))");
        expect(response).toEqual(qt.Program(
            [qt.ExpressionStatement(
                {...qt.BinaryExpression("+",
                    {...qt.BinaryExpression("+",
                        qt.IntegerLiteral(1, "1", lineLoc(2, 3)),
                        qt.IntegerLiteral(2, "2", lineLoc(4, 5)),
                        lineLoc(2, 5)
                    ), extra: { parenthesized: true }},
                    {...qt.BinaryExpression("+",
                        qt.IntegerLiteral(3, "3", lineLoc(8, 9)),
                        qt.IntegerLiteral(4, "4", lineLoc(10, 11)),
                        lineLoc(8, 11)
                    ), extra: { parenthesized: true }},
                    lineLoc(1, 12)
                ), extra: { parenthesized: true }},
                lineLoc(0, 13)
            )],
            [],
            lineLoc(0, 13)
        ));
    });

    it("Single, space", () => {
        const response = parse("( 1 )");
        expect(response).toEqual(qt.Program(
            [qt.ExpressionStatement({
                ...qt.IntegerLiteral(1, "1", lineLoc(2, 3)),
                extra: { parenthesized: true },
            }, lineLoc(0, 5))],
            [],
            lineLoc(0, 5)
        ));
    });

    it("Double", () => {
        const response = parse("(( 1 ))");
        expect(response).toEqual(qt.Program(
            [qt.ExpressionStatement({
                ...qt.IntegerLiteral(1, "1", lineLoc(3, 4)),
                extra: { parenthesized: true },
            }, lineLoc(0, 7))],
            [],
            lineLoc(0, 7)
        ));
    });

    it("Unary", () => {
        const response = parse("!(1)");
        expect(response).toEqual(qt.Program(
            [qt.ExpressionStatement(
                qt.UnaryExpression(
                    '!',
                    {...qt.IntegerLiteral(1, "1", lineLoc(2, 3)), extra: { parenthesized: true }},
                    true,
                    lineLoc(0, 4)
                ),
                lineLoc(0, 4)
            )],
            [],
            lineLoc(0, 4)
        ));
    });

    it("Unary, space", () => {
        const response = parse("!( 1 )");
        expect(response).toEqual(qt.Program(
            [qt.ExpressionStatement(
                qt.UnaryExpression(
                    '!',
                    {...qt.IntegerLiteral(1, "1", lineLoc(3, 4)), extra: { parenthesized: true }},
                    true,
                    lineLoc(0, 6)
                ),
                lineLoc(0, 6)
            )],
            [],
            lineLoc(0, 6)
        ));
    });

    it("Ternary", () => {
        const response = parse("( 1 < 2/3 ) ? 4 : 5");
        expect(response).toEqual(qt.Program(
            [qt.ExpressionStatement(
                qt.ConditionalExpression(
                    {
                        ...qt.BinaryExpression(
                            "<",
                            qt.IntegerLiteral(1, "1", lineLoc(2, 3)),
                            qt.BinaryExpression(
                                "/",
                                qt.IntegerLiteral(2, "2", lineLoc(6, 7)),
                                qt.IntegerLiteral(3, "3", lineLoc(8, 9)),
                                lineLoc(6, 9)
                            ),
                            lineLoc(2, 9)
                        ),
                        extra: { parenthesized: true },
                    },
                    qt.IntegerLiteral(4, "4", lineLoc(14, 15)),
                    qt.IntegerLiteral(5, "5", lineLoc(18, 19)),
                    lineLoc(0, 19),
                )
            , lineLoc(0, 19))],
            [],
            lineLoc(0, 19)
        ));
    });

});
