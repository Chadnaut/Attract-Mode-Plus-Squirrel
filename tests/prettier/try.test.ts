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

describe("Try", () => {
    it("TryStatement", () => {
        const response = format("  try {  a  } catch  (e)  { b }  ");
        expect(response).toBe("try {\n    a;\n} catch (e) {\n    b;\n}\n");
    });

    it("ThrowStatement", () => {
        const response = format("  throw   x  ");
        expect(response).toBe("throw x;\n");
    });

});
