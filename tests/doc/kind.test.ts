import { describe, expect, it } from "@jest/globals";
import { getKindOrder } from "../../src/doc/kind";

describe("Doc Kind", () => {
    it("getKindOrder", () => {
        expect(getKindOrder("package")).toBeLessThan(getKindOrder("module"));
        expect(getKindOrder("unknown")).toBeGreaterThan(getKindOrder("module"));
    });
});
