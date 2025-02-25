/*
	see copyright notice in squirrel.h
*/
import { TokenType, scstrtod, scisalnum, scisalpha, sciscntrl, scisdigit, scisxdigit, MAX_CHAR, SQLEXREADFUNC, SQUIRREL_EOB } from '../include/squirrel.h';
import { CompilerErrorFunc, TK } from './sqcompiler.h';
import { SQSharedState } from './sqstate.cpp';
import { SQLexerStruct } from './sqlexer.h';

//

class SQLexerDefine extends SQLexerStruct {
    CUR_CHAR: TokenType;
    RETURN_TOKEN = (t: TokenType): TokenType => { this._prevtoken = this._curtoken; this._curtoken = t; return t; };
    IS_EOB = (): boolean => { return this.CUR_CHAR == SQUIRREL_EOB; };
    NEXT = () => { this.Next(); this._currentcolumn++; this._currentindex++; };
    INIT_TEMP_STRING = () => { this._longstr = ""; this._realstr = this.CUR_CHAR };
    APPEND_CHAR = (c: TokenType) => { if (c != undefined) this._longstr += c; };
    TERMINATE_BUFFER = () => { if (this.CUR_CHAR != undefined) { this._realstr = this._realstr.slice(0, -1); }};
    ADD_KEYWORD = (key: string, _id: string) => { this._keywords.push(key); };
}

//
//

export class SQLexer extends SQLexerDefine {

    constructor(ss: SQSharedState, rg: SQLEXREADFUNC, up: string, efunc: CompilerErrorFunc, ed: any)
    {   super();
        this._errfunc = efunc;
        this._errtarget = ed;
        this._sharedstate = ss; ss._lex = this;
        this._keywords = [];
        this.ADD_KEYWORD('while', TK.WHILE);
        this.ADD_KEYWORD('do', TK.DO);
        this.ADD_KEYWORD('if', TK.IF);
        this.ADD_KEYWORD('else', TK.ELSE);
        this.ADD_KEYWORD('break', TK.BREAK);
        this.ADD_KEYWORD('continue', TK.CONTINUE);
        this.ADD_KEYWORD('return', TK.RETURN);
        this.ADD_KEYWORD('null', TK.NULL);
        this.ADD_KEYWORD('function', TK.FUNCTION);
        this.ADD_KEYWORD('local', TK.LOCAL);
        this.ADD_KEYWORD('for', TK.FOR);
        this.ADD_KEYWORD('foreach', TK.FOREACH);
        this.ADD_KEYWORD('in', TK.IN);
        this.ADD_KEYWORD('typeof', TK.TYPEOF);
        this.ADD_KEYWORD('base', TK.BASE);
        this.ADD_KEYWORD('delete', TK.DELETE);
        this.ADD_KEYWORD('try', TK.TRY);
        this.ADD_KEYWORD('catch', TK.CATCH);
        this.ADD_KEYWORD('throw', TK.THROW);
        this.ADD_KEYWORD('clone', TK.CLONE);
        this.ADD_KEYWORD('yield', TK.YIELD);
        this.ADD_KEYWORD('resume', TK.RESUME);
        this.ADD_KEYWORD('switch', TK.SWITCH);
        this.ADD_KEYWORD('case', TK.CASE);
        this.ADD_KEYWORD('default', TK.DEFAULT);
        this.ADD_KEYWORD('this', TK.THIS);
        this.ADD_KEYWORD('class', TK.CLASS);
        this.ADD_KEYWORD('extends', TK.EXTENDS);
        this.ADD_KEYWORD('constructor', TK.CONSTRUCTOR);
        this.ADD_KEYWORD('instanceof', TK.INSTANCEOF);
        this.ADD_KEYWORD('true', TK.TRUE);
        this.ADD_KEYWORD('false', TK.FALSE);
        this.ADD_KEYWORD('static', TK.STATIC);
        this.ADD_KEYWORD('enum', TK.ENUM);
        this.ADD_KEYWORD('const', TK.CONST);

        this._readf = rg;
        this._up = up;
        this._lasttokenline = this._currentline = 1;
        this._lasttokencolumn = this._currentcolumn = 0; this._lasttokenindex = this._currentindex = 0;
        this._prevtoken = undefined;
        this._reached_eof = false;
        this.Next();
    }

