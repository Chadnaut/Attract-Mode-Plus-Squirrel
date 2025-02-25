/*
	see copyright notice in squirrel.h
*/
import { _OP, AAT, BW, CMP, NEW_SLOT_ATTRIBUTES_FLAG, NEW_SLOT_COMPUTED_FLAG, NEW_SLOT_JSON_FLAG, NEW_SLOT_METHOD_FLAG, NEW_SLOT_STATIC_FLAG, NOT, SQOpcode } from './sqopcodes.h';
import { OT, SQLEXREADFUNC, SQObject, SQUIRREL_EOB, TokenType } from '../include/squirrel.h';
import { CompilerError, CompilerErrorFunc, SQCompilerStruct, TK, TK_VALUES } from './sqcompiler.h';
import { SQFuncState } from './sqfuncstate.cpp';
import { SQLexer } from './sqlexer.cpp';
import { SQVM, _ss } from './sqvm.cpp';
import { _table } from './sqobject.h';
import { AST } from '../../ast';





const EXPR = 1;
const OBJECT = 2;
const BASE = 3;
const LOCAL = 4;
const OUTER = 5;

export type SQExpState = { // #L23
    etype: 1 | 2 | 3 | 4 | 5;   /* expr. type; one of EXPR, OBJECT, BASE, OUTER or LOCAL */
    epos: number;               /* expr. location on stack; -1 for OBJECT and BASE */
    donot_get: boolean;         /* signal not to deref the next value */
};

// const MAX_COMPILER_ERROR_LEN = 256;

export type SQScope = {
    outers: number;
    stacksize: number; nodestacksize: number;
};
class SQCompilerDefine extends SQCompilerStruct {
    BEGIN_SCOPE = () => { this.__oldscope__ = Object.assign({}, this._scope); this._scopeNodeSize.push(this._fs._nodestack.length);
                        this._scope.outers = this._fs._outers;
                        this._scope.stacksize = this._fs.GetStackSize(); }

    RESOLVE_OUTERS = () => { if (this._fs.GetStackSize() != this._scope.stacksize) {
                        if (this._fs.CountOuters(this._scope.stacksize)) {
                            this._fs.AddInstruction(_OP.CLOSE, 0, this._scope.stacksize);
                        }
                    }}

    END_SCOPE_NO_CLOSE = () => { if (this._fs.GetStackSize() != this._scope.stacksize) {
                            this._fs.SetStackSize(this._scope.stacksize);
                        }
                        this._scope = this.__oldscope__; this._scope.nodestacksize = this._fs._nodestack.length - this._scopeNodeSize.pop()!;
                    }

    END_SCOPE = () => { const oldouters = this._fs._outers;
                        if (this._fs.GetStackSize() != this._scope.stacksize) {
                            this._fs.SetStackSize(this._scope.stacksize);
                            if (oldouters != this._fs._outers) {
                                this._fs.AddInstruction(_OP.CLOSE, 0, this._scope.stacksize);
                            }
                        }
                        this._scope = this.__oldscope__; this._scope.nodestacksize = this._fs._nodestack.length - this._scopeNodeSize.pop()!;
                    }

    BEGIN_BREAKBLE_BLOCK = () => { this.__nbreaks__ = this._fs._unresolvedbreaks.length;
                        this.__ncontinues__ = this._fs._unresolvedcontinues.length;
                        this._fs._breaktargets.push(0); this._fs._continuetargets.push(0); }

