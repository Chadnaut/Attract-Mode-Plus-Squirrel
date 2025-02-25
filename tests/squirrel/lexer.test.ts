import { beforeEach, describe, expect, it, fit } from "@jest/globals";
import { CompilerErrorFunc, TK } from "../../src/squirrel/squirrel/sqcompiler.h";
import { SQLexer } from "../../src/squirrel/squirrel/sqlexer.cpp";
import { parse, lineLoc, dump } from "../utils";
import { MAX_CHAR } from "../../src/squirrel/include/squirrel.h";
import { SQLexerStruct } from "../../src/squirrel/squirrel/sqlexer.h";
import { SQSharedState } from "../../src/squirrel/squirrel/sqstate.cpp";

jest.mock('../../src/squirrel/include/squirrel.h', () => ({
    ...jest.requireActual('../../src/squirrel/include/squirrel.h'),
    MAX_CHAR: 0xFF
}));

let errors = [];
let index = 0;
let ss = new SQSharedState();
const readf = (text: string): string | undefined => text[index++];
const efunc: CompilerErrorFunc = (target, err) => { throw err; }
const enone: CompilerErrorFunc = (target, err) => { errors.push(err); }

beforeEach(() => {
    errors = [];
    index = 0;
});

describe("SQLexer", () => {

    it("LexerStruct", () => {
        const s = new SQLexerStruct();
        expect(s.Next()).toBeUndefined();
    });

    it("Creates", () => {
        const s = new SQLexer(ss, readf, "", efunc, this);
        expect(s).toBeInstanceOf(SQLexer);
    });

    it("Char", () => {
        const s = new SQLexer(ss, readf, "'a'", efunc, this);
        expect(s.Lex()).toEqual(TK.INTEGER);
        expect(s._nvalue).toEqual('a'.charCodeAt(0));
        expect(s._longstr).toEqual("'a'");
    });

    it("String", () => {
        const s = new SQLexer(ss, readf, '"text"', efunc, this);
        expect(s.Lex()).toEqual(TK.STRING_LITERAL);
        expect(s._svalue).toEqual("text");
        expect(s._longstr).toEqual('"text"');
    });

    it("String, escaped", () => {
        const s = new SQLexer(ss, readf, '"\\t\\a\\b\\n\\r\\v\\f\\0\\\\\\"\\\'"', efunc, this);
        expect(s.Lex()).toEqual(TK.STRING_LITERAL);
        expect(s._svalue).toEqual('\t\a\b\n\r\v\f\0\\"\'');
        expect(s._longstr).toEqual('"\\t\\a\\b\\n\\r\\v\\f\\0\\\\\\"\\\'"');
    });

    it("String, xdigit", () => {
        const s = new SQLexer(ss, readf, '"\\xFFFF"', efunc, this);
        expect(s.Lex()).toEqual(TK.STRING_LITERAL);
        expect(s._svalue).toEqual(String.fromCharCode(65535));
        expect(s._longstr).toEqual('"\\xFFFF\"');
    });

    it("String, verbatim", () => {
        const s = new SQLexer(ss, readf, '@"te\nxt"', efunc, this);
        expect(s.Lex()).toEqual(TK.STRING_LITERAL);
        expect(s._svalue).toEqual("te\nxt");
        expect(s._longstr).toEqual('@"te\nxt"');
    });

    it("String, verbatim escaped", () => {
        const s = new SQLexer(ss, readf, '@"\\t\\a\\b\\n\\r\\v\\f\\0\\\\""\\\'"', efunc, this);
        expect(s.Lex()).toEqual(TK.STRING_LITERAL);
        expect(s._svalue).toEqual('\\t\\a\\b\\n\\r\\v\\f\\0\\\\"\\\'');
        expect(s._longstr).toEqual('@"\\t\\a\\b\\n\\r\\v\\f\\0\\\\""\\\'"');
    });

    it("String, verbatim xdigit", () => {
        const s = new SQLexer(ss, readf, '@"\\xFFFF"', efunc, this);
        expect(s.Lex()).toEqual(TK.STRING_LITERAL);
        expect(s._svalue).toEqual('\\xFFFF');
        expect(s._longstr).toEqual('@"\\xFFFF"');
    });

    it("Integer", () => {
        const s = new SQLexer(ss, readf, "123", efunc, this);
        expect(s.Lex()).toEqual(TK.INTEGER);
        expect(s._nvalue).toEqual(123);
        expect(s._longstr).toEqual("123");
    });

    it("Integer, hex", () => {
        const s = new SQLexer(ss, readf, "0xFFFF", efunc, this);
        expect(s.Lex()).toEqual(TK.INTEGER);
        expect(s._nvalue).toEqual(65535);
        expect(s._longstr).toEqual("0xFFFF");
    });

    it("Integer, octal", () => {
        const s = new SQLexer(ss, readf, "0777", efunc, this);
        expect(s.Lex()).toEqual(TK.INTEGER);
        expect(s._nvalue).toEqual(511);
        expect(s._longstr).toEqual("0777");
    });

    it("Float", () => {
        const s = new SQLexer(ss, readf, "1.230", efunc, this);
        expect(s.Lex()).toEqual(TK.FLOAT);
        expect(s._fvalue).toEqual(1.23);
        expect(s._longstr).toEqual("1.230");
    });

    it("Float, scientific", () => {
        const s = new SQLexer(ss, readf, "1.2e-3", efunc, this);
        expect(s.Lex()).toEqual(TK.FLOAT);
        expect(s._fvalue).toEqual(0.0012);
        expect(s._longstr).toEqual("1.2e-3");
    });

    it("Float, zero decimal", () => {
        const s = new SQLexer(ss, readf, "1.00", efunc, this);
        expect(s.Lex()).toEqual(TK.FLOAT);
        expect(s._fvalue).toEqual(1);
        expect(s._longstr).toEqual("1.00");
    });

    it("Class", () => {
        const s = new SQLexer(ss, readf, "class", efunc, this);
        expect(s.Lex()).toEqual(TK.CLASS);
    });

    it("Function", () => {
        const s = new SQLexer(ss, readf, "function", efunc, this);
        expect(s.Lex()).toEqual(TK.FUNCTION);
    });

    it("Location", () => {
        const s = new SQLexer(ss, readf, " first  second \n third", efunc, this);
        expect(s.Lex()).toEqual(TK.IDENTIFIER);
        expect(s._svalue).toEqual('first');
        expect(s._lasttokenline).toEqual(1);
        expect(s._lasttokencolumn).toEqual(1);
        expect(s._currentline).toEqual(1);
        expect(s._currentcolumn).toEqual(6);

        expect(s.Lex()).toEqual(TK.IDENTIFIER);
        expect(s._svalue).toEqual('second');
        expect(s._lasttokenline).toEqual(1);
        expect(s._lasttokencolumn).toEqual(8);
        expect(s._currentline).toEqual(1);
        expect(s._currentcolumn).toEqual(14);

        expect(s.Lex()).toEqual(TK.IDENTIFIER);
        expect(s._svalue).toEqual('third');
        expect(s._lasttokenline).toEqual(2);
        expect(s._lasttokencolumn).toEqual(1);
        expect(s._currentline).toEqual(2);
        expect(s._currentcolumn).toEqual(6);
    });

    it("Location with comment", () => {
        const s = new SQLexer(ss, readf, " first /* */ second /* \n */ third", efunc, this);
        expect(s.Lex()).toEqual(TK.IDENTIFIER);
        expect(s._svalue).toEqual('first');
        expect(s._lasttokenline).toEqual(1);
        expect(s._lasttokencolumn).toEqual(1);
        expect(s._currentline).toEqual(1);
        expect(s._currentcolumn).toEqual(6);

        expect(s.Lex()).toEqual(TK.IDENTIFIER);
        expect(s._svalue).toEqual('second');
        expect(s._lasttokenline).toEqual(1);
        expect(s._lasttokencolumn).toEqual(13);
        expect(s._currentline).toEqual(1);
        expect(s._currentcolumn).toEqual(19);

        expect(s.Lex()).toEqual(TK.IDENTIFIER);
        expect(s._svalue).toEqual('third');
        expect(s._lasttokenline).toEqual(2);
        expect(s._lasttokencolumn).toEqual(4);
        expect(s._currentline).toEqual(2);
        expect(s._currentcolumn).toEqual(9);
    });

    it("Continue: Comment", () => {
        const s = new SQLexer(ss, readf, "/*", enone, this);
        s.Lex();
        expect(errors[0].message).toBe("missing \"*/\" in comment");
    });

    it("Continue: Control", () => {
        const s = new SQLexer(ss, readf, String.fromCharCode(127), enone, this);
        s.Lex();
        expect(errors[0].message).toBe("unexpected character(control)");
    });

    it("Continue: Unfinished", () => {
        const s = new SQLexer(ss, readf, "\"Unfinished", enone, this);
        s.Lex();
        expect(errors[0].message).toBe("unfinished string");
    });

    it("Continue: Unrecognised", () => {
        const s = new SQLexer(ss, readf, "\"\\q\"", enone, this);
        s.Lex();
        expect(errors[0].message).toBe("unrecognised escaper char");
    });

    it("Throws: Invalid character", () => {
        expect(() => {
            parse(String.fromCharCode(MAX_CHAR + 1));
        }).toThrow("Invalid character");
    });

    it('Throws: missing "*/" in comment', () => {
        expect(() => {
            parse("/*");
        }).toThrow('missing "*/" in comment');
    });

    it("Throws: error parsing the string, verbatim", () => {
        expect(() => {
            parse('@"');
        }).toThrow("error parsing the string");
    });

    it("Throws: error parsing the string", () => {
        expect(() => {
            parse('"');
        }).toThrow("error parsing the string");
    });

    it("Throws: invalid token '..'", () => {
        expect(() => {
            parse("x..y");
        }).toThrow("invalid token '..'");
    });

    it("Throws: unexpected character(control)", () => {
        expect(() => {
            parse(String.fromCharCode(127));
        }).toThrow("unexpected character(control)");
    });

    it("Throws: unfinished string", () => {
        expect(() => {
            parse('"x');
        }).toThrow("unfinished string");
    });

    it("Throws: newline in a constant", () => {
        expect(() => {
            parse('"\n');
        }).toThrow("newline in a constant");
    });

    it("Throws: hexadecimal number expected", () => {
        expect(() => {
            parse('"\\xN"');
        }).toThrow("hexadecimal number expected");
    });

    it("Throws: unrecognised escaper char", () => {
        expect(() => {
            parse('"\\k"');
        }).toThrow("unrecognised escaper char");
    });

    it("Throws: empty constant", () => {
        expect(() => {
            parse("''");
        }).toThrow("empty constant");
    });

    it("Throws: constant too long", () => {
        expect(() => {
            parse("'nn'");
        }).toThrow("constant too long");
    });

    it("Does not throw: constant too long", () => {
        expect(() => {
            parse("'\\x0123'");
        }).not.toThrow("constant too long");
    });

    it("Throws: invalid octal number", () => {
        expect(() => {
            parse('0779');
        }).toThrow("invalid octal number");
    });

    it("Throws: too many digits for an Hex number", () => {
        expect(() => {
            parse("0xFFFFFFFF1");
        }).toThrow("too many digits for an Hex number");
    });

    it("Throws: invalid numeric format (unreachable)", () => {
        expect(() => {
            parse("0.0");
        }).not.toThrow("invalid numeric format");
    });

    it("Throws: exponent expected", () => {
        expect(() => {
            parse("1ex");
        }).toThrow("exponent expected");
    });

    it("Throws: end of statement expected (; or lf), verbatim", () => {
        expect(() => {
            parse('@"invalid \\" escape"');
        }).toThrow("end of statement expected (; or lf)");
    });

    it("Does not throw: end of statement expected", () => {
        expect(() => {
            parse('local x = 1; if (1) {} else {} x = 2;');
        }).not.toThrow("end of statement expected (; or lf)");
    });
});
