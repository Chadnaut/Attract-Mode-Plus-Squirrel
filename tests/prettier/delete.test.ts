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

describe("Delete", () => {

    it("delete", () => {
        const response = format(" delete x.y  ");
        expect(response).toBe("delete x.y;\n");
    });

    it("delete, assign", () => {
        const response = format(" local x  =  delete x.y  ");
        expect(response).toBe("local x = delete x.y;\n");
    });

    it("delete, root", () => {
        const response = format(" delete  ::root  ");
        expect(response).toBe("delete ::root;\n");
    });

});
