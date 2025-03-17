import { describe, expect, it } from "@jest/globals";
import { escapeArg, SquirrelLauncher } from '../../src/utils/launcher';
import * as path from "path";

let spawnKills = 0;
let spawnArgs = [];
let onStdErr = (data) => {};
let onStdOut = (data) => {};
let onError = (code, signal) => {};
let onClose = (code, signal) => {};

jest.mock('child_process', () => ({
    spawn: (filename, args, options) => {
        spawnArgs = args;
        return {
            stderr: {
                on: (event, cb) => { onStdErr = cb; },
            },
            stdout: {
                on: (event, cb) => { onStdOut = cb; },
            },
            on: (event, cb) => {
                if (event === "error") onError = cb;
                if (event === "close") onClose = cb;
            },
            kill: () => {
                spawnKills++;
                onClose(null, null);
            }
        }
    },
}));

let appendCount = 0;
const output = {
    append: (text) => { appendCount++; },
    restartWatcher: () => {}
};

beforeEach(() => {
    spawnKills = 0;
    appendCount = 0;
    spawnArgs = [];
    onStdErr = (data) => {};
    onStdOut = (data) => {};
    onError = (code, signal) => {};
    onClose = (code, signal) => {};
})

describe("Launcher", () => {

    it("Creates", () => {
        expect(new SquirrelLauncher(output)).toBeTruthy();
    });

    it("Disposes", () => {
        const s = new SquirrelLauncher(output);
        expect(() => { s.dispose(); }).not.toThrow();
    });

    it("EscapeArg", () => {
        expect(escapeArg("arg")).toBe("arg");
        expect(escapeArg("ar\"g")).toBe("ar\"\"g");
    });

    it("Label", () => {
        const s = new SquirrelLauncher(output);
        s.enabled = true;
        s.path = __dirname;
        s.filename = path.basename(__filename);
        const text = "Attract-Mode v1";
        onStdOut(text);
        expect(s.button.text).toContain(text);
    });

    it("Launch does not throw", () => {
        const s = new SquirrelLauncher(output);
        expect(() => s.launchAM()).not.toThrow();

        s.enabled = false;
        expect(() => s.launchAM()).not.toThrow();

        s.enabled = true;
        s.filename = "mock";
        expect(() => s.launchAM()).not.toThrow();
    });

    it("Launch Loglevel Silent", () => {
        const s = new SquirrelLauncher(output);
        s.enabled = true;
        s.filename = "mock";

        s.logOutput = "";
        s.launchAM();
        expect(spawnArgs.includes("silent")).toBe(true);
    });

    it("Launch Loglevel Info", () => {
        const s = new SquirrelLauncher(output);
        s.enabled = true;
        s.filename = "mock";

        s.logOutput = "console-info";
        s.launchAM();
        expect(spawnArgs.includes("info")).toBe(true);
    });

    it("Launch Loglevel Debug", () => {
        const s = new SquirrelLauncher(output);
        s.enabled = true;
        s.filename = "mock";
        s.logOutput = "console-debug";

        s.launchAM();
        expect(spawnArgs.includes("debug")).toBe(true);
    });

    it("Launch Kills", () => {
        const s = new SquirrelLauncher(output);
        s.enabled = true;
        s.filename = "mock";

        s.launchAM(); // launch
        s.launchAM(); // kill
        expect(spawnKills).toBe(1);

        s.launchAM(); // launch
        s.launchAM(); // kill
        expect(spawnKills).toBe(2);
    });

    it("Launch Config", () => {
        const s = new SquirrelLauncher(output);
        s.enabled = true;
        s.filename = "mock";
        s.config = "mock";
        s.launchAM();
        expect(spawnArgs.includes("--config")).toBe(true);
    });

    it("Launch Logfile", () => {
        const s = new SquirrelLauncher(output);
        s.enabled = true;
        s.filename = "mock";
        s.logOutput = "logfile-debug";
        s.launchAM();
        expect(spawnArgs.includes("--logfile")).toBe(true);
    });

    it("Launch Appends", () => {
        const s = new SquirrelLauncher(output);
        s.enabled = true;
        s.filename = "mock";
        s.launchAM();

        onStdErr("err");
        expect(appendCount).toBe(1);
        appendCount = 0;

        onStdOut("err");
        expect(appendCount).toBe(1);
        appendCount = 0;

        onError(0, "sig");
        expect(appendCount).toBe(1);
        appendCount = 0;

        onError(0, null);
        expect(appendCount).toBe(1);
        appendCount = 0;

        onClose(0, null);
        expect(appendCount).toBe(0);
    });
});
