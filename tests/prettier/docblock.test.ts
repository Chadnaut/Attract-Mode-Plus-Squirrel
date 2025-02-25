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

describe("Docblock", () => {

    it("FunctionDeclaration", () => {
        const response = format(" /** doc1 */ function foo() {}");
        expect(response).toBe("/** doc1 */ function foo() {}\n");
    });

    it("FunctionDeclaration, multiline", () => {
        const response = format(" /**\n* doc1\n* doc2\n */\n function foo() {}");
        expect(response).toBe("/**\n * doc1\n * doc2\n */\nfunction foo() {}\n");
    });

});
