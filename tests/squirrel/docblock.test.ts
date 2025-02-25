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

describe("Docblock", () => {

    it("FunctionDeclaration", () => {
        const response = parse(" /** doc1 */ function foo() {}");
        expect(response.comments).toEqual([
            qt.CommentBlock(' doc1 ', true, lineLoc(1, 12))
        ]);
    });

    it("VariableDeclaration, local", () => {
        const response = parse(" /** doc1 */ local x = 1");
        expect(response.comments).toEqual([
            qt.CommentBlock(' doc1 ', true, lineLoc(1, 12))
        ]);
    });

    it("VariableDeclaration, const", () => {
        const response = parse(" /** doc1 */ const x = 1");
        expect(response.comments).toEqual([
            qt.CommentBlock(' doc1 ', true, lineLoc(1, 12))
        ]);
    });

    it("EnumDeclaration", () => {
        const response = parse(" /** doc1 */ enum x { y = 1 }");
        expect(response.comments).toEqual([
            qt.CommentBlock(' doc1 ', true, lineLoc(1, 12))
        ]);
    });

    it("EnumMember", () => {
        const response = parse("enum x { /** doc1 */ y = 1, /** doc2 */ z = 1 }");
        expect(response.comments).toEqual([
            qt.CommentBlock(' doc1 ', true, lineLoc(9, 20)),
            qt.CommentBlock(' doc2 ', true, lineLoc(28, 39))
        ]);
    });

    it("PropertyDefinition", () => {
        const response = parse("class x { /** doc1 */ y = 1 }");
        expect(response.comments).toEqual([
            qt.CommentBlock(' doc1 ', true, lineLoc(10, 21))
        ]);
    });

    it("MethodDefinition", () => {
        const response = parse("class x { /** doc1 */ function y() {} }");
        expect(response.comments).toEqual([
            qt.CommentBlock(' doc1 ', true, lineLoc(10, 21))
        ]);
    });

    it("ClassDeclaration", () => {
        const response = parse(" /** doc1 */ class x {}");
        expect(response.comments).toEqual([
            qt.CommentBlock(' doc1 ', true, lineLoc(1, 12))
        ]);
    });

    it("Class, Property, Method", () => {
        const response = parse(" /** doc1 */ class x { /** doc2 */ y = 1; /** doc3 */ function z() {} }");
        expect(response.comments).toEqual([
                qt.CommentBlock(' doc1 ', true, lineLoc(1, 12)),
                qt.CommentBlock(' doc2 ', true, lineLoc(23, 34)),
                qt.CommentBlock(' doc3 ', true, lineLoc(42, 53))
        ]);
    });

    it("Ignore invalid", () => {
        const response = parse(" class x /** doc1 */ { y = 1 }");
        expect(response.comments).toEqual([
            qt.CommentBlock(' doc1 ', true, lineLoc(9, 20))
        ]);
    });

});
