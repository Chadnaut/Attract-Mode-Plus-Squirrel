import { describe, expect, it } from "@jest/globals";
import { format, dump } from "../utils";

describe("Ignore", () => {

    it("Ignore Node", async () => {
        const response = await format("// prettier-ignore\nlocal x = [ 1 , 2 , 3 , 4 ]\nlocal y = [ 1 , 2 , 3 , 4 ]\n");
        expect(response).toBe("// prettier-ignore\nlocal x = [ 1 , 2 , 3 , 4 ]\nlocal y = [1, 2, 3, 4];\n");
    });

});
