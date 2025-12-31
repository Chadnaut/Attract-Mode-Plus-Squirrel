import { SquirrelLiveReload } from './../../src/utils/reload';
import { describe, expect, it } from "@jest/globals";
import { window, workspace } from 'vscode';
import { MockTextDocument } from '../utils';
import constants from '../../src/constants';
import * as path from "path";

let disposeCount = 0;
let didSaveCallback;

jest.spyOn(workspace, "onDidSaveTextDocument").mockImplementation((cb): any => {
    didSaveCallback = cb;
    return { dispose: () => { disposeCount++; } };
});

jest.spyOn(window, "showWarningMessage").mockImplementation((...args: any[]): Promise<any> => {
    return new Promise((resolve) => { resolve(messageResolve) })
});

let setConfigName;
let setConfigValue;
let messageResolve = constants.LIVE_RELOAD_DISABLE;

jest.replaceProperty(constants, "LANGUAGE_ID", "squirrel");
jest.replaceProperty(constants, "ASSETS_PATH", "assets");
jest.replaceProperty(constants, "FE_PLUGINS_PATH", "plugins");
jest.replaceProperty(constants, "LIVE_RELOAD_PLUGIN", "reload");
jest.replaceProperty(constants, "LIVE_RELOAD_FILE", "reload.nut");
jest.replaceProperty(constants, "LIVE_RELOAD_LOG", "reload.log");
jest.mock('../../src/utils/config.ts', () => ({
    ...jest.requireActual('../../src/utils/config.ts'),
    getConfigValue: (name) => {
        switch (name) {
            case constants.ATTRACT_MODE_PATH:
                return "am";
        }
    },
    setConfigValue: (name, value) => {
        setConfigName = name;
        setConfigValue = value;
    }
}));

let writeCount = 0;
let makeCount = 0;
let copyCount = 0;
let copySuccess = true;
let fileExists = [];
let dirExists = [];
let readFile = [];

jest.mock('../../src/utils/file.ts', () => ({
    ...jest.requireActual('../../src/utils/file.ts'),
    writeFile: (n) => { writeCount++; },
    readFile: (n) => { return readFile.pop(); },
    copyFile: (n) => { if (copySuccess) copyCount++; return copySuccess; },
    makeDir: (n) => { makeCount++; },
    fileExists: (n) => { return fileExists.includes(n); },
    dirExists: (n) => { return dirExists.includes(n); },
}));


beforeEach(() => {
    setConfigName = null;
    setConfigValue = null;
    readFile = [];
    writeCount = 0;
    copyCount = 0;
    copySuccess = true;
    makeCount = 0;
    disposeCount = 0;
    fileExists = [];
    dirExists = ["am"];
    didSaveCallback = () => {};
    messageResolve = constants.LIVE_RELOAD_DISABLE;
})


