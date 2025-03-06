import { describe, expect, it } from "@jest/globals";
import { format } from "../utils";

describe("Space", () => {

    it("1tbs", async () => {
        const options = { braceStyle: '1tbs' };
        const response = await format('if(1){}else{}', options);
        expect(response).toBe('if (1) {\n} else {\n}\n');
    });

    it("allman", async () => {
        const options = { braceStyle: 'allman' };
        const response = await format('if(1){}else{}', options);
        expect(response).toBe('if (1)\n{\n}\nelse\n{\n}\n');
    });

    it("stroustrup", async () => {
        const options = { braceStyle: 'stroustrup' };
        const response = await format('if(1){}else{}', options);
        expect(response).toBe('if (1) {\n}\nelse {\n}\n');
    });

    // --------------------------------

    it("1tsb", async () => {
        const options = { spaceInParens: true, condenseParens: true };
        const response = await format('if(call());', options);
        expect(response).toBe('if ( call() );\n');
    });

    it("Reduce Parens", async () => {
        const options = { reduceParens: true };
        const response = await format('if((true));', options);
        expect(response).toBe('if (true);\n');
    });

    it("No Reduce Parens", async () => {
        const options = { reduceParens: false };
        const response = await format('if((true));', options);
        expect(response).toBe('if ((true));\n');
    });

    it("No Reduce Parens Multiple", async () => {
        const options = { reduceParens: false };
        const response = await format('if(((true)));', options);
        expect(response).toBe('if ((true));\n');
    });

    it("No space in parens", async () => {
        const options = { spaceInParens: false };
        const response = await format('if(true);', options);
        expect(response).toBe('if (true);\n');
    });

    it("Space in parens", async () => {
        const options = { spaceInParens: true };
        const response = await format('if(true);', options);
        expect(response).toBe('if ( true );\n');
    });

    it("No Condense Parens", async () => {
        const options = { spaceInParens: true, condenseParens: false };
        const response = await format('if((1+2)*3);', options);
        expect(response).toBe('if ( ( 1 + 2 ) * 3 );\n');
    });

    it("Condense Parens Left", async () => {
        const options = { spaceInParens: true, condenseParens: true };
        const response = await format('if((1+2)*3);', options);
        expect(response).toBe('if (( 1 + 2 ) * 3 );\n');
    });

    it("Condense Parens Right", async () => {
        const options = { spaceInParens: true, condenseParens: true };
        const response = await format('if(1*(2+3));', options);
        expect(response).toBe('if ( 1 * ( 2 + 3 ));\n');
    });

    it("Condense Parens Both", async () => {
        const options = { spaceInParens: true, condenseParens: true };
        const response = await format('if((1+2)*(3+4));', options);
        expect(response).toBe('if (( 1 + 2 ) * ( 3 + 4 ));\n');
    });

    it("Condense Parens Call", async () => {
        const options = { spaceInParens: true, condenseParens: true };
        const response = await format('if(call());', options);
        expect(response).toBe('if ( call() );\n');
    });
});
