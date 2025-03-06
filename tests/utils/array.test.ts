import { describe, expect, it } from "@jest/globals";
import { uniqueFilter } from "../../src/utils/array";

describe("Array", () => {

    it("Array filter unique", () => {
        const arr = [1,2,3,1,2,3];
        expect(arr.filter(uniqueFilter)).toEqual([1,2,3]);
    });

});
