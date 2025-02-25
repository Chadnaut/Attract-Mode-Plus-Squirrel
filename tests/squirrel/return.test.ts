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

describe("Return", () => {

    it("ReturnStatement", () => {
        const response = parse(" return 1 ");
        // dump(response);
        expect(response).toEqual(qt.Program(
            [qt.ReturnStatement(
                qt.IntegerLiteral(1, "1", lineLoc(8, 9)),
                lineLoc(1, 9)
            )],
            [],
            lineLoc(0, 10)
        ));
    });

    it("ReturnStatement, empty", () => {
        const response = parse(" return ");
        // dump(response);
        expect(response).toEqual(qt.Program(
            [qt.ReturnStatement(
                null,
                lineLoc(1, 7)
            )],
            [],
            lineLoc(0, 8)
        ));
    });

    it("YieldExpression", () => {
        const response = parse(" yield 1 ");
        // dump(response);
        expect(response).toEqual(qt.Program(
            [qt.YieldExpression(
                qt.IntegerLiteral(1, "1", lineLoc(7, 8)),
                lineLoc(1, 8)
            )],
            [],
            lineLoc(0, 9)
        ));
    });

    it("YieldExpression, empty", () => {
        const response = parse(" yield ");
        expect(response).toEqual(qt.Program(
            [qt.YieldExpression(
                null,
                lineLoc(1, 6)
            )],
            [],
            lineLoc(0, 7)
        ));
    });

    it("BreakStatement, while", () => {
        const response = parse("while (a) { break }");
        // dump(response);
        expect(response).toEqual(qt.Program(
            [qt.WhileStatement(
                qt.Identifier('a', lineLoc(7, 8)),
                qt.BlockStatement([
                    qt.BreakStatement(lineLoc(12, 17))
                ], lineLoc(10, 19)),
                lineLoc(0, 19)
            )],
            [],
            lineLoc(0, 19)
        ));
    });

    it("BreakStatement, dowhile", () => {
        const response = parse("do { break } while (a)");
        expect(response).toEqual(qt.Program(
            [qt.DoWhileStatement(
                qt.BlockStatement([
                    qt.BreakStatement(lineLoc(5, 10))
                ], lineLoc(3, 12)),
                qt.Identifier('a', lineLoc(20, 21)),
                lineLoc(0, 22)
            )],
            [],
            lineLoc(0, 22)
        ));
    });

    it("BreakStatement, for", () => {
        const response = parse("for (;;) { break }");
        // dump(response);
        expect(response).toEqual(qt.Program(
            [qt.ForStatement(
                null,
                null,
                null,
                qt.BlockStatement([
                    qt.BreakStatement(lineLoc(11, 16))
                ], lineLoc(9, 18)),
                lineLoc(0, 18)
            )],
            [],
            lineLoc(0, 18)
        ));
    });

    it("BreakStatement, foreach", () => {
        const response = parse("foreach (x in y) { break }");
        // dump(response);
        expect(response).toEqual(qt.Program(
            [qt.ForInStatement(
                null,
                qt.Identifier('x', lineLoc(9, 10)),
                qt.Identifier('y', lineLoc(14, 15)),
                qt.BlockStatement([
                    qt.BreakStatement(lineLoc(19, 24))
                ], lineLoc(17, 26)),
                lineLoc(0, 26)
            )],
            [],
            lineLoc(0, 26)
        ));
    });

    it("BreakStatement, switch", () => {
        const response = parse("switch (a) { case 1: break }");
        // dump(response);
        expect(response).toEqual(qt.Program(
            [qt.SwitchStatement(
                qt.Identifier('a', lineLoc(8, 9)),
                [
                    qt.SwitchCase(
                        qt.IntegerLiteral(1, "1", lineLoc(18, 19)),
                        [qt.BreakStatement(lineLoc(21, 26))],
                        lineLoc(13, 26)
                    ),
                ],
                lineLoc(0, 28)
            )],
            [],
            lineLoc(0, 28)
        ));
    });

    it("ContinueStatement, while", () => {
        const response = parse("while (a) { continue }");
        expect(response).toEqual(qt.Program(
            [qt.WhileStatement(
                qt.Identifier('a', lineLoc(7, 8)),
                qt.BlockStatement([
                    qt.ContinueStatement(lineLoc(12, 20))
                ], lineLoc(10, 22)),
                lineLoc(0, 22)
            )],
            [],
            lineLoc(0, 22)
        ));
    });

    it("ContinueStatement, dowhile", () => {
        const response = parse("do { continue } while (a)");
        expect(response).toEqual(qt.Program(
            [qt.DoWhileStatement(
                qt.BlockStatement([
                    qt.ContinueStatement(lineLoc(5, 13))
                ], lineLoc(3, 15)),
                qt.Identifier('a', lineLoc(23, 24)),
                lineLoc(0, 25)
            )],
            [],
            lineLoc(0, 25)
        ));
    });

    it("ContinueStatement, for", () => {
        const response = parse("for (;;) { continue }");
        expect(response).toEqual(qt.Program(
            [qt.ForStatement(
                null,
                null,
                null,
                qt.BlockStatement([
                    qt.ContinueStatement(lineLoc(11, 19))
                ], lineLoc(9, 21)),
                lineLoc(0, 21)
            )],
            [],
            lineLoc(0, 21)
        ));
    });

    it("ContinueStatement, foreach", () => {
        const response = parse("foreach (x in y) { continue }");
        expect(response).toEqual(qt.Program(
            [qt.ForInStatement(
                null,
                qt.Identifier('x', lineLoc(9, 10)),
                qt.Identifier('y', lineLoc(14, 15)),
                qt.BlockStatement([
                    qt.ContinueStatement(lineLoc(19, 27))
                ], lineLoc(17, 29)),
                lineLoc(0, 29)
            )],
            [],
            lineLoc(0, 29)
        ));
    });

});
