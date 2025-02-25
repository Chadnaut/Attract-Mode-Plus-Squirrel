import {
    beforeEach,
    describe,
    fdescribe,
    expect,
    it,
    fit,
    xit,
} from "@jest/globals";
import { formatCPP, dump } from "../utils";

describe("CPP", () => {

    it("FunctionDeclaration", () => {
        const response = formatCPP("  function   foo( ) {   x = 1  }");
        expect(response).toBe("function foo()\n{\n    x = 1;\n}\n");
    });
    it("FunctionDeclaration, Empty", () => {
        const response = formatCPP("  function   foo( ) {    }");
        expect(response).toBe("function foo()\n{\n}\n");
    });
    it("FunctionDeclaration, Local", () => {
        const response = formatCPP("  local function foo() { x = 1 }");
        expect(response).toBe("local function foo()\n{\n    x = 1;\n}\n");
    });
    it("FunctionDeclaration, Local Empty", () => {
        const response = formatCPP("  local function foo() {  }");
        expect(response).toBe("local function foo()\n{\n}\n");
    });
    it("FunctionExpression", () => {
        const response = formatCPP("  local x = function()   { x = 1; } ");
        expect(response).toBe("local x = function ()\n{\n    x = 1;\n};\n");
    });
    it("FunctionExpression, Empty", () => {
        const response = formatCPP("  local x = function()   {  } ");
        expect(response).toBe("local x = function ()\n{\n};\n");
    });
    it("Lambda", () => {
        const response = formatCPP("  local x  =  @(y)   y+1 ");
        expect(response).toBe("local x = @(y) y + 1;\n");
    });
    it("CallExpression, func", () => {
        const response = formatCPP("  func  (a,   b, function(f) { c })  ");
        expect(response).toBe("func(a, b, function (f)\n{\n    c;\n});\n");
    });
    it("ClassExpression", () => {
        const response = formatCPP("  local  x  =   class{x=1}");
        expect(response).toBe("local x = class\n{\n    x = 1;\n};\n");
    });
    it("ClassExpression, Empty", () => {
        const response = formatCPP("  local  x  =   class{}");
        expect(response).toBe("local x = class\n{\n};\n");
    });
    it("ClassDeclaration", () => {
        const response = formatCPP("  class foo {x=1}");
        expect(response).toBe("class foo\n{\n    x = 1;\n}\n");
    });
    it("ClassDeclaration, empty", () => {
        const response = formatCPP("  class foo {}");
        expect(response).toBe("class foo\n{\n}\n");
    });
    // xit("ClassExpression, Attribute", () => {
    //     const response = formatCPP("local x = class </a=1,b=2/> {}");
    //     expect(response).toBe("local x = class </ a = 1, b = 2 /> {};\n");
    // });
    it("MethodDefinition", () => {
        const response = formatCPP("  class foo { function x(a) { b;} } ");
        expect(response).toBe("class foo\n{\n    function x(a)\n    {\n        b;\n    }\n}\n");
    });
    it("MethodDefinition, Empty", () => {
        const response = formatCPP("  class foo { function x(a) {} } ");
        expect(response).toBe("class foo\n{\n    function x(a)\n    {\n    }\n}\n");
    });
    it("Constructor", () => {
        const response = formatCPP('  class foo { constructor  (x) { a} } ');
        expect(response).toBe("class foo\n{\n    constructor(x)\n    {\n        a;\n    }\n}\n");
    });
    it("Constructor, Empty", () => {
        const response = formatCPP('  class foo { constructor  (x) {} } ');
        expect(response).toBe("class foo\n{\n    constructor(x)\n    {\n    }\n}\n");
    });
    it("Enum", () => {
        const response = formatCPP('  enum     x {a,b} ');
        expect(response).toBe('enum x\n{\n    a,\n    b\n}\n');
    });
    it("Enum, Empty", () => {
        const response = formatCPP('  enum     x {} ');
        expect(response).toBe('enum x\n{\n}\n');
    });
    it("Table", () => {
        const response = formatCPP('  local x = { a = 1 } ');
        expect(response).toBe('local x = { a = 1 };\n');
    });
    it("Table, empty", () => {
        const response = formatCPP('  local x = {} ');
        expect(response).toBe('local x = {};\n');
    });
    it("Table, long", () => {
        const response = formatCPP('  local x = { x = 111111111111111111111111111111111111111111, y = 2222222222222222222222222222222222222222222222 } ');
        expect(response).toBe('local x =\n{\n    x = 111111111111111111111111111111111111111111,\n    y = 2222222222222222222222222222222222222222222222\n};\n');
    });
    it("If", () => {
        const response = formatCPP(" if  ( 1  ) { a }");
        expect(response).toBe("if (1)\n{\n    a;\n}\n");
    });
    it("If, Empty", () => {
        const response = formatCPP(" if  ( 1  ) { }");
        expect(response).toBe("if (1)\n{\n}\n");
    });
    it("If Else", () => {
        const response = formatCPP(" if  ( 1  ) { a }  else  { b }");
        expect(response).toBe("if (1)\n{\n    a;\n}\nelse\n{\n    b;\n}\n");
    });
    it("If Else, Sameline", () => {
        const response = formatCPP(" if  ( 1  )  a   else   b ");
        expect(response).toBe("if (1) a;\nelse b;\n");
    });
    it("If Else, Empty", () => {
        const response = formatCPP(" if  ( 1  ) {  }  else  {  }");
        expect(response).toBe("if (1)\n{\n}\nelse\n{\n}\n");
    });
    it("If Else If, Empty", () => {
        const response = formatCPP(" if  ( 1  ) {  }  else if (2)  {  }");
        expect(response).toBe("if (1)\n{\n}\nelse if (2)\n{\n}\n");
    });
    it("Switch", () => {
        const response = formatCPP(" switch (x) { case 1:a;case 2:b;}");
        expect(response).toBe("switch (x)\n{\n    case 1:\n        a;\n    case 2:\n        b;\n}\n");
    });
    it("ForStatement", () => {
        const response = formatCPP(' for (local x=0  ; x<1;  x++) { a } ');
        expect(response).toBe('for (local x = 0; x < 1; x++)\n{\n    a;\n}\n');
    });
    it("ForStatement, Empty", () => {
        const response = formatCPP(' for (local x=0  ; x<1;  x++) {  } ');
        expect(response).toBe('for (local x = 0; x < 1; x++)\n{\n}\n');
    });
    it("ForEachStatement", () => {
        const response = formatCPP(' foreach ( x in y ) { a } ');
        expect(response).toBe('foreach (x in y)\n{\n    a;\n}\n');
    });
    it("ForEachStatement, Empty", () => {
        const response = formatCPP(' foreach ( x in y ) {} ');
        expect(response).toBe('foreach (x in y)\n{\n}\n');
    });
    it("TryStatement", () => {
        const response = formatCPP("  try {  a  } catch  (e)  { b }  ");
        expect(response).toBe("try\n{\n    a;\n}\ncatch (e)\n{\n    b;\n}\n");
    });
    it("TryStatement, Empty", () => {
        const response = formatCPP("  try {    } catch  (e)  {  }  ");
        expect(response).toBe("try\n{\n}\ncatch (e)\n{\n}\n");
    });
    it("WhileStatement", () => {
        const response = formatCPP("  while ( 1 ){  a  }");
        expect(response).toBe("while (1)\n{\n    a;\n}\n");
    });
    it("WhileStatement, Empty", () => {
        const response = formatCPP("  while ( 1 ){   }");
        expect(response).toBe("while (1)\n{\n}\n");
    });
    it("DoWhileStatement", () => {
        const response = formatCPP(" do {a}  while ( 1 )");
        expect(response).toBe("do\n{\n    a;\n}\nwhile (1);\n");
    });
    it("DoWhileStatement, Empty", () => {
        const response = formatCPP(" do {}  while ( 1 )");
        expect(response).toBe("do\n{\n}\nwhile (1);\n");
    });

});
