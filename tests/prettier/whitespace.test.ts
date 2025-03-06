import { describe, expect, it } from "@jest/globals";
import { format, dump } from "../utils";

describe("Whitespace", () => {
    it("Class", async () => {
        const response = await format("class foo {}\n\n\nclass bar {}\n");
        expect(response).toBe("class foo {}\n\nclass bar {}\n");
    });

});
