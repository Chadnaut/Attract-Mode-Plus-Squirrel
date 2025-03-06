const extensions = { all: [] };

import { SquirrelConflictCheck } from './../../src/utils/conflict';
import { describe, expect, it } from "@jest/globals";
import { Extension } from 'vscode';
import constants from '../../src/constants';

jest.mock('vscode', () => ({
    window: {
        showErrorMessage: () => {
            return new Promise((resolve) => { resolve(constants.CHECK_CONFLICTS_DISABLE) });
        },
    },
    extensions,
}));

let hasConfigSet = false;

jest.mock('../../src/utils/config', () => ({
    setConfigValue: () => { hasConfigSet = true; },
}));

beforeEach(() => {
    extensions.all = [];
    hasConfigSet = false;
});


describe("Conflict", () => {

    it("Creates", () => {
        expect(new SquirrelConflictCheck()).toBeTruthy();
    });

    it("No conflict, no exts", async() => {
        const c = new SquirrelConflictCheck();
        c.id = "squirrel";
        c.enabled = true;

        await new Promise((r) => setTimeout(r, 0));
        expect(hasConfigSet).toBe(false);
    });

    it("No Conflict, self", async() => {
        extensions.all = [
            <Extension<any>>{ id: 'squirrel', packageJSON: {} },
        ];

        const c = new SquirrelConflictCheck();
        c.id = "squirrel";
        c.enabled = true;

        await new Promise((r) => setTimeout(r, 0));
        expect(hasConfigSet).toBe(false);
    });

    it("No Conflict, no crossover", async() => {
        extensions.all = [
            <Extension<any>>{ id: 'a', packageJSON: { contributes: { languages: [{ }] } } },
            <Extension<any>>{ id: 'b', packageJSON: { contributes: {} } },
            <Extension<any>>{ id: 'c', packageJSON: {} },
        ];

        const c = new SquirrelConflictCheck();
        c.id = "squirrel";
        c.enabled = true;

        await new Promise((r) => setTimeout(r, 0));
        expect(hasConfigSet).toBe(false);
    });

    it("Conflict, grammar", async() => {
        extensions.all = [
            <Extension<any>>{ id: 'a', packageJSON: { contributes: { grammars: [{ language: 'squirrel' }] } } },
        ];

        const c = new SquirrelConflictCheck();
        c.id = "squirrel";
        c.enabled = true;

        await new Promise((r) => setTimeout(r, 0));
        expect(hasConfigSet).toBe(true);
    });

    it("Conflict, language", async() => {
        extensions.all = [
            <Extension<any>>{ id: 'a', packageJSON: { contributes: { languages: [{ id: 'squirrel' }] } } },
        ];

        const c = new SquirrelConflictCheck();
        c.id = "squirrel";
        c.enabled = true;

        await new Promise((r) => setTimeout(r, 0));
        expect(hasConfigSet).toBe(true);
    });

    it("Conflict, extension", async() => {
        extensions.all = [
            <Extension<any>>{ id: 'a', packageJSON: { contributes: { languages: [{ extensions: ['nut'] }] } } },
        ];

        const c = new SquirrelConflictCheck();
        c.id = "squirrel";
        c.enabled = true;

        await new Promise((r) => setTimeout(r, 0));
        expect(hasConfigSet).toBe(true);
    });

});
