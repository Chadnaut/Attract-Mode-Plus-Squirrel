import { describe, expect, it } from "@jest/globals";
import { escapeArg, SquirrelLauncher } from '../../src/utils/launcher';
import * as path from "path";
import { SquirrelOutputChannel } from "../../src/utils/output";
import { MockTextDocument } from "../utils";
import { parseExtra as parse, dump, pos } from "../utils";
import { formatUserConfig, getFormatInfo, setFormatTarget } from "../../src/utils/format";
import { getBranchAtPos } from "../../src/utils/find";
import { Hover, TextDocument, window } from "vscode";

const visibleTextEditors = [];
jest.replaceProperty(window, "visibleTextEditors", visibleTextEditors);

beforeEach(() => {
    visibleTextEditors.length = 0;
});

function getInfo(text, index) {
    const program = parse(text);
    const b = getBranchAtPos(program, pos(index))
    const t = new MockTextDocument(text);
    const info = getFormatInfo(t, b);
    return info;
}

describe("Format", () => {

    it("getFormatInfo, empty", () => {
        expect(getInfo("", 0)).toBeUndefined();
    });

    it("getFormatInfo, wrong type", () => {
        expect(getInfo("123", 2)).toBeUndefined();
    });

    it("getFormatInfo, wrong name", () => {
        expect(getInfo("name", 2)).toBeUndefined();
    });

    it("getFormatInfo, wrong parent", () => {
        expect(getInfo("local x = { order = 123 }", 14)).toBeUndefined();
    });

    it("getFormatInfo, no class", () => {
        expect(getInfo("order", 2)).toBeUndefined();
    });

    it("getFormatInfo, not attr", () => {
        expect(getInfo("class UserConfig { order = 123 }", 21)).toBeUndefined();
    });

    it("getFormatInfo, valid", () => {
        expect(getInfo("class UserConfig { </ order=123 /> prop = 123 }", 24)).toBeInstanceOf(Hover);
    });

    // -------------------------------------------------------------------------

    it("formatUserConfig, no doc", () => {
        setFormatTarget();
        expect(() => formatUserConfig()).not.toThrow();
    });

    it("formatUserConfig, no branch", () => {
        const t = new MockTextDocument("");
        visibleTextEditors.push({ document: t })
        setFormatTarget(t);
        expect(() => formatUserConfig()).not.toThrow();
    });

    it("formatUserConfig, no doc", () => {
        setFormatTarget(null as TextDocument, []);
        expect(() => formatUserConfig()).not.toThrow();
    });

    it("formatUserConfig, valid", () => {
        let editCount = 0;
        const t = new MockTextDocument("");
        visibleTextEditors.push({ document: t, edit: () => { editCount++; } })
        setFormatTarget(t, []);
        formatUserConfig();
        expect(editCount).toBe(1);
    });

    it("formatUserConfig, works", () => {
        const text = "class UserConfig { </ order=123 /> prop = 123 }";
        const program = parse(text);
        const branch = getBranchAtPos(program, pos(10)).slice(0, -1);
        const t = new MockTextDocument(text);
        let replaceVal;
        const builder = { replace: (a, b) => { replaceVal = b; } }
        visibleTextEditors.push({ document: t, edit: (cb) => { cb(builder); } })
        setFormatTarget(t, branch);
        formatUserConfig();
        expect(replaceVal).toBe("0");
    });

});
