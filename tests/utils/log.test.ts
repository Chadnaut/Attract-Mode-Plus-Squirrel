import { getLogLinks } from './../../src/utils/log';
import { describe, expect, it } from "@jest/globals";
import { MockTextDocument } from '../utils';

describe("Log", () => {

    it("none", () => {
        expect(getLogLinks(new MockTextDocument(""))).toEqual([]);
    });

    it("script error", () => {
        expect(getLogLinks(new MockTextDocument("Script Error in file.nut - "))).toHaveLength(1);
    });

    it("line error", () => {
        expect(getLogLinks(new MockTextDocument("*WARN [here] link line [1]"))).toHaveLength(1);
    });

    it("compiler error", () => {
        expect(getLogLinks(new MockTextDocument("link line = (1) column = (1)"))).toHaveLength(1);
    });

    it("loaded layout", () => {
        expect(getLogLinks(new MockTextDocument(" - Loaded layout: link (name)"))).toHaveLength(2);
    });

    it("config", () => {
        expect(getLogLinks(new MockTextDocument("Config: link\n"))).toHaveLength(1);
    });

    it("file", () => {
        expect(getLogLinks(new MockTextDocument("unrecognized in file: link. Valid"))).toHaveLength(1);
    });

});
