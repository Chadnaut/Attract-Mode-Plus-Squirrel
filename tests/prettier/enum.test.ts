import { describe, expect, it } from "@jest/globals";
import { format, dump } from "../utils";

describe("EnumDeclaration", () => {
    it("enum", async () => {
        const response = await format('  enum     x {a,b} ');
        expect(response).toBe('enum x {\n    a,\n    b\n}\n');
    });

    it("members", async () => {
        const response = await format('  enum     x {a=1,b  =  2} ');
        expect(response).toBe('enum x {\n    a = 1,\n    b = 2\n}\n');
    });

    it("empty", async () => {
        const response = await format('  enum     x {} ');
        expect(response).toBe('enum x {}\n');
    });
});
