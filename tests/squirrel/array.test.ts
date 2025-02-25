import {
    beforeEach,
    describe,
    fdescribe,
    expect,
    it,
    fit,
} from "@jest/globals";
import { parse, lineLoc } from "../utils";
import { SQTree as qt } from "../../src/ast";

describe("Array", () => {
    it("Array", () => {
        const response = parse(" [ 1 , 2 ] ");
        // dump(response);
        expect(response).toEqual(qt.Program(
            [qt.ExpressionStatement(qt.ArrayExpression([
                qt.IntegerLiteral(1, "1", lineLoc(3, 4)),
                qt.IntegerLiteral(2, "2", lineLoc(7, 8))
            ], lineLoc(1, 10)))],
            [],
            lineLoc(0, 11)
        ));
    });

    it("Empty", () => {
        const response = parse(" [ ] ");
        // dump(response);
        expect(response).toEqual(qt.Program(
            [qt.ExpressionStatement(qt.ArrayExpression([
            ], lineLoc(1, 4)))],
            [],
            lineLoc(0, 5)
        ));
    });

    it("Long", () => {
        const text = "[0,1,2,3,4,5,6,7,8,9,0,1,2,3,4,5,6,7,8,9,0,1,2,3,4,5,6,7,8,9,0,1,2,3,4,5,6,7,8,9,0,1,2,3,4,5,6,7,8,9,0,1,2,3,4,5,6,7,8,9,0,1,2,3,4,5,6,7,8,9,0,1,2,3,4,5,6,7,8,9,0,1,2,3,4,5,6,7,8,9,0,1,2,3,4,5,6,7,8,9,0,1,2,3,4,5,6,7,8,9,0,1,2,3,4,5,6,7,8,9,0,1,2,3,4,5,6,7,8,9,0,1,2,3,4,5,6,7,8,9,0,1,2,3,4,5,6,7,8,9,0,1,2,3,4,5,6,7,8,9,0,1,2,3,4,5,6,7,8,9,0,1,2,3,4,5,6,7,8,9,0,1,2,3,4,5,6,7,8,9,0,1,2,3,4,5,6,7,8,9,0,1,2,3,4,5,6,7,8,9,0,1,2,3,4,5,6,7,8,9,0,1,2,3,4,5,6,7,8,9,0,1,2,3,4,5,6,7,8,9,0,1,2,3,4,5,6,7,8,9,0,1,2]";
        expect(() => parse(text)).not.toThrow();
    });

    it("Nested", () => {
        const response = parse("[1,[2,3]]");
        expect(response).toEqual(qt.Program(
            [qt.ExpressionStatement(qt.ArrayExpression([
                qt.IntegerLiteral(1, "1", lineLoc(1, 2)),
                qt.ArrayExpression([
                    qt.IntegerLiteral(2, "2", lineLoc(4, 5)),
                    qt.IntegerLiteral(3, "3", lineLoc(6, 7))
                ], lineLoc(3, 8))
            ], lineLoc(0, 9)))],
            [],
            lineLoc(0, 9)
        ));
    });

});
