import { SquirrelOutputChannel } from './../../src/utils/output';
import { describe, expect, it } from "@jest/globals";
import { OutputChannel, window } from 'vscode';
import constants from '../../src/constants';

let disposeCount = 0;
let clearCount = 0;
let appendCount = 0;
let showCount = 0;

jest.spyOn(window, "createOutputChannel").mockImplementation((...args: any[]): OutputChannel => {
    return {
        dispose: () => { disposeCount++; },
        clear: () => { clearCount++; },
        append: (n) => { appendCount++; },
        appendLine: (n) => { appendCount++; },
        show: (n) => { showCount++; },
    } as OutputChannel;
});

jest.replaceProperty(constants, "LOG_INTERVAL", 0);
jest.replaceProperty(constants, "LOG_FILENAME", "");
jest.mock('../../src/utils/config.ts', () => ({
    ...jest.requireActual('../../src/utils/config.ts'),
    getConfigValue: (name) => {
        switch (name) {
            case constants.ATTRACT_MODE_PATH:
                return "am";
        }
    },
}));

let tailCallback = (content) => {};
jest.mock('tail', () => ({
    Tail: class {
        on = (e, cb) => { tailCallback = cb; }
        unwatch = () => {}
    }
}));


let fileExists = true;
jest.mock('../../src/utils/file.ts', () => ({
    ...jest.requireActual('../../src/utils/file.ts'),
    fileExists: (n) => { return fileExists; },
}));


beforeEach(() => {
    fileExists = true;
    disposeCount = 0;
    clearCount = 0;
    appendCount = 0;
    showCount = 0;
    tailCallback = (content) => {};
})


describe("Output", () => {

    it("Creates", () => {
        expect(new SquirrelOutputChannel()).toBeTruthy();
    });

    it("Does not throw", () => {
        const s = new SquirrelOutputChannel();
        expect(() => { s.restartWatcher() }).not.toThrow();
        expect(() => { s.startWatcher() }).not.toThrow();
        expect(() => { s.clear() }).not.toThrow();
        expect(() => { s.append() }).not.toThrow();
        expect(() => { s.appendLine() }).not.toThrow();
        expect(() => { s.removeChannel() }).not.toThrow();
    });

    it("Enables", async () => {
        const s = new SquirrelOutputChannel();
        s.enabled = true;
        expect(s.enabled).toBe(true);
    });

    it("Not watching", async () => {
        const s = new SquirrelOutputChannel();
        s.enabled = true;
        await new Promise((r) => setTimeout(r, 0)); // wait a tick
        tailCallback("mock");
        expect(appendCount).toBe(0);
    });

    it("Invalid path", async () => {
        const s = new SquirrelOutputChannel();
        s.path = "am2";
        s.enabled = true;
        s.watch = true;
        await new Promise((r) => setTimeout(r, 0)); // wait a tick
        tailCallback("mock");
        expect(appendCount).toBe(1);
        expect(() => s.stopWatcher()).not.toThrow();
        expect(() => s.startWatcher()).not.toThrow();

        s.path = null;
        expect(() => s.stopWatcher()).not.toThrow();
        expect(() => s.startWatcher()).not.toThrow();
    });

    it("Already listening", async () => {
        const s = new SquirrelOutputChannel();
        s.path = "am";
        s.enabled = true;
        s.watch = true;
        await new Promise((r) => setTimeout(r, 0)); // wait a tick
        expect(() => s.startWatcher()).not.toThrow();
    });

    it("No file", async () => {
        const s = new SquirrelOutputChannel();
        fileExists = false;
        expect(() => s.startWatcher()).not.toThrow();
    });

    it("Append", async () => {
        const s = new SquirrelOutputChannel();
        s.path = "am";
        s.enabled = true;
        s.watch = true;
        await new Promise((r) => setTimeout(r, 0)); // wait a tick
        tailCallback("mock");
        expect(appendCount).toBe(1);
    });

    it("AppendLine", async () => {
        const s = new SquirrelOutputChannel();
        s.enabled = true;
        s.append("mock");
        expect(appendCount).toBe(1);
        expect(clearCount).toBe(0);
    });

    it("AppendLine Clears", async () => {
        const s = new SquirrelOutputChannel();
        s.enabled = true;
        s.append(undefined);
        expect(appendCount).toBe(0);
        expect(clearCount).toBe(1);
    });

    it("Shows", async () => {
        const s = new SquirrelOutputChannel();
        s.path = "am";
        s.watch = true;

        s.enabled = false;
        expect(showCount).toBe(0);
        s.enabled = true;
        expect(showCount).toBe(1);
    });

    it("Clears", async () => {
        const s = new SquirrelOutputChannel();
        s.path = "am";
        s.enabled = true;
        s.watch = true;

        await new Promise((r) => setTimeout(r, 0)); // wait a tick
        expect(clearCount).toBe(1); // clears on all watch value changes

        tailCallback(undefined);
        expect(clearCount).toBe(2);
    });

    it("Disposes", async () => {
        const s = new SquirrelOutputChannel();
        s.enabled = true;
        expect(disposeCount).toBe(0);
        s.dispose();
        expect(disposeCount).toBe(1);
    });

    it("Disables", async () => {
        const s = new SquirrelOutputChannel();

        s.path = "am";
        s.enabled = true;
        await new Promise((r) => setTimeout(r, 0)); // wait a tick
        expect(disposeCount).toBe(0);

        s.enabled = false;
        await new Promise((r) => setTimeout(r, 0)); // wait a tick
        expect(disposeCount).toBe(1);
    });

});
