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

describe("For", () => {

    it("ForStatement", () => {
        const response = parse(" for (local x=0; x<1; x++) { a } ");
        // dump(response);
        expect(response).toEqual(qt.Program(
            [qt.ForStatement(
                qt.VariableDeclaration(
                    'local',
                    [
                        qt.VariableDeclarator(
                            qt.Identifier('x', lineLoc(12, 13)),
                            qt.IntegerLiteral(0, "0", lineLoc(14, 15)),
                            lineLoc(12, 15)
                        ),
                    ],
                    lineLoc(6, 15)
                ),
                qt.BinaryExpression(
                    '<',
                    qt.Identifier('x', lineLoc(17, 18)),
                    qt.IntegerLiteral(1, "1", lineLoc(19, 20)),
                ),
                qt.UpdateExpression(
                    '++',
                    qt.Identifier('x', lineLoc(22, 23)),
                    false,
                    lineLoc(22, 25)
                ),
                qt.BlockStatement([
                    qt.ExpressionStatement(qt.Identifier('a', lineLoc(29, 30)))
                ], lineLoc(27, 32)),
                lineLoc(1, 32)
            )],
            [],
            lineLoc(0, 33)
        ));
    });

    it("ForStatement, null", () => {
        const response = parse(" for (;;) { a } ");
        // dump(response);
        expect(response).toEqual(qt.Program(
            [qt.ForStatement(
                null,
                null,
                null,
                qt.BlockStatement([
                    qt.ExpressionStatement(qt.Identifier('a', lineLoc(12, 13)))
                ], lineLoc(10, 15)),
                lineLoc(1, 15)
            )],
            [],
            lineLoc(0, 16)
        ));
    });

    it("ForStatement, braceless", () => {
        const response = parse(" for (;;) a ");
        // dump(response);
        expect(response).toEqual(qt.Program(
            [qt.ForStatement(
                null,
                null,
                null,
                qt.ExpressionStatement(qt.Identifier('a', lineLoc(10, 11))),
                lineLoc(1, 11)
            )],
            [],
            lineLoc(0, 12)
        ));
    });

    it("ForStatement, non-local init", () => {
        expect(() => parse("for (x; x<1; x++) {}")).not.toThrow();
    });

    it("ForInStatement", () => {
        const response = parse(" foreach (x in y) { a } ");
        // dump(response);
        expect(response).toEqual(qt.Program(
            [qt.ForInStatement(
                null,
                qt.Identifier('x', lineLoc(10, 11)),
                qt.Identifier('y', lineLoc(15, 16)),
                qt.BlockStatement([
                    qt.ExpressionStatement(qt.Identifier('a', lineLoc(20, 21)))
                ], lineLoc(18, 23)),
                lineLoc(1, 23)
            )],
            [],
            lineLoc(0, 24)
        ));
    });

    it("ForInStatement, index", () => {
        const response = parse(" foreach (i,x in y) { a } ");
        // dump(response);
        expect(response).toEqual(qt.Program(
            [qt.ForInStatement(
                qt.Identifier('i', lineLoc(10, 11)),
                qt.Identifier('x', lineLoc(12, 13)),
                qt.Identifier('y', lineLoc(17, 18)),
                qt.BlockStatement([
                    qt.ExpressionStatement(qt.Identifier('a', lineLoc(22, 23)))
                ], lineLoc(20, 25)),
                lineLoc(1, 25)
            )],
            [],
            lineLoc(0, 26)
        ));
    });
});
