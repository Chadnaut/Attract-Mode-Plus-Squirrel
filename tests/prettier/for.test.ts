import { describe, expect, it } from "@jest/globals";
import { format, dump } from "../utils";

describe("For", () => {
    it("ForStatement", async () => {
        const response = await format(' for (local x=0  ; x<1;  x++) { a } ');
        expect(response).toBe('for (local x = 0; x < 1; x++) {\n    a;\n}\n');
    });

    it("ForStatement, null", async () => {
        const response = await format(' for ( ;  ; ) { a } ');
        expect(response).toBe('for (;;) {\n    a;\n}\n');
    });

    it("ForStatement, braceless", async () => {
        const response = await format(' for ( ;  ; ) a ');
        expect(response).toBe('for (;;) a;\n');
    });

    it("ForStatement, long", async () => {
        const response = await format(' for (local x=0  ; x<yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy;  x++) { a } ');
        expect(response).toBe('for (\n    local x = 0;\n    x < yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy;\n    x++\n) {\n    a;\n}\n');
    });

    it("ForEachStatement", async () => {
        const response = await format(' foreach ( x in y ) { a } ');
        expect(response).toBe('foreach (x in y) {\n    a;\n}\n');
    });

    it("ForEachStatement, long", async () => {
        const response = await format(' foreach ( x in yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy ) { a } ');
        expect(response).toBe('foreach (x in yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy) {\n    a;\n}\n');
    });

    it("ForEachStatement, index", async () => {
        const response = await format(' foreach ( i,  x in y ) { a } ');
        expect(response).toBe('foreach (i, x in y) {\n    a;\n}\n');
    });

});
