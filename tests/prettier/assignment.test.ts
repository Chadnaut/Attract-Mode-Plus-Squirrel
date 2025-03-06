import { describe, expect, it } from "@jest/globals";
import { format, dump } from "../utils";

describe("AssignmentExpression", () => {

    it("init", async () => {
        const response = await format("  local x  =  1  ");
        expect(response).toBe("local x = 1;\n");
    });

    it("null", async () => {
        const response = await format("  local x    ");
        expect(response).toBe("local x;\n");
    });

    it("multiple", async () => {
        const response = await format("  local x  =  1,y  =2  ");
        expect(response).toBe(
            "local x = 1,\n    y = 2;\n",
        );
    });

    it("const", async () => {
        const response = await format("  const x  =  1  ");
        expect(response).toBe("const x = 1;\n");
    });

    it("const, multiline", async () => {
        const response = await format("  const x  =  1 \n\n\n\n\n const y =  2 ");
        expect(response).toBe("const x = 1;\n\nconst y = 2;\n");
    });

    it("newslot", async () => {
        const response = await format(' x   <- 1');
        expect(response).toBe('x <- 1;\n');
    });

    it("eq", async () => {
        const response = await format(' x   = 1');
        expect(response).toBe('x = 1;\n');
    });

    it("minuseq", async () => {
        const response = await format(' x   -= 1');
        expect(response).toBe('x -= 1;\n');
    });

    it("assignment, long int", async () => {
        const response = await format(' xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx   += 11111111111111111111111111111111111111 ');
        // dump(response);
        expect(response).toBe('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx += 11111111111111111111111111111111111111;\n');
    });

    it("assignment, long other", async () => {
        const response = await format(' xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx   += yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy ');
        // dump(response);
        expect(response).toBe('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx +=\n    yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy;\n');
    });
});
