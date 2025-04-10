import { createNodeMaps } from '../../src/utils/map';
import { describe, expect, it } from "@jest/globals";
import { getImportModuleName, getNodeImportFilename, getNodeLink, getNutCompletions, isProgramGlobal, getRelativePath, getRelativeNutPath, getFileCompletions } from "../../src/utils/import";
import { AST, SQTree as qt } from "../../src/ast";
import constants from "../../src/constants";
import { parseExtra as parse, pos } from '../utils';
import { getBranchAtPos } from '../../src/utils/find';
import { forwardSlash } from '../../src/utils/file';
import * as path from "path";

jest.replaceProperty(constants, "FE_MODULES_PATH", "modules");
jest.replaceProperty(constants, "FE_LAYOUTS_PATH", "tests");
jest.replaceProperty(constants, "ASSETS_PATH", "assets");

let am_path = "";
jest.mock('../../src/utils/config.ts', () => ({
    ...jest.requireActual('../../src/utils/config.ts'),
    getConfigValue: (name) => {
        switch (name) {
            case constants.ATTRACT_MODE_ARTWORK:
                return "snap";
            case constants.ATTRACT_MODE_PATH:
                return am_path;
            default:
                return path.join(__dirname, "../samples")
        }
    }
}));

beforeEach(() => {
    am_path = path.join(__dirname, "../samples");
});

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
        expect(getNodeLink([qt.CallExpression(null), qt.StringLiteral("")])).toBeUndefined();
    });

    it("getNodeLink, call valid", () => {
        const filename = path.join(__dirname, "../samples/layout/layout.nut");
        const program = parse(`/** @param {string($file)} a */ function call(a) {}; call("${forwardSlash(filename)}")`);
        const n = getBranchAtPos(program, pos(60));
        expect(getNodeLink(n)).toBe(filename);
    });

    it("getNodeLink, string valid", () => {
        const filename = path.join(__dirname, "../samples/layout/layout.nut");
        const n = qt.StringLiteral(filename);
        const program = <AST.Program>{ sourceName: "root" };
        expect(getNodeLink([program, n])).toBe(filename);
    });

    it("getNodeLink, string invalid", () => {
        const n = qt.StringLiteral("");
        expect(getNodeLink([n])).toBeUndefined();
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

    it("getRelativePath", () => {
        const filename = path.join(__dirname, "../samples/layout/layout.nut");
        const sourceName = __filename;
        expect(getRelativePath("invalid", "invalid")).toBeUndefined();
        expect(getRelativePath("invalid", sourceName)).toBeUndefined();
        expect(getRelativePath(undefined, sourceName)).toBeUndefined();
        expect(getRelativePath("invalid", undefined)).toBeUndefined();
        expect(getRelativePath(undefined, undefined)).toBeUndefined();
        expect(getRelativePath(1.0 as unknown as string, undefined)).toBeUndefined();
        expect(getRelativePath(filename, sourceName)).toBe(filename);
        expect(getRelativePath(filename, "/layouts/x/")).toBe(filename);
        expect(getRelativePath(filename, "/plugins/x/")).toBe(filename);
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
        expect(getNodeImportFilename([call, (<AST.CallExpression>call).arguments[0]])).toBeUndefined();
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
        expect(getNodeImportFilename([call, (<AST.CallExpression>call).arguments[0]])).toBeUndefined();
    });

    it("getNodeImportFilename, $nut invalid arg", () => {
        const program = parse(`/** @param {string($nut)} a */ function add(a) {}; add(null)`, { sourcename: path.join(__dirname, "../samples/layout") });
        const n = getBranchAtPos(program, pos(53)).slice(0, -1);
        const b = [...n, (<AST.CallExpression>n.at(-1)).arguments[0]];
        expect(getNodeImportFilename(b)).toBeUndefined();
    });

    it("getNodeImportFilename, $nut", () => {
        const filename = path.join(__dirname, "../samples/layout/layout.nut");
        const program = parse(`/** @param {string($nut)} a */ function add(a) {}; add("${forwardSlash(filename)}")`, { sourcename: path.join(__dirname, "../samples/layout") });
        const n = getBranchAtPos(program, pos(53)).slice(0, -1);
        const b = [...n, (<AST.CallExpression>n.at(-1)).arguments[0]];
        expect(getNodeImportFilename(b)).toBe(filename);
    });

    it("getNodeImportFilename, $file, bad index", () => {
        const filename = path.join(__dirname, "../samples/layout/layout.nut");
        const program = parse(`/** @param {string($file)} a */ function add(a) {}; add("${forwardSlash(filename)}")`, { sourcename: path.join(__dirname, "../samples/layout") });
        const n = getBranchAtPos(program, pos(54)).slice(0, -1);
        const b = [...n, (<AST.CallExpression>n.at(-1)).arguments[1]]; // <-- invalid index
        expect(getNodeImportFilename(b)).toBeUndefined();
    });

    it("getNodeImportFilename, $file", () => {
        const filename = path.join(__dirname, "../samples/layout/layout.nut");
        const program = parse(`/** @param {string($file)} a */ function add(a) {}; add("${forwardSlash(filename)}")`, { sourcename: path.join(__dirname, "../samples/layout") });
        const n = getBranchAtPos(program, pos(54)).slice(0, -1);
        const b = [...n, (<AST.CallExpression>n.at(-1)).arguments[0]];
        expect(getNodeImportFilename(b)).toBe(filename);
    });

    it("getNodeImportFilename, $module, name", () => {
        const filename = path.join(__dirname, "../samples/modules/example.nut");
        const program = parse(`/** @param {string($module)} a */ function add(a) {}; add("example")`, { sourcename: path.join(__dirname, "../samples/layout") });
        const n = getBranchAtPos(program, pos(55)).slice(0, -1);
        const b = [...n, (<AST.CallExpression>n.at(-1)).arguments[0]];
        expect(getNodeImportFilename(b)).toBe(filename);
    });

    it("getNodeImportFilename, $module, nut", () => {
        const filename = path.join(__dirname, "../samples/modules/example.nut");
        const program = parse(`/** @param {string($module)} a */ function add(a) {}; add("example.nut")`, { sourcename: path.join(__dirname, "../samples/layout") });
        const n = getBranchAtPos(program, pos(55)).slice(0, -1);
        const b = [...n, (<AST.CallExpression>n.at(-1)).arguments[0]];
        expect(getNodeImportFilename(b)).toBe(filename);
    });

    it("getNodeImportFilename, $artwork ignored", () => {
        const program = parse(`/** @param {string($artwork)} a */ function add(a) {}; add("snap")`, { sourcename: path.join(__dirname, "../samples/layout") });
        const n = getBranchAtPos(program, pos(56)).slice(0, -1);
        const b = [...n, (<AST.CallExpression>n.at(-1)).arguments[0]];
        expect(getNodeImportFilename(b)).toBe(undefined);
    });

    it("getNodeImportFilename, $image", () => {
        const filename = path.join(__dirname, "../samples/layout/simple_nut.png");
        const program = parse(`/** @param {string($image)} a */ function add(a) {}; add("layout/simple_nut.png")`, { sourcename: path.join(__dirname, "../samples/layout") });
        const n = getBranchAtPos(program, pos(55)).slice(0, -1);
        const b = [...n, (<AST.CallExpression>n.at(-1)).arguments[0]];
        expect(getNodeImportFilename(b)).toBe(filename);
    });

    it("getNodeImportFilename, $image, ignore magic token", () => {
        const program = parse(`/** @param {string($image)} a */ function add(a) {}; add("layout/simple_[n].png")`, { sourcename: path.join(__dirname, "../samples/layout") });
        const n = getBranchAtPos(program, pos(55)).slice(0, -1);
        const b = [...n, (<AST.CallExpression>n.at(-1)).arguments[0]];
        expect(getNodeImportFilename(b)).toBeUndefined();
    });

    it("getNodeImportFilename, $audio mp4", () => {
        const filename = path.join(__dirname, "../samples/layout/simple_nut.mp4");
        const program = parse(`/** @param {string($audio)} a */ function add(a) {}; add("layout/simple_nut.mp4")`, { sourcename: path.join(__dirname, "../samples/layout") });
        const n = getBranchAtPos(program, pos(55)).slice(0, -1);
        const b = [...n, (<AST.CallExpression>n.at(-1)).arguments[0]];
        expect(getNodeImportFilename(b)).toBe(filename);
    });

    it("getNodeImportFilename, $audio wav", () => {
        const filename = path.join(__dirname, "../samples/layout/simple_nut.wav");
        const program = parse(`/** @param {string($audio)} a */ function add(a) {}; add("layout/simple_nut.wav")`, { sourcename: path.join(__dirname, "../samples/layout") });
        const n = getBranchAtPos(program, pos(55)).slice(0, -1);
        const b = [...n, (<AST.CallExpression>n.at(-1)).arguments[0]];
        expect(getNodeImportFilename(b)).toBe(filename);
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

    it("getFileCompletions", () => {
        const completions = getFileCompletions(__dirname);
        expect(completions.length).toBeGreaterThan(0);
    });

    it("getFileCompletions, no basepath", () => {
        am_path = "";
        const completions = getFileCompletions(__dirname);
        expect(completions).toHaveLength(0);
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
