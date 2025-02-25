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

describe("Return", () => {
    it("ReturnStatement", () => {
        const response = format("return    1");
        expect(response).toBe("return 1;\n");
    });

    it("ReturnStatement, empty", () => {
        const response = format("return    ");
        expect(response).toBe("return;\n");
    });

    it("YieldStatement", () => {
        const response = format("yield    1");
        expect(response).toBe("yield 1;\n");
    });

    it("YieldStatement, empty", () => {
        const response = format("yield    ");
        expect(response).toBe("yield;\n");
    });

    it("BreakStatement", () => {
        const response = format("while(a){break}");
        expect(response).toBe("while (a) {\n    break;\n}\n");
    });

    it("ContinueStatement", () => {
        const response = format("while(a){continue}");
        expect(response).toBe("while (a) {\n    continue;\n}\n");
    });

});
