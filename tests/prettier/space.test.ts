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

    // --------------------------------

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

    // --------------------------------

    it("Array bracket spacing, off", async () => {
        const options = { arrayBracketSpacing: false };
        const response = await format('[1,2,3];', options);
        expect(response).toBe('[1, 2, 3];\n');
    });

    it("Array bracket spacing, on", async () => {
        const options = { arrayBracketSpacing: true };
        const response = await format('[1,2,3];', options);
        expect(response).toBe('[ 1, 2, 3 ];\n');
    });

    it("Array bracket spacing, not array", async () => {
        const options = { arrayBracketSpacing: true };
        const response = await format('table["key"];', options);
        expect(response).toBe('table["key"];\n');
    });

    // --------------------------------

    it("Curly braces spacing, off", async () => {
        const options = { objectCurlySpacing: false };
        const response = await format('local x = {a=1};', options);
        expect(response).toBe('local x = {a = 1};\n');
    });

    it("Curly braces spacing, on", async () => {
        const options = { objectCurlySpacing: true };
        const response = await format('local x = {a=1};', options);
        expect(response).toBe('local x = { a = 1 };\n');
    });

    // --------------------------------

    it("Parentheses spacing, off", async () => {
        const options = { spaceInParens: false };
        const response = await format('foo(  1  );', options);
        expect(response).toBe('foo(1);\n');
    });

    it("Parentheses spacing, on", async () => {
        const options = { spaceInParens: true };
        const response = await format('foo(  1  );', options);
        expect(response).toBe('foo( 1 );\n');
    });

    // --------------------------------

    it("Computed property spacing, off string", async () => {
        const options = { computedPropertySpacing: false };
        const response = await format('x[  "key"  ];', options);
        expect(response).toBe('x["key"];\n');
    });

    it("Computed property spacing, off number", async () => {
        const options = { computedPropertySpacing: false };
        const response = await format('x[  0  ];', options);
        expect(response).toBe('x[0];\n');
    });

    it("Computed property spacing, on string", async () => {
        const options = { computedPropertySpacing: true };
        const response = await format('x[  "key"  ];', options);
        expect(response).toBe('x[ "key" ];\n');
    });

    it("Computed property spacing, on number", async () => {
        const options = { computedPropertySpacing: true };
        const response = await format('x[  0  ];', options);
        expect(response).toBe('x[ 0 ];\n');
    });

    it("Computed property spacing, not property", async () => {
        const options = { computedPropertySpacing: true };
        const response = await format('[1,2,3];', options);
        expect(response).toBe('[1, 2, 3];\n');
    });

    // --------------------------------

    it("Semicolon, off", async () => {
        const options = { semi: false };
        const response = await format('value', options);
        expect(response).toBe('value\n');
    });

    it("Semicolon, on", async () => {
        const options = { semi: true };
        const response = await format('value', options);
        expect(response).toBe('value;\n');
    });

    it("Semicolon, not on braces", async () => {
        const options = { semi: true };
        const response = await format('function foo() {}', options);
        expect(response).toBe('function foo() {}\n');
    });

    // --------------------------------

    it("Tabs, off", async () => {
        const options = { useTabs: false };
        const response = await format('function foo() { value; }', options);
        expect(response).toBe('function foo() {\n    value;\n}\n');
    });

    it("Tabs, on", async () => {
        const options = { useTabs: true };
        const response = await format('function foo() { value; }', options);
        expect(response).toBe('function foo() {\n\tvalue;\n}\n');
    });
});
