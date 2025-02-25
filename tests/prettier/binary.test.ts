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

describe("BinaryExpression", () => {
    it("binary", () => {
        const response = format(' x   + 1');
        expect(response).toBe('x + 1;\n');
    });

    it("binary, multiple", () => {
        const response = format(' x   + 1   *  2  ');
        expect(response).toBe('x + 1 * 2;\n');
    });

    it("binary, long", () => {
        const response = format(' xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx   + 1111111111111111111111111111111111111 ');
        // dump(response);
        expect(response).toBe('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx +\n    1111111111111111111111111111111111111;\n');
    });

    it("binary, parenthesis keep", () => {
        const response = format('((1 + 2) * 3)');
        expect(response).toBe('(1 + 2) * 3;\n');
    });

    it("binary, parenthesis remove", () => {
        const response = format('1 + (2 * 3)');
        expect(response).toBe('1 + 2 * 3;\n');
    });
});
