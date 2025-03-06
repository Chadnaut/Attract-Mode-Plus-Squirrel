import { describe, expect, it } from "@jest/globals";
import { format, dump } from "../utils";

describe("Empty", () => {

    it("If, empty", async () => {
        const response = await format(" if (1) ; ");
        expect(response).toBe("if (1);\n");
    });

    it("For, empty", async () => {
        const response = await format(" for(;;); ");
        expect(response).toBe("for (;;);\n");
    });

    it("While, empty", async () => {
        const response = await format(" while(1); ");
        expect(response).toBe("while (1);\n");
    });

    it("DoWhile, empty", async () => {
        const response = await format(" do; while(1); ");
        expect(response).toBe("do;\nwhile (1);\n");
    });

    it("Try, empty", async () => {
        const response = await format(" try; catch(e); ");
        expect(response).toBe("try;\ncatch (e);\n");
    });
});
