import { describe, expect, it } from "@jest/globals";
import { format, dump } from "../utils";

describe("Return", () => {
    it("ReturnStatement", async () => {
        const response = await format("return    1");
        expect(response).toBe("return 1;\n");
    });

    it("ReturnStatement, empty", async () => {
        const response = await format("return    ");
        expect(response).toBe("return;\n");
    });

    it("YieldStatement", async () => {
        const response = await format("yield    1");
        expect(response).toBe("yield 1;\n");
    });

    it("YieldStatement, empty", async () => {
        const response = await format("yield    ");
        expect(response).toBe("yield;\n");
    });

    it("BreakStatement", async () => {
        const response = await format("while(a){break}");
        expect(response).toBe("while (a) {\n    break;\n}\n");
    });

    it("ContinueStatement", async () => {
        const response = await format("while(a){continue}");
        expect(response).toBe("while (a) {\n    continue;\n}\n");
    });

});
