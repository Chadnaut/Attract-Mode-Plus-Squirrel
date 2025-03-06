import { describe, expect, it } from "@jest/globals";
import { dump, format, formatCPP } from "../utils";
import * as path from "path";
import { readFile } from "../../src/utils/file";

export const getFile = (filename: string): string =>
    readFile(path.join(__dirname, filename));

describe("Sample", () => {

    it("Home", async () => {
        const name = "home";
        const src = getFile(`../samples/format/${name}.src.nut`);
        const jsx = getFile(`../samples/format/${name}.jsx.nut`);
        const cpp = getFile(`../samples/format/${name}.cpp.nut`);

        expect(await format(src)).toBe(jsx);
        expect(await format(jsx)).toBe(jsx);
        expect(await format(cpp)).toBe(jsx);

        expect(await formatCPP(src)).toBe(cpp);
        expect(await formatCPP(jsx)).toBe(cpp);
        expect(await formatCPP(cpp)).toBe(cpp);
    });

    it("Test", async () => {
        const name = "test";
        const src = getFile(`../samples/format/${name}.src.nut`);
        const jsx = getFile(`../samples/format/${name}.jsx.nut`);
        const cpp = getFile(`../samples/format/${name}.cpp.nut`);

        expect(await format(src)).toBe(jsx);
        expect(await format(jsx)).toBe(jsx);
        expect(await format(cpp)).toBe(jsx);

        expect(await formatCPP(src)).toBe(cpp);
        expect(await formatCPP(jsx)).toBe(cpp);
        expect(await formatCPP(cpp)).toBe(cpp);
    });

    it("Penner", async () => {
        const name = "penner";
        const src = getFile(`../samples/format/${name}.src.nut`);
        const jsx = getFile(`../samples/format/${name}.jsx.nut`);
        const cpp = getFile(`../samples/format/${name}.cpp.nut`);

        expect(await format(src)).toBe(jsx);
        expect(await format(jsx)).toBe(jsx);
        expect(await format(cpp)).toBe(jsx);

        expect(await formatCPP(src)).toBe(cpp);
        expect(await formatCPP(jsx)).toBe(cpp);
        expect(await formatCPP(cpp)).toBe(cpp);
    });
});