    END_BREAKBLE_BLOCK = (continue_target: number = -1) => { this.__nbreaks__ = this._fs._unresolvedbreaks.length - this.__nbreaks__;
                        this.__ncontinues__ = this._fs._unresolvedcontinues.length - this.__ncontinues__;
                        if (this.__ncontinues__ > 0) this.ResolveContinues(this._fs, this.__ncontinues__, continue_target);
                        if (this.__nbreaks__ > 0) this.ResolveBreaks(this._fs, this.__nbreaks__);
                        this._fs._breaktargets.pop(); this._fs._continuetargets.pop(); }
}
export class SQCompiler extends SQCompilerDefine // #L72
{
// public:
    constructor(v: SQVM, rg: SQLEXREADFUNC, up: string, sourcename: string, raiseerror: boolean, efunc: CompilerErrorFunc, lineinfo: boolean)
    {   super();
        this._vm = v; this._efunc = efunc;
        this._lex = new SQLexer(_ss(v), rg, up, this.ThrowError.bind(this), this);
        this._sourcename = sourcename; this._raiseerror = raiseerror;
        this._lineinfo = lineinfo;
        this._scope.outers = 0;
        this._scope.stacksize = 0;
        this._compilererror = null;
    }
    ThrowError = (ud: SQCompiler, s: CompilerError): void => {
        const c = ud;
        c.Error(s.message, s.loc);
    };
    Error = (s: string, loc?: AST.SourceLocation): void =>
    {
        //
        //
		//
        this._compilererror = s; // `Error in ${this._sourcename}:${startLine}:${startColumn} on line ${line} column ${column}: ${s}`;
        this._efunc(this, { message: this._compilererror, loc: loc ?? this.CurLoc() });
    };
    Lex = (): void => { this._token = this._lex.Lex(); this.UpdateLexLoc(); }
    Expect = (tok: TokenType): SQObject =>
    {
        let unexpected = false;
        if (this._token != tok) {
            if (this._token == TK.CONSTRUCTOR && tok == TK.IDENTIFIER) {
                //do nothing
            }
            else {
                let etypename: string;
                if (TK_VALUES.includes(<TK>tok)) {
                    switch(tok)
                    {
                    case TK.IDENTIFIER:
                        etypename = "IDENTIFIER";
                        break;
                    // case TK.STRING_LITERAL: // unreachable
                    //     etypename = "STRING_LITERAL";
                    //     break;
                    // case TK.INTEGER: // not used
                    //     etypename = "INTEGER";
                    //     break;
                    // case TK.FLOAT: // not used
                    //     etypename = "FLOAT";
                    //     break;
                    default:
                        etypename = this._lex.Tok2Str(tok);
                    }
                    this.Error(`expected '${etypename}'`, this.LastLoc()); unexpected = true;
                } else
                this.Error(`expected '${tok}'`, this.LastLoc()); unexpected = true;
            }
        }
        let ret: SQObject = { _type: OT.NULL, _unVal: 0 };
        switch (tok)
        {
            case TK.IDENTIFIER:
                ret = this._fs.CreateString(this._lex._svalue);
                break;
            case TK.STRING_LITERAL:
                ret = this._fs.CreateString(this._lex._svalue, this._lex._longstr);
                break;
            // case TK.INTEGER: // not used
            //     ret = { _type: OT.INTEGER, _unVal: this._lex._nvalue, _rawVal: this._lex._longstr };
            //     break;
            // case TK.FLOAT: // not used
            //     ret = { _type: OT.FLOAT, _unVal: this._lex._fvalue, _rawVal: this._lex._longstr };
            //     break;
        }
        /* this.Lex(); */ if (unexpected) { this.LexUnexpected(); } else { this.Lex(); }
        return ret;
    };
    IsEndOfStatement = (): boolean => { return (this._lex._prevtoken == '\n' || this._token == SQUIRREL_EOB || this._token == '}' || this._token == ';');};
    OptionalSemicolon = (): void =>
    {
        if (this._token == ';') { this.Lex(); return; }
        if (!this.IsEndOfStatement()) {
            this.Error('end of statement expected (; or lf)', this.LastLoc());
        }
    };
    MoveIfCurrentTargetIsLocal = (): void => {
        let trg = this._fs.TopTarget();
        if (this._fs.IsLocal(trg) || 1) {
            trg = this._fs.PopTarget(); //no pops the target and move it
            this._fs.AddInstruction(_OP.MOVE, this._fs.PushTarget(), trg, 5);
        }
    }
    Compile = (o: AST.Program): boolean =>
    {
        this._debugline = 1;
        this._debugop = 0;

        const funcstate = new SQFuncState(_ss(this._vm), null, this.ThrowError.bind(this), this);
        funcstate._name = { _type: OT.STRING, _unVal: "main" };
        this._fs = funcstate;
        this._fs.AddParameter(this._fs.CreateString("this"));
        this._fs.AddParameter(this._fs.CreateString("vargv"));
        this._fs._varparams = true;
        this._fs._sourcename = this._sourcename;
        const stacksize = this._fs.GetStackSize();
		try {
            this.InitLexLoc(); this.Lex();
            while (this._token != SQUIRREL_EOB) {
                this.Statement();
                if (this._lex._prevtoken != '}' && this._lex._prevtoken != ';') this.OptionalSemicolon();
            }
            this._fs.SetStackSize(stacksize);
            this._fs.AddLineInfos(this._lex._currentline, this._lineinfo, true);
            this._fs.AddInstruction(_OP.RETURN, 0xFF);
            this._fs.SetStackSize(0);
            o = Object.assign(o, this._fs.BuildProto());
// #ifdef _DEBUG_DUMP
            // this._fs.Dump(_funcproto(o));
// #endif
        }
		catch (err: any) {
			if(this._raiseerror && _ss(this._vm)._compilererrorhandler) {
		        _ss(this._vm)._compilererrorhandler(this._vm, err, this._sourcename,
					this._lex._currentline, this._lex._currentcolumn);
			}
			_ss(this._vm)._lasterror = err;
			return false;
		}
        return true;
    };
    Statements = (): void =>
    {
        while(this._token != '}' && this._token != TK.DEFAULT && this._token != TK.CASE) {
            this.Statement();
            if(this._lex._prevtoken != '}' && this._lex._prevtoken != ';') this.OptionalSemicolon(); if (this._token == SQUIRREL_EOB) break;
        }
    }
    Statement = (closeframe: boolean = true): void =>
    {
        this._fs.AddLineInfos(this._lex._currentline, this._lineinfo); const i = this.LexIndex();
        switch (this._token) {
            case ';':           this.Lex(); this._fs.AddInstruction(_OP._EMPTY_STATEMENT, this.LastLoc()); break;
            case TK.IF:		    this.IfStatement();			break;
            case TK.WHILE:		this.WhileStatement();		break;
            case TK.DO:		    this.DoWhileStatement();	break;
            case TK.FOR:		this.ForStatement();		break;
            case TK.FOREACH:	this.ForEachStatement();	break;
            case TK.SWITCH:	    this.SwitchStatement();		break;
            case TK.LOCAL:      this.LocalDeclStatement();  break;
            case TK.RETURN:
            case TK.YIELD: {
                let op: SQOpcode; const loc = this.CurLoc();
                if(this._token == TK.RETURN) {
                    op = _OP._RETURN;
                }
                else {
                    op = _OP._YIELD;
                    this._fs._bgenerator = true;
                }
                this.Lex();
                if(!this.IsEndOfStatement()) {
                    const retexp = this._fs.GetCurrentPos()+1;
                    this.CommaExpr();
                    if(op == _OP._RETURN && this._fs._traps > 0)
                        this._fs.AddInstruction(_OP.POPTRAP, this._fs._traps, 0);
                    this._fs._returnexp = retexp;
                    this._fs.AddInstruction(op, 1, this._fs.PopTarget(), this._fs.GetStackSize(), loc);
                }
                else{
                    if(op == _OP._RETURN && this._fs._traps > 0)
                        this._fs.AddInstruction(_OP.POPTRAP, this._fs._traps ,0);
                    this._fs._returnexp = -1;
                    this._fs.AddInstruction(op, 0xFF, 0, this._fs.GetStackSize(), loc);
                }
                break;}
            case TK.BREAK:
                if(this._fs._breaktargets.length <= 0) this.Error("'break' has to be in a loop block");
                if(this._fs._breaktargets[0] > 0) {
                    this._fs.AddInstruction(_OP.POPTRAP, this._fs._breaktargets[0], 0);
                }
                this.RESOLVE_OUTERS();
                this._fs.AddInstruction(_OP._BREAK_STATEMENT, 0, -1234, this.CurLoc());
                this._fs._unresolvedbreaks.push(this._fs.GetCurrentPos());
                this.Lex();
                break;
            case TK.CONTINUE:
                if(this._fs._continuetargets.length <= 0) this.Error("'continue' has to be in a loop block");
                if(this._fs._continuetargets[0] > 0) {
                    this._fs.AddInstruction(_OP.POPTRAP, this._fs._continuetargets[0], 0);
                }
                this.RESOLVE_OUTERS();
                this._fs.AddInstruction(_OP._CONTINUE_STATEMENT, 0, -1234, this.CurLoc());
                this._fs._unresolvedcontinues.push(this._fs.GetCurrentPos());
                this.Lex();
                break;
            case TK.FUNCTION:
                this.FunctionStatement();
                break;
            case TK.CLASS:
                this.ClassStatement();
                break;
            case TK.ENUM:
                this.EnumStatement();
                break;
            case '{': {
                    this.BEGIN_SCOPE(); const s = this.CurLoc().start;
                    this.Lex();
                    this.Statements(); const e = this.CurLoc().end;
                    this.Expect('}');
                    if (closeframe) {
                        this.END_SCOPE();
                    }
                    else {
                        this.END_SCOPE_NO_CLOSE();
                    } this._fs.AddInstruction(_OP._BLOCK_STATEMENT, this._scope.nodestacksize, this.Loc(s, e));
                }
                break;
            case TK.TRY:
                this.TryCatchStatement();
                break;
            case TK.THROW: { const loc = this.CurLoc();
                this.Lex();
                this.CommaExpr();
                this._fs.AddInstruction(_OP._THROW, this._fs.PopTarget(), loc);
                break; }
            case TK.CONST:
                {
                    const s = this.CurLoc().start; this.Lex(); let loc = this.CurLoc();
                    const id = this.Expect(TK.IDENTIFIER); this._fs.AddInstruction(_OP._IDENTIFIER, 0, id, loc);
                    this.Expect('='); loc = this.CurLoc(); const e = this.CurLoc().end;
                    const val = this.ExpectScalar(); this._fs.AddInstruction(_OP._SCALAR_LITERAL, 0, val, loc); this._fs.AddInstruction(_OP._VARIABLE_DECLARATOR); this._fs.AddInstruction(_OP._VARIABLE_DECLARATION, 1, 1, this.Loc(s, e));
                    this.OptionalSemicolon();
                    const enums = _ss(this._vm)._consts;
                    let strongid: SQObject | null = id;
                    enums.NewSlot(strongid, val);
			        strongid = null;
                }
                break;
            default:
                this.CommaExpr(true);
                this._fs.DiscardTarget();
                //this._fs.PopTarget();
                break;
        }
        this._fs.SnoozeOpt(); this._fs.UpdateStatement(); this.LexIfSame(i);
    };
    EmitDerefOp = (op: SQOpcode, p3: any = 0): void =>
    {
        const val = this._fs.PopTarget();
        const key = this._fs.PopTarget();
        const src = this._fs.PopTarget();
        this._fs.AddInstruction(op, this._fs.PushTarget(), src, key, p3 /*val*/);
    }
    Emit2ArgsOP = (op: SQOpcode, p3: any = 0, p4: any = 0): void =>
    {
        const p2 = this._fs.PopTarget(); //src in OP_GET
        const p1 = this._fs.PopTarget(); //key in OP_GET
        this._fs.AddInstruction(op, this._fs.PushTarget(), p1, p2, p3, p4);
    }
    EmitCompoundArith(tok: TokenType, etype: number, pos: number): void
    {
        /* Generate code depending on the expression type */
        switch(etype) {
        case LOCAL:{
                const p2 = this._fs.PopTarget(); //src in OP_GET
                const p1 = this._fs.PopTarget(); //key in OP_GET
                this._fs.PushTarget(p1);
                //EmitCompArithLocal(tok, p1, p1, p2);
                this._fs.AddInstruction(_OP._ASSIGNMENT_EXPRESSION, p1, p2, p1, this.ChooseArithOpByToken(tok));
                this._fs.SnoozeOpt();
            }
            break;
        case OBJECT:
        case BASE:
            {
                const val = this._fs.PopTarget();
                const key = this._fs.PopTarget();
                const src = this._fs.PopTarget();
                /* _OP.COMPARITH mixes dest obj and source val in the arg1 */
                this._fs.AddInstruction(_OP._ASSIGNMENT_EXPRESSION, this._fs.PushTarget(), (src<<16)|val, key, this.ChooseCompArithCharByToken(tok));
            }
            break;
        case OUTER:
            {
                const val = this._fs.TopTarget();
                const tmp = this._fs.PushTarget();
                this._fs.AddInstruction(_OP.GETOUTER, tmp, pos);
                this._fs.AddInstruction(_OP._ASSIGNMENT_EXPRESSION, tmp, val, tmp, this.ChooseArithOpByToken(tok));
                this._fs.AddInstruction(_OP.SETOUTER, tmp, pos, tmp);
            }
            break;
        }
    }
    CommaExpr = (sequence?: boolean) =>
    {
        for (this.Expression(false); this._token == ','; this._fs.PopTarget(), this.Lex(), this.CommaExpr(sequence), sequence ? this._fs.AddInstruction(_OP._SEQUENCE_EXPRESSION) : null);
    }
    Expression = (required = true) =>
    {
        const es:SQExpState = Object.assign({}, this._es);
        this._es.etype = EXPR;
        this._es.epos = -1;
        this._es.donot_get = false; const i = this._fs.StackSize();
        this.LogicalOrExp(); if (required && this._fs.StackSize() === i) { this.AddUndefined(); }
        switch(this._token)  {
            case '=':
            case TK.NEWSLOT:
            case TK.MINUSEQ:
            case TK.PLUSEQ:
            case TK.MULEQ:
            case TK.DIVEQ:
            case TK.MODEQ: {
                const op = this._token;
                const ds: number = this._es.etype;
                const pos = this._es.epos;
                if (ds == EXPR) this.Error("can't assign expression", this.LastLoc());
                else if (ds == BASE) this.Error("'base' cannot be modified", this.LastLoc());

                this.Lex(); this.Expression();

                switch(op){
                case TK.NEWSLOT:
                    if(ds == OBJECT || ds == BASE)
                        this.EmitDerefOp(_OP._ASSIGNMENT_EXPRESSION, _OP.NEWSLOT);
                    else //if _derefstate != DEREF_NO_DEREF && DEREF_FIELD so is the index of a local
                        this.Error("can't 'create' a local slot", this._fs.NodeAt(-2)?.loc);
                    break;
                case '=': //ASSIGN
                    switch(ds) {
                        case LOCAL:
                            {
                                const src = this._fs.PopTarget();
                                const dst = this._fs.TopTarget();
                                this._fs.AddInstruction(_OP._ASSIGNMENT_EXPRESSION, dst, src, 0, _OP.SET);
                            }
                            break;
                        case OBJECT:
                        case BASE:
                            this.EmitDerefOp(_OP._ASSIGNMENT_EXPRESSION, _OP.SET);
                            break;
                        case OUTER:
                            {
                                const src = this._fs.PopTarget();
                                const dst = this._fs.PushTarget();
                                this._fs.AddInstruction(_OP._ASSIGNMENT_EXPRESSION, dst, pos, src, _OP.SET);
                            }
                    }
                    break;
                case TK.MINUSEQ:
                case TK.PLUSEQ:
                case TK.MULEQ:
                case TK.DIVEQ:
                case TK.MODEQ:
                    this.EmitCompoundArith(op, ds, pos);
                    break;
                }
                }
                break;
            case '?': {
                this.Lex();
                this._fs.AddInstruction(_OP.JZ, this._fs.PopTarget());
                const jzpos = this._fs.GetCurrentPos();
                const trg = this._fs.PushTarget();
                this.Expression();
                const first_exp = this._fs.PopTarget();
                if (trg != first_exp) this._fs.AddInstruction(_OP.MOVE, trg, first_exp);
                const endfirstexp = this._fs.GetCurrentPos();
                this._fs.AddInstruction(_OP.JMP, 0, 0);
                this.Expect(':');
                const jmppos = this._fs.GetCurrentPos();
                this.Expression();
                const second_exp = this._fs.PopTarget();
                if (/*trg != second_exp*/ true) this._fs.AddInstruction(_OP._CONDITIONAL_EXPRESSION, trg, second_exp);
                this._fs.SetIntructionParam(jmppos, 1, this._fs.GetCurrentPos() - jmppos);
                this._fs.SetIntructionParam(jzpos, 1, endfirstexp - jzpos + 1);
                this._fs.SnoozeOpt();
                }
                break;
        }
        this._es = es;
    }
	INVOKE_EXP = (f: () => void): void =>
	{
		const es = Object.assign({}, this._es);
		this._es.etype     = EXPR;
		this._es.epos      = -1;
		this._es.donot_get = false;
		f();
		this._es = es;
	}
    BIN_EXP = (op: SQOpcode, f: () => void, op3: BW | CMP | -1 = -1): void =>
    {
        this.Lex();
        this.INVOKE_EXP(f);
        const op1 = this._fs.PopTarget(); const op2 = this._fs.PopTarget();
        this._fs.AddInstruction(op, this._fs.PushTarget(), op1, op2, op3);
    }
    LogicalOrExp = (first = false): void =>
    {
        this.LogicalAndExp();
        for(;;) if(this._token == TK.OR) {
            const first_exp = this._fs.PopTarget();
            const trg = this._fs.PushTarget();
            this._fs.AddInstruction(_OP.OR, trg, 0, first_exp, 0);
            const jpos = this._fs.GetCurrentPos();
            if (first/*trg != first_exp*/) this._fs.AddInstruction(_OP._LOGICAL_EXPRESSION, trg, first_exp, _OP.OR); // this._fs.AddInstruction(_OP.MOVE, trg, first_exp);
            this.Lex(); this.INVOKE_EXP(this.LogicalOrExp.bind(this, true));
            this._fs.SnoozeOpt();
            const second_exp = this._fs.PopTarget();
            if (!first/*trg != second_exp*/) this._fs.AddInstruction(_OP._LOGICAL_EXPRESSION, trg, second_exp, _OP.OR);
            this._fs.SnoozeOpt();
            this._fs.SetIntructionParam(jpos, 1, (this._fs.GetCurrentPos() - jpos));
            break;
        } else return;
    }
    LogicalAndExp = (first = false): void =>
    {
        this.BitwiseOrExp();
        for(;;) switch(this._token) {
        case TK.AND: {
            const first_exp = this._fs.PopTarget();
            const trg = this._fs.PushTarget();
            this._fs.AddInstruction(_OP.AND, trg, 0, first_exp, 0);
            const jpos = this._fs.GetCurrentPos();
            if (first/*trg != first_exp*/) this._fs.AddInstruction(_OP._LOGICAL_EXPRESSION, trg, first_exp, _OP.AND); // this._fs.AddInstruction(_OP.MOVE, trg, first_exp);
            this.Lex(); this.INVOKE_EXP(this.LogicalAndExp.bind(this, true));
            this._fs.SnoozeOpt();
            const second_exp = this._fs.PopTarget();
            if (!first/*trg != second_exp*/) this._fs.AddInstruction(_OP._LOGICAL_EXPRESSION, trg, second_exp, _OP.AND);
            this._fs.SnoozeOpt();
            this._fs.SetIntructionParam(jpos, 1, (this._fs.GetCurrentPos() - jpos));
            break;
            }

        default:
            return;
        }
    }
    BitwiseOrExp = (): void =>
    {
        this.BitwiseXorExp();
        for(;;) if(this._token == '|')
        {this.BIN_EXP(_OP.BITW, this.BitwiseXorExp.bind(this), BW.OR);
        }else return;
    }
    BitwiseXorExp = (): void =>
    {
        this.BitwiseAndExp();
        for(;;) if(this._token == '^')
        {this.BIN_EXP(_OP.BITW, this.BitwiseAndExp.bind(this), BW.XOR);
        }else return;
    }
    BitwiseAndExp = (): void =>
    {
        this.EqExp();
        for(;;) if(this._token == '&')
        {this.BIN_EXP(_OP.BITW, this.EqExp.bind(this), BW.AND);
        }else return;
    }
    EqExp = (): void =>
    {
        this.CompExp();
        for(;;) switch(this._token) {
        case TK.EQ: this.BIN_EXP(_OP.EQ, this.CompExp.bind(this)); break;
        case TK.NE: this.BIN_EXP(_OP.NE, this.CompExp.bind(this)); break;
        case TK.THREEWAYSCMP: this.BIN_EXP(_OP.CMP, this.CompExp.bind(this), CMP.THREEW); break;
        default: return;
        }
    }
    CompExp = (): void =>
    {
        this.ShiftExp();
        for(;;) switch(this._token) {
        case '>': this.BIN_EXP(_OP.CMP, this.ShiftExp.bind(this), CMP.G); break;
        case '<': this.BIN_EXP(_OP.CMP, this.ShiftExp.bind(this), CMP.L); break;
        case TK.GE: this.BIN_EXP(_OP.CMP, this.ShiftExp.bind(this), CMP.GE); break;
        case TK.LE: this.BIN_EXP(_OP.CMP, this.ShiftExp.bind(this), CMP.LE); break;
        case TK.IN: this.BIN_EXP(_OP.EXISTS, this.ShiftExp.bind(this)); break;
        case TK.INSTANCEOF: this.BIN_EXP(_OP.INSTANCEOF, this.ShiftExp.bind(this)); break;
        default: return;
        }
    }
    ShiftExp = (): void =>
    {
        this.PlusExp();
        for(;;) switch(this._token) {
        case TK.USHIFTR: this.BIN_EXP(_OP.BITW, this.PlusExp.bind(this), BW.USHIFTR); break;
        case TK.SHIFTL: this.BIN_EXP(_OP.BITW, this.PlusExp.bind(this), BW.SHIFTL); break;
        case TK.SHIFTR: this.BIN_EXP(_OP.BITW, this.PlusExp.bind(this), BW.SHIFTR); break;
        default: return;
        }
    }
    ChooseArithOpByToken = (tok: TokenType): SQOpcode =>
    {
        switch(tok) {
            case TK.PLUSEQ: case '+': return _OP.ADD;
            case TK.MINUSEQ: case '-': return _OP.SUB;
            case TK.MULEQ: case '*': return _OP.MUL;
            case TK.DIVEQ: case '/': return _OP.DIV;
            case TK.MODEQ: case '%': return _OP.MOD;
            // default: this.assert(0, 'invalid opcode'); // unreachable
        }
        // return _OP.ADD; // unreachable
    }
    ChooseCompArithCharByToken = (tok: TokenType): SQOpcode | undefined =>
    {
        let oper: _OP | undefined;
        switch (tok) {
        case TK.MINUSEQ: oper = _OP.SUB; break;
        case TK.PLUSEQ: oper = _OP.ADD; break;
        case TK.MULEQ: oper = _OP.MUL; break;
        case TK.DIVEQ: oper = _OP.DIV; break;
        case TK.MODEQ: oper = _OP.MOD; break;
        // default: oper = undefined; //shut up compiler // unreachable
        //     this.assert(0, 'invalid opcode'); break; // unreachable
        };
        return oper;
    }
    PlusExp = (): void =>
    {
        this.MultExp();
        for(;;) switch(this._token) {
        case '+': case '-':
            this.BIN_EXP(this.ChooseArithOpByToken(this._token), this.MultExp.bind(this)); break;
        default: return;
        }
    }

