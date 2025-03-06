import { describe, expect, it } from "@jest/globals";
import { format, dump } from "../utils";

describe("Complex", () => {

    it("Complex", async () => {
        const response = await format("class foo { x = 1;\n\n\n\n function bar(a,b) {return a+b} }");
        expect(response).toBe(
`class foo {
    x = 1;

    function bar(a, b) {
        return a + b;
    }
}
`);
    });

});
