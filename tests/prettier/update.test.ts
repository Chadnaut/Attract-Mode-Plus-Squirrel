import { describe, expect, it } from "@jest/globals";
import { format, dump } from "../utils";

describe("Update", () => {
    it("PrefixInc", async () => {
        const response = await format("++ x");
        expect(response).toBe("++x;\n");
    });

    it("SuffixInc", async () => {
        const response = await format(" x   ++  ");
        expect(response).toBe("x++;\n");
    });

    it("SuffixInc, precidence", async () => {
        const response = await format(" x   +++   y  ");
        expect(response).toBe("x++ + y;\n");
    });

    it("SuffixDec, precidence", async () => {
        const response = await format(" x   ---   y  ");
        expect(response).toBe("x-- - y;\n");
    });

});
