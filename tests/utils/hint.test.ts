import { getInlayHints, getNodeHints } from './../../src/utils/hint';
import { describe, expect, it } from "@jest/globals";
import { SQTree as qt } from "../../src/ast";
import { dump, errors, parseForceExtra as parse, pos, lineLoc } from "../utils";

describe("Hint", () => {

    it("getNodeHints, invalid", () => {
        expect(getNodeHints(undefined)).toBeUndefined();
    });

    it("getInlayHints", () => {
        const program = parse(`
        /**
         * @param a Alpha
         * @param b Beta
         */
        function foo(a, b) {}
        foo(1, 2);
        `);
        const indent = 8;
        const hints = getInlayHints([program], qt.SourceLocation(
            qt.Position(1, 0, 0),
            qt.Position(7, 100, 0),
        ));
        expect(hints).toHaveLength(2);
        expect(hints[0].label).toBe("a:");
        expect(hints[0].position.line).toBe(6);
        expect(hints[0].position.character).toBe(indent + 4);
        expect(hints[1].label).toBe("b:");
        expect(hints[1].position.line).toBe(6);
        expect(hints[1].position.character).toBe(indent + 7);
    });

    it("getInlayHints, without DocBlock", () => {
        const program = parse(`
        function foo(a, b, c) {}
        foo(1, 2, ); // no hint for param 3
        `);
        const indent = 8;
        const hints = getInlayHints([program], qt.SourceLocation(
            qt.Position(1, 0, 0),
            qt.Position(3, 100, 0),
        ));
        expect(hints).toHaveLength(2);
        expect(hints[0].label).toBe("a:");
        expect(hints[0].position.line).toBe(2);
        expect(hints[0].position.character).toBe(indent + 4);
        expect(hints[1].label).toBe("b:");
        expect(hints[1].position.line).toBe(2);
        expect(hints[1].position.character).toBe(indent + 7);
    });

    it("getInlayHints, with default values", () => {
        const program = parse(`
        /**
         * @param a Alpha
         * @param b Beta
         */
        function foo(a=3, b=4) {}
        foo(1, 2);
        `);
        const indent = 8;
        const hints = getInlayHints([program], qt.SourceLocation(
            qt.Position(1, 0, 0),
            qt.Position(7, 100, 0),
        ));
        expect(hints).toHaveLength(2);
        expect(hints[0].label).toBe("a:");
        expect(hints[0].position.line).toBe(6);
        expect(hints[0].position.character).toBe(indent + 4);
        expect(hints[1].label).toBe("b:");
        expect(hints[1].position.line).toBe(6);
        expect(hints[1].position.character).toBe(indent + 7);
    });

    it("getInlayHints, typeMember", () => {
        const program = parse(`
        /** @lends */ class StringLiteral { function len(value) {} }
        "string".len(123);
        `);
        const indent = 8;
        const hints = getInlayHints([program], qt.SourceLocation(
            qt.Position(1, 0, 0),
            qt.Position(3, 100, 0),
        ));
        expect(hints).toHaveLength(1);
        expect(hints[0].label).toBe("value:");
        expect(hints[0].position.line).toBe(2);
        expect(hints[0].position.character).toBe(indent + 13);
    });

    it("getInlayHints, incomplete", () => {
        const program = parse(`
        function foo(a, b) {}
        foo("1");
        foo("1, "2"); // invalid
        """) // invalid
        foo("2");
        `);
        const indent = 8;
        const hints = getInlayHints([program], qt.SourceLocation(
            qt.Position(1, 0, 0),
            qt.Position(6, 100, 0),
        ));
        expect(errors().length).toBeGreaterThanOrEqual(1);
        expect(hints).toHaveLength(4);
        expect(hints[0].label).toBe("a:");
        expect(hints[0].position.line).toBe(2);
        expect(hints[0].position.character).toBe(indent + 4);
        expect(hints[1].label).toBe("a:");
        expect(hints[1].position.line).toBe(3);
        expect(hints[1].position.character).toBe(indent + 4);
        expect(hints[2].label).toBe("b:");
        expect(hints[2].position.line).toBe(3);
        expect(hints[2].position.character).toBe(indent + 9);
        expect(hints[3].label).toBe("a:");
        expect(hints[3].position.line).toBe(5);
        expect(hints[3].position.character).toBe(indent + 4);
    });

    it("getInlayHints, no args", () => {
        const program = parse('function foo() {}; foo()');
        const hints = getInlayHints([program], lineLoc(0, 100));
        expect(hints).toHaveLength(0);
    });

    it("getInlayHints, no callee", () => {
        const program = parse('this.foo("1")');
        const hints = getInlayHints([program], lineLoc(0, 100));
        expect(hints).toHaveLength(0);
    });

    it("getInlayHints, no params", () => {
        const program = parse('function foo() {}; foo("1")');
        const hints = getInlayHints([program], lineLoc(0, 100));
        expect(hints).toHaveLength(0);
    });

    it("getInlayHints, repeat", () => {
        const program = parse('local foo = function(a) {}; foo(1)');
        const hints = getInlayHints([program], lineLoc(0, 100));
        expect(hints).toHaveLength(1);
        const hints2 = getInlayHints([program], lineLoc(0, 100));
        expect(hints2).toHaveLength(1);
    });

    it("getInlayHints, rest", () => {
        const program = parse('function foo(...) {}; foo("1")');
        const hints = getInlayHints([program], lineLoc(0, 100));
        expect(hints).toHaveLength(0);
    });

    it("getInlayHints, func exp", () => {
        const program = parse('local foo = function(a) {}; foo(1)');
        const hints = getInlayHints([program], lineLoc(0, 100));
        expect(hints).toHaveLength(1);
        expect(hints[0].label).toBe("a:");
        expect(hints[0].position.line).toBe(0);
        expect(hints[0].position.character).toBe(32);
    });

    it("getInlayHints, overloading", () => {
        const program = parse('function foo(c) {}; function foo(a,b) {}; foo(1,2); foo(3);');
        const hints = getInlayHints([program], lineLoc(0, 100));
        expect(hints).toHaveLength(3);
        expect(hints[0].label).toBe("a:");
        expect(hints[0].position.line).toBe(0);
        expect(hints[0].position.character).toBe(46);
        expect(hints[1].label).toBe("b:");
        expect(hints[1].position.line).toBe(0);
        expect(hints[1].position.character).toBe(48);
        expect(hints[2].label).toBe("c:");
        expect(hints[2].position.line).toBe(0);
        expect(hints[2].position.character).toBe(56);
    });

    it("getInlayHints, rest named", () => {
        const program = parse('/** @param ...here */ function foo(...) {}; foo("1")');
        const hints = getInlayHints([program], lineLoc(0, 100));
        expect(hints).toHaveLength(1);
        expect(hints[0].label).toBe("here:");
        expect(hints[0].position.line).toBe(0);
        expect(hints[0].position.character).toBe(48);
    });

    it("getInlayHints, rest named multiple", () => {
        const program = parse('/** @param ...here */ function foo(...) {}; foo("1","2")');
        const hints = getInlayHints([program], lineLoc(0, 100));
        expect(hints).toHaveLength(2);
        expect(hints[0].label).toBe("here:");
        expect(hints[0].position.line).toBe(0);
        expect(hints[0].position.character).toBe(48);
        expect(hints[1].label).toBe("here:");
        expect(hints[1].position.line).toBe(0);
        expect(hints[1].position.character).toBe(52);
    });

    it("getInlayHints, invalid", () => {
        expect(getInlayHints([undefined], undefined)).toHaveLength(0);
        expect(getInlayHints([qt.Identifier("name")], undefined)).toHaveLength(0);
    });

});
