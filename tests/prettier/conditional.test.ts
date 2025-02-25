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

describe("Conditional", () => {

    it("ConditionalExpression", () => {
        const response = format(" true  ?  a:b");
        expect(response).toBe("true ? a : b;\n");
    });

    it("ConditionalExpression, long", () => {
        const response = format(" true  ?  11111111111111111111111111111111111111:22222222222222222222222222222222222222");
        expect(response).toBe("true\n    ? 11111111111111111111111111111111111111\n    : 22222222222222222222222222222222222222;\n");
    });

});
