import { describe, expect, it } from "@jest/globals";
import { ExtensionContext } from 'vscode';
import constants from '../../src/constants';

let confEnabled = true;

const getConfigValue = (name, def) => {
    switch (name) {
        case constants.COMPLETIONS_SHOW_SQUIRREL:
            return confEnabled;
        case constants.COMPLETIONS_SHOW_AM:
            return confEnabled;
        default:
            return def;
    }
};

jest.mock('../../src/utils/config.ts', () => ({
    // ...jest.requireActual('../../src/utils/config.ts'),
    onConfigChange: (name, cb) => {
        cb(getConfigValue(name, null))
    },
    getConfigValue,
}));

let info = null;

jest.spyOn(console, "info").mockImplementation((...args: any[]) => {
    info = args[0];
});

beforeEach(() => {
    confEnabled = true;
    info = null;
});

import { activate } from './../../src/extension';

describe("Extension", () => {

    it("Activates", () => {
        const context = {
            subscriptions: [],
            extension: { packageJSON: { id: "squirrel" }}
        } as ExtensionContext;
        confEnabled = true;
        expect(() => activate(context)).not.toThrow();
        expect(info).not.toBeNull();
    });

    it("Activates, disabled", () => {
        const context = {
            subscriptions: [],
            extension: { packageJSON: { id: "squirrel" }}
        } as ExtensionContext;
        confEnabled = false;
        expect(() => activate(context)).not.toThrow();
        expect(info).not.toBeNull();
    });

});
