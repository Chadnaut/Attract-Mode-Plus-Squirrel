import { describe, expect, it } from "@jest/globals";
import { escapeArg, SquirrelLauncher } from '../../src/utils/launcher';
import * as path from "path";
import { SquirrelOutputChannel } from "../../src/utils/output";

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

let appendText = "";
let appendCount = 0;
const output = {
    append: (text) => { appendText += text; appendCount++; },
    appendLine: (text) => { appendText += text; appendCount++; },
    restartWatcher: () => {}
} as SquirrelOutputChannel;

beforeEach(() => {
    spawnKills = 0;
    appendText = "";
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

    it("Label Default", () => {
        const s = new SquirrelLauncher(output);
        s.enabled = true;
        s.path = __dirname;
        s.filename = path.basename(__filename);
        const text = "Invalid v1";
        onStdOut(text);
        expect(s.button.text).toContain("Attract-Mode");
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

    it("Launch Text", () => {
        const s = new SquirrelLauncher(output);
        s.enabled = true;
        s.filename = "mock";
        s.launchAM();
        expect(appendText).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}.\d{3}/);
        expect(appendCount).toBe(1);
    });

    it("Launch StdOut", () => {
        const s = new SquirrelLauncher(output);
        s.enabled = true;
        s.filename = "mock";
        s.launchAM();
        onStdOut("data");
        expect(appendText.toLowerCase()).toContain('data');
        expect(appendCount).toBe(2);
    });

    it("Launch StdErr", () => {
        const s = new SquirrelLauncher(output);
        s.enabled = true;
        s.filename = "mock";
        s.launchAM();
        onStdErr("steff");
        expect(appendText.toLowerCase()).toContain('error');
        expect(appendText.toLowerCase()).toContain('steff');
        expect(appendCount).toBe(2);
    });

    it("Launch Error Sig", () => {
        const s = new SquirrelLauncher(output);
        s.enabled = true;
        s.filename = "mock";
        s.launchAM();
        onError(1, "sig");
        expect(appendText.toLowerCase()).toContain('warning');
        expect(appendText.toLowerCase()).toContain('sig');
        expect(appendCount).toBe(2);
    });

    it("Launch Error Null", () => {
        const s = new SquirrelLauncher(output);
        s.enabled = true;
        s.filename = "mock";
        s.launchAM();
        onError(2, null);
        expect(appendText.toLowerCase()).toContain('warning');
        expect(appendCount).toBe(2);
    });

    it("Launch Close Sig", () => {
        const s = new SquirrelLauncher(output);
        s.enabled = true;
        s.filename = "mock";
        s.launchAM();
        onClose(3, 'sig');
        expect(appendText.toLowerCase()).toContain('closed');
        expect(appendText.toLowerCase()).toContain('sig');
        expect(appendCount).toBe(2);
    });

    it("Launch Close Null", () => {
        const s = new SquirrelLauncher(output);
        s.enabled = true;
        s.filename = "mock";
        s.launchAM();
        onClose(4, null);
        expect(appendText.toLowerCase()).toContain('closed');
        expect(appendCount).toBe(2);
    });
});
