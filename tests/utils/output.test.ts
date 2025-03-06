import { SquirrelOutputChannel } from './../../src/utils/output';
import { describe, expect, it } from "@jest/globals";
import { OutputChannel, window } from 'vscode';
import constants from '../../src/constants';

let disposeCount = 0;
let clearCount = 0;
let appendCount = 0;

jest.spyOn(window, "createOutputChannel").mockImplementation((...args: any[]): OutputChannel => {
    return {
        dispose: () => { disposeCount++; },
        clear: () => { clearCount++; },
        appendLine: (n) => { appendCount++; },
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


jest.mock('../../src/utils/file.ts', () => ({
    ...jest.requireActual('../../src/utils/file.ts'),
    fileExists: (n) => { return true; },
}));


beforeEach(() => {
    disposeCount = 0;
    clearCount = 0;
    appendCount = 0;
    tailCallback = (content) => {};
})


describe("Output", () => {

    it("Creates", () => {
        expect(new SquirrelOutputChannel()).toBeTruthy();
    });

    it("Enables", async () => {
        const s = new SquirrelOutputChannel();
        s.enabled = true;
        expect(s.enabled).toBe(true);
    });

    it("Appends", async () => {
        const s = new SquirrelOutputChannel();
        s.enabled = true;
        await new Promise((r) => setTimeout(r, 0)); // wait a tick
        tailCallback("mock");
        expect(appendCount).toBe(1);
    });

    it("Clears", async () => {
        const s = new SquirrelOutputChannel();
        s.enabled = true;
        await new Promise((r) => setTimeout(r, 0)); // wait a tick
        expect(clearCount).toBe(1);

        tailCallback(undefined);
        expect(appendCount).toBe(0);
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

        s.enabled = true;
        await new Promise((r) => setTimeout(r, 0)); // wait a tick
        expect(disposeCount).toBe(0);
        expect(clearCount).toBe(1);

        s.enabled = false;
        await new Promise((r) => setTimeout(r, 0)); // wait a tick
        expect(disposeCount).toBe(1);
        expect(clearCount).toBe(1);
    });

});
