import { createNodeMaps } from '../../src/utils/map';
import { describe, expect, it } from "@jest/globals";
import { getImportModuleName, getNodeImportFilename, getNodeLink, getNutCompletions, isProgramGlobal, getRelativeFilename, getRelativeNutPath } from "../../src/utils/import";
import { AST, SQTree as qt } from "../../src/ast";
import constants from "../../src/constants";
import { parseExtra as parse, pos } from '../utils';
import { getBranchAtPos } from '../../src/utils/find';
import { forwardSlash } from '../../src/utils/file';
import * as path from "path";

jest.replaceProperty(constants, "FE_MODULES_PATH", "modules");
jest.replaceProperty(constants, "FE_LAYOUTS_PATH", "tests");
jest.replaceProperty(constants, "ASSETS_PATH", "assets");
jest.mock('../../src/utils/config.ts', () => ({
    ...jest.requireActual('../../src/utils/config.ts'),
    getConfigValue: () => path.join(__dirname, "../samples"),
}));

describe("Import", () => {

    it("isProgramGlobal", () => {
        expect(isProgramGlobal(null)).toBe(false);
        expect(isProgramGlobal(<AST.Program>{})).toBe(false);

        expect(isProgramGlobal(parse("local x = 123;"))).toBe(false);

        // using the global flag is not enough
        const program = parse("/** @global \n @package */ local x = 123;");
        expect(isProgramGlobal(program)).toBe(false);

        // it must be in the assets path
        const program2 = parse("/** @global \n @package */ local x = 123;", { sourcename: "assets/file.nut" });
        expect(isProgramGlobal(program2)).toBe(true);
    });

    it("getNodeLink, invalid", () => {
        expect(getNodeLink([])).toBeUndefined();
        expect(getNodeLink([qt.StringLiteral("")])).toBeUndefined();
    });

    it("getNodeLink, valid", () => {
        const filename = path.join(__dirname, "../samples/layout/layout.nut");
        const n = qt.StringLiteral(filename);
        const program = <AST.Program>{ sourceName: "root" };
        expect(getNodeLink([program, n])).toBe(filename);
    });

    it("getNodeLink, binary", () => {
        const left = path.join(__dirname, "../samples/layout/");
        const right = "layout.nut";
        const n = qt.BinaryExpression("+",
            qt.StringLiteral(left),
            qt.StringLiteral(right)
        );
        const program = <AST.Program>{ sourceName: "root" };
        expect(getNodeLink([program, n, n.right])).toBe(left + right);
    });

    it("getNodeLink, import", () => {
        const filename = path.join(__dirname, "../samples/layout/layout.nut");
        const program = parse(`fe.do_nut("${forwardSlash(filename)}")`)
        const n = getBranchAtPos(program, pos(13));
        expect(getNodeLink(n)).toBe(filename);
    });

    it("getRelativeFilename", () => {
        const filename = path.join(__dirname, "../samples/layout/layout.nut");
        const sourceName = __filename;
        expect(getRelativeFilename("invalid", "invalid")).toBeUndefined();
        expect(getRelativeFilename("invalid", sourceName)).toBeUndefined();
        expect(getRelativeFilename(undefined, sourceName)).toBeUndefined();
        expect(getRelativeFilename("invalid", undefined)).toBeUndefined();
        expect(getRelativeFilename(undefined, undefined)).toBeUndefined();
        expect(getRelativeFilename(1.0 as unknown as string, undefined)).toBeUndefined();
        expect(getRelativeFilename(filename, sourceName)).toBe(filename);
        expect(getRelativeFilename(filename, "/layouts/x/")).toBe(filename);
        expect(getRelativeFilename(filename, "/plugins/x/")).toBe(filename);
    });

    it("getNodeImportFilename, undefined", () => {
        expect(getNodeImportFilename([])).toBeUndefined();
    });

    it("getNodeImportFilename, invalid callee", () => {
        const filename = path.join(__dirname, "../samples/layout/layout.nut");
        const call = createNodeMaps(qt.CallExpression(
            null,
            [qt.StringLiteral(filename)]
        ));
        expect(getNodeImportFilename([call])).toBeUndefined();
    });

    it("getNodeImportFilename, fe invalid property", () => {
        const filename = path.join(__dirname, "../samples/layout/layout.nut");
        const call = createNodeMaps(qt.CallExpression(
            qt.MemberExpression(
                qt.Identifier("fe"),
                null
            ),
            [qt.StringLiteral(filename)]
        ));
        expect(getNodeImportFilename([call])).toBeUndefined();
    });

    it("getNodeImportFilename, fe.do_nut invalid arg", () => {
        const program = parse(`fe.do_nut(null)`);
        const n = getBranchAtPos(program, pos(4)).slice(0, -2);
        expect(getNodeImportFilename(n)).toBeUndefined();
    });

    it("getNodeImportFilename, fe.do_nut", () => {
        const filename = path.join(__dirname, "../samples/layout/layout.nut");
        const program = parse(`fe.do_nut("${forwardSlash(filename)}")`);
        const n = getBranchAtPos(program, pos(4)).slice(0, -2);
        expect(getNodeImportFilename(n)).toBe(filename);
    });

    it("getNodeImportFilename, fe.do_nut, bad index", () => {
        const filename = path.join(__dirname, "../samples/layout/layout.nut");
        const program = parse(`fe.do_nut("${forwardSlash(filename)}")`);
        const n = getBranchAtPos(program, pos(4)).slice(0, -2);
        expect(getNodeImportFilename(n, 1)).toBeUndefined();
    });

    it("getNodeImportFilename, dofile", () => {
        const filename = path.join(__dirname, "../samples/layout/layout.nut");
        const program = parse(`dofile("${forwardSlash(filename)}")`);
        const n = getBranchAtPos(program, pos(4)).slice(0, -1);
        expect(getNodeImportFilename(n)).toBe(filename);
    });

    it("getNodeImportFilename, fe.load_module, name", () => {
        const filename = path.join(__dirname, "../samples/modules/example.nut");
        const program = parse(`fe.load_module("example")`);
        const n = getBranchAtPos(program, pos(4)).slice(0, -2);
        expect(getNodeImportFilename(n)).toBe(filename);
    });

    it("getNodeImportFilename, fe.load_module, nut", () => {
        const filename = path.join(__dirname, "../samples/modules/example.nut");
        const program = parse(`fe.load_module("example.nut")`);
        const n = getBranchAtPos(program, pos(4)).slice(0, -2);
        expect(getNodeImportFilename(n)).toBe(filename);
    });

    it("getNodeImportFilename, fe.add_artwork ignored", () => {
        const program = parse(`fe.add_artwork("example")`);
        const n = getBranchAtPos(program, pos(4)).slice(0, -2);
        expect(getNodeImportFilename(n)).not.toBe("example");
        expect(getNodeImportFilename(n)).toBe(undefined);
    });

    it("getNodeImportFilename, fe.add_image", () => {
        const filename = path.join(__dirname, "../samples/layout/simple_nut.png");
        const program = parse(`fe.add_image("layout/simple_nut.png")`, { sourcename: path.join(__dirname, "../samples/layout/layout.nut") });
        const n = getBranchAtPos(program, pos(4)).slice(0, -2);
        expect(getNodeImportFilename(n)).toBe(filename);
    });

    it("getNodeImportFilename, fe.add_image, ignore magic token", () => {
        const program = parse(`fe.add_image("layout/simple_[token]_nut.png")`, { sourcename: path.join(__dirname, "../samples/layout/layout.nut") });
        const n = getBranchAtPos(program, pos(4)).slice(0, -2);
        expect(getNodeImportFilename(n)).toBeUndefined();
    });

    it("getNodeImportFilename, fe.add_music", () => {
        const filename = path.join(__dirname, "../samples/layout/simple_nut.mp4");
        const program = parse(`fe.add_music("layout/simple_nut.mp4")`, { sourcename: path.join(__dirname, "../samples/layout") });
        const n = getBranchAtPos(program, pos(4)).slice(0, -2);
        expect(getNodeImportFilename(n)).toBe(filename);
    });

    it("getNodeImportFilename, fe.add_sound", () => {
        const filename = path.join(__dirname, "../samples/layout/simple_nut.wav");
        const program = parse(`fe.add_sound("layout/simple_nut.wav")`, { sourcename: path.join(__dirname, "../samples/layout") });
        const n = getBranchAtPos(program, pos(4)).slice(0, -2);
        expect(getNodeImportFilename(n)).toBe(filename);
    });

    it("getImportModuleName", () => {
        const filename = path.join(__dirname, "../samples/modules/example.nut");
        const filename2 = path.join(__dirname, "../samples/modules/sub/module.nut");
        expect(getImportModuleName(undefined)).toBeUndefined();
        expect(getImportModuleName("name")).toBeUndefined();
        expect(getImportModuleName(path.join(__dirname, "../samples/modules"))).toBeUndefined();
        expect(getImportModuleName(filename)).toBe("example");
        expect(getImportModuleName(filename2)).toBe("sub");
    });

    it("getNutCompletions", () => {
        const filename = path.join(__dirname, "../samples/layout/layout.nut");
        const completions = getNutCompletions(filename);
        expect(completions.length).toBeGreaterThan(0);
        expect(completions).not.toContain("layout/layout.nut");
        expect(getNutCompletions(undefined)).toHaveLength(0);
    });

    it("Import loop handled", () => {
        expect(() => parse("fe.load_module(x)")).not.toThrow();
    });
});
