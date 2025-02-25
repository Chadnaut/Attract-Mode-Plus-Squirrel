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

describe("For", () => {
    it("ForStatement", () => {
        const response = format(' for (local x=0  ; x<1;  x++) { a } ');
        expect(response).toBe('for (local x = 0; x < 1; x++) {\n    a;\n}\n');
    });

    it("ForStatement, null", () => {
        const response = format(' for ( ;  ; ) { a } ');
        expect(response).toBe('for (;;) {\n    a;\n}\n');
    });

    it("ForStatement, braceless", () => {
        const response = format(' for ( ;  ; ) a ');
        expect(response).toBe('for (;;) a;\n');
    });

    it("ForStatement, long", () => {
        const response = format(' for (local x=0  ; x<yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy;  x++) { a } ');
        expect(response).toBe('for (\n    local x = 0;\n    x < yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy;\n    x++\n) {\n    a;\n}\n');
    });

    it("ForEachStatement", () => {
        const response = format(' foreach ( x in y ) { a } ');
        expect(response).toBe('foreach (x in y) {\n    a;\n}\n');
    });

    it("ForEachStatement, long", () => {
        const response = format(' foreach ( x in yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy ) { a } ');
        expect(response).toBe('foreach (x in yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy) {\n    a;\n}\n');
    });

    it("ForEachStatement, index", () => {
        const response = format(' foreach ( i,  x in y ) { a } ');
        expect(response).toBe('foreach (i, x in y) {\n    a;\n}\n');
    });

});
