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

describe("This", () => {

    it("ThisExpression", () => {
        const response = parse("this");
        expect(response).toEqual(qt.Program(
            [qt.ExpressionStatement(qt.ThisExpression(lineLoc(0, 4)))],
            [],
            lineLoc(0, 4)
        ));
    });

    it("ThisExpression, Block", () => {
        const response = parse("{ this }");
        expect(response).toEqual(qt.Program(
            [qt.BlockStatement([
                qt.ExpressionStatement(qt.ThisExpression(lineLoc(2, 6)))
            ], lineLoc(0, 8))],
            [],
            lineLoc(0, 8)
        ));
    });

    it("BaseExpression", () => {
        const response = parse("base");
        expect(response).toEqual(qt.Program(
            [qt.ExpressionStatement(qt.Base(lineLoc(0, 4)))],
            [],
            lineLoc(0, 4)
        ));
    });

    it("BaseExpression, Block", () => {
        const response = parse("{ base }");
        expect(response).toEqual(qt.Program(
            [qt.BlockStatement([
                qt.ExpressionStatement(qt.Base(lineLoc(2, 6)))
            ], lineLoc(0, 8))],
            [],
            lineLoc(0, 8)
        ));
    });

});
