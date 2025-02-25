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

describe("While", () => {
    it("WhileStatement", () => {
        const response = format("  while ( 1 ){  a  }");
        expect(response).toBe("while (1) {\n    a;\n}\n");
    });
    it("DoWhileStatement", () => {
        const response = format(" do {a}  while ( 1 )");
        expect(response).toBe("do {\n    a;\n} while (1);\n");
    });

});
