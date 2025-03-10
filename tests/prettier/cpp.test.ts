import { describe, expect, it } from "@jest/globals";
import { formatCPP } from "../utils";

describe("CPP", () => {

    it("ForStatement, null", async () => {
        const response = await formatCPP(' for ( ;  ; ) { } ');
        expect(response).toBe('for (;;)\n{\n}\n');
    });
    it("FunctionDeclaration", async () => {
        const response = await formatCPP("  function   foo( ) {   x = 1  }");
        expect(response).toBe("function foo()\n{\n    x = 1;\n}\n");
    });
    it("FunctionDeclaration, Empty", async () => {
        const response = await formatCPP("  function   foo( ) {    }");
        expect(response).toBe("function foo()\n{\n}\n");
    });
    it("FunctionDeclaration, Local", async () => {
        const response = await formatCPP("  local function foo() { x = 1 }");
        expect(response).toBe("local function foo()\n{\n    x = 1;\n}\n");
    });
    it("FunctionDeclaration, Local Empty", async () => {
        const response = await formatCPP("  local function foo() {  }");
        expect(response).toBe("local function foo()\n{\n}\n");
    });
    it("FunctionExpression", async () => {
        const response = await formatCPP("  local x = function()   { x = 1; } ");
        expect(response).toBe("local x = function ()\n{\n    x = 1;\n};\n");
    });
    it("FunctionExpression, Empty", async () => {
        const response = await formatCPP("  local x = function()   {  } ");
        expect(response).toBe("local x = function ()\n{\n};\n");
    });
    it("Lambda", async () => {
        const response = await formatCPP("  local x  =  @(y)   y+1 ");
        expect(response).toBe("local x = @( y ) y + 1;\n");
    });
    it("CallExpression, func", async () => {
        const response = await formatCPP("  func  (a,   b, function(f) { c })  ");
        expect(response).toBe("func( a, b, function ( f )\n{\n    c;\n} );\n");
    });
    it("ClassExpression", async () => {
        const response = await formatCPP("  local  x  =   class{x=1}");
        expect(response).toBe("local x = class\n{\n    x = 1;\n};\n");
    });
    it("ClassExpression, Empty", async () => {
        const response = await formatCPP("  local  x  =   class{}");
        expect(response).toBe("local x = class\n{\n};\n");
    });
    it("ClassDeclaration", async () => {
        const response = await formatCPP("  class foo {x=1}");
        expect(response).toBe("class foo\n{\n    x = 1;\n}\n");
    });
    it("ClassDeclaration, empty", async () => {
        const response = await formatCPP("  class foo {}");
        expect(response).toBe("class foo\n{\n}\n");
    });
    it("MethodDefinition", async () => {
        const response = await formatCPP("  class foo { function x(a) { b;} } ");
        expect(response).toBe(
            "class foo\n{\n    function x( a )\n    {\n        b;\n    }\n}\n",
        );
    });
    it("MethodDefinition, Empty", async () => {
        const response = await formatCPP("  class foo { function x(a) {} } ");
        expect(response).toBe(
            "class foo\n{\n    function x( a )\n    {\n    }\n}\n",
        );
    });
    it("Constructor", async () => {
        const response = await formatCPP("  class foo { constructor  ( x) { a} } ");
        expect(response).toBe(
            "class foo\n{\n    constructor( x )\n    {\n        a;\n    }\n}\n",
        );
    });
    it("Constructor, Empty", async () => {
        const response = await formatCPP("  class foo { constructor  ( x) {} } ");
        expect(response).toBe(
            "class foo\n{\n    constructor( x )\n    {\n    }\n}\n",
        );
    });
    it("Enum", async () => {
        const response = await formatCPP("  enum     x {a,b} ");
        expect(response).toBe("enum x\n{\n    a,\n    b\n}\n");
    });
    it("Enum, Empty", async () => {
        const response = await formatCPP("  enum     x {} ");
        expect(response).toBe("enum x\n{\n}\n");
    });
    it("Table", async () => {
        const response = await formatCPP("  local x = { a = 1 } ");
        expect(response).toBe("local x = { a = 1 };\n");
    });
    it("Table, empty", async () => {
        const response = await formatCPP("  local x = {} ");
        expect(response).toBe("local x = {};\n");
    });
    it("Table, long", async () => {
        const response = await formatCPP(
            "  local x = { x = 111111111111111111111111111111111111111111, y = 2222222222222222222222222222222222222222222222 } ",
        );
        expect(response).toBe(
            "local x =\n{\n    x = 111111111111111111111111111111111111111111,\n    y = 2222222222222222222222222222222222222222222222\n};\n",
        );
    });
    it("If", async () => {
        const response = await formatCPP(" if  ( 1  ) { a }");
        expect(response).toBe("if ( 1 )\n{\n    a;\n}\n");
    });
    it("If, Empty", async () => {
        const response = await formatCPP(" if  ( 1  ) { }");
        expect(response).toBe("if ( 1 )\n{\n}\n");
    });
    it("If Else", async () => {
        const response = await formatCPP(" if  ( 1  ) { a }  else  { b }");
        expect(response).toBe("if ( 1 )\n{\n    a;\n}\nelse\n{\n    b;\n}\n");
    });
    it("If Else, Sameline", async () => {
        const response = await formatCPP(" if  ( 1  )  a   else   b ");
        expect(response).toBe("if ( 1 ) a;\nelse b;\n");
    });
    it("If Else, Empty", async () => {
        const response = await formatCPP(" if  ( 1  ) {  }  else  {  }");
        expect(response).toBe("if ( 1 )\n{\n}\nelse\n{\n}\n");
    });
    it("If Else If, Empty", async () => {
        const response = await formatCPP(" if  ( 1  ) {  }  else if (  2)  {  }");
        expect(response).toBe("if ( 1 )\n{\n}\nelse if ( 2 )\n{\n}\n");
    });
    it("Switch", async () => {
        const response = await formatCPP(" switch ( x) { case 1:a;case 2:b;}");
        expect(response).toBe(
            "switch ( x )\n{\n    case 1:\n        a;\n    case 2:\n        b;\n}\n",
        );
    });
    it("ForStatement", async () => {
        const response = await formatCPP(" for (local x=0  ; x<1;  x++) { a } ");
        expect(response).toBe(
            "for ( local x = 0; x < 1; x++ )\n{\n    a;\n}\n",
        );
    });
    it("ForStatement, Empty", async () => {
        const response = await formatCPP(" for (local x=0  ; x<1;  x++) {  } ");
        expect(response).toBe("for ( local x = 0; x < 1; x++ )\n{\n}\n");
    });
    it("ForEachStatement", async () => {
        const response = await formatCPP(" foreach ( x in y ) { a } ");
        expect(response).toBe("foreach ( x in y )\n{\n    a;\n}\n");
    });
    it("ForEachStatement, Empty", async () => {
        const response = await formatCPP(" foreach ( x in y ) {} ");
        expect(response).toBe("foreach ( x in y )\n{\n}\n");
    });
    it("TryStatement", async () => {
        const response = await formatCPP("  try {  a  } catch  ( e)  { b }  ");
        expect(response).toBe("try\n{\n    a;\n}\ncatch ( e )\n{\n    b;\n}\n");
    });
    it("TryStatement, Empty", async () => {
        const response = await formatCPP("  try {    } catch  ( e)  {  }  ");
        expect(response).toBe("try\n{\n}\ncatch ( e )\n{\n}\n");
    });
    it("WhileStatement", async () => {
        const response = await formatCPP("  while (   1 ){  a  }");
        expect(response).toBe("while ( 1 )\n{\n    a;\n}\n");
    });
    it("WhileStatement, Empty", async () => {
        const response = await formatCPP("  while (   1 ){   }");
        expect(response).toBe("while ( 1 )\n{\n}\n");
    });
    it("DoWhileStatement", async () => {
        const response = await formatCPP(" do {a}  while (  1 )");
        expect(response).toBe("do\n{\n    a;\n}\nwhile ( 1 );\n");
    });
    it("DoWhileStatement, Empty", async () => {
        const response = await formatCPP(" do {}  while (  1 )");
        expect(response).toBe("do\n{\n}\nwhile ( 1 );\n");
    });
    it("Unary", async () => {
        const response = await formatCPP(" ! true ");
        expect(response).toBe("!true;\n");
    });
    it("Unary, Comment", async () => {
        const response = await formatCPP(" ! /*comment*/ true ");
        expect(response).toBe("!( /*comment*/ true );\n");
    });
    it("Ternary", async () => {
        const response = await formatCPP("1?2?3:4:5");
        expect(response).toBe("1 ? ( 2 ? 3 : 4 ) : 5;\n");
    });
    it("Conditional", async () => {
        const response = await formatCPP("@()true?1:0\n");
        expect(response).toBe("@() true ? 1 : 0\n");
    });
    it("Conditional, Assigned", async () => {
        const response = await formatCPP("local   x = @() 1?2:3");
        expect(response).toBe("local x = @() 1 ? 2 : 3;\n");
    });
    it("Conditional, Sequence Parens", async () => {
        const response = await formatCPP("local   x = @() (1,2,3)");
        expect(response).toBe("local x = @() ( 1, 2, 3 );\n");
    });
    it("Call Args, All Broken Out", async () => {
        const response = await formatCPP("call(1,2\n\n3)");
        expect(response).toBe("call(\n    1,\n    2,\n\n    3\n);\n");
    });
    it("Function param comment", async () => {
        const response = await formatCPP("function   a(/*comment*/){}");
        expect(response).toBe("function a( /*comment*/ )\n{\n}\n");
    });
    it("Function multiline return", async () => {
        const response = await formatCPP("function a(){ return -(1000000000000000000000000000000*1000000000000000000000000000000)+1 }");
        expect(response).toBe("function a()\n{\n    return (\n        -( 1000000000000000000000000000000 * 1000000000000000000000000000000 ) +\n        1\n    );\n}\n");
    });

    it("Assign bracket newline", async () => {
        const response = await formatCPP('local x = (1+2)\n\nlocal y = 3 + 4');
        expect(response).toBe(`local x = 1 + 2;\n\nlocal y = 3 + 4;\n`);
    });

    it("Array", async () => {
        const response = await formatCPP('local x = [1,2,3] ');
        expect(response).toBe(`local x = [ 1, 2, 3 ];\n`);
    });
    it("For sequence", async () => {
        const response = await formatCPP('for(a,b;c,d;e,f){}');
        expect(response).toBe(`for ( a, b; c, d; e, f )\n{\n}\n`);
    });

    // Appears odd, but sequence adds extra brackets here
    // - This matches JS behavior

    it("Yield sequence", async () => {
        const response = await formatCPP('function a(){ yield 1,2}');
        expect(response).toBe(`function a()\n{\n    yield ( 1, 2 );\n}\n`); // js yield has no parens
    });
    it("Throw", async () => {
        const response = await formatCPP('throw 1,2');
        expect(response).toBe(`throw ( 1, 2 );\n`);
    });
    it("Table key sequence", async () => {
        const response = await formatCPP('local x = { ["x", "y"] = 1 } ');
        expect(response).toBe(`local x = { [ ( "x", "y" ) ] = 1 };\n`);
    });

    it("If sequence", async () => {
        const response = await formatCPP('if(1,2){}');
        expect(response).toBe(`if ( ( 1, 2 ) )\n{\n}\n`);
    });
    it("While sequence", async () => {
        const response = await formatCPP('while(1,2){}');
        expect(response).toBe(`while ( ( 1, 2 ) )\n{\n}\n`);
    });
    it("Do While sequence", async () => {
        const response = await formatCPP('do{}while(1,2)');
        expect(response).toBe(`do\n{\n}\nwhile ( ( 1, 2 ) );\n`);
    });
    it("Switch sequence", async () => {
        const response = await formatCPP('switch(a,b){}');
        expect(response).toBe(`switch ( ( a, b ) )\n{\n}\n`);
    });
});
