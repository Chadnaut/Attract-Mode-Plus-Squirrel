import { describe, expect, it } from "@jest/globals";
import { format, dump } from "../utils";

describe("Docblock", () => {

    it("FunctionDeclaration", async () => {
        const response = await format(" /** doc1 */ function foo() {}");
        expect(response).toBe("/** doc1 */ function foo() {}\n");
    });

    it("FunctionDeclaration, multiline", async () => {
        const response = await format(" /**\n* doc1\n* doc2\n */\n function foo() {}");
        expect(response).toBe("/**\n * doc1\n * doc2\n */\nfunction foo() {}\n");
    });

});
