import { describe, expect, it } from "@jest/globals";
import { workspace } from "vscode";
import { getConfigParts, getConfigValue, setConfigValue, onConfigChange, configStore, getPrettierOptions } from "../../src/utils/config";


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
    });

    it("getPrettierOptions", () => {
        const options = getPrettierOptions();
        expect(options.parser).toBe("squirrel");
    });

});
