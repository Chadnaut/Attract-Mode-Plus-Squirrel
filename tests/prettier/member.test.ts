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

describe("Member", () => {
    it("SequenceExpression", () => {
        const response = format("a,b,c");
        expect(response).toBe("a, b, c;\n");
    });

    it("SequenceExpression, long", () => {
        const response = format("aaaaaaaaaaaaaaaaaaaaaaaa,bbbbbbbbbbbbbbbbbbbbbbbbb,cccccccccccccccccccccccccccc");
        expect(response).toBe("aaaaaaaaaaaaaaaaaaaaaaaa,\n    bbbbbbbbbbbbbbbbbbbbbbbbb,\n    cccccccccccccccccccccccccccc;\n");
    });

    it("Root", () => {
        const response = format(" ::root ");
        expect(response).toBe("::root;\n");
    });

    it("MemberExpression, Calculated", () => {
        const response = format(" x[ 1 ] ");
        expect(response).toBe("x[1];\n");
    });

    it("MemberExpression, Dot", () => {
        const response = format(" x .y ");
        expect(response).toBe("x.y;\n");
    });

});
