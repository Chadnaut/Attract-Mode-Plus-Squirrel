import { getBranchAtPos } from './../../src/utils/find';
import { getHoverInfo, getHoverImage } from './../../src/utils/hover';
import { describe, expect, it } from "@jest/globals";
import { dump, parseExtra as parse, pos } from "../utils";
import * as path from "path";
import { forwardSlash } from '../../src/utils/file';

describe("Hover", () => {

    it("getHoverInfo", () => {
        const program = parse('function foo() {}');
        const hover = getHoverInfo(getBranchAtPos(program, pos(10)));
        expect(hover.contents['value']).toContain('foo');
    });

    it("getHoverInfo, meta call", () => {
        const program = parse('class foo { /** mock */ function _call(alpha) {} }; /** bar */ local f = foo(); f');
        const hover = getHoverInfo(getBranchAtPos(program, pos(81)));
        expect(hover.contents['value']).toContain('alpha');
        expect(hover.contents['value']).toContain('mock');
        expect(hover.contents['value']).toContain('bar');
    });

    it("getHoverInfo, meta call excludes class", () => {
        const program = parse('class foo { /** mock */ function _call(alpha) {} }; /** bar */ local f = foo(); f');
        const hover = getHoverInfo(getBranchAtPos(program, pos(8)));
        expect(hover.contents['value']).not.toContain('alpha');
        expect(hover.contents['value']).not.toContain('mock');
        expect(hover.contents['value']).not.toContain('bar');
    });

    it("getHoverInfo, undefined", () => {
        expect(getHoverInfo([])).toBeUndefined();
    });

    it("getHoverInfo, none", () => {
        const program = parse('function foo() {}');
        const hover = getHoverInfo(getBranchAtPos(program, pos(4)));
        expect(hover).toBeUndefined();
    });

    it("getHoverInfo, base", () => {
        const program = parse('class foo { constructor() { base }}');
        const hover = getHoverInfo(getBranchAtPos(program, pos(30)));
        expect(hover).not.toBeUndefined();
    });

    it("getHoverInfo, this", () => {
        const program = parse('class foo { constructor() { this }}');
        const hover = getHoverInfo(getBranchAtPos(program, pos(30)));
        expect(hover).not.toBeUndefined();
    });

    it("getHoverInfo, rest", () => {
        const program = parse('class foo { constructor(...) {}}');
        const hover = getHoverInfo(getBranchAtPos(program, pos(26)));
        expect(hover).not.toBeUndefined();
    });

    it("getHoverInfo, missing member", () => {
        const program = parse("missing.property");
        const hover = getHoverInfo(getBranchAtPos(program, pos(10)));
        expect(hover).not.toBeUndefined();
    });

    it("getHoverInfo, literal", () => {
        const program = parse('"string"');
        const hover = getHoverInfo(getBranchAtPos(program, pos(4)));
        expect(hover).toBeUndefined();
    });

    it("getHoverInfo, param doc", () => {
        const program = parse('/** @param {string} alpha here */ function foo(alpha) {};');
        const hover = getHoverInfo(getBranchAtPos(program, pos(49)));
        expect(hover.contents['value']).toContain('here');
        expect(hover.contents['value']).toContain('alpha');
    });

    it("getHoverInfo, param", () => {
        const program = parse('function foo(alpha) {};');
        const hover = getHoverInfo(getBranchAtPos(program, pos(15)));
        expect(hover.contents['value']).toContain('alpha');
    });

    it("getHoverInfo, param root", () => {
        const program = parse('foo <- function(alpha) {};');
        const hover = getHoverInfo(getBranchAtPos(program, pos(18)));
        expect(hover.contents['value']).toContain('alpha');
    });

    it("getHoverInfo, param inner", () => {
        const program = parse("/** @param {integer} a info */ local foo = function(a) { a };");
        const hover = getHoverInfo(getBranchAtPos(program, pos(58)));
        expect(hover.contents['value']).toContain('integer');
        expect(hover.contents['value']).toContain('info');
    });

    it("getHoverInfo, memberDef", () => {
        const program = parse('/** @lends */ class StringLiteral { /** here */ function tointeger() {}; } "string".tointeger()');
        const hover = getHoverInfo(getBranchAtPos(program, pos(88)));
        expect(hover.contents['value']).toContain('here');
    });

    it("getHoverInfo, docblock", () => {
        const program = parse('/** MyDoc */ function foo() {}');
        const hover = getHoverInfo(getBranchAtPos(program, pos(24)));
        expect(hover.contents['value']).toContain('foo');
        expect(hover.contents['value']).toContain('MyDoc');
    });

    it("getHoverImage", () => {
        const imagePath = forwardSlash(path.join(__dirname, '../samples/layout/simple_nut.png'));
        const program = parse(`"${imagePath}"`);
        const hover = getHoverImage(program, pos(6), __filename);
        expect(hover.contents['value']).toContain('<img');
    });

    it("getHoverImage, missing", () => {
        const program = parse('"bad.png"');
        const hover = getHoverImage(program, pos(1), __filename);
        expect(hover).toBeUndefined();
    });

    it("getHoverImage, not string", () => {
        const program = parse("123");
        const hover = getHoverImage(program, pos(1), __filename);
        expect(hover).toBeUndefined();
    });

    it("getHoverImage, none", () => {
        const program = parse("123");
        const hover = getHoverImage(program, pos(100), __filename);
        expect(hover).toBeUndefined();
    });

});
