import { describe, expect, it } from "@jest/globals";
import { visitorKeys } from "../../src/ast/ast";

describe("VisitorKeys", () => {
    it("Is object", () => {
        expect(typeof visitorKeys).toBe("object");
    });
});
