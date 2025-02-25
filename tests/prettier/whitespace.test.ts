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

describe("Whitespace", () => {
    it("Class", () => {
        const response = format("class foo {}\n\n\nclass bar {}\n");
        expect(response).toBe("class foo {}\n\nclass bar {}\n");
    });

});
