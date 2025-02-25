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

describe("Ignore", () => {

    it("Ignore Node", () => {
        const response = format("// prettier-ignore\nlocal x = [ 1 , 2 , 3 , 4 ]\nlocal y = [ 1 , 2 , 3 , 4 ]\n");
        expect(response).toBe("// prettier-ignore\nlocal x = [ 1 , 2 , 3 , 4 ]\nlocal y = [1, 2, 3, 4];\n");
    });

});
