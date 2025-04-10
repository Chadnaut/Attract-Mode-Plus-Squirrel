import constants from "../../src/constants";
import { getBranchAtPos } from "../../src/utils/find";
import { resolveBinaryExpression } from "../../src/utils/binary";
import { parseExtra as parse, pos } from "../utils";

jest.replaceProperty(constants, "FE_LAYOUTS_PATH", "tests");
jest.mock('../../src/utils/config.ts', () => ({
    ...jest.requireActual('../../src/utils/config.ts'),
    getConfigValue: (configSection, defaultValue) => {
        switch (configSection) {
            case constants.ATTRACT_MODE_PATH:
                return "config";
            default:
                return false;
        }
    }
}));

describe("BinaryExpression", () => {
    it("id", () => {
        const program = parse('a');
        const exp = getBranchAtPos(program, pos(1));
        expect(resolveBinaryExpression(exp, __filename)).toBeUndefined();
    });

    it("self", () => {
        const program = parse('"a"');
        const exp = getBranchAtPos(program, pos(3));
        expect(resolveBinaryExpression(exp, __filename)).toEqual("a");
    });

    it("single", () => {
        const program = parse('"a" + "b"');
        const exp = getBranchAtPos(program, pos(9)).slice(0, -1);
        expect(resolveBinaryExpression(exp, __filename)).toEqual("ab");
    });

    it("multiple", () => {
        const program = parse('"a" + "b" + "c"');
        const exp = getBranchAtPos(program, pos(15)).slice(0, -1);
        expect(resolveBinaryExpression(exp, __filename)).toEqual("abc");
    });

    it("memberExpression, not fe", () => {
        const program = parse('local x = { y = "a" } x.y + "b" + "c"');
        const exp = getBranchAtPos(program, pos(37)).slice(0, -1);
        // expect(resolveBinaryExpression(exp, __filename)).toEqual("abc");
        expect(resolveBinaryExpression(exp, __filename)).toBeUndefined();
    });

    it("memberExpression, not identifier", () => {
        const program = parse('local x = { y = "a" } ["x"].y + "b" + "c"');
        const exp = getBranchAtPos(program, pos(41)).slice(0, -1);
        expect(resolveBinaryExpression(exp, __filename)).toBeUndefined();
    });

    it("memberExpression, fe", () => {
        const program = parse('fe <- { /** @external $script_dir */ script_dir = "" }; fe.script_dir + "c"');
        const exp = getBranchAtPos(program, pos(75)).slice(0, -1);
        expect(resolveBinaryExpression(exp, __filename)).toEqual(`${__dirname}\\c`);
    });

    it("memberExpression, fe invalid prop", () => {
        const program = parse('fe <- { script_dir = "" }; fe.script_dir + "c"');
        const exp = getBranchAtPos(program, pos(46)).slice(0, -1);
        expect(resolveBinaryExpression(exp, __filename)).toBeUndefined();
    });

    it("FeConfigDirectory", () => {
        const program = parse('/** @external $FeConfigDirectory */ FeConfigDirectory <- ""; FeConfigDirectory + "a"');
        const exp = getBranchAtPos(program, pos(84)).slice(0, -1);
        expect(resolveBinaryExpression(exp, __filename)).toEqual("config/a");
    });

    it("module_dir", () => {
        const program = parse('/** @external $module_dir */ module_dir <- ""; module_dir + "b"');
        const exp = getBranchAtPos(program, pos(63)).slice(0, -1);
        expect(resolveBinaryExpression(exp, __filename)).toEqual(`${__dirname}/b`);
    });

    it("script_dir", () => {
        const program = parse('/** @external $script_dir */ script_dir <- ""; script_dir + "c"');
        const exp = getBranchAtPos(program, pos(63)).slice(0, -1);
        expect(resolveBinaryExpression(exp, __filename)).toEqual(`${__dirname}\\c`);
    });

    it("minus", () => {
        const program = parse('"a" - "b"');
        const exp = getBranchAtPos(program, pos(9)).slice(0, -1);
        expect(resolveBinaryExpression(exp, __filename)).toEqual(undefined);
    });

    it("non-string left", () => {
        const program = parse('3 + "b"');
        const exp = getBranchAtPos(program, pos(7)).slice(0, -1);
        expect(resolveBinaryExpression(exp, __filename)).toEqual(undefined);
    });

    it("non-string right", () => {
        const program = parse('"a" + 3');
        const exp = getBranchAtPos(program, pos(7)).slice(0, -1);
        expect(resolveBinaryExpression(exp, __filename)).toEqual(undefined);
    });

    it("missing", () => {
        const program = parse('a');
        const exp = getBranchAtPos(program, pos(1)).slice(0, -1);
        expect(resolveBinaryExpression(exp, __filename)).toEqual(undefined);
    });

    it("undefined", () => {
        expect(resolveBinaryExpression([], null)).toEqual(undefined);
    });
});
