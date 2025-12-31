/*	see copyright notice in squirrel.h */
import { SQExpState, SQScope } from './sqcompiler.cpp';
import { SQFuncState } from './sqfuncstate.cpp';
import { SQTree as qt } from '../../ast/create';
import { SQLexer } from './sqlexer.cpp';
import { _ss, SQVM } from './sqvm.cpp';
import { AST } from '../../ast';
import { SQUIRREL_EOB, TokenType } from '../include/squirrel.h';
import { _OP } from './sqopcodes.h';

export const enum TK {
    IDENTIFIER = 258,
    STRING_LITERAL = 259,
    INTEGER = 260,
    FLOAT = 261,
    BASE = 262,
    DELETE = 263,
    EQ = 264,
    NE = 265,
    LE = 266,
    GE = 267,
    SWITCH = 268,
    ARROW = 269,
    AND = 270,
    OR = 271,
    IF = 272,
    ELSE = 273,
    WHILE = 274,
    BREAK = 275,
    FOR = 276,
    DO = 277,
    NULL = 278,
    FOREACH = 279,
    IN = 280,
    NEWSLOT = 281,
    MODULO = 282,
    LOCAL = 283,
    CLONE = 284,
    FUNCTION = 285,
    RETURN = 286,
    TYPEOF = 287,
    UMINUS = 288,
    PLUSEQ = 289,
    MINUSEQ = 290,
    CONTINUE = 291,
    YIELD = 292,
    TRY = 293,
    CATCH = 294,
    THROW = 295,
    SHIFTL = 296,
    SHIFTR = 297,
    RESUME = 298,
    DOUBLE_COLON = 299,
    CASE = 300,
    DEFAULT = 301,
    THIS = 302,
    PLUSPLUS = 303,
    MINUSMINUS = 304,
    THREEWAYSCMP = 305,
    USHIFTR = 306,
    CLASS = 307,
    EXTENDS = 308,
    CONSTRUCTOR = 310,
    INSTANCEOF = 311,
    VARPARAMS = 312,
    // VARGC = 313,
    // VARGV = 314,
    TRUE = 315,
    FALSE = 316,
    MULEQ = 317,
    DIVEQ = 318,
    MODEQ = 319,
    ATTR_OPEN = 320,
    ATTR_CLOSE = 321,
    STATIC = 322,
    ENUM = 323,
    CONST = 324,
}

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
