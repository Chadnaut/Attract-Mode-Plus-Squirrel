import {
    beforeEach,
    describe,
    fdescribe,
    expect,
    it,
    fit,
    xit,
} from "@jest/globals";
import { format, dump } from "../utils";

describe("Array", () => {

    it("Short", () => {
        const response = format("[1,2,3]");
        expect(response).toBe("[1, 2, 3];\n");
    });

    it("Long, int", () => {
        const response = format("[11111111111111111111111111,222222222222222222222222222222,333333333333333333333333333333]");
        expect(response).toBe("[\n    11111111111111111111111111, 222222222222222222222222222222,\n    333333333333333333333333333333\n];\n");
    });

    it("Long, str", () => {
        const response = format('["11111111111111111111111111","222222222222222222222222222222","333333333333333333333333333333"]');
        expect(response).toBe('[\n    "11111111111111111111111111",\n    "222222222222222222222222222222",\n    "333333333333333333333333333333"\n];\n');
    });

});
