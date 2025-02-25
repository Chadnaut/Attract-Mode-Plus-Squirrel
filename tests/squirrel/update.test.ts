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

describe("Update", () => {
    it("PrefixInc", () => {
        const response = parse(" ++x ");
        expect(response).toEqual(qt.Program(
            [qt.ExpressionStatement(qt.UpdateExpression(
                '++',
                qt.Identifier('x', lineLoc(3, 4)),
                true,
                lineLoc(1, 4)
            ))],
            [],
            lineLoc(0, 5)
        ));
    });

    it("PrefixDec", () => {
        const response = parse(" --x ");
        expect(response).toEqual(qt.Program(
            [qt.ExpressionStatement(qt.UpdateExpression(
                '--',
                qt.Identifier('x', lineLoc(3, 4)),
                true,
                lineLoc(1, 4)
            ))],
            [],
            lineLoc(0, 5)
        ));
    });

    it("SuffixInc", () => {
        const response = parse(" x++ ");
        expect(response).toEqual(qt.Program(
            [qt.ExpressionStatement(qt.UpdateExpression(
                '++',
                qt.Identifier('x', lineLoc(1, 2)),
                false,
                lineLoc(1, 4)
            ))],
            [],
            lineLoc(0, 5)
        ));
    });

    it("SuffixDec", () => {
        const response = parse(" x-- ");
        expect(response).toEqual(qt.Program(
            [qt.ExpressionStatement(qt.UpdateExpression(
                '--',
                qt.Identifier('x', lineLoc(1, 2)),
                false,
                lineLoc(1, 4)
            ))],
            [],
            lineLoc(0, 5)
        ));
    });

    it("Update Param, math", () => {
        expect(() => parse("1 + --t;")).not.toThrow();
    });

    it("Update Param, prefix, math2", () => {
        expect(() => parse("-1 + --t;")).not.toThrow();
    });

    it("Update Param, suffix, math2", () => {
        expect(() => parse("-1 + t--;")).not.toThrow();
    });

    it("SuffixInc, precidence", () => {
        const response = parse("x+++y");
        expect(response?.body[0]['expression'].left.type).toBe('UpdateExpression');
    });

    it("SuffixDec, precidence", () => {
        const response = parse("x---y");
        expect(response?.body[0]['expression'].left.type).toBe('UpdateExpression');
    });
});