    Error = (err: string): void =>
    {
        this._errfunc(this._errtarget, { message: err, loc: { start: { line: this._currentline, column: this._currentcolumn, index: this._currentindex }, end: { line: this._currentline, column: this._currentcolumn+1, index: this._currentindex+1 }} }); // this._errfunc(this._errtarget, { message: err, loc: { start: { line: this._lasttokenline, column: this._lasttokencolumn, index: this._lasttokenindex }, end: { line: this._currentline, column: this._currentcolumn, index: this._currentindex }} });
    };

    Next = (): void =>
    {
        const t: TokenType = this._readf(this._up);
        if ((t?.charCodeAt(0) ?? 0) > MAX_CHAR) this.Error("Invalid character");
        if (t != undefined) {
            this.CUR_CHAR = this._currdata = t; this._realstr += t;
            return;
        }
        this.CUR_CHAR = this._currdata = SQUIRREL_EOB;
        this._reached_eof = true;
    };

    Tok2Str = (tok: TokenType): string | null =>
    {
        //
        //
        if (this._keywords.includes(tok)) {
            //
            //
            return tok.toUpperCase();
        }
        return null;
    }

    LexBlockComment = (): void =>
    {
        let done = false; this.InitBlockComment();
        while (!done) { this.AppendComment(this.CUR_CHAR);
            switch (this.CUR_CHAR as unknown) {
                case "*": { this.NEXT(); if (this.CUR_CHAR == "/") { done = true; this.NEXT(); }} continue;
                case "\n": this._currentline++; this.NEXT(); this._lasttokencolumn = 0; this._currentcolumn = 0; continue;
                case SQUIRREL_EOB: this.ErrorSpan('missing "*/" in comment'); done = true;
                default: this.NEXT();
            }
        } this.TerminateBlockComment();
    };
    LexLineComment = (hash: boolean): void =>
    {
        this.InitComment(); do { this.AppendComment(this.CUR_CHAR); this.NEXT(); } while (this.CUR_CHAR != "\n" && !this.IS_EOB()); this.TerminateComment(hash);
    };

