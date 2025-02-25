/*	see copyright notice in squirrel.h */
import { TokenType, SQLEXREADFUNC } from '../include/squirrel.h';
import { CompilerErrorFunc } from './sqcompiler.h';
import { SQTree as qt } from '../../ast/create';
import { SQSharedState } from './sqstate.cpp';
import { AST } from '../../ast';

export class SQLexerStruct
{
    // private:
	Next = () => {};
    _curtoken: TokenType;
    _keywords!: TokenType[];
    _reached_eof!: boolean;

    // public:
    _prevtoken: TokenType;
    _currentline!: number;
    _lasttokenline!: number;
    _currentcolumn!: number;
    _svalue!: string;
    _nvalue!: number;
    _fvalue!: number;
    _readf!: SQLEXREADFUNC;
    _up!: string;
    _currdata: TokenType;
    _sharedstate!: SQSharedState;
    _longstr: string = ''; _realstr: string = '';
    _errfunc!: CompilerErrorFunc;
    _errtarget: any;

    // --------------------------------------------------------
    // Custom

    _lasttokencolumn: number = 0;
    _lasttokenindex: number = 0;
    _currentindex: number = 0;
    _comments: (AST.CommentLine | AST.CommentBlock)[] = [];
    _commentstr: string = '';
    _commentstart!: AST.Position;

    PushComment = (comment: AST.CommentLine | AST.CommentBlock) => {
        this._comments.push(comment);
    };

    ResetValues = () => {
        this._realstr = "";
        this._longstr = "";
        this._svalue = "";
        this._nvalue = 0;
        this._fvalue = 0.0;
    };

    /** Called when lexed past EOF, places last indexes at the end */
    EndPos = () => {
        this._lasttokencolumn = this._currentcolumn;
        this._lasttokenindex = this._currentindex;
        this._lasttokenline = this._currentline;
    }

    ErrorCurrent = (err: string, startOffset: number, endOffset: number): void =>
    {
        this._errfunc(this._errtarget, {
            message: err,
            loc: {
                start: { line: this._currentline, column: this._currentcolumn + startOffset, index: this._currentindex + startOffset },
                end: { line: this._currentline, column: this._currentcolumn + endOffset, index: this._currentindex + endOffset }
            }
        });
    };

    ErrorSpan = (err: string, startOffset: number = 0, endOffset: number = 0): void =>
    {
        this._errfunc(this._errtarget, {
            message: err,
            loc: {
                start: { line: this._lasttokenline, column: this._lasttokencolumn + startOffset, index: this._lasttokenindex + startOffset },
                end: { line: this._currentline, column: this._currentcolumn + endOffset, index: this._currentindex + endOffset }
            }
        });
    };

    InitComment = () => {
        this._commentstr = '';
        this._commentstart = qt.Position(this._lasttokenline, this._lasttokencolumn, this._lasttokenindex);
    };

    AppendComment = (c: TokenType) => {
        if (c != undefined) this._commentstr += c;
    };

    TerminateComment = (hash: boolean) => {
        this._svalue = this._longstr.slice(1);
        this.PushComment(qt.CommentLine(this._commentstr.slice(1), hash, qt.SourceLocation(
            this._commentstart,
            qt.Position(this._currentline, this._currentcolumn, this._currentindex),
        )));
    }

    InitBlockComment = () => {
        this.InitComment();
    }

    TerminateBlockComment = () => {
        const isDocBlock = (this._commentstr.length > 1) && (this._commentstr.slice(0, 1) === "*");
        this.PushComment(qt.CommentBlock(this._commentstr.slice(isDocBlock ? 1 : 0, -1), isDocBlock, qt.SourceLocation(
            this._commentstart,
            qt.Position(this._currentline, this._currentcolumn, this._currentindex),
        )));
    }
}
