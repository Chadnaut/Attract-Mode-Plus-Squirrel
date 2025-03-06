import { describe, expect, it } from "@jest/globals";
import { format, dump } from "../utils";

describe("Literal", () => {
    it("Identifier", async () => {
        const response = await format('  "x" ');
        expect(response).toBe('"x";\n');
    });

    it("IntegerLiteral", async () => {
        const response = await format("  1   ");
        expect(response).toBe("1;\n");
    });

    it("BooleanLiteral", async () => {
        const response = await format("  true  ");
        expect(response).toBe("true;\n");
    });

    it("FloatLiteral", async () => {
        const response = await format("  1.0  ");
        expect(response).toBe("1.0;\n");
    });

    it("NullLiteral", async () => {
        const response = await format("  null  ");
        expect(response).toBe("null;\n");
    });

    it("StringLiteral", async () => {
        const response = await format(' "ஃ" ');
        expect(response).toBe('"ஃ";\n');
    });

    it("StringLiteral Verbatim", async () => {
        const response = await format(' @"1" ');
        expect(response).toBe('@"1";\n');
    });
});
