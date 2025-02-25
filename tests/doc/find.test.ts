import {
    beforeEach,
    describe,
    fdescribe,
    expect,
    it,
    fit,
} from "@jest/globals";
import { parseExtra as parse, pos, dump } from "../utils";
import { getCommentAtPosition, getCommentBlockAtPosition, getCommentDocBlock, getDocAttr, getNodeDoc, getNodeDocBlock, hasCommentDocBlock, setCommentDocBlock } from "../../src/doc/find";
import { getBranchAtPos } from "../../src/utils/find";
import { AST, SQTree as qt } from "../../src/ast";
import constants from "../../src/constants";
import { SymbolKind } from "vscode";
import { getNodeSymbol } from '../../src/utils/symbol';
import { DocBlock } from "../../src/doc/kind";

jest.replaceProperty(constants, "FE_MODULES_PATH", "mock");

describe("Doc Find", () => {

    it("getCommentAtPosition, invalid", () => {
        expect(getCommentAtPosition(null, null)).toBeUndefined();
    });

    it("getNodeDocBlock, undefined", () => {
        expect(getNodeDocBlock(undefined)).toBeUndefined();
    });

    it("hasCommentBlock", () => {
        expect(hasCommentDocBlock(undefined)).toBe(false);
        expect(getCommentDocBlock(undefined)).toBe(undefined);

        const n = <AST.CommentBlock>{};
        const b = <DocBlock>{};
        setCommentDocBlock(n, b);
        expect(getCommentDocBlock(n)).toBe(b);
    });

    // -------------------------------------------------------------------------

    it("getCommentBlockAtPosition works", () => {
        const program = parse("/** Doc */ function foo() {}");
        expect(getCommentBlockAtPosition(program, pos(0)).type).toBe("CommentBlock");
        expect(getCommentBlockAtPosition(program, pos(5)).type).toBe("CommentBlock");
        expect(getCommentBlockAtPosition(program, pos(10)).type).toBe("CommentBlock");
        expect(getCommentBlockAtPosition(program, pos(11))).toBeUndefined();
        expect(getCommentBlockAtPosition(program, pos(22))).toBeUndefined();
        expect(getCommentBlockAtPosition(undefined, undefined)).toBeUndefined();
    });

    // -------------------------------------------------------------------------

    it("docblock get", () => {
        const program = parse("/** @param {integer} foo Hello */ function foo() {}");
        const node = getBranchAtPos(program, pos(45));
        expect(getNodeDoc(node)).toHaveProperty("attributes");
        expect(getNodeDoc([program])).toBeUndefined();
    });

    it("docblock missing returns undefined", () => {
        const program = parse("/** @param {integer} foo Hello */ function foo() {} function bar() {}");
        const node = getBranchAtPos(program, pos(63));
        expect(getNodeDoc([])).toBeUndefined();
        expect(getNodeDoc(node)).toBeUndefined();
        expect(getNodeDoc([program])).toBeUndefined();
    });

    it("docblock with package applied to program", () => {
        const program = parse("/** @package */ function foo() {}");
        const node = getBranchAtPos(program, pos(27));
        expect(getNodeDoc(node)).toBeUndefined();
        expect(getNodeDoc([program])).toHaveProperty("attributes");
    });

    it("FunctionDeclaration docblock", () => {
        const program = parse("/** Doc */ function foo() {}");
        const node = getBranchAtPos(program, pos(21));
        const doc = getNodeDoc(node);
        expect(doc).toHaveProperty("attributes");
        expect(getDocAttr(doc, "description").documentation).toBe("Doc");
    });

    it("FunctionExpression docblock", () => {
        const program = parse("/** Doc */ local foo = function() {}");
        const node = getBranchAtPos(program, pos(19));
        const doc = getNodeDoc(node);
        expect(doc).toHaveProperty("attributes");
        expect(getDocAttr(doc, "description").documentation).toBe("Doc");
    });

    it("ClassDeclaration docblock", () => {
        const program = parse("/**\n * @lends x y\n * @-ignore\n */\nclass foo {}");
        const node = getBranchAtPos(program, qt.Position(5, 7, null));
        const doc = getNodeDoc(node);
        expect(doc).toHaveProperty("attributes");
        expect(getDocAttr(doc, "lends")).toBeTruthy();
    });

    it("ClassExpression docblock", () => {
        const program = parse("/** Doc */ local foo = class {}");
        const node = getBranchAtPos(program, pos(18));
        const doc = getNodeDoc(node);
        expect(doc).toHaveProperty("attributes");
        expect(getDocAttr(doc, "description").documentation).toBe("Doc");
    });

    it("VariableDeclaration docblock", () => {
        const program = parse("/** Doc */ local foo = 123");
        const node = getBranchAtPos(program, pos(18));
        const doc = getNodeDoc(node);
        expect(doc).toHaveProperty("attributes");
        expect(getDocAttr(doc, "description").documentation).toBe("Doc");
    });

    it("VariableDeclarator docblock", () => {
        const program = parse("local /** Doc */ foo = 123");
        const node = getBranchAtPos(program, pos(18));
        const doc = getNodeDoc(node);
        expect(doc).toHaveProperty("attributes");
        expect(getDocAttr(doc, "description").documentation).toBe("Doc");
    });

    it("Root docblock", () => {
        const program = parse("/** Doc */ root <- 123;");
        const node = getBranchAtPos(program, pos(13));
        const doc = getNodeDoc(node);
        expect(doc).toHaveProperty("attributes");
        expect(getDocAttr(doc, "description").documentation).toBe("Doc");
    });

    // -------------------------------------------------------------------------

    it("docblock get loop caught", () => {
        const program = parse("name");
        const n = getBranchAtPos(program, pos(2));
        expect(getNodeDoc(n, n)).toBeUndefined();
    });

    it("stores in program", () => {
        const p = parse("/** Doc1 */ /** Doc2 */");
        expect(p.comments.length).toBe(2);
    });

    // -------------------------------------------------------------------------

    it("type, local", () => {
        const program = parse("/** @type {IntegerLiteral} */ local foo = \"string\"")
        const node = getBranchAtPos(program, pos(38));
        expect(getDocAttr(getNodeDoc(node), "type")?.type).toBe("IntegerLiteral");
    });

    it("type, empty", () => {
        const program = parse("/** @type */ local foo = \"string\"")
        const node = getBranchAtPos(program, pos(20));
        expect(getDocAttr(getNodeDoc(node), "type")?.type).toBe("*");
    });

    it("class", () => {
        const program = parse("/** @class */ local foo = \"string\"")
        const node = getBranchAtPos(program, pos(21));
        expect(getNodeSymbol(node)?.kind).toBe(SymbolKind.Class);
    });

    it("method", () => {
        const program = parse("/** @method */ local foo = \"string\"")
        const node = getBranchAtPos(program, pos(22));
        expect(getNodeSymbol(node)?.kind).toBe(SymbolKind.Method);
    });
});
