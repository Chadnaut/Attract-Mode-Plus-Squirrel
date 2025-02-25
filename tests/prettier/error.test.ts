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

describe("Error", () => {
    it("Throw on error", () => {
        expect(() => {
            format('function foo(..., x) {}');
        }).toThrow(); // "expected ')'"
        // Error message wont match due to synchronizedPrettier
    });
});
