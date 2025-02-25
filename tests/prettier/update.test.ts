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

describe("Update", () => {
    it("PrefixInc", () => {
        const response = format("++ x");
        expect(response).toBe("++x;\n");
    });

    it("SuffixInc", () => {
        const response = format(" x   ++  ");
        expect(response).toBe("x++;\n");
    });

    it("SuffixInc, precidence", () => {
        const response = format(" x   +++   y  ");
        expect(response).toBe("x++ + y;\n");
    });

    it("SuffixDec, precidence", () => {
        const response = format(" x   ---   y  ");
        expect(response).toBe("x-- - y;\n");
    });

});
