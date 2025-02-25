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

describe("Conditional", () => {
    it("ConditionalExpression", () => {
        const response = parse("true ? a : b;");
        // dump(response);
        expect(response).toEqual(qt.Program(
            [qt.ExpressionStatement(qt.ConditionalExpression(
                qt.BooleanLiteral(true, lineLoc(0, 4)),
                qt.Identifier('a', lineLoc(7, 8)),
                qt.Identifier('b', lineLoc(11, 12)),
            ))],
            [],
            lineLoc(0, 13)
        ));
    });

    it("ConditionalExpression, unary", () => {
        expect(() => parse("-a ? -b : -c")).not.toThrow();
    });

});
