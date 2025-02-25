import { describe, expect, it } from "@jest/globals";
import { dump, parseExtra as parse, pos } from "../utils";
import { getNodeAtPos as _getNodeAtPos } from "../../src/utils/find";
import { uniqueFilter } from "../../src/utils/array";

describe("Array", () => {

    it("Array filter unique", () => {
        const arr = [1,2,3,1,2,3];
        expect(arr.filter(uniqueFilter)).toEqual([1,2,3]);
    });

});
