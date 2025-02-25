import {
    beforeEach,
    describe,
    fdescribe,
    expect,
    it,
    fit,
} from "@jest/globals";
import { parse, lineLoc, dump } from "../utils";
import { SQTree as qt } from "../../src/ast";

describe("Empty", () => {

    it("If, empty", () => {
        const response = parse(" if (1) ; ");
        // dump(response);
        expect(response?.body[0]?.["consequent"].type).toBe("EmptyStatement");
    });

    it("For, empty", () => {
        const response = parse(" for(;;); ");
        // dump(response);
        expect(response?.body[0]?.["body"].type).toBe("EmptyStatement");
    });

    it("While, empty", () => {
        const response = parse(" while(1); ");
        // dump(response);
        expect(response?.body[0]?.["body"].type).toBe("EmptyStatement");
    });

    it("DoWhile, empty", () => {
        const response = parse(" do; while(1); ");
        // dump(response);
        expect(response?.body[0]?.["body"].type).toBe("EmptyStatement");
    });

    it("Try, empty", () => {
        const response = parse(" try; catch(e); ");
        // dump(response);
        expect(response?.body[0]?.["block"].type).toBe("EmptyStatement");
        expect(response?.body[0]?.["handler"].body.type).toBe("EmptyStatement");
    });

});
