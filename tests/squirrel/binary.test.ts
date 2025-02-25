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

describe("BinaryExpression", () => {
    it("Add", () => {
        const response = parse("1 + 2");
        // dump(response);
        expect(response).toEqual(qt.Program(
            [qt.ExpressionStatement(qt.BinaryExpression(
                "+",
                qt.IntegerLiteral(1, "1", lineLoc(0, 1)),
                qt.IntegerLiteral(2, "2", lineLoc(4, 5)),
            ))],
            [],
            lineLoc(0, 5)
        ));
    });

    it("Subtract", () => {
        const response = parse("1 - 2");
        expect(response).toEqual(qt.Program(
            [qt.ExpressionStatement(qt.BinaryExpression(
                "-",
                qt.IntegerLiteral(1, "1", lineLoc(0, 1)),
                qt.IntegerLiteral(2, "2", lineLoc(4, 5)),
            ))],
            [],
            lineLoc(0, 5)
        ));
    });

    it("Multiply", () => {
        const response = parse("1 * 2");
        expect(response).toEqual(qt.Program(
            [qt.ExpressionStatement(qt.BinaryExpression(
                "*",
                qt.IntegerLiteral(1, "1", lineLoc(0, 1)),
                qt.IntegerLiteral(2, "2", lineLoc(4, 5)),
            ))],
            [],
            lineLoc(0, 5)
        ));
    });

    it("Divide", () => {
        const response = parse("1 / 2");
        expect(response).toEqual(qt.Program(
            [qt.ExpressionStatement(qt.BinaryExpression(
                "/",
                qt.IntegerLiteral(1, "1", lineLoc(0, 1)),
                qt.IntegerLiteral(2, "2", lineLoc(4, 5)),
            ))],
            [],
            lineLoc(0, 5)
        ));
    });

    it("Compound", () => {
        const response = parse("1 * 2 + 3 / 4");
        expect(response).toEqual(qt.Program(
            [qt.ExpressionStatement(qt.BinaryExpression(
                "+",
                qt.BinaryExpression(
                    "*",
                    qt.IntegerLiteral(1, "1", lineLoc(0, 1)),
                    qt.IntegerLiteral(2, "2", lineLoc(4, 5)),
                ),
                qt.BinaryExpression(
                    "/",
                    qt.IntegerLiteral(3, "3", lineLoc(8, 9)),
                    qt.IntegerLiteral(4, "4", lineLoc(12, 13)),
                ),
            ))],
            [],
            lineLoc(0, 13)
        ));
    });

    it("Parenthesized", () => {
        const response = parse(" (1 + 2) ");
        // dump(response);
        expect(response).toEqual(qt.Program(
            [qt.ExpressionStatement(
                {
                    ...qt.BinaryExpression(
                        "+",
                        qt.IntegerLiteral(1, "1", lineLoc(2, 3)),
                        qt.IntegerLiteral(2, "2", lineLoc(6, 7)),
                        lineLoc(2, 7) // does not count parenthesis
                    ),
                    extra: { parenthesized: true }
                },
                lineLoc(1, 8),
            )],
            [],
            lineLoc(0, 9)
        ));
    });

    it("Parenthesized, sub", () => {
        const response = parse("1 * (2 + 3)");
        // dump(response);
        expect(response).toEqual(qt.Program(
            [qt.ExpressionStatement(qt.BinaryExpression(
                "*",
                qt.IntegerLiteral(1, "1", lineLoc(0, 1)),
                {
                    ...qt.BinaryExpression(
                        "+",
                        qt.IntegerLiteral(2, "2", lineLoc(5, 6)),
                        qt.IntegerLiteral(3, "3", lineLoc(9, 10)),
                        lineLoc(5, 10)
                    ),
                    extra: { parenthesized: true }
                },
                lineLoc(0, 11)
            ))],
            [],
            lineLoc(0, 11)
        ));
    });
});
