import { describe, expect, it } from "@jest/globals";
import { format, dump } from "../utils";

describe("Conditional", () => {

    it("ConditionalExpression", async () => {
        const response = await format(" true  ?  a:b");
        expect(response).toBe("true ? a : b;\n");
    });

    it("ConditionalExpression, long", async () => {
        const response = await format(" true  ?  11111111111111111111111111111111111111:22222222222222222222222222222222222222");
        expect(response).toBe("true\n    ? 11111111111111111111111111111111111111\n    : 22222222222222222222222222222222222222;\n");
    });

});