    Lex = (): TokenType =>
    {
        this.ResetValues();
        while (this.CUR_CHAR != SQUIRREL_EOB) { this._lasttokenline = this._currentline; this._lasttokencolumn = this._currentcolumn; this._lasttokenindex = this._currentindex;
            switch (this.CUR_CHAR as unknown) {
                case "\t": case "\r": case " ": this.NEXT(); continue;
                case "\n":
                    this._currentline++;
                    this._prevtoken = this._curtoken;
                    this._curtoken = "\n";
                    this.NEXT();
                    this._currentcolumn = 0;
                    continue;
                case "#": this.LexLineComment(true); continue;
                case "/":
                    this.NEXT();
                    switch (this.CUR_CHAR) {
                        case "*":
                            this.NEXT();
                            this.LexBlockComment();
                            continue;
                        case "/":
                            this.LexLineComment(false);
                            continue;
                        case "=":
                            this.NEXT();
                            return this.RETURN_TOKEN(TK.DIVEQ);
                            // continue;
                        case ">":
                            this.NEXT();
                            return this.RETURN_TOKEN(TK.ATTR_CLOSE);
                            // continue;
                        default:
                            return this.RETURN_TOKEN("/");
                    }
                case "=":
                    this.NEXT();
                    if (this.CUR_CHAR != "=") { return this.RETURN_TOKEN("="); }
                    else { this.NEXT(); return this.RETURN_TOKEN(TK.EQ); }
                case "<":
                    this.NEXT();
                    switch (this.CUR_CHAR as unknown) {
                        case "=":
                            this.NEXT();
                            if (this.CUR_CHAR == ">") {
                                this.NEXT();
                                return this.RETURN_TOKEN(TK.THREEWAYSCMP);
                            }
                            return this.RETURN_TOKEN(TK.LE);
                            // break;
                        case "-": this.NEXT(); return this.RETURN_TOKEN(TK.NEWSLOT); // break;
                        case "<": this.NEXT(); return this.RETURN_TOKEN(TK.SHIFTL); // break;
                        case "/": this.NEXT(); return this.RETURN_TOKEN(TK.ATTR_OPEN); // break;
                    }
                    return this.RETURN_TOKEN("<");
                case ">":
                    this.NEXT();
                    if (this.CUR_CHAR == "=") { this.NEXT(); return this.RETURN_TOKEN(TK.GE); }
                    else if (this.CUR_CHAR == ">") {
                        this.NEXT();
                        if (this.CUR_CHAR == ">") {
                            this.NEXT();
                            return this.RETURN_TOKEN(TK.USHIFTR);
                        }
                        return this.RETURN_TOKEN(TK.SHIFTR);
                    }
                    else { return this.RETURN_TOKEN(">"); }
                case "!":
                    this.NEXT();
                    if (this.CUR_CHAR != "=") { return this.RETURN_TOKEN("!"); }
                    else { this.NEXT(); return this.RETURN_TOKEN(TK.NE); }
                case "@": {
                    let stype: TokenType;
                    this.NEXT();
                    if (this.CUR_CHAR != '"') {
                        return this.RETURN_TOKEN("@");
                    }
                    if ((stype = this.ReadString('"', true)) != undefined) {
                        return this.RETURN_TOKEN(stype);
                    }
                    this.ErrorSpan("error parsing the string");
                }
                case '"':
                case "'": {
                    let stype: TokenType;
                    if ((stype = this.ReadString(this.CUR_CHAR, false)) != undefined) {
                        return this.RETURN_TOKEN(stype);
                    }
                    this.ErrorSpan("error parsing the string");
                }
                case "{": case "}": case "(": case ")": case "[": case "]":
                case ";": case ",": case "?": case "^": case "~": {
                    const ret = this.CUR_CHAR;
                    this.NEXT(); return this.RETURN_TOKEN(ret); }
                case ".":
                    this.NEXT();
                    if (this.CUR_CHAR != ".") { return this.RETURN_TOKEN("."); }
                    this.NEXT();
                    if (this.CUR_CHAR != ".") { this.ErrorCurrent("invalid token '..'", -2, 0); }
                    this.NEXT();
                    return this.RETURN_TOKEN(TK.VARPARAMS);
                case "&":
                    this.NEXT();
                    if (this.CUR_CHAR != "&") { return this.RETURN_TOKEN("&"); }
                    else { this.NEXT(); return this.RETURN_TOKEN(TK.AND); }
                case "|":
                    this.NEXT();
                    if (this.CUR_CHAR != "|") { return this.RETURN_TOKEN("|"); }
                    else { this.NEXT(); return this.RETURN_TOKEN(TK.OR); }
                case ":":
                    this.NEXT();
                    if (this.CUR_CHAR != ":") { return this.RETURN_TOKEN(":"); }
                    else { this.NEXT(); return this.RETURN_TOKEN(TK.DOUBLE_COLON); }
                case "*":
                    this.NEXT();
                    if (this.CUR_CHAR == "=") { this.NEXT(); return this.RETURN_TOKEN(TK.MULEQ); }
                    else return this.RETURN_TOKEN("*");
                case "%":
                    this.NEXT();
                    if (this.CUR_CHAR == "=") { this.NEXT(); return this.RETURN_TOKEN(TK.MODEQ); }
                    else return this.RETURN_TOKEN("%");
                case "-":
                    this.NEXT();
                    if (this.CUR_CHAR == "=") { this.NEXT(); return this.RETURN_TOKEN(TK.MINUSEQ); }
                    else if (this.CUR_CHAR == "-") { this.NEXT(); return this.RETURN_TOKEN(TK.MINUSMINUS); }
                    else return this.RETURN_TOKEN("-");
                case "+":
                    this.NEXT();
                    if (this.CUR_CHAR == "=") { this.NEXT(); return this.RETURN_TOKEN(TK.PLUSEQ); }
                    else if (this.CUR_CHAR == "+") { this.NEXT(); return this.RETURN_TOKEN(TK.PLUSPLUS); }
                    else return this.RETURN_TOKEN("+");
                // case SQUIRREL_EOB: this.EndPos(); // Unreachable
                //     return;
                default: {
                    if (scisdigit(this.CUR_CHAR)) {
                        const ret = this.ReadNumber();
                        return this.RETURN_TOKEN(ret);
                    }
                    else if (scisalpha(this.CUR_CHAR) || this.CUR_CHAR == "_") {
                        const t = this.ReadID();
                        return this.RETURN_TOKEN(t);
                    }
                    else {
                        const c = this.CUR_CHAR;
                        if (sciscntrl(c)) this.Error("unexpected character(control)");
                        this.NEXT();
                        return this.RETURN_TOKEN(c);
                    }
                    // return this.RETURN_TOKEN(undefined);
                }
            }
        } this.EndPos();
        return;
    };

