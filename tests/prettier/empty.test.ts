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

describe("Empty", () => {

    it("If, empty", () => {
        const response = format(" if (1) ; ");
        expect(response).toBe("if (1);\n");
    });

    it("For, empty", () => {
        const response = format(" for(;;); ");
        expect(response).toBe("for (;;);\n");
    });

    it("While, empty", () => {
        const response = format(" while(1); ");
        expect(response).toBe("while (1);\n");
    });

    it("DoWhile, empty", () => {
        const response = format(" do; while(1); ");
        expect(response).toBe("do;\nwhile (1);\n");
    });

    it("Try, empty", () => {
        const response = format(" try; catch(e); ");
        expect(response).toBe("try;\ncatch (e);\n");
    });
});
