import { describe, expect, it } from "@jest/globals";
import { format, dump } from "../utils";

describe("Delete", () => {

    it("delete", async () => {
        const response = await format(" delete x.y  ");
        expect(response).toBe("delete x.y;\n");
    });

    it("delete, assign", async () => {
        const response = await format(" local x  =  delete x.y  ");
        expect(response).toBe("local x = delete x.y;\n");
    });

    it("delete, root", async () => {
        const response = await format(" delete  ::root  ");
        expect(response).toBe("delete ::root;\n");
    });

});
