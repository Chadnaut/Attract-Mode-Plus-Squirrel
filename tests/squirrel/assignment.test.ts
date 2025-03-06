import { describe, expect, it } from "@jest/globals";
import { parse, lineLoc, dump } from "../utils";
import { SQTree as qt } from "../../src/ast";

describe("Assignment", () => {

    it("Sequence", () => {
        const response = parse(" local x = (1,2,3); ");
        expect(response).toEqual(qt.Program(
            [qt.VariableDeclaration('local', [
                qt.VariableDeclarator(
                    qt.Identifier('x', lineLoc(7, 8)),
                    {...qt.SequenceExpression([
                        qt.IntegerLiteral(1, "1", lineLoc(12, 13)),
                        qt.IntegerLiteral(2, "2", lineLoc(14, 15)),
                        qt.IntegerLiteral(3, "3", lineLoc(16, 17)),
                    ], lineLoc(12, 17)), extra: { parenthesized: true } },
                    lineLoc(7, 18) // includes parens
                ),
            ], lineLoc(1, 18))], // does not include semi-colon
            [],
            lineLoc(0, 20)
        ));
    });

    it("Constant", () => {
        const response = parse(" const x = 1; ");
        // dump(response);
        expect(response).toEqual(qt.Program(
            [qt.VariableDeclaration('const', [
                qt.VariableDeclarator(
                    qt.Identifier('x', lineLoc(7, 8)),
                    qt.IntegerLiteral(1, "1", lineLoc(11, 12)),
                ),
            ], lineLoc(1, 12))], // does not include semi-colon
            [],
            lineLoc(0, 14)
        ));

        expect(() => parse(" const x = true; ")).not.toThrow();
        expect(() => parse(" const x = false; ")).not.toThrow();
        expect(() => parse(" const x = 1; ")).not.toThrow();
        expect(() => parse(" const x = -1; ")).not.toThrow();
        expect(() => parse(" const x = 1.0; ")).not.toThrow();
        expect(() => parse(" const x = -1.0; ")).not.toThrow();
        expect(() => parse(' const x = "string"; ')).not.toThrow();
        expect(() => parse(' const x = { y = 123 }; ')).toThrow();
    });

    it("Declaration", () => {
        const response = parse(" local x = 1; ");
        // dump(response);
        expect(response).toEqual(qt.Program(
            [qt.VariableDeclaration('local', [
                qt.VariableDeclarator(
                    qt.Identifier('x', lineLoc(7, 8)),
                    qt.IntegerLiteral(1, "1", lineLoc(11, 12)),
                ),
            ], lineLoc(1, 12))], // does not include semi-colon
            [],
            lineLoc(0, 14)
        ));
    });

    it("Declaration, comments", () => {
        const response = parse(" local /**/ x /**/ = /**/ 1; ");
        // dump(response);
        expect(response).toEqual(qt.Program(
            [qt.VariableDeclaration('local', [
                qt.VariableDeclarator(
                    qt.Identifier('x', lineLoc(12, 13)),
                    qt.IntegerLiteral(1, "1", lineLoc(26, 27)),
                ),
            ], lineLoc(1, 27))], // does not include semi-colon
            [
                qt.CommentBlock('', false, lineLoc(7, 11)),
                qt.CommentBlock('', false, lineLoc(14, 18)),
                qt.CommentBlock('', false, lineLoc(21, 25)),
            ],
            lineLoc(0, 29)
        ));
    });

    it("Declaration, null", () => {
        const response = parse(" local x; ");
        // dump(response);
        expect(response).toEqual(qt.Program(
            [qt.VariableDeclaration('local', [
                qt.VariableDeclarator(
                    qt.Identifier('x', lineLoc(7, 8))
                ),
            ], lineLoc(1, 8))],
            [],
            lineLoc(0, 10)
        ));
    });

    it("Declaration, multiple", () => {
        const response = parse(" local x = 1, y = 2 ");
        // dump(response);
        expect(response).toEqual(qt.Program(
            [qt.VariableDeclaration('local', [
                qt.VariableDeclarator(
                    qt.Identifier('x', lineLoc(7, 8)),
                    qt.IntegerLiteral(1, "1", lineLoc(11, 12)),
                ),
                qt.VariableDeclarator(
                    qt.Identifier('y', lineLoc(14, 15)),
                    qt.IntegerLiteral(2, "2", lineLoc(18, 19)),
                ),
            ], lineLoc(1, 19))],
            [],
            lineLoc(0, 20)
        ));
    });

    it("NewSlot", () => {
        const response = parse("x <- 1");
        // dump(response);
        expect(response).toEqual(qt.Program(
            [qt.ExpressionStatement(qt.AssignmentExpression(
                "<-",
                qt.Identifier('x', lineLoc(0, 1)),
                qt.IntegerLiteral(1, "1", lineLoc(5, 6)),
            ))],
            [],
            lineLoc(0, 6)
        ));
    });

    it("EQ", () => {
        const response = parse("x = 1");
        // dump(response);
        expect(response).toEqual(qt.Program(
            [qt.ExpressionStatement(qt.AssignmentExpression(
                "=",
                qt.Identifier('x', lineLoc(0, 1)),
                qt.IntegerLiteral(1, "1", lineLoc(4, 5)),
            ))],
            [],
            lineLoc(0, 5)
        ));
    });

    it("MINUSEQ", () => {
        const response = parse("x -= 1");
        // dump(response);
        expect(response).toEqual(qt.Program(
            [qt.ExpressionStatement(qt.AssignmentExpression(
                "-=",
                qt.Identifier('x', lineLoc(0, 1)),
                qt.IntegerLiteral(1, "1", lineLoc(5, 6)),
            ))],
            [],
            lineLoc(0, 6)
        ));
    });

    it("PLUSEQ", () => {
        const response = parse("x += 1");
        // dump(response);
        expect(response).toEqual(qt.Program(
            [qt.ExpressionStatement(qt.AssignmentExpression(
                "+=",
                qt.Identifier('x', lineLoc(0, 1)),
                qt.IntegerLiteral(1, "1", lineLoc(5, 6)),
            ))],
            [],
            lineLoc(0, 6)
        ));
    });

    it("MULEQ", () => {
        const response = parse("x *= 1");
        expect(response).toEqual(qt.Program(
            [qt.ExpressionStatement(qt.AssignmentExpression(
                "*=",
                qt.Identifier('x', lineLoc(0, 1)),
                qt.IntegerLiteral(1, "1", lineLoc(5, 6)),
            ))],
            [],
            lineLoc(0, 6)
        ));
    });

    it("DIVEQ", () => {
        const response = parse("x /= 1");
        expect(response).toEqual(qt.Program(
            [qt.ExpressionStatement(qt.AssignmentExpression(
                "/=",
                qt.Identifier('x', lineLoc(0, 1)),
                qt.IntegerLiteral(1, "1", lineLoc(5, 6)),
            ))],
            [],
            lineLoc(0, 6)
        ));
    });

    it("MODEQ", () => {
        const response = parse("x %= 1");
        expect(response).toEqual(qt.Program(
            [qt.ExpressionStatement(qt.AssignmentExpression(
                "%=",
                qt.Identifier('x', lineLoc(0, 1)),
                qt.IntegerLiteral(1, "1", lineLoc(5, 6)),
            ))],
            [],
            lineLoc(0, 6)
        ));
    });

    it("Local, EQ", () => {
        const response = parse("local x = 1; x += 1");
        // dump(response);
        expect(response).toEqual(qt.Program(
            [
                qt.VariableDeclaration('local', [
                    qt.VariableDeclarator(
                        qt.Identifier('x', lineLoc(6, 7)),
                        qt.IntegerLiteral(1, "1", lineLoc(10, 11)),
                    ),
                ], lineLoc(0, 11)),
                qt.ExpressionStatement(qt.AssignmentExpression(
                    "+=",
                    qt.Identifier('x', lineLoc(13, 14)),
                    qt.IntegerLiteral(1, "1", lineLoc(18, 19)),
                ))
            ],
            [],
            lineLoc(0, 19)
        ));
    });
});
