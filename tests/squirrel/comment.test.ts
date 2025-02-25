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

describe("Comment", () => {

    it("Line", () => {
        const response = parse(" // comment");
        // dump(response);
        expect(response).toEqual(qt.Program(
            [],
            [qt.CommentLine(' comment', false, lineLoc(1, 11))],
            lineLoc(0, 11)
        ));
    });

    it("Line, Empty", () => {
        const response = parse(" //");
        // dump(response);
        expect(response).toEqual(qt.Program(
            [],
            [qt.CommentLine('', false, lineLoc(1, 3))],
            lineLoc(0, 3)
        ));
    });

    it("Line, Hash", () => {
        const response = parse("  # comment");
        // dump(response);
        expect(response).toEqual(qt.Program(
            [],
            [qt.CommentLine(' comment', true, lineLoc(2, 11))],
            lineLoc(0, 11)
        ));
    });

    it("Line, After", () => {
        const response = parse("x = 1 // comment");
        // dump(response);
        expect(response).toEqual(qt.Program(
            [qt.ExpressionStatement(
                qt.AssignmentExpression(
                    '=',
                    qt.Identifier('x', lineLoc(0, 1)),
                    qt.IntegerLiteral(1, "1", lineLoc(4, 5)),
                )
            )],
            [qt.CommentLine(' comment', false, lineLoc(6, 16))],
            lineLoc(0, 16)
        ));
    });

    it("Block", () => {
        const response = parse(" /* comment */");
        // dump(response);
        expect(response).toEqual(qt.Program(
            [],
            [qt.CommentBlock(' comment ', false, lineLoc(1, 14))],
            lineLoc(0, 14)
        ));
    });

    it("Block, Multiline", () => {
        const response = parse(" /* comment \n here */ ");
        expect(response).toEqual(qt.Program(
            [],
            [qt.CommentBlock(' comment \n here ', false, qt.SourceLocation(qt.Position(1,1,1), qt.Position(2,8,21)))],
            qt.SourceLocation(qt.Position(1,0,0), qt.Position(2,9,22))
        ));
    });

    it("Block, After", () => {
        const response = parse("x = 1 /* comment */");
        // dump(response);
        expect(response).toEqual(qt.Program(
            [qt.ExpressionStatement(
                qt.AssignmentExpression(
                    '=',
                    qt.Identifier('x', lineLoc(0, 1)),
                    qt.IntegerLiteral(1, "1", lineLoc(4, 5)),
                )
            )],
            [qt.CommentBlock(' comment ', false, lineLoc(6, 19))],
            lineLoc(0, 19)
        ));
    });

    it("Block, Middle", () => {
        const response = parse("x /* comment */ = 1");
        // dump(response);
        expect(response).toEqual(qt.Program(
            [qt.ExpressionStatement(
                qt.AssignmentExpression(
                    '=',
                    qt.Identifier('x', lineLoc(0, 1)),
                    qt.IntegerLiteral(1, "1", lineLoc(18, 19)),
                )
            )],
            [qt.CommentBlock(' comment ', false, lineLoc(2, 15))],
            lineLoc(0, 19)
        ));
    });


    it("Block, Newline", () => {
        const response = parse("123\n/* comment */   456  ");
        // dump(response);
        expect(response).toEqual(qt.Program(
            [
                qt.ExpressionStatement(
                qt.IntegerLiteral(123, "123", lineLoc(0, 3))
                ),
                qt.ExpressionStatement(
                    qt.IntegerLiteral(456, "456", qt.SourceLocation(qt.Position(2, 16, 20), qt.Position(2, 19, 23)))
                )
            ],
            [qt.CommentBlock(' comment ', false, qt.SourceLocation(qt.Position(2, 0, 4), qt.Position(2, 13, 17)))],
            qt.SourceLocation(qt.Position(1, 0, 0), qt.Position(2, 21, 25))
        ));
    });

});
