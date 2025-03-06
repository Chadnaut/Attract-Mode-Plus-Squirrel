import { describe, expect, it } from "@jest/globals";
import { format } from "../utils";

describe("Array", () => {

    it("Short", async () => {
        const response = await format("[1,2,3]");
        expect(response).toBe("[1, 2, 3];\n");
    });

    it("Long, int", async () => {
        const response = await format("[11111111111111111111111111,222222222222222222222222222222,333333333333333333333333333333]");
        expect(response).toBe("[\n    11111111111111111111111111, 222222222222222222222222222222,\n    333333333333333333333333333333\n];\n");
    });

    it("Long, str", async () => {
        const response = await format('["11111111111111111111111111","222222222222222222222222222222","333333333333333333333333333333"]');
        expect(response).toBe('[\n    "11111111111111111111111111",\n    "222222222222222222222222222222",\n    "333333333333333333333333333333"\n];\n');
    });

});
