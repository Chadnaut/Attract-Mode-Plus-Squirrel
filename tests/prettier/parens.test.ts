import { describe, expect, it } from "@jest/globals";
import { format, dump } from "../utils";

describe("Parens", () => {

    it("Nested", async () => {
        const response = await format("(((1)+2)+3)", { reduceParens: false });
        expect(response).toBe('(((1) + 2) + 3);\n');
    });

    it("Sequential", async () => {
        const response = await format("((1+2)+(3+4))", { reduceParens: false });
        expect(response).toBe('((1 + 2) + (3 + 4));\n');
    });

    it("Multiple", async () => {
        const response = await format("(((1)))", { reduceParens: false });
        expect(response).toBe('(1);\n');
    });

});
