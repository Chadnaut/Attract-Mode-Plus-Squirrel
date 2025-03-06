import { describe, expect, it } from "@jest/globals";
import { format, dump } from "../utils";

describe("Unary", () => {
    it("Not", async () => {
        const response = await format("! 1");
        expect(response).toBe("!1;\n");
    });
    it("BW Not", async () => {
        const response = await format("~ 1");
        expect(response).toBe("~1;\n");
    });
    it("BW Not, parenthesis removal", async () => {
        const response = await format("~ (1)");
        expect(response).toBe("~1;\n");
    });
    it("Typeof", async () => {
        const response = await format(" typeof  1");
        expect(response).toBe("typeof 1;\n");
    });
    it("Resume", async () => {
        const response = await format(" resume  1");
        expect(response).toBe("resume 1;\n");
    });
    it("Clone", async () => {
        const response = await format(" clone  1");
        expect(response).toBe("clone 1;\n");
    });
    it("Neg, int", async () => {
        const response = await format(" -1");
        expect(response).toBe("-1;\n");
    });
    it("Neg, id", async () => {
        const response = await format(" -a");
        expect(response).toBe("-a;\n");
    });

});
