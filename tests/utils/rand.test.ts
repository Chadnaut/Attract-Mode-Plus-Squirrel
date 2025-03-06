import { describe, expect, it } from "@jest/globals";
import { getRandSeed } from './../../src/utils/rand';

describe("Rand", () => {

    it("Works", () => {
        const r1 = getRandSeed(0);
        const v1 = r1();
        const v2 = r1();
        expect(v1).not.toBeUndefined();
        expect(v1).not.toEqual(v2);
    });

    it("Repeats", () => {
        const arr = Array(100).fill(0);

        const r1 = getRandSeed(0);
        const a1 = arr.map(r1);

        const r2 = getRandSeed(0);
        const a2 = arr.map(r2);

        expect(a1).toEqual(a2);
    });

});
