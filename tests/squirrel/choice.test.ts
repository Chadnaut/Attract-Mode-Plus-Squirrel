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

describe("Choice", () => {

    it("If", () => {
        const response = parse(" if (1) { a } ");
        // dump(response);
        expect(response).toEqual(qt.Program(
            [qt.IfStatement(
                qt.IntegerLiteral(1, "1", lineLoc(5, 6)),
                qt.BlockStatement([
                    qt.ExpressionStatement(qt.Identifier('a', lineLoc(10, 11)))
                ], lineLoc(8, 13)),
                null,
                lineLoc(1, 13)
            )],
            [],
            lineLoc(0, 14)
        ));
    });

    it("If, braceless", () => {
        const response = parse(" if (1) a ");
        // dump(response);
        expect(response).toEqual(qt.Program(
            [qt.IfStatement(
                qt.IntegerLiteral(1, "1", lineLoc(5, 6)),
                qt.ExpressionStatement(qt.Identifier('a', lineLoc(8, 9))),
                null,
                lineLoc(1, 9)
            )],
            [],
            lineLoc(0, 10)
        ));
    });

    it("If Else", () => {
        const response = parse(" if (1) { a } else { b } ");
        // dump(response);
        expect(response).toEqual(qt.Program(
            [qt.IfStatement(
                qt.IntegerLiteral(1, "1", lineLoc(5, 6)),
                qt.BlockStatement([
                    qt.ExpressionStatement(qt.Identifier('a', lineLoc(10, 11)))
                ], lineLoc(8, 13)),
                qt.BlockStatement([
                    qt.ExpressionStatement(qt.Identifier('b', lineLoc(21, 22)))
                ], lineLoc(19, 24)),
                lineLoc(1, 24)
            )],
            [],
            lineLoc(0, 25)
        ));
    });

    it("If Else If", () => {
        const response = parse("if (1) { a } else if (2) { b }");
        // dump(response);
        expect(response).toEqual(qt.Program(
            [qt.IfStatement(
                qt.IntegerLiteral(1, "1", lineLoc(4, 5)),
                qt.BlockStatement([
                    qt.ExpressionStatement(qt.Identifier('a', lineLoc(9, 10)))
                ], lineLoc(7, 12)),
                qt.IfStatement(
                    qt.IntegerLiteral(2, "2", lineLoc(22, 23)),
                    qt.BlockStatement([
                        qt.ExpressionStatement(qt.Identifier('b', lineLoc(27, 28)))
                    ], lineLoc(25, 30)),
                    null,
                    lineLoc(18, 30)
                ),
                lineLoc(0, 30)
            )],
            [],
            lineLoc(0, 30)
        ));
    });

    it("Switch", () => {
        const response = parse(" switch (x) { case 1: a; case 2: b; } ");
        // dump(response);
        expect(response).toEqual(qt.Program(
            [qt.SwitchStatement(
                qt.Identifier('x', lineLoc(9, 10)),
                [
                    qt.SwitchCase(
                        qt.IntegerLiteral(1, "1", lineLoc(19, 20)),
                        [qt.ExpressionStatement(qt.Identifier('a', lineLoc(22, 23)))],
                        lineLoc(14, 23)
                    ),
                    qt.SwitchCase(
                        qt.IntegerLiteral(2, "2", lineLoc(30, 31)),
                        [qt.ExpressionStatement(qt.Identifier('b', lineLoc(33, 34)))],
                        lineLoc(25, 34)
                    ),
                ],
                lineLoc(1, 37)
            )],
            [],
            lineLoc(0, 38)
        ));
    });

    it("Switch Default", () => {
        const response = parse(" switch (x) { default: c; } ");
        // dump(response);
        expect(response).toEqual(qt.Program(
            [qt.SwitchStatement(
                qt.Identifier('x', lineLoc(9, 10)),
                [
                    qt.SwitchCase(
                        null,
                        [qt.ExpressionStatement(qt.Identifier('c', lineLoc(23, 24)))],
                        lineLoc(14, 24)
                    ),
                ],
                lineLoc(1, 27)
            )],
            [],
            lineLoc(0, 28)
        ));
    });

    it("Switch Case Local", () => {
        expect(() => parse("local x = 1; switch (1) { case x: }")).not.toThrow();
    });
});
