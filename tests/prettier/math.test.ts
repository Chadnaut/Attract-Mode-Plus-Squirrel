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

describe("Math", () => {
    it("Ops", () => {
        const response = format(" 1  * 2 /   3 % 4  + 5  - 6 ");
        expect(response).toBe("(((1 * 2) / 3) % 4) + 5 - 6;\n");
    });

    it("Shift", () => {
        const response = format(" 1   << 2  >> 3>>> 4 < 5 > 6  <= 7 >= 8");
        expect(response).toBe("((1 << 2) >> 3) >>> 4 < 5 > 6 <= 7 >= 8;\n");
    });

    it("In", () => {
        const response = format(" 1  in  2 instanceof    3 ");
        expect(response).toBe("1 in 2 instanceof 3;\n");
    });

    it("Logical", () => {
        const response = format(" 1   &&   2 || 3 ");
        expect(response).toBe("(1 && 2) || 3;\n");
    });
});
