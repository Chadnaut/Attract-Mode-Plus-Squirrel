import { describe, expect, it } from "@jest/globals";
import { format, dump } from "../utils";

describe("Function", () => {
    it("FunctionDeclaration", async () => {
        const response = await format("  function   foo( ) {   x = 1  }");
        expect(response).toBe("function foo() {\n    x = 1;\n}\n");
    });
    it("Function, member id", async () => {
        const response = await format("  function foo::bar::who()   { x = 1; }");
        expect(response).toBe("function foo::bar::who() {\n    x = 1;\n}\n");
    });
    it("Local", async () => {
        const response = await format("  local function foo() { x = 1 }");
        expect(response).toBe("local function foo() {\n    x = 1;\n}\n");
    });
    it("FunctionExpression", async () => {
        const response = await format("  local x = function()   { x = 1; } ");
        expect(response).toBe("local x = function () {\n    x = 1;\n};\n");
    });
    it("Lambda", async () => {
        const response = await format("  local x  =  @(y)   y+1 ");
        expect(response).toBe("local x = @(y) y + 1;\n");
    });
    it("Lambda, comment", async () => {
        const response = await format("  local x  =  @(y) /* c */  y+1;   // comment");
        expect(response).toBe("local x = @(y) /* c */ y + 1; // comment\n");
    });
    it("CallExpression", async () => {
        const response = await format("  func  (a,   b)  ");
        expect(response).toBe("func(a, b);\n");
    });
    it("CallExpression, func", async () => {
        const response = await format("  func  (a,   b, function(f) { c })  ");
        expect(response).toBe("func(a, b, function (f) {\n    c;\n});\n");
    });
    it("Chaining", async () => {
        const response = await format(" parent. one  ( ) .two ().three().veeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeerylong()  ");
        expect(response).toBe("parent\n    .one()\n    .two()\n    .three()\n    .veeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeerylong();\n");
    });
    it("Params", async () => {
        const response = await format(" function foo(  x , y  ) {}  ");
        expect(response).toBe("function foo(x, y) {}\n");
    });
    it("Params, long", async () => {
        const response = await format(" function foo(  xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx , yyyyyyyyyyyyyyyyyyyyyyyyyyyyyy  ) {}  ");
        expect(response).toBe("function foo(\n    xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx,\n    yyyyyyyyyyyyyyyyyyyyyyyyyyyyyy\n) {}\n");
    });
    it("Param Defaults", async () => {
        const response = await format("  function foo  (  x = 1  , y =  2 ) {\n}  ");
        expect(response).toBe("function foo(x = 1, y = 2) {}\n");
    });
    it("Param Rest", async () => {
        const response = await format(" function foo( ... ) {}  ");
        expect(response).toBe("function foo(...) {}\n");
    });
    it("Param Both", async () => {
        const response = await format(" function foo(x,y,...) {}  ");
        expect(response).toBe("function foo(x, y, ...) {}\n");
    });

});
