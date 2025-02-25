import {
    beforeEach,
    describe,
    fdescribe,
    expect,
    it,
    fit,
    xit,
} from "@jest/globals";
import { format, formatCPP, dump, parseForce as parse } from "../utils";
import { getRandSeed } from "../../src/utils/rand";

const rand = getRandSeed(0);

const randText = (size = 1000) => {
    const arr = Array(size).fill(0);
    const codes = arr.map(() => Math.floor(rand() * 65535));
    return String.fromCharCode(...codes);
}

describe("Rand", () => {

    it("Parses gibberish", () => {
        expect(() => {
            for (let i=0; i<100; i++) parse(randText());
        }).not.toThrow();
    });

});
