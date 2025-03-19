import {
    beforeEach,
    describe,
    fdescribe,
    expect,
    it,
    fit,
} from "@jest/globals";
import { parseForce as parse, lineLoc, dump, errors } from "../utils";
import { SQTree as qt } from "../../src/ast";

describe("Incomplete", () => {

    it("String, newline", () => {
        const response = parse("\"invalid\n\"valid\"");
        expect(errors().length).toBeGreaterThan(0);
        expect(response).toEqual(qt.Program(
            [
                {
                    ...qt.ExpressionStatement(
                        qt.StringLiteral("invalid\n", '"invalid\n"', qt.SourceLocation(qt.Position(1,0,0), qt.Position(2,1,10)))
                    ),
                    directive: "invalid\n"
                },
                qt.ExpressionStatement(
                    qt.Identifier("valid", qt.SourceLocation(qt.Position(2,1,10), qt.Position(2,6,15)))
                )
            ],
            [],
            qt.SourceLocation(qt.Position(1,0,0), qt.Position(2,8,17))
        ));
    });

    it("Block, missing closure", () => {
        const response = parse("{  ");
        expect(errors().length).toBeGreaterThan(0);
        expect(response).toEqual(qt.Program(
            [qt.BlockStatement([], lineLoc(0, 3))],
            [],
            lineLoc(0, 3)
        ));
    });

    it("MemberExpression, missing property", () => {
        const response = parse("obj.");
        expect(errors().length).toBeGreaterThan(0);
        expect(response).toEqual(qt.Program(
            [qt.ExpressionStatement(
                qt.MemberExpression(
                    qt.Identifier('obj', lineLoc(0, 3)),
                    qt.Identifier('', lineLoc(4, 4)),
                    false, false,
                    lineLoc(0, 4)
                )
            )],
            [],
            lineLoc(0, 4)
        ));
    });

    it("MemberExpression, block, missing property", () => {
        const response = parse("{obj.}");
        expect(errors().length).toBeGreaterThan(0);
        expect(response).toEqual(qt.Program(
            [qt.BlockStatement([qt.ExpressionStatement(
                qt.MemberExpression(
                    qt.Identifier('obj', lineLoc(1, 4)),
                    qt.Identifier('', lineLoc(5, 5)),
                    false, false,
                    lineLoc(1, 5)
                )
            )], lineLoc(0, 6))],
            [],
            lineLoc(0, 6)
        ));
    });

    it("CallExpression, missing bracket", () => {
        const response = parse("call(");
        expect(errors().length).toBeGreaterThan(0);
        expect(response).toEqual(qt.Program(
            [qt.ExpressionStatement(
                qt.CallExpression(
                    qt.Identifier('call', lineLoc(0, 4)),
                    [qt.Undefined(lineLoc(5, 5))], // <-- placeholder node
                    lineLoc(0, 5)
                )
            )],
            [],
            lineLoc(0, 5)
        ));
    });

    it("CallExpression, missing multiple params", () => {
        const response = parse("call(,1,)");
        expect(errors().length).toBeGreaterThan(0);
        expect(response).toEqual(qt.Program(
            [qt.ExpressionStatement(
                qt.CallExpression(
                    qt.Identifier('call', lineLoc(0, 4)),
                    [
                        qt.Undefined(lineLoc(5,5)),
                        qt.IntegerLiteral(1, "1", lineLoc(6,7)),
                        qt.Undefined(lineLoc(8,8)),
                    ],
                    lineLoc(0, 9)
                )
            )],
            [],
            lineLoc(0, 9)
        ));
    });

    it("CallExpression, missing param", () => {
        const response = parse("call(1,)");
        expect(errors().length).toBeGreaterThan(0);
        expect(response).toEqual(qt.Program(
            [qt.ExpressionStatement(
                qt.CallExpression(
                    qt.Identifier('call', lineLoc(0, 4)),
                    [
                        qt.IntegerLiteral(1, "1", lineLoc(5,6)),
                        qt.Undefined(lineLoc(7,7)),
                    ],
                    lineLoc(0, 8)
                )
            )],
            [],
            lineLoc(0, 8)
        ));
    });


    it("CallExpression, missing param space", () => {
        const response = parse("call(1,  )");
        expect(errors().length).toBeGreaterThan(0);
        expect(response).toEqual(qt.Program(
            [qt.ExpressionStatement(
                qt.CallExpression(
                    qt.Identifier('call', lineLoc(0, 4)),
                    [
                        qt.IntegerLiteral(1, "1", lineLoc(5,6)),
                        qt.Undefined(lineLoc(7,7)),
                    ],
                    lineLoc(0, 10)
                )
            )],
            [],
            lineLoc(0, 10)
        ));
    });

    it("CallExpression, arg missing member", () => {
        const response = parse("call(obj.)");
        expect(errors().length).toBeGreaterThan(0);
        expect(response).toEqual(qt.Program(
            [qt.ExpressionStatement(
                qt.CallExpression(
                    qt.Identifier('call', lineLoc(0, 4)),
                    [
                        qt.MemberExpression(
                            qt.Identifier('obj', lineLoc(5, 8)),
                            qt.Identifier('', lineLoc(9, 9)),
                            false, false,
                            lineLoc(5, 9)
                        )
                    ],
                    lineLoc(0, 10)
                )
            )],
            [],
            lineLoc(0, 10)
        ));
    });

    it("CallExpression, arg missing member, next call valid", () => {
        const response = parse('call(obj.) call(obj.a);');
        // dump(response);
        expect(errors().length).toBeGreaterThan(0);
        expect(response).toEqual(qt.Program(
            [qt.ExpressionStatement(
                qt.CallExpression(
                    qt.Identifier('call', lineLoc(0, 4)),
                    [
                        qt.MemberExpression(
                            qt.Identifier('obj', lineLoc(5, 8)),
                            qt.Identifier('', lineLoc(9, 9)),
                            false, false,
                            lineLoc(5, 9)
                        )
                    ],
                    lineLoc(0, 10)
                )
            ),
            qt.ExpressionStatement(
                qt.CallExpression(
                    qt.Identifier('call', lineLoc(11, 15)),
                    [
                        qt.MemberExpression(
                            qt.Identifier('obj', lineLoc(16, 19)),
                            qt.Identifier('a', lineLoc(20, 21)),
                            false, false,
                            lineLoc(16, 21)
                        )
                    ],
                    lineLoc(11, 22)
                )
            )],
            [],
            lineLoc(0, 23)
        ));
    });

    it("Function, invalid params", () => {
        const response = parse("function foo(...,x){}");
        expect(errors().length).toBeGreaterThan(0);
        expect(response).toEqual(qt.Program(
            [qt.FunctionDeclaration(
                qt.Identifier('foo', lineLoc(9, 12)),
                [
                    qt.RestElement(lineLoc(13, 16)),
                    qt.Identifier('x', lineLoc(17, 18)),
                ],
                qt.BlockStatement([], lineLoc(19, 21)),
                false,
                lineLoc(0, 21)
            )],
            [],
            lineLoc(0, 21)
        ));
    });

    it("Table, missing single value", () => {
        const response = parse("x={y=}");
        // dump(response);
        expect(errors().length).toBeGreaterThan(0);
        expect(response).toEqual(qt.Program(
            [qt.ExpressionStatement(qt.AssignmentExpression(
                "=",
                qt.Identifier('x', lineLoc(0, 1)),
                qt.ObjectExpression(
                    [
                        qt.Property(
                            "init",
                            qt.Identifier("y", lineLoc(3, 4)),
                            qt.Undefined(lineLoc(5, 5)),
                            false,
                            false,
                            lineLoc(3, 5)
                        )
                    ],
                    false,
                    lineLoc(2, 6)
                ),
            ))],
            [],
            lineLoc(0, 6)
        ));
    });

    it("Function without body", () => {
        const response = parse("function foo\ncall()\nfunction bar { call(); }\n");
        expect(response.body[0]["body"]).toBeNull();
    });

});