describe("Reload", () => {

    it("Creates", () => {
        expect(new SquirrelLiveReload()).toBeTruthy();
    });

    it("Disposes", () => {
        const s = new SquirrelLiveReload();
        expect(disposeCount).toBe(0);
        s.dispose();
        expect(disposeCount).toBe(1);
    });

    it("Extensions", () => {
        const s = new SquirrelLiveReload();
        s.extensions = "a,b,c";
        expect(s).toBeTruthy();
    });

    it("Save, bad doc", () => {
        const s = new SquirrelLiveReload();
        didSaveCallback(null);
        expect(writeCount).toBe(0);
    });

    it("Save, disabled", () => {
        const s = new SquirrelLiveReload();
        s.enabled = false;
        didSaveCallback(new MockTextDocument("mock"));
        expect(writeCount).toBe(0);
    });

    it("Save, wrong language", () => {
        const s = new SquirrelLiveReload();
        didSaveCallback(new MockTextDocument("mock"));
        expect(writeCount).toBe(0);
    });

    it("Save, right language", () => {
        const s = new SquirrelLiveReload();
        const d = new MockTextDocument("mock");
        d.languageId = "squirrel";
        didSaveCallback(d);
        expect(writeCount).toBe(1);
    });

    it("No am path", async () => {
        dirExists = [];
        const s = new SquirrelLiveReload();
        s.enabled = true;
        await new Promise((r) => setTimeout(r, 0)); // wait a tick

        expect(setConfigName).toEqual(constants.LIVE_RELOAD_ENABLED);
        expect(setConfigValue).toEqual(false);
    });

    it("Install, yes", async () => {
        jest.spyOn(window, "showInformationMessage").mockImplementation((...args: any[]): Promise<any> => {
            return new Promise((resolve) => { resolve(constants.YES) })
        });

        fileExists = [];
        const s = new SquirrelLiveReload();
        s.enabled = true;
        await new Promise((r) => setTimeout(r, 0)); // wait a tick

        expect(makeCount).toEqual(1);
        expect(copyCount).toEqual(1);
    });

    it("Install, exists", async () => {
        jest.spyOn(window, "showInformationMessage").mockImplementation((...args: any[]): Promise<any> => {
            return new Promise((resolve) => { resolve(constants.YES) })
        });

        fileExists = [];
        const s = new SquirrelLiveReload();
        dirExists.push(s['getDstPath']());
        s.enabled = true;
        await new Promise((r) => setTimeout(r, 0)); // wait a tick

        expect(makeCount).toEqual(0);
        expect(copyCount).toEqual(1);
    });

    it("Install, no", async () => {
        jest.spyOn(window, "showInformationMessage").mockImplementation((...args: any[]): Promise<any> => {
            return new Promise((resolve) => { resolve(constants.LIVE_RELOAD_DISABLE) })
        });

        const s = new SquirrelLiveReload();
        s.enabled = true;
        await new Promise((r) => setTimeout(r, 0)); // wait a tick

        expect(makeCount).toEqual(0);
        expect(copyCount).toEqual(0);
        expect(setConfigName).toEqual(constants.LIVE_RELOAD_ENABLED);
        expect(setConfigValue).toEqual(false);
    });

    it("Install, abort", async () => {
        jest.spyOn(window, "showInformationMessage").mockImplementation((...args: any[]): Promise<any> => {
            return new Promise((resolve, reject) => { reject() })
        });

        const s = new SquirrelLiveReload();
        s.enabled = true;
        await new Promise((r) => setTimeout(r, 0)); // wait a tick

        expect(makeCount).toEqual(0);
        expect(copyCount).toEqual(0);
        expect(setConfigName).toEqual(constants.LIVE_RELOAD_ENABLED);
        expect(setConfigValue).toEqual(false);
    });

    it("Install, fail", async () => {
        jest.spyOn(window, "showInformationMessage").mockImplementation((...args: any[]): Promise<any> => {
            return new Promise((resolve) => { resolve(constants.YES) })
        });

        fileExists = [];
        copySuccess = false;
        const s = new SquirrelLiveReload();
        s.enabled = true;
        await new Promise((r) => setTimeout(r, 0)); // wait a tick

        expect(makeCount).toEqual(1);
        expect(copyCount).toEqual(0);
        expect(setConfigName).toEqual(constants.LIVE_RELOAD_ENABLED);
        expect(setConfigValue).toEqual(false);
    });

    it("Install, error", async () => {
        jest.spyOn(window, "showInformationMessage").mockImplementation((...args: any[]): Promise<any> => {
            return new Promise((resolve) => { resolve(constants.YES) })
        });

        messageResolve = null;
        fileExists = [];
        copySuccess = false;
        const s = new SquirrelLiveReload();
        s.enabled = true;
        await new Promise((r) => setTimeout(r, 0)); // wait a tick

        expect(makeCount).toEqual(1);
        expect(copyCount).toEqual(0);
        expect(setConfigName).toEqual(null);
        expect(setConfigValue).toEqual(null);
    });

    it("Update, package wrong", async () => {
        fileExists = [path.join("am", "plugins", "reload", "reload.nut")];
        readFile = ["@package a", "@package b"];

        const s = new SquirrelLiveReload();
        s.enabled = true;
        await new Promise((r) => setTimeout(r, 0)); // wait a tick

        expect(setConfigName).toEqual(constants.LIVE_RELOAD_ENABLED);
        expect(setConfigValue).toEqual(false);
    });

    it("Update, author wrong", async () => {
        fileExists = [path.join("am", "plugins", "reload", "reload.nut")];
        readFile = ["@author a", "@author b"];

        const s = new SquirrelLiveReload();
        s.enabled = true;
        await new Promise((r) => setTimeout(r, 0)); // wait a tick

        expect(setConfigName).toEqual(constants.LIVE_RELOAD_ENABLED);
        expect(setConfigValue).toEqual(false);
    });

    it("Update, same", async () => {
        fileExists = [path.join("am", "plugins", "reload", "reload.nut")];
        readFile = ["@package a\n@author a", "@package a\n@author a"];
        copySuccess = false;

        const s = new SquirrelLiveReload();
        s.enabled = true;
        await new Promise((r) => setTimeout(r, 0)); // wait a tick

        expect(copyCount).toEqual(0);
        expect(setConfigName).toEqual(null);
    });

    it("Update, copy fail", async () => {
        fileExists = [path.join("am", "plugins", "reload", "reload.nut")];
        readFile = ["@package a\n@author a\na", "@package a\n@author a\nb"];
        copySuccess = false;

        const s = new SquirrelLiveReload();
        s.enabled = true;
        await new Promise((r) => setTimeout(r, 0)); // wait a tick

        expect(copyCount).toEqual(0);
        expect(setConfigName).toEqual(constants.LIVE_RELOAD_ENABLED);
        expect(setConfigValue).toEqual(false);
    });

    it("Update, success", async () => {
        fileExists = [path.join("am", "plugins", "reload", "reload.nut")];
        readFile = ["@package a\n@author a\na", "@package a\n@author a\nb"];

        const s = new SquirrelLiveReload();
        s.enabled = true;
        await new Promise((r) => setTimeout(r, 0)); // wait a tick

        expect(copyCount).toEqual(1);
        expect(setConfigName).toEqual(null);
    });

});
