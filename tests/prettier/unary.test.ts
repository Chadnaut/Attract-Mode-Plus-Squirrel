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

describe("Unary", () => {
    it("Not", () => {
        const response = format("! 1");
        expect(response).toBe("!1;\n");
    });
    it("BW Not", () => {
        const response = format("~ 1");
        expect(response).toBe("~1;\n");
    });
    it("BW Not, parenthesis removal", () => {
        const response = format("~ (1)");
        expect(response).toBe("~1;\n");
    });
    it("Typeof", () => {
        const response = format(" typeof  1");
        expect(response).toBe("typeof 1;\n");
    });
    it("Resume", () => {
        const response = format(" resume  1");
        expect(response).toBe("resume 1;\n");
    });
    it("Clone", () => {
        const response = format(" clone  1");
        expect(response).toBe("clone 1;\n");
    });
    it("Neg, int", () => {
        const response = format(" -1");
        expect(response).toBe("-1;\n");
    });
    it("Neg, id", () => {
        const response = format(" -a");
        expect(response).toBe("-a;\n");
    });

});
