import {
    beforeEach,
    describe,
    fdescribe,
    expect,
    it,
    fit,
} from "@jest/globals";
import { parseExtra as parse, pos, dump } from "../utils";
import { AST, SQTree as qt } from "../../src/ast";
import constants from "../../src/constants";
import { attachDoc, createDoc, updateNodeDoc } from "../../src/doc/create";
import { getNodeDeprecated } from '../../src/utils/deprecated';
import { getNodeToken } from '../../src/utils/token';
import { getNodeDoc, getNodeDocBlock } from "../../src/doc/find";

jest.replaceProperty(constants, "FE_MODULES_PATH", "mock");

describe("Doc Create", () => {

    it("docblock assigned to undefined does not throw", () => {
        const db = createDoc(qt.CommentBlock("", true));
        expect(() => { attachDoc([], db); }).not.toThrow();
    });

    it("docblock assign works", () => {
        const db = createDoc(qt.CommentBlock("", true));
        const n = qt.Identifier("name");
        attachDoc([undefined, n], db);
        expect(getNodeDocBlock(n)).toBe(db);
    });

    it("deprecated attr updates extra", () => {
        const db = createDoc(qt.CommentBlock("@deprecated", true));
        const n = qt.Identifier("name");
        attachDoc([undefined, n], db);
        expect(getNodeDeprecated([n])).toBe(true);
    });

    it("enum attr updates token", () => {
        const db = createDoc(qt.CommentBlock("@enum", true));
        const n = qt.Identifier("name");
        attachDoc([undefined, n], db);
        expect(getNodeToken(n)).toBe("enum");
    });

    it("updateNodeDoc works", () => {
        const program = parse("/** @param {integer} foo Hello */ function foo() {}");
        expect(updateNodeDoc(null)).toBe(null);
        expect(updateNodeDoc(program)).toBe(program);
    });


    it("docblock automatically added to program in module path", () => {
        const program = parse("function foo() {}");

        program.sourceName = "";
        updateNodeDoc(program);
        expect(getNodeDoc([program])).toBeUndefined();
    });

    it("docblock automatically added to program in module path, with attrs", () => {
        const program = parse("function foo() {}");

        program.sourceName = "mock/test"
        updateNodeDoc(program);
        expect(getNodeDoc([program])).toHaveProperty("attributes");
    });
});

