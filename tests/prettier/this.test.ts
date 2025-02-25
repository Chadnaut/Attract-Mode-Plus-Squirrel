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

describe("This", () => {
    it("ThisExpression", () => {
        const response = format("  this  ");
        expect(response).toBe("this;\n");
    });

    it("BaseExpression", () => {
        const response = format("  base  ");
        expect(response).toBe("base;\n");
    });
});
