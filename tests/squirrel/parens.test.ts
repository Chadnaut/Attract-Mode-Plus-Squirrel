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

describe("Parensthesis", () => {

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
