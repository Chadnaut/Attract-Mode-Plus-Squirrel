import { describe, expect, it } from "@jest/globals";
import { parseForce as parse } from "../utils";
import { readFile } from "../../src/utils/file";
import * as path from "path";

const getFile = (filename: string): string =>
    readFile(path.join(__dirname, filename));

const pieceWise = (text: string, inc = 1) => {
    const n = text.length;
    for (let i = 0; i <= n; i += inc) {
        parse(text.slice(0, i));
        parse(text.slice(n - i, n));
    }
};

/**
 * This is a SLOW test
 * - Runs in 1-character increments per file
 */
describe("Sample", () => {
    it("Home", () => {
        const text = getFile("../samples/format/home.src.nut");
        expect(() => {
            pieceWise(text);
        }).not.toThrow();
    });

    it("text", () => {
        const text = getFile("../samples/format/test.src.nut");
        expect(() => {
            pieceWise(text);
        }).not.toThrow();
    });

    // it("Penner", () => {
    //     const src = getFile("../samples/format/penner.src.nut");
    //     expect(() => { pieceWise(src, 50); }).not.toThrow();
    // });
});