    GetIDType = (s: string): TokenType =>
    {
        //
        if (this._keywords.includes(s)) {
            return s;
        }
        return TK.IDENTIFIER;
    };


    ReadString = (ndelim: string, verbatim: boolean): TokenType =>
    {
        this.INIT_TEMP_STRING(); if (verbatim) this._realstr = '@' + this._realstr;
        this.NEXT();
        if (this.IS_EOB()) return;
        for (;;) {
            while (this.CUR_CHAR != ndelim) {
                switch (this.CUR_CHAR as unknown) {
                case SQUIRREL_EOB:
                    this.ErrorSpan("unfinished string");
                    return;
                case "\n":
                    if (!verbatim) this.Error("newline in a constant");
                    this.APPEND_CHAR(this.CUR_CHAR); this.NEXT();
                    this._currentline++; this._currentcolumn = 0;
                    break;
                case "\\":
                    if (verbatim) {
                        this.APPEND_CHAR("\\"); this.NEXT();
                    }
                    else {
                        this.NEXT();
                        switch (this.CUR_CHAR) {
                            case "x": this.NEXT(); {
                                if (!scisxdigit(this.CUR_CHAR)) this.ErrorCurrent("hexadecimal number expected", -2, 1);
                                const maxdigits = 4;
                                let temp = "";
                                let n = 0;
                                while (scisxdigit(this.CUR_CHAR) && n < maxdigits) {
                                    temp += this.CUR_CHAR;
                                    n++;
                                    this.NEXT();
                                }
                                //
                                //
                                this.APPEND_CHAR(String.fromCharCode(Number(`0x${temp}`)));
                                }
                                break;
                            case 't': this.APPEND_CHAR('\t'); this.NEXT(); break;
                            case 'a': this.APPEND_CHAR('\a'); this.NEXT(); break;
                            case 'b': this.APPEND_CHAR('\b'); this.NEXT(); break;
                            case 'n': this.APPEND_CHAR('\n'); this.NEXT(); break;
                            case 'r': this.APPEND_CHAR('\r'); this.NEXT(); break;
                            case 'v': this.APPEND_CHAR('\v'); this.NEXT(); break;
                            case 'f': this.APPEND_CHAR('\f'); this.NEXT(); break;
                            case '0': this.APPEND_CHAR('\0'); this.NEXT(); break;
                            case '\\': this.APPEND_CHAR('\\'); this.NEXT(); break;
                            case '"': this.APPEND_CHAR('"'); this.NEXT(); break;
                            case '\'': this.APPEND_CHAR('\''); this.NEXT(); break;
                            default:
                                this.ErrorCurrent("unrecognised escaper char", -1, 1);
                                break;
                        }
                    }
                    break;
                default:
                    this.APPEND_CHAR(this.CUR_CHAR);
                    this.NEXT();
                }
            }
            this.NEXT();
            if (verbatim && this.CUR_CHAR == '"') { //double quotation
                this.APPEND_CHAR(this.CUR_CHAR);
                this.NEXT();
            }
            else {
                break;
            }
        }
        this.TERMINATE_BUFFER();
        const len = this._longstr.length;
        if (ndelim == "'") {
            if (len == 0) this.ErrorSpan("empty constant");
            if (len > 1) this.ErrorSpan("constant too long");
            this._nvalue = this._longstr.charCodeAt(0); this._longstr = this._realstr;
            return TK.INTEGER;
        }
        this._svalue = this._longstr; this._longstr = this._realstr;
        return TK.STRING_LITERAL;
    };

