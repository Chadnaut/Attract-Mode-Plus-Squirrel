import { describe, expect, it } from "@jest/globals";
import { format, dump } from "../utils";

describe("BinaryExpression", () => {
    it("binary", async () => {
        const response = await format(' x   + 1');
        expect(response).toBe('x + 1;\n');
    });

    it("binary, multiple", async () => {
        const response = await format(' x   + 1   *  2  ');
        expect(response).toBe('x + 1 * 2;\n');
    });

    it("binary, long", async () => {
        const response = await format(' xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx   + 1111111111111111111111111111111111111 ');
        // dump(response);
        expect(response).toBe('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx +\n    1111111111111111111111111111111111111;\n');
    });

    it("binary, parenthesis keep", async () => {
        const response = await format('((1 + 2) * 3)');
        expect(response).toBe('(1 + 2) * 3;\n');
    });

    it("binary, parenthesis remove", async () => {
        const response = await format('1 + (2 * 3)');
        expect(response).toBe('1 + 2 * 3;\n');
    });
});
