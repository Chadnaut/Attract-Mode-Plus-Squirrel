import {
    beforeEach,
    describe,
    fdescribe,
    expect,
    it,
    fit,
    xit,
} from "@jest/globals";
import { format, dump } from "../utils";

describe("AssignmentExpression", () => {

    it("init", () => {
        const response = format("  local x  =  1  ");
        expect(response).toBe("local x = 1;\n");
    });

    it("null", () => {
        const response = format("  local x    ");
        expect(response).toBe("local x;\n");
    });

    it("multiple", () => {
        const response = format("  local x  =  1,y  =2  ");
        expect(response).toBe(
            "local x = 1,\n    y = 2;\n",
        );
    });

    it("const", () => {
        const response = format("  const x  =  1  ");
        expect(response).toBe("const x = 1;\n");
    });

    it("const, multiline", () => {
        const response = format("  const x  =  1 \n\n\n\n\n const y =  2 ");
        expect(response).toBe("const x = 1;\n\nconst y = 2;\n");
    });

    it("newslot", () => {
        const response = format(' x   <- 1');
        expect(response).toBe('x <- 1;\n');
    });

    it("eq", () => {
        const response = format(' x   = 1');
        expect(response).toBe('x = 1;\n');
    });

    it("minuseq", () => {
        const response = format(' x   -= 1');
        expect(response).toBe('x -= 1;\n');
    });

    it("assignment, long int", () => {
        const response = format(' xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx   += 11111111111111111111111111111111111111 ');
        // dump(response);
        expect(response).toBe('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx += 11111111111111111111111111111111111111;\n');
    });

    it("assignment, long ither", () => {
        const response = format(' xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx   += yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy ');
        // dump(response);
        expect(response).toBe('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx +=\n    yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy;\n');
    });
});
