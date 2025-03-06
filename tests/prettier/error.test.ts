import { describe, expect, it } from "@jest/globals";
import { format, dump } from "../utils";

describe("Error", () => {
    it("Throw on error", async () => {
        await expect(format('function foo(..., x) {}'))
            .rejects
            .toBe("expected ')'");
    });
});
