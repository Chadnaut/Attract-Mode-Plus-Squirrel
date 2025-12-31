import { describe, expect, it } from "@jest/globals";
import { workspace, WorkspaceFolder } from "vscode";
import { getConfigParts, getConfigValue, setConfigValue, onConfigChange, configStore, getPrettierOptions, getWorkspaceConfig, resetWorkspaceConfig } from "../../src/utils/config";
import constants from "../../src/constants";
import * as path from "path";

let consoleErr = false;

beforeEach(() => {
    consoleErr = false;
    console.error = () => { consoleErr = true; };
});

describe("Config", () => {

    it("getConfigParts", () => {
        expect(getConfigParts("a")).toEqual(["", "a"]);
        expect(getConfigParts("a.b")).toEqual(["a", "b"]);
        expect(getConfigParts("a.b.c")).toEqual(["a.b", "c"]);
    });

    it("getConfigValue", () => {
        expect(getConfigValue("config.value")).toBeUndefined();
        expect(getConfigValue("config.value", "value")).toBe("value");
    });

    it("setConfigValue", () => {
        expect(setConfigValue("config.value", true)).toBeUndefined();
        expect(setConfigValue("config.sub.value", true)).toBeUndefined();
    });

    it("onConfigChange", () => {
        let count = 0;

        let spyOnDidChangeConfiguration;
        const spy = jest.spyOn(workspace, "onDidChangeConfiguration");
        spy.mockImplementation((cb) => { spyOnDidChangeConfiguration = cb; return null; });

        onConfigChange("config.value", () => { count++; });
        expect(count).toBe(1);

        configStore["config.value"] = 2;
        spyOnDidChangeConfiguration({ affectsConfiguration: () => true });
        expect(count).toBe(2);

        // no change
        spyOnDidChangeConfiguration({ affectsConfiguration: () => true });
        expect(count).toBe(2);

        // no callback
        configStore["config.value"] = 3;
        spyOnDidChangeConfiguration({ affectsConfiguration: () => false });
        expect(count).toBe(2);
    });

    it("getPrettierOptions", () => {
        const options = getPrettierOptions();
        expect(options.parser).toBe("squirrel");
    });

    it("getWorkspaceConfig, no workspace", () => {
        resetWorkspaceConfig();
        expect(getWorkspaceConfig("config.value")).toBeUndefined();
    });

    it("getWorkspaceConfig, missing", () => {
        resetWorkspaceConfig();
        jest.spyOn(workspace, "workspaceFolders", "get").mockReturnValue([<WorkspaceFolder>{uri:{fsPath:""}}]);
        expect(getWorkspaceConfig("config.value")).toBeUndefined();
        expect(getWorkspaceConfig("config.value")).toBeUndefined(); // cache
    });

    it("getWorkspaceConfig, bad", () => {
        resetWorkspaceConfig();
        const dir = path.join(__dirname, "../samples");
        jest.spyOn(workspace, "workspaceFolders", "get").mockReturnValue([<WorkspaceFolder>{uri:{fsPath:dir}}]);
        const p = jest.replaceProperty(constants, "CONFIG_FILENAME", "SAMPLES.md");
        expect(getWorkspaceConfig("config.value")).toBeUndefined();
        expect(consoleErr).toBeTruthy();
        p.restore();
    });

    it("getWorkspaceConfig, no entry", () => {
        resetWorkspaceConfig();
        const dir = path.join(__dirname, "../samples/workspace");
        jest.spyOn(workspace, "workspaceFolders", "get").mockReturnValue([<WorkspaceFolder>{uri:{fsPath:dir}}]);
        expect(getWorkspaceConfig("config.invalid")).toBeUndefined();
    });

    it("getWorkspaceConfig, valid", () => {
        resetWorkspaceConfig();
        const dir = path.join(__dirname, "../samples/workspace");
        jest.spyOn(workspace, "workspaceFolders", "get").mockReturnValue([<WorkspaceFolder>{uri:{fsPath:dir}}]);
        expect(getWorkspaceConfig("config.value")).toEqual(123);
        expect(getWorkspaceConfig("config.value")).toEqual(123); // cache
    });

    it("getWorkspaceConfig, subvalue", () => {
        resetWorkspaceConfig();
        const dir = path.join(__dirname, "../samples/workspace");
        jest.spyOn(workspace, "workspaceFolders", "get").mockReturnValue([<WorkspaceFolder>{uri:{fsPath:dir}}]);
        expect(getWorkspaceConfig("config.sub.value")).toEqual(456);
    });

});