    MultExp = (): void =>
    {
        this.PrefixedExpr();
        for(;;) switch(this._token) {
        case '*': case '/': case '%':
            this.BIN_EXP(this.ChooseArithOpByToken(this._token), this.PrefixedExpr.bind(this)); break;
        default: return;
        }
    }
    //if 'pos' != -1 the previous variable is a local variable
    PrefixedExpr = (): void =>
    {
        let pos = this.Factor();
        for(;;) {
            switch(this._token) {
            case '.':
                pos = -1;
                this.Lex();

                this._fs.AddInstruction(_OP._MEMBER_PROPERTY, this._fs.PushTarget(), 0, this._fs.GetConstant(this.Expect(TK.IDENTIFIER)), this.LastLoc());
                if (this._es.etype == BASE) {
                    this.Emit2ArgsOP(_OP.GET);
                    pos = this._fs.TopTarget();
                    this._es.etype = EXPR;
                    this._es.epos = pos;
                }
                else {
                    if (this.NeedGet()) {
                        this.Emit2ArgsOP(_OP.GET);
                    }
                    this._es.etype = OBJECT;
                }
                break;
            case '[':
                if (this._lex._prevtoken == '\n') this.Error("cannot brake deref/or comma needed after [exp]=exp slot declaration", this.LastLoc());
                const s = this.CurLoc().start; this.Lex(); this.Expression(); const e = this.CurLoc().end; this.Expect(']'); this._fs.AddInstruction(_OP._MEMBER_EXPRESSION, 1, this.Loc(s, e));
                pos = -1;
                if(this._es.etype==BASE) {
                    this.Emit2ArgsOP(_OP.GET);
                    pos = this._fs.TopTarget();
                    this._es.etype = EXPR;
                    this._es.epos = pos;
                }
                else {
                    if (this.NeedGet()) {
                        this.Emit2ArgsOP(_OP.GET);
                    }
                    this._es.etype = OBJECT;
                }
                break;
            case TK.MINUSMINUS:
            case TK.PLUSPLUS:
                {
                    if (this.IsEndOfStatement()) return; const loc = this.CurLoc();
                    const diff = (this._token == TK.MINUSMINUS) ? -1 : 1;
                    this.Lex();
                    switch(this._es.etype)
                    {
                        case EXPR: this.Error("can't '++' or '--' an expression", this.LastLoc()); break;
                        case OBJECT:
                        case BASE:
                            this.Emit2ArgsOP(_OP._UPDATE_EXPRESSION_SUFFIX, diff, loc);
                            break;
                        case LOCAL: {
                            const src = this._fs.PopTarget();
                            this._fs.AddInstruction(_OP._UPDATE_EXPRESSION_SUFFIX, this._fs.PushTarget(), src, 0, diff, loc);
                            }
                            break;
                        case OUTER: {
                            const tmp1 = this._fs.PushTarget();
                            const tmp2 = this._fs.PushTarget();
                            this._fs.AddInstruction(_OP.GETOUTER, tmp2, this._es.epos);
                            this._fs.AddInstruction(_OP._UPDATE_EXPRESSION_SUFFIX, tmp1, tmp2, 0, diff, loc);
                            this._fs.AddInstruction(_OP.SETOUTER, tmp2, this._es.epos, tmp2);
                            this._fs.PopTarget();
                        }
                    }
                }
                return;
                // break;
            case '(':
                switch (this._es.etype) {
                    case OBJECT: {
                        const key     = this._fs.PopTarget();  /* location of the key */
                        const table   = this._fs.PopTarget();  /* location of the object */
                        const closure = this._fs.PushTarget(); /* location for the closure */
                        const ttarget = this._fs.PushTarget(); /* location for 'this' pointer */
                        this._fs.AddInstruction(_OP.PREPCALL, closure, key, table, ttarget);
                        }
                        break;
                    case BASE:
                        //Emit2ArgsOP(_OP.GET);
                        this._fs.AddInstruction(_OP.MOVE, this._fs.PushTarget(), 0);
                        break;
                    case OUTER:
                        this._fs.AddInstruction(_OP.GETOUTER, this._fs.PushTarget(), this._es.epos);
                        this._fs.AddInstruction(_OP.MOVE,     this._fs.PushTarget(), 0);
                        break;
                    default:
                        this._fs.AddInstruction(_OP.MOVE, this._fs.PushTarget(), 0);
                }
                this._es.etype = EXPR;
                this.Lex();
                this.FunctionCallArgs();
                break;
            default: return;
            }
        }
    }
    Factor = (): number => // #L709
    {
        this._es.etype = EXPR;
        switch(this._token as unknown)
        {
        case TK.STRING_LITERAL:
			this._fs.AddInstruction(_OP._STRING_LITERAL, this._fs.PushTarget(), this._fs.GetConstant(this._fs.CreateString(this._lex._svalue, this._lex._longstr)), this.CurLoc());
            this.Lex();
            break;
        case TK.BASE:
            this.Lex();
            this._fs.AddInstruction(_OP._BASE, this._fs.PushTarget(), this.LastLoc());
            this._es.etype = BASE;
            this._es.epos = this._fs.TopTarget();
            return (this._es.epos);
            // break;
        case TK.IDENTIFIER:
        case TK.CONSTRUCTOR:
        case TK.THIS:{
                let id!: SQObject;
                let constant: SQObject = { _type: OT.NULL, _unVal: 0 };

                switch(this._token) {
                    case TK.IDENTIFIER:  id = this._fs.CreateString(this._lex._svalue); this._fs.AddInstruction(_OP._IDENTIFIER, 0, id, this.CurLoc()); break;
                    case TK.THIS:        id = this._fs.CreateString("this"); this._fs.AddInstruction(_OP._THIS_EXPRESSION, this.CurLoc()); break;
                    case TK.CONSTRUCTOR: id = this._fs.CreateString("constructor"); this._fs.AddInstruction(_OP._IDENTIFIER, 0, id, this.CurLoc()); break;
                }

                let pos = -1;
                this.Lex();
                if ((pos = this._fs.GetLocalVariable(id)) != -1) {
                	/* Handle a local variable (includes 'this') */
                	this._fs.PushTarget(pos);
                    this._es.etype = LOCAL;
                    this._es.epos = pos;
                }

                else if((pos = this._fs.GetOuterVariable(id)) != -1) {
                	/* Handle a free var */
                    if(this.NeedGet()) {
                		this._es.epos = this._fs.PushTarget();
                		this._fs.AddInstruction(_OP.GETOUTER, this._es.epos, pos);
                        /* _es.etype = EXPR; already default value */
                    }
                    else {
                        this._es.etype = OUTER;
                		this._es.epos = pos;
                    }
                }

                else if (this._fs.IsConstant(id, constant)) {
					/* Handle named constant */
                    let constval: SQObject = { _type: OT.NULL, _unVal: 0 };
                    let constid: SQObject;
                    if (constant._type == OT.TABLE) {
                        this.Expect('.');
                        constid = this.Expect(TK.IDENTIFIER); this._fs.AddInstruction(_OP._IDENTIFIER, 0, constid, this.LastLoc()); this._fs.AddInstruction(_OP._MEMBER_EXPRESSION, 0, this.LastLoc());
						if(!_table(constant).Get(constid, constval)) {
                            constval = { _type: OT.NULL, _unVal: 0 }
                            this.Error(`invalid constant [${id._unVal}.${constid._unVal}]`, this.LastLoc());
						}
                    }
                    else { // const
                        constval = constant;
                    }
                	this._es.epos = this._fs.PushTarget();

                	/* generate direct or literal function depending on size */
                	const ctype = constval._type;
                	switch(ctype) {
                		case OT.INTEGER: this.EmitLoadConstInt(constval._unVal, constval._rawVal, this._es.epos); break;
                		case OT.FLOAT: this.EmitLoadConstFloat(constval._unVal, constval._rawVal, this._es.epos); break;
                		default: this._fs.AddInstruction(_OP.LOAD, this._es.epos, this._fs.GetConstant(constval)); break;
                	}
                    this._es.etype = EXPR;
                }
                else {
                    /* Handle a non-local variable, aka a field. Push the 'this' pointer on
                    * the virtual stack (always found in offset 0, so no instruction needs to
                    * be generated), and push the key next. Generate an _OP.LOAD instruction
                    * for the latter. If we are not using the variable as a dref expr, generate
                    * the _OP.GET instruction.
                    */
                	this._fs.PushTarget(0);
                	this._fs.AddInstruction(_OP.LOAD, this._fs.PushTarget(), this._fs.GetConstant(id));
                	if (this.NeedGet()) {
                		this.Emit2ArgsOP(_OP.GET);
                	}
                    this._es.etype = OBJECT;
                }
                return this._es.epos;
            }
            // break;
        case TK.DOUBLE_COLON:  // "::"
			this._fs.AddInstruction(_OP._ROOT, this._fs.PushTarget(), this.CurLoc());
            this._es.etype = OBJECT;
            this._token = '.'; /* hack: drop into PrefixExpr, case '.'*/
			this._es.epos = -1;
            return this._es.epos;
            // break;
        case TK.NULL:
            this._fs.AddInstruction(_OP._NULL_LITERAL, this._fs.PushTarget(), 1, this.CurLoc());
            this.Lex();
            break;
        case TK.INTEGER: this.EmitLoadConstInt(this._lex._nvalue, this._lex._longstr, -1, 1); this.Lex(); break;
        case TK.FLOAT: this.EmitLoadConstFloat(this._lex._fvalue, this._lex._longstr, -1, 1); this.Lex(); break;
        case TK.TRUE: case TK.FALSE:
            this._fs.AddInstruction(_OP._BOOLEAN_LITERAL, this._fs.PushTarget(), this._token == TK.TRUE ? 1 : 0, this.CurLoc());
            this.Lex();
            break;
        case '[': {
                const s = this.CurLoc().start; this._fs.AddInstruction(_OP._ARRAY_EXPRESSION, this._fs.PushTarget(), 0, 0, NOT.ARRAY, this.CurLoc());
                const apos = this._fs.GetCurrentPos(); let key = 0;
                this.Lex();
                while(this._token != ']') { const i = this.LexIndex();
                    this.Expression();
                    if(this._token == ',') this.Lex();
                    const val = this._fs.PopTarget();
                    const array = this._fs.TopTarget();
                    this._fs.AddInstruction(_OP._ARRAY_ELEMENT, array, val, AAT.STACK);
                    key++; if (this.LexOrError(i, "expected ']'")) break;
                }
                this._fs.SetIntructionParam(apos, 1, key); const e = this.CurLoc().end;
                this.Lex(); this._fs.AddInstruction(_OP._DEFINITION_BODY, this.Loc(s, e));
            }
            break;
        case '{':
			this._fs.AddInstruction(_OP._OBJECT_EXPRESSION, this._fs.PushTarget(), 0, NOT.TABLE, this.CurLoc());
            this.Lex(); this.ParseTableOrClass(',', '}');
            break;
        case TK.FUNCTION: this.FunctionExp(this._token); break;
        case '@': this.FunctionExp(this._token, true); break;
        case TK.CLASS: this.Lex(); this.ClassExp(); break;
        case '-': { const loc = this.CurLoc();
            this.Lex();
            switch (this._token) {
            case TK.INTEGER: { this.EmitLoadConstInt(this._lex._nvalue, this._lex._longstr, -1, 1); this.Lex(); this._fs.AddInstruction(_OP.NEG, 0, 0, loc); break; }
            case TK.FLOAT: { this.EmitLoadConstFloat(this._lex._fvalue, this._lex._longstr, -1, 1); this.Lex(); this._fs.AddInstruction(_OP.NEG, 0, 0, loc); break; }
            default: this.UnaryOP(_OP.NEG);
            }
            break; }
        case '!': this.Lex(); this.UnaryOP(_OP.NOT); break;
        case '~': { const loc = this.CurLoc();
            this.Lex();
            if (this._token == TK.INTEGER) { this.EmitLoadConstInt(this._lex._nvalue, this._lex._longstr, -1, 1); this.Lex(); this._fs.AddInstruction(_OP.BWNOT, 0, 0, loc); break; }
            this.UnaryOP(_OP.BWNOT);
            break; }
        case TK.TYPEOF: this.Lex(); this.UnaryOP(_OP.TYPEOF); break;
        case TK.RESUME: this.Lex(); this.UnaryOP(_OP.RESUME); break;
        case TK.CLONE: this.Lex(); this.UnaryOP(_OP.CLONE); break;
        case TK.MINUSMINUS:
        case TK.PLUSPLUS: this.PrefixIncDec(this._token); break;
        case TK.DELETE: this.DeleteExpr(); break;
        case '(': { const s = this.CurLoc().start; this.Lex(); this.CommaExpr(); const e = this.CurLoc().end; this.Expect(')'); this._fs.AddInstruction(_OP._PARENTHESIZED, this.Loc(s, e)); }
            break;
        default: this.Error("expression expected");
        }
        return -1;
    }
    EmitLoadConstInt = (value: number, raw: string, target: number, add?: number): void =>
    {
        if(target < 0) {
            target = this._fs.PushTarget(); if (add) this._fs.AddInstruction(_OP._INTEGER_LITERAL, 0, { _type: OT.INTEGER, _unVal: value, _rawVal: raw }, this.CurLoc());
        }
        if (true) { // (value & (~(0xFFFFFFFF))) == 0) { //does it fit in 32 bits?
            this._fs.AddInstruction(_OP.LOADINT, target, value);
        }
        // else { // unreachable since we dont check sizes
        //     this._fs.AddInstruction(_OP.LOAD, target, this._fs.GetNumericConstant(value));
        // }
    }
    EmitLoadConstFloat = (value: number, raw: string, target: number, add?: number): void =>
    {
        if(target < 0) {
            target = this._fs.PushTarget(); if (add) this._fs.AddInstruction(_OP._FLOAT_LITERAL, 0, { _type: OT.FLOAT, _unVal: value, _rawVal: raw }, this.CurLoc());
        }
        if (true) { // sizeof(SQFloat) == sizeof(SQInt32)) {
            this._fs.AddInstruction(_OP.LOADFLOAT, target, value);
        }
        // else { // unreachable since we dont check sizes
        //     this._fs.AddInstruction(_OP.LOAD, target, this._fs.GetNumericConstantF(value));
        // }
    }
    UnaryOP = (op: SQOpcode): void =>
    {
        const loc = this.LastLoc(); this.PrefixedExpr();
        const src = this._fs.PopTarget();
        this._fs.AddInstruction(op, this._fs.PushTarget(), src, loc);
    }
    NeedGet = (): boolean =>
    {
        switch(this._token) {
        case '=': case '(': case TK.NEWSLOT: case TK.MODEQ: case TK.MULEQ:
        case TK.DIVEQ: case TK.MINUSEQ: case TK.PLUSEQ: case TK.PLUSPLUS: case TK.MINUSMINUS:
            return false;
        }
        return (!this._es.donot_get || (this._es.donot_get && (this._token == '.' || this._token == '[')));
    }
    FunctionCallArgs = () =>
    {
        let nargs = 1; const s = this.LastLoc().start; //this
        while (this._token != ')') { const i = this.LexIndex();
            this.Expression();
            this.MoveIfCurrentTargetIsLocal();
            nargs++;
            if(this._token == ','){
                this.Lex();
                if ((this._token as unknown) == ')') { this.Error("expression expected, found ')'"); this.AddUndefined(); nargs++; }
            } if (this.LexOrError(i, "expected ')'")) break;
        } const e = this.CurLoc().end;
        this.Lex();
        for (let i = 0; i < (nargs - 1); i++) this._fs.PopTarget();
        const stackbase = this._fs.PopTarget();
        const closure = this._fs.PopTarget();
        this._fs.AddInstruction(_OP._CALL_EXPRESSION, this._fs.PushTarget(), closure, stackbase, nargs, this.Loc(s, e));
    }
    ParseTableOrClass = (separator: string, terminator: string): void =>
    {
        const tpos = this._fs.GetCurrentPos(); let nkeys = 0; const s = this.LastLoc().start;
        while(this._token != terminator) { const i = this.LexIndex();
            let hasattrs = false; let computed = false; let loc;
            let isstatic = false; let json = false; let method = false;
            //check if is an attribute
            if(separator == ';') {
                if(this._token == TK.ATTR_OPEN) {
                    this._fs.AddInstruction(_OP._OBJECT_EXPRESSION, this._fs.PushTarget(), 1, NOT.TABLE, this.CurLoc()); this.Lex();
                    this.ParseTableOrClass(',', TK.ATTR_CLOSE);
                    hasattrs = true;
                }
                if(this._token == TK.STATIC) {
                    isstatic = true; loc = this.CurLoc();
                    this.Lex();
                } else { loc = this.CurLoc(); }
            } else { loc = this.CurLoc(); }
            switch (this._token) {
                case TK.FUNCTION:
                case TK.CONSTRUCTOR: {
                    let tk = this._token; let floc; method = true; if (tk == TK.CONSTRUCTOR) floc = this.CurLoc();
                    this.Lex(); if (tk == TK.FUNCTION) floc = this.CurLoc();
                    const id: SQObject = (tk == TK.FUNCTION) ? this.Expect(TK.IDENTIFIER) : this._fs.CreateString("constructor"); const nloc = this.CurLoc();
                    this.Expect('(');
                    this._fs.AddInstruction(_OP._IDENTIFIER, this._fs.PushTarget(), this._fs.GetConstant(id), floc);
                    this.CreateFunction(id);
                    this._fs.AddInstruction(_OP._FUNCTION_EXPRESSION, this._fs.PushTarget(), this._fs._functions.length - 1, 0, nloc);
                    }
                    break;
                case '[':
                    this.Lex(); this.CommaExpr(); this.Expect(']');
                    this.Expect('='); this.Expression(); computed = true;
                    break;
                case TK.STRING_LITERAL: //JSON
                    if(separator == ',') { //only works for tables
                        const sloc = this.CurLoc(); this._fs.AddInstruction(_OP._STRING_LITERAL, this._fs.PushTarget(), this._fs.GetConstant(this.Expect(TK.STRING_LITERAL)), sloc); // Expect() === case STRING_LITERAL
                        this.Expect(':'); this.Expression(); json = true;
                        break;
                    }
                default: const eloc = this.CurLoc();
                    this._fs.AddInstruction(_OP._IDENTIFIER, this._fs.PushTarget(), this._fs.GetConstant(this.Expect(TK.IDENTIFIER)), eloc);
                    this.Expect('='); this.Expression();
            }
            if (this._token == separator) this.Lex();//optional comma/semicolon
            nkeys++;
            const val = this._fs.PopTarget();
            const key = this._fs.PopTarget();
            const attrs = hasattrs ? this._fs.PopTarget() : -1;
            this.assert((hasattrs && (attrs == key-1)) || !hasattrs, 'invalid attribute location');
            const flags = (hasattrs ? NEW_SLOT_ATTRIBUTES_FLAG : 0) | (isstatic ? NEW_SLOT_STATIC_FLAG : 0) | (computed ? NEW_SLOT_COMPUTED_FLAG : 0) | (json ? NEW_SLOT_JSON_FLAG : 0) | (method ? NEW_SLOT_METHOD_FLAG : 0);
            const table = this._fs.TopTarget(); //<<BECAUSE OF THIS NO COMMON EMIT FUNC IS POSSIBLE
            if(separator == ',') { //hack recognizes a table from the separator
                this._fs.AddInstruction(_OP._PROPERTY, flags /*0xFF*/, table, val, loc);
            }
            else {
                this._fs.AddInstruction(_OP._METHOD_PROPERTY_DEFINITION, flags, table, key, val, loc); //this for classes only as it invokes _newmember
            } if (this.LexOrError(i, `expected '${terminator == TK.ATTR_CLOSE ? '/>' : terminator}'`)) break;
        }
        if(separator == ',') //hack recognizes a table from the separator
			this._fs.SetIntructionParam(tpos, 1, nkeys);
        const e = this.CurLoc().end; this.Lex(); this._fs.AddInstruction(_OP._DEFINITION_BODY, this.Loc(s, e));
    };
    LocalDeclStatement = (): void =>
    {
        let varname: SQObject; const dloc = this.CurLoc(); let nargs = 0;
        this.Lex();
        if (this._token == TK.FUNCTION) {
            this.Lex(); const loc = this.CurLoc();
            varname = this.Expect(TK.IDENTIFIER); this._fs.AddInstruction(_OP._IDENTIFIER, 0, varname, loc);
            this.Expect('(');
            this.CreateFunction(varname, false);
            this._fs.AddInstruction(_OP._FUNCTION_DECLARATION, this._fs.PushTarget(), this._fs._functions.length - 1, 0, 1, dloc);
            this._fs.PopTarget();
            this._fs.PushLocalVariable(varname);
            return;
        }

        do { const loc = this.CurLoc();
            varname = this.Expect(TK.IDENTIFIER); this._fs.AddInstruction(_OP._IDENTIFIER, 0, varname, loc);
            if (this._token == '=') {
                this.Lex(); this.Expression();
                const src = this._fs.PopTarget();
                const dest = this._fs.PushTarget();
                if (dest != src || 1) this._fs.AddInstruction(_OP._VARIABLE_DECLARATOR, dest, src);
            } else {
                this._fs.AddInstruction(_OP._VARIABLE_DECLARATOR_NULL, this._fs.PushTarget(), 1);
            }
            nargs++;
			this._fs.PopTarget();
            this._fs.PushLocalVariable(varname);
            if (this._token == ',') this.Lex(); else break;
        } while (1); this._fs.AddInstruction(_OP._VARIABLE_DECLARATION, 0, nargs, dloc);
    };
    IfStatement = (): void =>
    {
        let jmppos: number;
        let haselse = false; const loc = this.CurLoc();
        this.Lex(); this.Expect('('); this.CommaExpr(); this.Expect(')');
        this._fs.AddInstruction(_OP.JZ, this._fs.PopTarget());
        const jnepos = this._fs.GetCurrentPos();
        this.BEGIN_SCOPE();

        this.Statement();
        //
        if(this._token != '}' && this._token != TK.ELSE) this.OptionalSemicolon();

        this.END_SCOPE();
        const endifblock = this._fs.GetCurrentPos();
        if(this._token == TK.ELSE){
            haselse = true;
            this.BEGIN_SCOPE();
            this._fs.AddInstruction(_OP.JMP);
            jmppos = this._fs.GetCurrentPos();
            this.Lex();
            this.Statement(); if (this._lex._prevtoken != '}') this.OptionalSemicolon();
            this.END_SCOPE();
            this._fs.SetIntructionParam(jmppos, 1, this._fs.GetCurrentPos() - jmppos);
        }
        this._fs.SetIntructionParam(jnepos, 1, endifblock - jnepos + (haselse ? 1 : 0)); this._fs.AddInstruction(_OP._IF_STATEMENT, haselse ? 1 : 0, loc);
    }
    WhileStatement = (): void =>
    {
        let jzpos: number, jmppos: number;
        jmppos = this._fs.GetCurrentPos(); const loc = this.CurLoc();
        this.Lex(); this.Expect('('); this.CommaExpr(); this.Expect(')');

        this.BEGIN_BREAKBLE_BLOCK();
        this._fs.AddInstruction(_OP.JZ, this._fs.PopTarget());
        jzpos = this._fs.GetCurrentPos();
        this.BEGIN_SCOPE();

        this.Statement();

        this.END_SCOPE();
        this._fs.AddInstruction(_OP._WHILE_STATEMENT, 0, jmppos - this._fs.GetCurrentPos() - 1, loc);
        this._fs.SetIntructionParam(jzpos, 1, this._fs.GetCurrentPos() - jzpos);

        this.END_BREAKBLE_BLOCK(jmppos);
    }
    DoWhileStatement = (): void =>
    {
        const s = this.CurLoc().start; this.Lex();
        const jmptrg = this._fs.GetCurrentPos();
        this.BEGIN_BREAKBLE_BLOCK();
        this.BEGIN_SCOPE();
        this.Statement();
        this.END_SCOPE();
        this.Expect(TK.WHILE);
        const continuetrg = this._fs.GetCurrentPos();
        this.Expect('('); this.CommaExpr(); const e = this.CurLoc().end; this.Expect(')');
        this._fs.AddInstruction(_OP.JZ, this._fs.PopTarget(), 1);
        this._fs.AddInstruction(_OP._DO_WHILE_STATEMENT, 0, jmptrg - this._fs.GetCurrentPos() - 1, this.Loc(s, e));
        this.END_BREAKBLE_BLOCK(continuetrg);
    }
    ForStatement = (): void =>
    {   const loc = this.CurLoc();
        this.Lex(); let hasinit = false, hastest = false, hasupdate = false;
        this.BEGIN_SCOPE();
        this.Expect('(');
        if(this._token == TK.LOCAL) { this.LocalDeclStatement(); hasinit = true; }
        else if(this._token != ';'){
            this.CommaExpr(); hasinit = true;
            this._fs.PopTarget();
        }
        this.Expect(';');
        this._fs.SnoozeOpt();
        const jmppos = this._fs.GetCurrentPos();
        let jzpos = -1;
        if(this._token != ';') { this.CommaExpr(); this._fs.AddInstruction(_OP.JZ, this._fs.PopTarget()); jzpos = this._fs.GetCurrentPos(); hastest = true; }
        this.Expect(';');
        this._fs.SnoozeOpt();
        const expstart = this._fs.GetCurrentPos() + 1;
        if(this._token != ')') {
            this.CommaExpr(); hasupdate = true;
            this._fs.PopTarget();
        }
        this.Expect(')');
        this._fs.SnoozeOpt();
        const expend = this._fs.GetCurrentPos();
        const expsize = (expend - expstart) + 1;
        let exp = [];
        if (expsize > 0) {
        	for(let i = 0; i < expsize; i++)
        		exp.push(this._fs.GetInstruction(expstart + i));
        	this._fs.PopInstructions(expsize);
        }
        this.BEGIN_BREAKBLE_BLOCK();
        this.Statement();
        const continuetrg = this._fs.GetCurrentPos();
        if(expsize > 0) {
        	for(let i = 0; i < expsize; i++)
        		this._fs.AddInstruction(_OP.JMP /*exp[i]*/);
        }
        this._fs.AddInstruction(_OP.JMP, 0, jmppos - this._fs.GetCurrentPos() - 1, 0);
        if (jzpos > 0) this._fs.SetIntructionParam(jzpos, 1, this._fs.GetCurrentPos() - jzpos);
        this.END_SCOPE();

        this.END_BREAKBLE_BLOCK(continuetrg); this._fs.AddInstruction(_OP._FOR_STATEMENT, hasinit ? 1 : 0, hastest ? 1 : 0, hasupdate ? 1 : 0, loc);
    }
    ForEachStatement = (): void =>
    {   const loc = this.CurLoc();
        let idxname: SQObject, valname: SQObject, hasindex = 0;
        this.Lex(); this.Expect('('); const iloc = this.CurLoc(); valname = this.Expect(TK.IDENTIFIER); this._fs.AddInstruction(_OP._IDENTIFIER, 0, valname, iloc);
        if (this._token == ',') {
            idxname = valname; hasindex = 1;
            this.Lex(); const iloc = this.CurLoc(); valname = this.Expect(TK.IDENTIFIER); this._fs.AddInstruction(_OP._IDENTIFIER, 0, valname, iloc);
        }
        else{
        	idxname = this._fs.CreateString("@INDEX@");
        }
        this.Expect(TK.IN);

        //save the stack size
        this.BEGIN_SCOPE();
        //put the table in the stack(evaluate the table expression)
        this.Expression(); this.Expect(')');
        const container = this._fs.TopTarget();
        //push the index local var
        const indexpos = this._fs.PushLocalVariable(idxname);
        this._fs.AddInstruction(_OP.LOADNULLS, indexpos, 1);
        //push the value local var
        const valuepos = this._fs.PushLocalVariable(valname);
        this._fs.AddInstruction(_OP.LOADNULLS, valuepos, 1);
        //push reference index
        const itrpos = this._fs.PushLocalVariable(this._fs.CreateString("@ITERATOR@")); //use invalid id to make it inaccessible
        this._fs.AddInstruction(_OP.LOADNULLS, itrpos, 1);
        const jmppos = this._fs.GetCurrentPos();
        this._fs.AddInstruction(_OP.FOREACH, container, 0, indexpos);
        const foreachpos = this._fs.GetCurrentPos();
        this._fs.AddInstruction(_OP.POSTFOREACH, container, 0, indexpos);
        //generate the statement code
        this.BEGIN_BREAKBLE_BLOCK();
        this.Statement();
        this._fs.AddInstruction(_OP.JMP, 0, jmppos - this._fs.GetCurrentPos() - 1);
        this._fs.SetIntructionParam(foreachpos, 1, this._fs.GetCurrentPos() - foreachpos);
        this._fs.SetIntructionParam(foreachpos + 1, 1, this._fs.GetCurrentPos() - foreachpos);
        this.END_BREAKBLE_BLOCK(foreachpos - 1);
        // //restore the local variable stack(remove index,val and ref idx)
        this._fs.PopTarget();
        this.END_SCOPE(); this._fs.AddInstruction(_OP._FOR_IN_STATEMENT, hasindex, loc);
    }
    SwitchStatement = (): void =>
    {
        const s = this.CurLoc().start; this.Lex(); this.Expect('('); this.CommaExpr(); this.Expect(')');
        this.Expect('{'); this._fs.AddInstruction(_OP._SWITCH_STATEMENT);
        const expr = this._fs.TopTarget();
        let bfirst = true;
        let tonextcondjmp = -1;
        let skipcondjmp = -1;
        let __nbreaks__ = this._fs._unresolvedbreaks.length;
        this._fs._breaktargets.push(0);
        while(this._token == TK.CASE) {
            if(!bfirst) {
            	this._fs.AddInstruction(_OP.JMP, 0, 0);
            	skipcondjmp = this._fs.GetCurrentPos();
            	this._fs.SetIntructionParam(tonextcondjmp, 1, this._fs.GetCurrentPos() - tonextcondjmp);
            }
			//condition
            const loc = this.CurLoc(); this.Lex(); this.Expression(); this.Expect(':');
            const trg = this._fs.PopTarget();
            let eqtarget = trg;
            const local = this._fs.IsLocal(trg);
            if (local) {
                eqtarget = this._fs.PushTarget(); //we need to allocate a extra reg
            }
            this._fs.AddInstruction(_OP.EQ, eqtarget, trg, expr);
            this._fs.AddInstruction(_OP.JZ, eqtarget, 0);
            if (local) {
                this._fs.PopTarget();
            }

            //end condition
            if (skipcondjmp != -1) {
            	this._fs.SetIntructionParam(skipcondjmp, 1, (this._fs.GetCurrentPos() - skipcondjmp));
            }
            tonextcondjmp = this._fs.GetCurrentPos();
            this.BEGIN_SCOPE();
            this.Statements();
            this.END_SCOPE();
            bfirst = false; this._fs.AddInstruction(_OP._SWITCH_CASE, 1, this._scope.nodestacksize, loc);
        }
        if (tonextcondjmp != -1)
        	this._fs.SetIntructionParam(tonextcondjmp, 1, this._fs.GetCurrentPos() - tonextcondjmp);
        if(this._token == TK.DEFAULT) {
            const loc = this.CurLoc(); this.Lex(); this.Expect(':');
            this.BEGIN_SCOPE();
            this.Statements();
            this.END_SCOPE(); this._fs.AddInstruction(_OP._SWITCH_CASE, 0, this._scope.nodestacksize, loc);
        }
        const e = this.CurLoc().end; this.Expect('}'); this._fs.AddInstruction(_OP._DEFINITION_BODY, this.Loc(s, e));
        this._fs.PopTarget();
        __nbreaks__ = this._fs._unresolvedbreaks.length - __nbreaks__;
        if (__nbreaks__ > 0) this.ResolveBreaks(this._fs, __nbreaks__);
        this._fs._breaktargets.pop();
    }
    FunctionStatement = (): void =>
    {
        let id: SQObject; const loc = this.CurLoc();
        this.Lex(); const iloc = this.CurLoc(); id = this.Expect(TK.IDENTIFIER); this._fs.AddInstruction(_OP._IDENTIFIER, 0, id, iloc)
        this._fs.PushTarget(0);
        this._fs.AddInstruction(_OP.LOAD, this._fs.PushTarget(), this._fs.GetConstant(id));
        if (this._token == TK.DOUBLE_COLON) this.Emit2ArgsOP(_OP.GET);

        while (this._token == TK.DOUBLE_COLON) {
            this.Lex();
            id = this.Expect(TK.IDENTIFIER); this._fs.AddInstruction(_OP._MEMBER_PROPERTY, 0, 1, id, this.LastLoc());
			this._fs.AddInstruction(_OP.LOAD, this._fs.PushTarget(), this._fs.GetConstant(id));
            if (this._token == TK.DOUBLE_COLON) this.Emit2ArgsOP(_OP.GET);
        }
        this.Expect('(');
        this.CreateFunction(id);
        this._fs.AddInstruction(_OP._FUNCTION_DECLARATION, this._fs.PushTarget(), this._fs._functions.length - 1, 0, 0, loc);
        this.EmitDerefOp(_OP.NEWSLOT);
        this._fs.PopTarget();
    }
    ClassStatement = (): void =>
    {
        let es: SQExpState; const loc = this.CurLoc();
        this.Lex();
        es = Object.assign({}, this._es);
        this._es.donot_get = true;
        this.PrefixedExpr();
        if(this._es.etype == EXPR) {
            this.Error("invalid class name", this.LastLoc());
        }
        else if(this._es.etype == OBJECT || this._es.etype == BASE) {
            this.ClassExp(); this._fs.AddInstruction(_OP._CLASS_DECLARATION, loc);
            this.EmitDerefOp(_OP.NEWSLOT);
            this._fs.PopTarget();
        }
        else {
            this.Error("cannot create a class in a local with the syntax(class <local>)", this.LastLoc());
        }
        this._es = es;
    }
    ExpectScalar = (): SQObject =>
    {
        let val: SQObject =
        { _type: OT.NULL, _unVal: 0 }; //shut up GCC 4.x
        switch (this._token as unknown) {
            case TK.INTEGER:
                val._type = OT.INTEGER;
                val._unVal = this._lex._nvalue; val._rawVal = this._lex._longstr;
                break;
            case TK.FLOAT:
                val._type = OT.FLOAT;
                val._unVal = this._lex._fvalue; val._rawVal = this._lex._longstr;
                break;
            case TK.STRING_LITERAL:
                val = this._fs.CreateString(this._lex._svalue, this._lex._longstr);
                break;
            case TK.TRUE:
            case TK.FALSE:
                val._type = OT.BOOL;
                val._unVal = this._token == TK.TRUE ? 1 : 0;
                break;
            case '-':
                this.Lex();
                switch (this._token)
                {
                    case TK.INTEGER:
                        val._type = OT.INTEGER;
                        val._unVal = -this._lex._nvalue; val._rawVal = '-'+this._lex._longstr;
                        break;
                    case TK.FLOAT:
                        val._type = OT.FLOAT;
                        val._unVal = -this._lex._fvalue; val._rawVal = '-'+this._lex._longstr;
                        break;
                    default:
                        this.Error("scalar expected : integer,float", this._fs.NodeAt(-1).loc);
                }
                break;
            default:
                this.Error("scalar expected : integer,float or string", this._fs.NodeAt(-1).loc);
        }
        this.Lex();
        return val;
    }
    EnumStatement = (): void =>
    {
        const s = this.CurLoc().start; this.Lex(); const iloc = this.CurLoc();
        const id = this.Expect(TK.IDENTIFIER); this._fs.AddInstruction(_OP._IDENTIFIER, 0, id, iloc); this._fs.AddInstruction(_OP._ENUM_DECLARATION);
        this.Expect('{');

        let table = this._fs.CreateTable();
        let nval = 0;
        while (this._token != '}') { const i = this.LexIndex(); const iloc = this.CurLoc();
            const key = this.Expect(TK.IDENTIFIER); this._fs.AddInstruction(_OP._IDENTIFIER, 0, key, iloc);
            let val: SQObject = { _type: OT.NULL, _unVal: 0 };
            if (this._token == '=') {
                this.Lex(); const mloc = this.CurLoc();
                val = this.ExpectScalar(); this._fs.AddInstruction(_OP._SCALAR_LITERAL, 0, val, mloc); this._fs.AddInstruction(_OP._ENUM_MEMBER, 1);
            }
            else {
                val._type = OT.INTEGER;
                val._unVal = nval++; val._rawVal = String(val._unVal); this._fs.AddInstruction(_OP._ENUM_MEMBER, 0);
            }
            _table(table).NewSlot(key, val);
            if (this._token == ',') this.Lex(); if (this.LexOrError(i, "expected '}'")) break;
        } const e = this.CurLoc().end; this._fs.AddInstruction(_OP._DEFINITION_BODY, this.Loc(s, e));
        const enums = _ss(this._vm)._consts;
        let strongid: SQObject | null = id;
        enums.NewSlot(strongid, table);
        strongid = null;
        this.Lex();
    }
    TryCatchStatement = (): void =>
    {
        let exid: SQObject; const loc = this.CurLoc();
        this.Lex();
        this._fs.AddInstruction(_OP.PUSHTRAP, 0, 0);
        this._fs._traps++;
        if (this._fs._breaktargets.length) this._fs._breaktargets[this._fs._breaktargets.length - 1]++;
        if (this._fs._continuetargets.length) this._fs._continuetargets[this._fs._continuetargets.length - 1]++;
        const trappos = this._fs.GetCurrentPos();
        {
            this.BEGIN_SCOPE();
            this.Statement();
            this.END_SCOPE();
        }
        this._fs._traps--;
        this._fs.AddInstruction(_OP.POPTRAP, 1, 0);
        if (this._fs._breaktargets.length) this._fs._breaktargets[this._fs._breaktargets.length - 1]--;
        if (this._fs._continuetargets.length) this._fs._continuetargets[this._fs._continuetargets.length - 1]--;
        this._fs.AddInstruction(_OP.JMP, 0, 0);
        const jmppos = this._fs.GetCurrentPos();
        this._fs.SetIntructionParam(trappos, 1, (this._fs.GetCurrentPos() - trappos));
        const cloc = this.CurLoc(); this.Expect(TK.CATCH); this.Expect('('); let iloc = this.CurLoc(); exid = this.Expect(TK.IDENTIFIER); this._fs.AddInstruction(_OP._IDENTIFIER, 0, exid, iloc); this.Expect(')');
        {
            this.BEGIN_SCOPE();
            const ex_target = this._fs.PushLocalVariable(exid);
            this._fs.SetIntructionParam(trappos, 0, ex_target);
            this.Statement();
            this._fs.SetIntructionParams(jmppos, 0, (this._fs.GetCurrentPos() - jmppos), 0);
            this.END_SCOPE();
        } this._fs.AddInstruction(_OP._TRY_STATEMENT, loc, cloc);
    }
    FunctionExp = (ftype: TokenType, lambda = false): void =>
    {
        const loc = this.CurLoc(); this.Lex(); this.Expect('(');
        const dummy: SQObject = { _type: OT.STRING, _unVal: 'dummy' };
        this.CreateFunction(dummy, lambda);
        this._fs.AddInstruction(lambda ? _OP._LAMBDA_EXPRESSION : _OP._FUNCTION_EXPRESSION, this._fs.PushTarget(), this._fs._functions.length - 1, ftype == TK.FUNCTION ? 0 : 1, loc);
    }
    ClassExp = (): void =>
    {
        let base = -1;
        let attrs = -1; const loc = this.LastLoc();
        if(this._token == TK.EXTENDS) {
            this.Lex(); this.Expression();
            base = this._fs.TopTarget();
        }
        if(this._token == TK.ATTR_OPEN) {
            const aloc = this.CurLoc(); this.Lex();
            this._fs.AddInstruction(_OP._OBJECT_EXPRESSION, this._fs.PushTarget(), 1, NOT.TABLE, aloc);
            this.ParseTableOrClass(',', TK.ATTR_CLOSE);
            attrs = this._fs.TopTarget();
        }
        this.Expect('{');
        if (attrs != -1) this._fs.PopTarget();
        if (base != -1) this._fs.PopTarget();
        this._fs.AddInstruction(_OP._CLASS_EXPRESSION, this._fs.PushTarget(), base, attrs, NOT.CLASS);
        this.ParseTableOrClass(';', '}'); this._fs.AddInstruction(_OP._CLASS_EXPRESSION_BODY, loc);
    }
    DeleteExpr = (): void =>
    {
        const loc = this.CurLoc();
        this.Lex();
        const es = Object.assign({}, this._es);
        this._es.donot_get = true;
        this.PrefixedExpr();
        if(this._es.etype==EXPR) this.Error("can't delete an expression", this.LastLoc());
        if(this._es.etype==OBJECT || this._es.etype==BASE) {
            this.Emit2ArgsOP(_OP._DELETE, loc);
        }
        else {
            this.Error("cannot delete an (outer) local", this.LastLoc());
        }
        this._es = es;
    }
    PrefixIncDec = (token: TokenType): void =>
    {
        let es: SQExpState;
        const diff = (token == TK.MINUSMINUS) ? -1 : 1; const loc = this.CurLoc();
        this.Lex();
        es = Object.assign({}, this._es);
        this._es.donot_get = true;
        this.PrefixedExpr();
        if(this._es.etype==EXPR) {
            this.Error("can't '++' or '--' an expression", loc);
        }
        else if (this._es.etype == OBJECT || this._es.etype == BASE) {
        	this.Emit2ArgsOP(_OP._UPDATE_EXPRESSION_PREFIX, diff, loc);
        }
        else if (this._es.etype == LOCAL) {
        	const src = this._fs.TopTarget();
        	this._fs.AddInstruction(_OP._UPDATE_EXPRESSION_PREFIX, src, src, 0, diff, loc);

        }
        else if (this._es.etype == OUTER) {
        	const tmp = this._fs.PushTarget();
        	this._fs.AddInstruction(_OP.GETOUTER, tmp, this._es.epos);
        	this._fs.AddInstruction(_OP._UPDATE_EXPRESSION_PREFIX, tmp, tmp, 0, diff, loc);
        	this._fs.AddInstruction(_OP.SETOUTER, tmp, this._es.epos, tmp);
        }
        this._es = es;
    }
    CreateFunction = (name: SQObject, lambda = false): void =>
    {
        const funcstate = this._fs.PushChildState(_ss(this._vm));
        funcstate._name = name;
        let paramname: SQObject;
        funcstate.AddParameter(this._fs.CreateString("this"));
        funcstate._sourcename = this._sourcename;
        let defparams = 0;
        while (this._token != ')') { const i = this.LexIndex();
            if (this._token == TK.VARPARAMS) {
                if(defparams > 0) this.Error("function with default parameters cannot have variable number of parameters", this.CurLoc());
                funcstate.AddParameter(this._fs.CreateString('vargv'), 1);
                funcstate._varparams = true;
                this.Lex();
                if((this._token as unknown) != ')') this.Error("expected ')'");
                /* break; */ if ((this._token as unknown) == ',') this.Lex(); // allow to continue
            }
            else {
                paramname = this.Expect(TK.IDENTIFIER);
                funcstate.AddParameter(paramname, 2);
                if (this._token == '=') {
                    this.Lex();
                    this.Expression();
                    funcstate.AddDefaultParam(this._fs.TopTarget());
                    defparams++;
                }
                else {
                    if (defparams > 0) this.Error("expected '='", this.LastLoc());
                }
                if(this._token == ',') this.Lex();
                else if(this._token != ')') this.Error("expected ')' or ','");
            } if (this.LexOrError(i, "expected ')'")) break;
        }
        this.Expect(')');
        for (let n = 0; n < defparams; n++) {
            this._fs.PopTarget();
        }

        const currchunk = this._fs;
        this._fs = funcstate;
        if(lambda) {
            this.Expression();
            this._fs.AddInstruction(_OP.RETURN, 1, this._fs.PopTarget()); }
        else {
            this.Statement(false);
        }
        funcstate.AddLineInfos(this._lex._prevtoken == '\n' ? this._lex._lasttokenline : this._lex._currentline, this._lineinfo, true);
        funcstate.AddInstruction(_OP.RETURN, -1);
        funcstate.SetStackSize(0);

        const func = funcstate.BuildProto();
// #ifdef _DEBUG_DUMP
//         funcstate.Dump(func);
// #endif
        this._fs = currchunk;
        this._fs._functions.push(funcstate);
		this._fs.PopChildState();
    }
    ResolveBreaks = (funcstate: SQFuncState, ntoresolve: number): void =>
    {
        while (ntoresolve > 0) {
            const pos = funcstate._unresolvedbreaks.at(-1)!;
            funcstate._unresolvedbreaks.pop();
            //set the jmp instruction
            funcstate.SetIntructionParams(pos, 0, funcstate.GetCurrentPos() - pos, 0);
            ntoresolve--;
        }
    }
    ResolveContinues = (funcstate: SQFuncState, ntoresolve: number, targetpos: number): void =>
    {
        while (ntoresolve > 0) {
            const pos = funcstate._unresolvedcontinues.at(-1)!;
            funcstate._unresolvedcontinues.pop();
            //set the jmp instruction
            funcstate.SetIntructionParams(pos, 0, targetpos - pos, 0);
            ntoresolve--;
        }
    }
// private:
    _token!: TokenType;
	// _fs!: SQFuncState;
	_sourcename!: string;
	// _lex!: SQLexer;
    _lineinfo!: boolean;
	_raiseerror: boolean;
	_debugline!: number;
	_debugop!: number;
	// _es!: SQExpState;
    // _scope!: SQScope;
	_compilererror!: string | null;
	_errorjmp!: number;
	// _vm!: SQVM;
};

// bool Compile(SQVM *vm,SQLEXREADFUNC rg, SQUserPointer up, const SQChar *sourcename, SQObjectPtr &out, bool raiseerror, bool lineinfo)
// {
//     SQCompiler p(vm, rg, up, sourcename, raiseerror, lineinfo);
//     return p.Compile(out);
// }

// #endif // #L1533