    LexHexadecimal = (s: string): number =>
    {
        //
        //
        //
        //
        //
        //
        return parseInt(s);
    }

    LexInteger = (s: string): number =>
    {
        //
        //
        //
        //
        return parseInt(s);
    }

    scisodigit = (c: string | undefined): boolean => { if (c === undefined) return false; const code = c.charCodeAt(0); return code > 47 && code < 56; };

    LexOctal = (s: string): number =>
    {
        //
        //
        //
        //
        //
        return parseInt(s, 8);
    }

    isexponent = (c: string | undefined): boolean => { return c == "e" || c == "E"; };


    MAX_HEX_DIGITS = 8;
    ReadNumber = (): TokenType =>
    {
        const TINT = 1;
        const TFLOAT = 2;
        const THEX = 3;
        const TSCIENTIFIC = 4;
        const TOCTAL = 5;
        let type = TINT; const firstchar = this.CUR_CHAR;
        //
        this.INIT_TEMP_STRING();
        this.NEXT(); if (firstchar == "0" && this.CUR_CHAR == SQUIRREL_EOB) this.Error("newline expected");
        if (firstchar == "0" && (this.CUR_CHAR?.toUpperCase() == "X" || this.scisodigit(this.CUR_CHAR))) {
            if (this.scisodigit(this.CUR_CHAR)) {
                type = TOCTAL;
                while (this.scisodigit(this.CUR_CHAR)) {
                    this.APPEND_CHAR(this.CUR_CHAR);
                    this.NEXT();
                }
                if (scisdigit(this.CUR_CHAR)) this.ErrorSpan("invalid octal number", 0, 1);
            }
            else {
                this.NEXT();
                type = THEX;
                while (scisxdigit(this.CUR_CHAR)) {
                    this.APPEND_CHAR(this.CUR_CHAR);
                    this.NEXT();
                }
                if (this._longstr.length > this.MAX_HEX_DIGITS) this.ErrorSpan("too many digits for an Hex number");
            }
        }
        else {
            this.APPEND_CHAR(firstchar);
            while (this.CUR_CHAR == "." || scisdigit(this.CUR_CHAR) || this.isexponent(this.CUR_CHAR)) {
                if (this.CUR_CHAR == "." || this.isexponent(this.CUR_CHAR)) type = TFLOAT;
                if (this.isexponent(this.CUR_CHAR)) {
                    // if (type != TFLOAT) this.Error("invalid numeric format"); // Unreachable!
                    type = TSCIENTIFIC;
                    this.APPEND_CHAR(this.CUR_CHAR);
                    this.NEXT();
                    if (this.CUR_CHAR == "+" || this.CUR_CHAR == "-") {
                        this.APPEND_CHAR(this.CUR_CHAR);
                        this.NEXT();
                    }
                    if (!scisdigit(this.CUR_CHAR)) this.Error("exponent expected");
                }

                this.APPEND_CHAR(this.CUR_CHAR);
                this.NEXT();
            }
        }
        this.TERMINATE_BUFFER(); this._longstr = this._realstr;
        switch (type) {
            case TSCIENTIFIC:
            case TFLOAT:
                this._fvalue = scstrtod(this._longstr);
                return TK.FLOAT;
            case TINT:
                this._nvalue = this.LexInteger(this._longstr);
                return TK.INTEGER;
            case THEX:
                this._nvalue = this.LexHexadecimal(this._longstr);
                return TK.INTEGER;
            case TOCTAL:
                this._nvalue = this.LexOctal(this._longstr);
                return TK.INTEGER;
        }
        // return;
    };

    ReadID = (): TokenType =>
    {
        let res: TokenType;
        this.INIT_TEMP_STRING();
        do {
            this.APPEND_CHAR(this.CUR_CHAR);
            this.NEXT();
        } while (scisalnum(this.CUR_CHAR) || this.CUR_CHAR == "_");
        this.TERMINATE_BUFFER();
        res = this.GetIDType(this._longstr);
        if (res == TK.IDENTIFIER || res == TK.CONSTRUCTOR) {
            this._svalue = this._longstr;
        }
        return res;
    }; // #L489
}
