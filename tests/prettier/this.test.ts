import { describe, expect, it } from "@jest/globals";
import { format, dump } from "../utils";

describe("This", () => {
    it("ThisExpression", async () => {
        const response = await format("  this  ");
        expect(response).toBe("this;\n");
    });

    it("BaseExpression", async () => {
        const response = await format("  base  ");
        expect(response).toBe("base;\n");
    });
});
