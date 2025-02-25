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

describe("Literal", () => {

    it("IntegerLiteral", () => {
        const response = parse(" 1 ");
        expect(response).toEqual(qt.Program(
            [qt.ExpressionStatement(qt.IntegerLiteral(1, "1", lineLoc(1, 2)))],
            [],
            lineLoc(0, 3)
        ));
    });

    it("FloatLiteral", () => {
        const response = parse(" 1.1 ");
        expect(response).toEqual(qt.Program(
            [qt.ExpressionStatement(qt.FloatLiteral(1.1, '1.1', lineLoc(1, 4)))],
            [],
            lineLoc(0, 5)
        ));
    });

    it("FloatLiteral, raw", () => {
        const response = parse(" 1.0 ");
        expect(response).toEqual(qt.Program(
            [qt.ExpressionStatement(qt.FloatLiteral(1.0, '1.0', lineLoc(1, 4)))],
            [],
            lineLoc(0, 5)
        ));
        expect(response?.body[0]?.['expression'].raw).toBe('1.0');
    });

    it("StringLiteral", () => {
        const response = parse(' "1" ');
        expect(response).toEqual(qt.Program(
            [qt.Directive(qt.StringLiteral('1', '"1"', lineLoc(1, 4)))],
            [],
            lineLoc(0, 5)
        ));
    });

    it("StringLiteral Special", () => {
        const response = parse(' "ஃ" ');
        expect(response).toEqual(qt.Program(
            [qt.Directive(qt.StringLiteral('ஃ', '"ஃ"', lineLoc(1, 4)))],
            [],
            lineLoc(0, 5)
        ));
    });

    it("StringLiteral Verbatim", () => {
        const response = parse(' @"1" ');
        expect(response).toEqual(qt.Program(
            [qt.Directive(qt.StringLiteral('1', '@"1"', lineLoc(1, 5)))],
            [],
            lineLoc(0, 6)
        ));
    });

    it("BooleanLiteral True", () => {
        const response = parse(" true ");
        expect(response).toEqual(qt.Program(
            [qt.ExpressionStatement(qt.BooleanLiteral(true, lineLoc(1, 5)))],
            [],
            lineLoc(0, 6)
        ));
    });

    it("BooleanLiteral False", () => {
        const response = parse(" false ");
        expect(response).toEqual(qt.Program(
            [qt.ExpressionStatement(qt.BooleanLiteral(false, lineLoc(1, 6)))],
            [],
            lineLoc(0, 7)
        ));
    });

    it("NullLiteral", () => {
        const response = parse(" null ");
        expect(response).toEqual(qt.Program(
            [qt.ExpressionStatement(qt.NullLiteral(lineLoc(1, 5)))],
            [],
            lineLoc(0, 6)
        ));
    });

});
