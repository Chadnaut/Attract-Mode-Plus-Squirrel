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

describe("Attribute", () => {

    it("Malformed attribute", () => {
        expect(() => { parse("class foo { </ x = 1 > x = 1; }"); }).toThrow();
    });

    it("ClassExpression", () => {
        const response = parse("local x = class </a=1/> {}");
        // dump(response);
        expect(response).toEqual(qt.Program(
            [qt.VariableDeclaration('local', [
                qt.VariableDeclarator(
                    qt.Identifier('x', lineLoc(6, 7)),
                    qt.ClassExpression(
                        qt.ClassBody([], lineLoc(24, 26)),
                        null,
                        qt.ObjectExpression([
                            qt.Property(
                                'init',
                                qt.Identifier('a', lineLoc(18, 19)),
                                qt.IntegerLiteral(1, "1", lineLoc(20, 21)),
                                false,
                                false,
                                lineLoc(18, 21)
                            )
                        ], true, lineLoc(16, 23)),
                        lineLoc(10, 26)
                    ),
                    lineLoc(6, 26)
                ),
            ], lineLoc(0, 26))],
            [],
            lineLoc(0, 26)
        ));
    });

    it("ClassExpression, Empty", () => {
        const response = parse("local x = class <//> {}");
        // dump(response);
        expect(response).toEqual(qt.Program(
            [qt.VariableDeclaration('local', [
                qt.VariableDeclarator(
                    qt.Identifier('x', lineLoc(6, 7)),
                    qt.ClassExpression(
                        qt.ClassBody([], lineLoc(21, 23)),
                        null,
                        qt.ObjectExpression([], true, lineLoc(16, 20)),
                        lineLoc(10, 23)
                    ),
                    lineLoc(6, 23)
                ),
            ], lineLoc(0, 23))],
            [],
            lineLoc(0, 23)
        ));
    });

    // att before prop also
    it("Class", () => {
        const response = parse(" class foo </a=1/> {} ");
        // dump(response);
        expect(response).toEqual(qt.Program(
            [qt.ClassDeclaration(
                qt.Identifier('foo', lineLoc(7, 10)),
                qt.ClassBody([], lineLoc(19, 21)),
                null,
                qt.ObjectExpression([
                    qt.Property(
                        'init',
                        qt.Identifier('a', lineLoc(13, 14)),
                        qt.IntegerLiteral(1, "1", lineLoc(15, 16)),
                        false,
                        false,
                        lineLoc(13, 16)
                    )
                ], true, lineLoc(11, 18)),
                lineLoc(1, 21)
            )],
            [],
            lineLoc(0, 22)
        ));
    });

    it("Property", () => {
        const response = parse(" class foo { </a=1/> x = 1; } ");
        // dump(response);
        expect(response).toEqual(qt.Program(
            [qt.ClassDeclaration(
                qt.Identifier('foo', lineLoc(7, 10)),
                qt.ClassBody([
                    qt.PropertyDefinition(
                        qt.Identifier('x', lineLoc(21, 22)),
                        qt.IntegerLiteral(1, "1", lineLoc(25, 26)),
                        false,
                        false,
                        qt.ObjectExpression([
                            qt.Property(
                                'init',
                                qt.Identifier('a', lineLoc(15, 16)),
                                qt.IntegerLiteral(1, "1", lineLoc(17, 18)),
                                false,
                                false,
                                lineLoc(15, 18)
                            )
                        ], true, lineLoc(13, 20)),
                        lineLoc(13, 26)
                    )
                ], lineLoc(11, 29)),
                null,
                null,
                lineLoc(1, 29)
            )],
            [],
            lineLoc(0, 30)
        ));
    });

    it("Method", () => {
        const response = parse(" class foo { </a=1/> function x() {} } ");
        // dump(response);
        expect(response).toEqual(qt.Program(
            [qt.ClassDeclaration(
                qt.Identifier('foo', lineLoc(7, 10)),
                qt.ClassBody([
                    qt.MethodDefinition(
                        "method",
                        qt.Identifier('x', lineLoc(30, 31)),
                        qt.FunctionExpression(
                            [],
                            qt.BlockStatement([], lineLoc(34, 36)),
                            lineLoc(31, 36)
                        ),
                        false,
                        qt.ObjectExpression([
                            qt.Property(
                                'init',
                                qt.Identifier('a', lineLoc(15, 16)),
                                qt.IntegerLiteral(1, "1", lineLoc(17, 18)),
                                false,
                                false,
                                lineLoc(15, 18)
                            )
                        ], true, lineLoc(13, 20)),
                        lineLoc(13, 36)
                    )
                ], lineLoc(11, 38)),
                null,
                null,
                lineLoc(1, 38)
            )],
            [],
            lineLoc(0, 39)
        ));
    });

});
