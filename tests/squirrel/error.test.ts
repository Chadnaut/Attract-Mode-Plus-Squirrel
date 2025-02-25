import {
    beforeEach,
    describe,
    fdescribe,
    expect,
    it,
    fit,
} from "@jest/globals";
import { parse, parseForce, lineLoc, dump, errors } from "../utils";

describe("Error", () => {

    it("Throws: expected 'IDENTIFIER'", () => {
        expect(() => {
            parse("enum e { x = 1 }; x = e.;");
        }).toThrow("expected 'IDENTIFIER'");
    });

    it("Throws: expected 'WHILE'", () => {
        expect(() => {
            parse("do {}");
        }).toThrow("expected 'WHILE'");
        expect(() => {
            parse("if");
        }).toThrow("expected '('");
        expect(() => {
            parse("enum e { x = 1 }; x = e;");
        }).toThrow("expected '.'");
    });

    it("Throws: end of statement expected (; or lf)", () => {
        expect(() => {
            parse("local x = 1 local y = 2");
        }).toThrow("end of statement expected (; or lf)");
    });

    it("Throws: 'break' has to be in a loop block", () => {
        expect(() => {
            parse("break;");
        }).toThrow("'break' has to be in a loop block");
        expect(() => {
            parse("while (1) { function a () { break; } }");
        }).toThrow("'break' has to be in a loop block");
    });

    it("Throws: 'continue' has to be in a loop block", () => {
        expect(() => {
            parse("continue;");
        }).toThrow("'continue' has to be in a loop block");
        expect(() => {
            parse("while (1) { function a () { continue; } }");
        }).toThrow("'continue' has to be in a loop block");
        expect(() => {
            parse("switch (a) { case 1: continue; }");
        }).toThrow("'continue' has to be in a loop block");
    });

    it("Throws: can't assign expression", () => {
        expect(() => {
            parse("const x = 1; x = 2;");
        }).toThrow("can't assign expression");
        expect(() => {
            parse("enum e { x = 1 }; e.x = 2;");
        }).toThrow("can't assign expression");
    });

    it("Throws: 'base' cannot be modified", () => {
        expect(() => {
            parse("base = 123;");
        }).toThrow("'base' cannot be modified");
    });

    it("Throws: can't 'create' a local slot", () => {
        expect(() => {
            parse("local x; x <- 1;");
        }).toThrow("can't 'create' a local slot");

        parseForce("<- 1");
        expect(errors()).toContain("can't 'create' a local slot");
    });

    it("Throws: cannot brake deref/or comma needed after [exp]=exp slot declaration", () => {
        expect(() => {
            parse("x\n[1]");
        }).toThrow("cannot brake deref/or comma needed after [exp]=exp slot declaration");
    });

    it("Throws: can't '++' or '--' an expression", () => {
        expect(() => {
            parse("++(1+2);");
        }).toThrow("can't '++' or '--' an expression");
        expect(() => {
            parse("const x = 1; ++x;");
        }).toThrow("can't '++' or '--' an expression");
    });

    it("Throws: invalid constant [...]", () => {
        expect(() => {
            parse("enum e { x = 1 }; x = e.y;");
        }).toThrow("invalid constant [e.y]");
    });

    it("Throws: expression expected", () => {
        expect(() => { parse(":.x"); }).toThrow("expression expected");
        expect(() => { parse("print("); }).toThrow("expression expected");
    });

    it("Throws: expression expected, found ')'", () => {
        expect(() => {
            parse("func(a,)");
        }).toThrow("expression expected, found ')'");
    });

    it("Throws: invalid class name", () => {
        expect(() => {
            parse("class 1 {}");
        }).toThrow("invalid class name");
        expect(() => {
            parse("class {}\n\n");
        }).toThrow("invalid class name");
        // }).toThrow("line 3 column 0: invalid class name");
    });

    it("Throws: cannot create a class in a local with the syntax(class <local>)", () => {
        expect(() => {
            parse("local x; class x {};");
        }).toThrow("cannot create a class in a local with the syntax(class <local>)");
    });

    it("Throws: scalar expected", () => {
        expect(() => {
            parse("const x = -{ y = 1 };");
        }).toThrow("scalar expected : integer,float");
        expect(() => {
            parse("enum x { y = { x = 1 } };");
        }).toThrow("scalar expected : integer,float or string");
    });

    it("Throws: scalar expected, string", () => {
        expect(() => {
            parse("const x = { y = 1 };");
        }).toThrow("scalar expected : integer,float or string");
    });

    it("Throws: can't delete an expression", () => {
        expect(() => {
            parse("const x = 1; delete x;");
        }).toThrow("can't delete an expression");
    });

    it("Throws: cannot delete an (outer) local", () => {
        expect(() => {
            parse("local x = 1; delete x;");
        }).toThrow("cannot delete an (outer) local");
        expect(() => {
            parse("delete this;");
        }).toThrow("cannot delete an (outer) local");
    });

    it("Throws: can't '++' or '--' an expression (suffix)", () => {
        expect(() => {
            parse("const x = 1; x++;");
        }).toThrow("can't '++' or '--' an expression");
    });

    it("Throws: function with default parameters cannot have variable number of parameters", () => {
        expect(() => {
            parse("function foo(x=1, ...) {}");
        }).toThrow("function with default parameters cannot have variable number of parameters");
    });

    it("Throws: expected ')'", () => {
        expect(() => {
            parse("function foo(..., x) {}");
        }).toThrow("expected ')'");
    });

    it("Throws: expected '='", () => {
        expect(() => {
            parse("function foo(x = 1, y) {}");
        }).toThrow("expected '='");
    });

    it("Throws: expected ')' or ','", () => {
        expect(() => {
            parse("function foo(x {}");
        }).toThrow("expected ')' or ','");
    });

    // -------------------------------------------------------------------------
    // Custom errors not in original code

    it("Throws: newline expected", () => {
        parseForce("local x = 0");
        expect(errors()).toContain("newline expected");
    });

    // -------------------------------------------------------------------------
    // Custom errors due to not aborting on first error

    it("Throws: expected ']'", () => {
        parseForce("local x = [1,2");
        expect(errors()).toContain("expected ']'");
    });

    it("Throws: expected ')'", () => {
        parseForce("function foo(a");
        expect(errors()).toContain("expected ')'");
    });

    it("Throws: expected ']'", () => {
        parseForce("local x = [1,");
        expect(errors()).toContain("expected ']'");
    });

    it("Throws: expected '}'", () => {
        parseForce("class foo { function bar() {} ");
        expect(errors()).toContain("expected '}'");
    });

    it("Throws: expected '/>'", () => {
        parseForce("class foo </ x = 10, ");
        expect(errors()).toContain("expected '/>'");
    });

    it("Throws: expected '}'", () => {
        parseForce("enum {x,");
        expect(errors()).toContain("expected '}'");
    });
});
