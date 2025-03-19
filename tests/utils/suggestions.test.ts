import { getParamSuggestions } from '../../src/utils/params';
import { describe, expect, it } from "@jest/globals";
import { dump, parseExtra as parse, pos } from "../utils";
import { SQTree as qt } from "../../src/ast";
import { CompletionItem } from 'vscode';
import constants from '../../src/constants';
import { refreshArtworkLabels } from '../../src/utils/media';

jest.mock('../../src/utils/media.ts', () => ({
    ...jest.requireActual('../../src/utils/media.ts'),
    getImageCompletions: (name) => ([
        new CompletionItem("mock-image")
    ]),
    getAudioCompletions: (name) => ([
        new CompletionItem("mock-audio")
    ]),
    getVideoCompletions: (name) => ([
        new CompletionItem("mock-video")
    ]),
    getShaderCompletions: (name) => ([
        new CompletionItem("mock-shader")
    ]),
}));

jest.mock('../../src/utils/import.ts', () => ({
    ...jest.requireActual('../../src/utils/import.ts'),
    getNutCompletions: (name) => ([
        new CompletionItem("mock-nut")
    ]),
}));

jest.mock('../../src/utils/module.ts', () => ({
    ...jest.requireActual('../../src/utils/module.ts'),
    getModuleCompletions: () => ([
        new CompletionItem("mock-module")
    ]),
}));

let getConfigValueFunc = (...any) => {};
jest.mock('../../src/utils/config.ts', () => ({
    ...jest.requireActual('../../src/utils/config.ts'),
    getConfigValue: (...any) => getConfigValueFunc(...any),
}));

beforeEach(() => {
    getConfigValueFunc = (v, def) => def;
});

describe("Suggestions", () => {

    it("getParamSuggestions, invalid", () => {
        const text = "/** @param {($module)} ...vargv */ function foo(a) {}; foo(10, 10);";
        const program = parse(text);
        const items = getParamSuggestions(text, program, pos(64));
        expect(items).toHaveLength(0);
    });

    it("getParamSuggestions, rest", () => {
        const text = "/** @param {($module)} ...vargv */ function foo(...) {}; foo(10, 10);";
        const program = parse(text);
        const items = getParamSuggestions(text, program, pos(66));
        expect(items).toHaveLength(1);
        expect(items[0].label).toBe("mock-module");
    });

    it("getParamSuggestions, meta call", () => {
        const text = "class foo { /** @param {($module)} ...vargv */ function _call(...) {} } local f = foo(); f(10, 10);";
        const program = parse(text);
        const items = getParamSuggestions(text, program, pos(96));
        expect(items).toHaveLength(1);
        expect(items[0].label).toBe("mock-module");
    });

    it("getParamSuggestions, meta call excludes class", () => {
        const text = "class foo { /** @param {($module)} ...vargv */ function _call(...) {} } local f = foo(); f(10, 10);";
        const program = parse(text);
        const items = getParamSuggestions(text, program, pos(8));
        expect(items).toHaveLength(0);
    });

    it("getParamSuggestions, $module", () => {
        const text = "/** @param {($module)} a */ function foo(a) {}; foo(10);";
        const program = parse(text);
        const items = getParamSuggestions(text, program, pos(53));
        expect(items).toHaveLength(1);
        expect(items[0].label).toBe("mock-module");
    });

    it("getParamSuggestions, $nut", () => {
        const text = "/** @param {($nut)} a */ function foo(a) {}; foo(10);";
        const program = parse(text);
        const items = getParamSuggestions(text, program, pos(50));
        expect(items).toHaveLength(1);
        expect(items[0].label).toBe("mock-nut");
    });

    it("getParamSuggestions, $image", () => {
        const text = '/** @param {($image)} a */ function foo(a) {}; foo("");';
        const program = parse(text);
        const items = getParamSuggestions(text, program, pos(52));
        expect(items).toHaveLength(1);
        expect(items[0].label).toBe("mock-image");
    });

    it("getParamSuggestions, $video", () => {
        const text = '/** @param {($video)} a */ function foo(a) {}; foo("");';
        const program = parse(text);
        const items = getParamSuggestions(text, program, pos(52));
        expect(items).toHaveLength(1);
        expect(items[0].label).toBe("mock-video");
    });

    it("getParamSuggestions, $audio", () => {
        const text = '/** @param {($audio)} a */ function foo(a) {}; foo("");';
        const program = parse(text);
        const items = getParamSuggestions(text, program, pos(52));
        expect(items).toHaveLength(1);
        expect(items[0].label).toBe("mock-audio");
    });

    it("getParamSuggestions, $shader", () => {
        const text = '/** @param {($shader)} a */ function foo(a) {}; foo("");';
        const program = parse(text);
        const items = getParamSuggestions(text, program, pos(53));
        expect(items).toHaveLength(1);
        expect(items[0].label).toBe("mock-shader");
    });

    it("getParamSuggestions, $artwork", () => {
        getConfigValueFunc = (v, def) => {
            switch (v) {
                case constants.SCAN_ARTWORK_ENABLED:
                    return false;
                case constants.ATTRACT_MODE_ARTWORK:
                    return "one,two";
                default:
                    return def;
            }
        };
        refreshArtworkLabels();

        const text = '/** @param {($artwork)} a */ function foo(a) {}; foo("");';
        const program = parse(text);
        const items = getParamSuggestions(text, program, pos(54));
        expect(items).toHaveLength(2);
        expect(items[0].label).toBe("one");
        expect(items[1].label).toBe("two");
    });

});
