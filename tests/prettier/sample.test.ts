import {
    beforeEach,
    describe,
    fdescribe,
    expect,
    it,
    fit,
    xit,
} from "@jest/globals";
import { format, formatCPP, dump } from "../utils";
import * as path from "path";
import { readFile } from "../../src/utils/file";

export const getFile = (filename: string): string =>
    readFile(path.join(__dirname, filename));

describe("Sample", () => {

    it("Home", () => {
        const name = "home";
        const src = getFile(`../samples/format/${name}.src.nut`);
        const jsx = getFile(`../samples/format/${name}.jsx.nut`);
        const cpp = getFile(`../samples/format/${name}.cpp.nut`);

        expect(format(src)).toBe(jsx);
        expect(format(jsx)).toBe(jsx);
        expect(format(cpp)).toBe(jsx);

        expect(formatCPP(src)).toBe(cpp);
        expect(formatCPP(jsx)).toBe(cpp);
        expect(formatCPP(cpp)).toBe(cpp);
    });

    it("Test", () => {
        const name = "test";
        const src = getFile(`../samples/format/${name}.src.nut`);
        const jsx = getFile(`../samples/format/${name}.jsx.nut`);
        const cpp = getFile(`../samples/format/${name}.cpp.nut`);

        expect(format(src)).toBe(jsx);
        expect(format(jsx)).toBe(jsx);
        expect(format(cpp)).toBe(jsx);

        expect(formatCPP(src)).toBe(cpp);
        expect(formatCPP(jsx)).toBe(cpp);
        expect(formatCPP(cpp)).toBe(cpp);
    });

    it("Penner", () => {
        const name = "penner";
        const src = getFile(`../samples/format/${name}.src.nut`);
        const jsx = getFile(`../samples/format/${name}.jsx.nut`);
        const cpp = getFile(`../samples/format/${name}.cpp.nut`);

        expect(format(src)).toBe(jsx);
        expect(format(jsx)).toBe(jsx);
        expect(format(cpp)).toBe(jsx);

        expect(formatCPP(src)).toBe(cpp);
        expect(formatCPP(jsx)).toBe(cpp);
        expect(formatCPP(cpp)).toBe(cpp);
    });
});
