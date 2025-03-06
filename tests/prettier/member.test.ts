import { describe, expect, it } from "@jest/globals";
import { format, dump } from "../utils";

describe("Member", () => {
    it("SequenceExpression", async () => {
        const response = await format("a,b,c");
        expect(response).toBe("a, b, c;\n");
    });

    it("SequenceExpression, long", async () => {
        const response = await format("aaaaaaaaaaaaaaaaaaaaaaaa,bbbbbbbbbbbbbbbbbbbbbbbbb,cccccccccccccccccccccccccccc");
        expect(response).toBe("aaaaaaaaaaaaaaaaaaaaaaaa,\n    bbbbbbbbbbbbbbbbbbbbbbbbb,\n    cccccccccccccccccccccccccccc;\n");
    });

    it("Root", async () => {
        const response = await format(" ::root ");
        expect(response).toBe("::root;\n");
    });

    it("MemberExpression, Calculated", async () => {
        const response = await format(" x[ 1 ] ");
        expect(response).toBe("x[1];\n");
    });

    it("MemberExpression, Dot", async () => {
        const response = await format(" x .y ");
        expect(response).toBe("x.y;\n");
    });

});
