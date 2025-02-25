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

describe("Unary", () => {
    it("Not", () => {
        const response = parse(" ! 1 ");
        // dump(response);
        expect(response).toEqual(qt.Program(
            [qt.ExpressionStatement(qt.UnaryExpression(
                '!',
                qt.IntegerLiteral(1, "1", lineLoc(3, 4)),
                true,
                lineLoc(1, 4)
            ))],
            [],
            lineLoc(0, 5)
        ));
    });

    it("BW Not", () => {
        const response = parse("~1");
        // dump(response);
        expect(response).toEqual(qt.Program(
            [qt.ExpressionStatement(qt.UnaryExpression(
                '~',
                qt.IntegerLiteral(1, "1", lineLoc(1, 2)),
                true,
                lineLoc(0, 2)
            ))],
            [],
            lineLoc(0, 2)
        ));
    });

    it("BW Not, other", () => {
        expect(() => parse("~1.1")).not.toThrow();
    });

    it("Typeof", () => {
        const response = parse("typeof 1");
        // dump(response);
        expect(response).toEqual(qt.Program(
            [qt.ExpressionStatement(qt.UnaryExpression(
                'typeof',
                qt.IntegerLiteral(1, "1", lineLoc(7, 8)),
                true,
                lineLoc(0, 8)
            ))],
            [],
            lineLoc(0, 8)
        ));
    });

    it("Resume", () => {
        const response = parse("resume 1");
        expect(response).toEqual(qt.Program(
            [qt.ExpressionStatement(qt.UnaryExpression(
                'resume',
                qt.IntegerLiteral(1, "1", lineLoc(7, 8)),
                true,
                lineLoc(0, 8)
            ))],
            [],
            lineLoc(0, 8)
        ));
    });

    it("Clone", () => {
        const response = parse("clone 1");
        expect(response).toEqual(qt.Program(
            [qt.ExpressionStatement(qt.UnaryExpression(
                'clone',
                qt.IntegerLiteral(1, "1", lineLoc(6, 7)),
                true,
                lineLoc(0, 7)
            ))],
            [],
            lineLoc(0, 7)
        ));
    });

    it("Neg, integer", () => {
        const response = parse("-1");
        // dump(response);
        expect(response).toEqual(qt.Program(
            [qt.ExpressionStatement(qt.UnaryExpression(
                '-',
                qt.IntegerLiteral(1, "1", lineLoc(1, 2)),
                true,
                lineLoc(0, 2)
            ))],
            [],
            lineLoc(0, 2)
        ));
    });

    it("Neg, float", () => {
        const response = parse("-1.1");
        expect(response).toEqual(qt.Program(
            [qt.ExpressionStatement(qt.UnaryExpression(
                '-',
                qt.FloatLiteral(1.1, "1.1", lineLoc(1, 4)),
                true,
                lineLoc(0, 4)
            ))],
            [],
            lineLoc(0, 4)
        ));
    });

    it("Neg, id", () => {
        const response = parse("-a");
        // dump(response);
        expect(response).toEqual(qt.Program(
            [qt.ExpressionStatement(qt.UnaryExpression(
                '-',
                qt.Identifier('a', lineLoc(1, 2)),
                true,
                lineLoc(0, 2)
            ))],
            [],
            lineLoc(0, 2)
        ));
    });

});
