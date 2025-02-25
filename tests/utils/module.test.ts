import { describe, expect, it } from "@jest/globals";
import * as path from "path";
import constants from "../../src/constants";
import { getModuleCompletions, getModuleInfo, parseSummary, parseUrl, parseVersion } from "../../src/utils/module";

jest.replaceProperty(constants, "FE_MODULES_PATH", "modules");
jest.replaceProperty(constants, "FE_LAYOUTS_PATH", "tests");
jest.replaceProperty(constants, "ASSETS_PATH", "assets");
jest.mock('../../src/utils/config.ts', () => ({
    ...jest.requireActual('../../src/utils/config.ts'),
    getConfigValue: () => path.join(__dirname, "../samples"),
}));

describe("Import", () => {

    it("parseVersion", () => {
        expect(parseVersion("v1.2.3")).toBe("1.2.3");
        expect(parseVersion("v1.23")).toBe("1.23");
        expect(parseVersion("version1.2.3")).toBe("1.2.3");
        expect(parseVersion("version1")).toBe("1.0");
        expect(parseVersion("version = 1")).toBe("1.0");
        expect(parseVersion("version <- 1")).toBe("1.0");
        expect(parseVersion("v1 v2 v3")).toBe("3.0");

        expect(parseVersion("")).toBeUndefined();
        expect(parseVersion("v < 1")).toBeUndefined();
        expect(parseVersion("license, version 1")).toBeUndefined();
        expect(parseVersion("with version 1")).toBeUndefined();
    });

    it("parseSummary", () => {
        expect(parseSummary("## Summary here")).toBe("Summary here");
        expect(parseSummary("// Summary here")).toBe("Summary here");
        expect(parseSummary("/* Summary here */")).toBe("Summary here");
        expect(parseSummary(`// "Summary" here`)).toBe(`"Summary" here`);

        expect(parseSummary("// Attract-Mode Frontend\n// Summary here")).toBe("Summary here");
        expect(parseSummary("/*\nSummary here\n*/")).toBe("Summary here");

        expect(parseSummary("/*######\n# Summary here\n######*/")).toBe("Summary here");
        expect(parseSummary("stuff\n\n\n/*\n    Summary here\n\n*/")).toBe("Summary here");
        expect(parseSummary("/*\n===\n\nAttract-Mode Frontend\r\nSummary here\n")).toBe("Summary here");

        expect(parseSummary("//\n// Summary here", 1)).toBeUndefined(); // after limit
        expect(parseSummary("// Summary")).toBeUndefined(); // no single words
        expect(parseSummary("// Attract-Mode Frontend Summary")).toBeUndefined(); // no keyword
        expect(parseSummary("")).toBeUndefined();
        expect(parseSummary("/* */\nSummary here")).toBeUndefined(); // outside comment
    });

    it("parseUrl", () => {
        expect(parseUrl("http://web.site")).toBe("http://web.site");
        expect(parseUrl("by Oomek")).toBe("https://github.com/oomek/attract-extra"); // special
        expect(parseUrl("http")).toBeUndefined();
        expect(parseUrl("bad")).toBeUndefined();
    });

    it("getModuleCompletions", () => {
        expect(getModuleCompletions().length).toBeGreaterThan(0);
    });

    it("getModuleInfo, invalid", () => {
        expect(getModuleInfo(null).title).toEqual("");
        expect(getModuleInfo(path.join(__dirname, "../samples/layout/simple_nut.png"))).toBeTruthy();
    });

    it("getModuleInfo, late doc", () => {
        const module = path.join(__dirname, "../samples/modules/latedoc.nut");
        const info = getModuleInfo(module);
        expect(info.title).toBe("Latedoc");
        expect(info.description).toBe("");
    });

    it("getModuleInfo, class", () => {
        const module = path.join(__dirname, "../samples/modules/class.nut");
        const info = getModuleInfo(module);
        expect(info.title).toBe("Class");
        expect(info.description).toBe("");
    });

    it("getModuleInfo, function", () => {
        const module = path.join(__dirname, "../samples/modules/func.nut");
        const info = getModuleInfo(module);
        expect(info.title).toBe("Func");
        expect(info.description).toBe("");
    });

    it("getModuleInfo, legacy", () => {
        const module = path.join(__dirname, "../samples/modules/legacy.nut");
        const info = getModuleInfo(module);
        expect(info.description).toBe("Legacy Module");
        expect(info.url).toBe("");
        expect(info.version).toBe("");
    });

    it("getModuleInfo, example", () => {
        const module = path.join(__dirname, "../samples/modules/example.nut");
        const info = getModuleInfo(module);
        expect(info.description).toBe(`Sample "module"`);
        expect(info.url).toBe("http://web.site");
        expect(info.version).toBe("1.2.3");
    });

    it("getModuleInfo, docblock empty", () => {
        const module = path.join(__dirname, "../samples/modules/empty.nut");
        const info = getModuleInfo(module);
        expect(info.description).toBe("");
        expect(info.url).toBe("");
        expect(info.version).toBe("");
    });

});
