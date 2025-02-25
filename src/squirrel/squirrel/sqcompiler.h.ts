/*	see copyright notice in squirrel.h */
import { SQExpState, SQScope } from './sqcompiler.cpp';
import { SQFuncState } from './sqfuncstate.cpp';
import { SQTree as qt } from '../../ast/create';
import { SQLexer } from './sqlexer.cpp';
import { _ss, SQVM } from './sqvm.cpp';
import { AST } from '../../ast';
import { SQUIRREL_EOB, TokenType } from '../include/squirrel.h';
import { _OP } from './sqopcodes.h';

export enum TK {
    IDENTIFIER = "identifier",
    STRING_LITERAL = "string_literal",
    INTEGER = "integer",
    FLOAT = "float",
    BASE = "base",
    DELETE = "delete",
    EQ = "eq",
    NE = "ne",
    LE = "le",
    GE = "ge",
    SWITCH = "switch",
    ARROW = "arrow",
    AND = "and",
    OR = "or",
    IF = "if",
    ELSE = "else",
    WHILE = "while",
    BREAK = "break",
    FOR = "for",
    DO = "do",
    NULL = "null",
    FOREACH = "foreach",
    IN = "in",
    NEWSLOT = "newslot",
    MODULO = "modulo",
    LOCAL = "local",
    CLONE = "clone",
    FUNCTION = "function",
    RETURN = "return",
    TYPEOF = "typeof",
    UMINUS = "uminus",
    PLUSEQ = "pluseq",
    MINUSEQ = "minuseq",
    CONTINUE = "continue",
    YIELD = "yield",
    TRY = "try",
    CATCH = "catch",
    THROW = "throw",
    SHIFTL = "shiftl",
    SHIFTR = "shiftr",
    RESUME = "resume",
    DOUBLE_COLON = "double_colon",
    CASE = "case",
    DEFAULT = "default",
    THIS = "this",
    PLUSPLUS = "plusplus",
    MINUSMINUS = "minusminus",
    THREEWAYSCMP = "threewayscmp",
    USHIFTR = "ushiftr",
    CLASS = "class",
    EXTENDS = "extends",
    CONSTRUCTOR = "constructor",
    INSTANCEOF = "instanceof",
    VARPARAMS = "varparams",
    // VARGC = "vargc",
    // VARGV = "vargv",
    TRUE = "true",
    FALSE = "false",
    MULEQ = "muleq",
    DIVEQ = "diveq",
    MODEQ = "modeq",
    ATTR_OPEN = "attr_open",
    ATTR_CLOSE = "attr_close",
    STATIC = "static",
    ENUM = "enum",
    CONST = "const",
}

export const TK_VALUES = Object.values(TK);

export type CompilerError = {
    message: string; // error message
    loc: AST.SourceLocation; // location to highlight
}

export type CompilerErrorFunc = (
    ud: any,
    s: CompilerError
) => void;

export class SQCompilerStruct {

    _fs!: SQFuncState;
    _lex!: SQLexer;
    _efunc!: CompilerErrorFunc;
    _vm!: SQVM;

    _token: TokenType;
    _es: SQExpState = { etype: 3, epos: 1, donot_get: false };
    _scope: SQScope = { outers: 0, stacksize: 0, nodestacksize: 0 };
    _storepos: AST.Position[] = [];
    __oldscope__!: SQScope;
    __nbreaks__!: number;
    __ncontinues__!: number;

    _scopeNodeSize: number[] = [];

    // placeholders, overwritten in extensions
    Lex = (): void => {}
    ResolveBreaks = (funcstate: SQFuncState, ntoresolve: number): void => {}
    ResolveContinues = (funcstate: SQFuncState, ntoresolve: number, targetpos: number): void => {}
    Error = (s: string, loc?: AST.SourceLocation | null): void => {}

    /** Sanity assertion - should never occur, but does! */
    assert = (v: any, err: string) => {
        if (!v) this.Error(err);
    }

    /** Reset stored location variables */
    InitLexLoc = (): void => {
        const ss = _ss(this._vm);
        ss._loc = ss._lastloc = qt.SourceLocation(qt.Position(1, 0, 0), qt.Position(1, 0, 0));
    }

    /** Update stored location variables */
    UpdateLexLoc = (): void => {
        const ss = _ss(this._vm);
        ss._lastloc = ss._loc;
        ss._loc = qt.SourceLocation(
            qt.Position(this._lex._lasttokenline, this._lex._lasttokencolumn, this._lex._lasttokenindex),
            qt.Position(this._lex._currentline, this._lex._currentcolumn, this._lex._currentindex),
        );
    }

    // -------------------------------------------------------------------------
    /*
        Helpers to "gracefully" proceed after an error is encountered
        - During edit the AST is almost always in a state of error
        - The AST still needs to be in a usable state however
    */

    /** Return lex index to use with ForceLex at a later time */
    LexIndex = (): number => _ss(this._vm)._loc.start.index;

    /** If index has not changed (due to error) force a Lex */
    LexIfSame = (index: number) => {
        if (index === _ss(this._vm)._loc.start.index) this.Lex();
    }

    /** Attempt to lex, raise error otherwise */
    LexOrError = (index: number, message: string): boolean => {
        this.LexIfSame(index);
        const EOB = this._token == SQUIRREL_EOB;
        if (EOB) this.Error(message);
        return EOB;
    }

    // SourceLocation wrapper
    Loc = qt.SourceLocation;

    /** Return loc of current token */
    CurLoc = (): AST.SourceLocation => _ss(this._vm)._loc;

    /** Return loc of previous token */
    LastLoc = (): AST.SourceLocation => _ss(this._vm)._lastloc;

    /**
     * On unexpected node collapse loc start into lastloc
     * - usually an unexpected node would throw an error
     * - since we want to continue anyway, instead of lexing just tweak lastloc
     * - proceeding LastLoc users will receive a zero-size location
     */
    LexUnexpected = () => {
        const ss = _ss(this._vm);
        ss._lastloc = qt.SourceLocation(
            ss._loc.start,
            ss._loc.start
        );
    }

    AddUndefined = () => {
        this._fs.AddInstruction(_OP._UNDEFINED, this.LastLoc())
    }
}
