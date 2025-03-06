import { addBranchId } from './../../src/utils/identifier';
import { createNodeMaps } from '../../src/utils/map';
import { describe, expect, it } from "@jest/globals";
import { SQTree as qt } from "../../src/ast";
import { dump, parseExtra as parse, pos } from "../utils";
import { getNodeExtendedClasses, getSuperDef, getSuperDefs, isClassDef } from "../../src/utils/super";
import { getNodeAtPos, getBranchAtPos } from "../../src/utils/find";
import { getNodeVal } from '../../src/utils/definition';

describe("Super", () => {

    it("isClassDef", () => {
        const program = parse("class foo {} local bar = class {} local who");

        expect(isClassDef([])).toBe(false);

        expect(isClassDef(getBranchAtPos(program, pos(2)))).toBe(true); // keyword
        expect(isClassDef(getBranchAtPos(program, pos(7)))).toBe(false); // id
        expect(isClassDef(getBranchAtPos(program, pos(7)).slice(0, -1))).toBe(true); // classdef

        expect(isClassDef(getBranchAtPos(program, pos(27)))).toBe(false); // classexp
        expect(isClassDef(getBranchAtPos(program, pos(20)))).toBe(false); // id
        expect(isClassDef(getBranchAtPos(program, pos(20)).slice(0, -1))).toBe(true); // declarator

        expect(isClassDef(getBranchAtPos(program, pos(41)))).toBe(false);
        expect(isClassDef(getBranchAtPos(program, pos(41)).slice(0, -1))).toBe(false);
    });

    it("getSuperDef, invalid", () => {
        const program = parse("class foo extends bar {}");
        const n = getBranchAtPos(program, pos(7)).slice(0, -1);
        expect(getSuperDef(n)).toEqual([]);
        expect(getSuperDef([])).toEqual([]);
    });

    it("getSuperDef, def > def", () => {
        const program = parse("class foo {} class bar extends foo {}");
        const n = getBranchAtPos(program, pos(20)).slice(0, -1);
        expect(getSuperDef(n).at(-1).type).toBe("ClassDeclaration");
    });

    it("getSuperDef, def > exp", () => {
        const program = parse("local foo = class {} class bar extends foo {}");
        const n = getBranchAtPos(program, pos(28)).slice(0, -1);
        expect(getSuperDef(n).at(-1).type).toBe("VariableDeclarator");
    });

    it("getSuperDef, exp > def", () => {
        const program = parse("class foo {} local bar = class extends foo {}");
        const n = getBranchAtPos(program, pos(40)).slice(0, -1);
        expect(getSuperDef(n).at(-1).type).toBe("ClassDeclaration");
    });

    it("getSuperDef, exp > exp", () => {
        const program = parse("local foo = class {} local bar = class extends foo {}");
        const n = getBranchAtPos(program, pos(48)).slice(0, -1);
        expect(getSuperDef(n).at(-1).type).toBe("VariableDeclarator");
    });

    it("getSuperDefs, def", () => {
        const program = parse("class foo {} class bar extends foo {} class moo extends bar {}");
        const n = getBranchAtPos(program, pos(45)).slice(0, -1);
        const items = getSuperDefs(n);
        expect(items.length).toEqual(2);
        expect(addBranchId(items[0]).at(-1)["name"]).toEqual("bar");
        expect(addBranchId(items[1]).at(-1)["name"]).toEqual("foo");
    });

    it("getSuperDefs, exp", () => {
        const program = parse("local foo = class {} local bar = class extends foo {} local moo = class extends bar {}");
        const n = getBranchAtPos(program, pos(61)).slice(0, -1);
        const items = getSuperDefs(n);
        expect(items.length).toEqual(2);
        expect(addBranchId(items[0]).at(-1)["name"]).toEqual("bar");
        expect(addBranchId(items[1]).at(-1)["name"]).toEqual("foo");
    });

    it("getSuperDefs, mixed", () => {
        const program = parse("class foo {} local bar = class extends foo {} class moo extends bar {}");
        const n = getBranchAtPos(program, pos(53)).slice(0, -1);
        const items = getSuperDefs(n);
        expect(items.length).toEqual(2);
        expect(addBranchId(items[0]).at(-1)["name"]).toEqual("bar");
        expect(addBranchId(items[1]).at(-1)["name"]).toEqual("foo");
    });

    it("getNodeExtendedClasses, undefined", () => {
        expect(getNodeExtendedClasses([])).toHaveLength(0);
    });

    it("getNodeExtendedClasses, invalid", () => {
        const program = parse("local x = 123")
        const id = getBranchAtPos(program, pos(7));
        const group = getNodeExtendedClasses(id);
        expect(group.length).toEqual(1);
        expect(group[0]).toEqual(id);
    });

    it("getNodeExtendedClasses, deep", () => {
        const program = parse("class foo {} class bar extends foo {} class moo extends bar {}");
        const n = getBranchAtPos(program, pos(46)).slice(0, -1);
        const group = getNodeExtendedClasses(n);
        expect(group.length).toEqual(3);
        expect(addBranchId(group[0]).at(-1)["name"]).toEqual("moo");
        expect(addBranchId(group[1]).at(-1)["name"]).toEqual("bar");
        expect(addBranchId(group[2]).at(-1)["name"]).toEqual("foo");
    });

    it("getNodeExtendedClasses, incomplete", () => {
        const program = parse("class bar extends foo {} class moo extends bar {}");
        const n = getBranchAtPos(program, pos(46)).slice(0, -1);
        const group = getNodeExtendedClasses(n);
        expect(group.length).toEqual(2);
        expect(addBranchId(group[0]).at(-1)["name"]).toEqual("moo");
        expect(addBranchId(group[1]).at(-1)["name"]).toEqual("bar");
    });

    it("getNodeExtendedClasses, dec", () => {
        const program = parse("class foo {} class bar extends foo {}");
        const n = getBranchAtPos(program, pos(20)).slice(0, -1);
        const group = getNodeExtendedClasses(n);
        expect(group.length).toEqual(2);
        expect(addBranchId(group[0]).at(-1)["name"]).toEqual("bar");
        expect(addBranchId(group[1]).at(-1)["name"]).toEqual("foo");
    });

    it("getNodeExtendedClasses, exp", () => {
        const program = parse("local foo = class {} local bar = class extends foo {}");
        const n = getBranchAtPos(program, pos(28)).slice(0, -1);
        const group = getNodeExtendedClasses(n);
        expect(group.length).toEqual(2);
        expect(addBranchId(group[0]).at(-1)["name"]).toEqual("bar");
        expect(addBranchId(group[1]).at(-1)["name"]).toEqual("foo");
    });

});
