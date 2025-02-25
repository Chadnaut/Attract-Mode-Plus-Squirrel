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

describe("Literal", () => {
    it("Identifier", () => {
        const response = format('  "x" ');
        expect(response).toBe('"x";\n');
    });

    it("IntegerLiteral", () => {
        const response = format("  1   ");
        expect(response).toBe("1;\n");
    });

    it("BooleanLiteral", () => {
        const response = format("  true  ");
        expect(response).toBe("true;\n");
    });

    it("FloatLiteral", () => {
        const response = format("  1.0  ");
        expect(response).toBe("1.0;\n");
    });

    it("NullLiteral", () => {
        const response = format("  null  ");
        expect(response).toBe("null;\n");
    });

    it("StringLiteral", () => {
        const response = format(' "ஃ" ');
        expect(response).toBe('"ஃ";\n');
    });

    it("StringLiteral Verbatim", () => {
        const response = format(' @"1" ');
        expect(response).toBe('@"1";\n');
    });
});
