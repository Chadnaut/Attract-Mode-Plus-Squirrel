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

describe("Function", () => {
    it("FunctionDeclaration", () => {
        const response = format("  function   foo( ) {   x = 1  }");
        expect(response).toBe("function foo() {\n    x = 1;\n}\n");
    });
    it("Function, member id", () => {
        const response = format("  function foo::bar::who()   { x = 1; }");
        expect(response).toBe("function foo::bar::who() {\n    x = 1;\n}\n");
    });
    it("Local", () => {
        const response = format("  local function foo() { x = 1 }");
        expect(response).toBe("local function foo() {\n    x = 1;\n}\n");
    });
    it("FunctionExpression", () => {
        const response = format("  local x = function()   { x = 1; } ");
        expect(response).toBe("local x = function () {\n    x = 1;\n};\n");
    });
    it("Lambda", () => {
        const response = format("  local x  =  @(y)   y+1 ");
        expect(response).toBe("local x = @(y) y + 1;\n");
    });
    it("Lambda, comment", () => {
        const response = format("  local x  =  @(y) /* c */  y+1;   // comment");
        expect(response).toBe("local x = @(y) /* c */ y + 1; // comment\n");
    });
    it("CallExpression", () => {
        const response = format("  func  (a,   b)  ");
        expect(response).toBe("func(a, b);\n");
    });
    it("CallExpression, func", () => {
        const response = format("  func  (a,   b, function(f) { c })  ");
        expect(response).toBe("func(a, b, function (f) {\n    c;\n});\n");
    });
    it("Chaining", () => {
        const response = format(" parent. one  ( ) .two ().three().veeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeerylong()  ");
        expect(response).toBe("parent\n    .one()\n    .two()\n    .three()\n    .veeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeerylong();\n");
    });
    it("Params", () => {
        const response = format(" function foo(  x , y  ) {}  ");
        expect(response).toBe("function foo(x, y) {}\n");
    });
    it("Params, long", () => {
        const response = format(" function foo(  xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx , yyyyyyyyyyyyyyyyyyyyyyyyyyyyyy  ) {}  ");
        expect(response).toBe("function foo(\n    xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx,\n    yyyyyyyyyyyyyyyyyyyyyyyyyyyyyy\n) {}\n");
    });
    it("Param Defaults", () => {
        const response = format("  function foo  (  x = 1  , y =  2 ) {\n}  ");
        expect(response).toBe("function foo(x = 1, y = 2) {}\n");
    });
    it("Param Rest", () => {
        const response = format(" function foo( ... ) {}  ");
        expect(response).toBe("function foo(...) {}\n");
    });
    it("Param Both", () => {
        const response = format(" function foo(x,y,...) {}  ");
        expect(response).toBe("function foo(x, y, ...) {}\n");
    });

});
