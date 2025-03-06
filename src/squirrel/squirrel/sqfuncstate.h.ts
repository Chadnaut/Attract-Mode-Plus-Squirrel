/*	see copyright notice in squirrel.h */
import { SQLineInfo, SQLocalVarInfo, SQOuterVar } from './sqfuncproto.h';
import { CompilerErrorFunc } from './sqcompiler.h';
import { SQObject } from '../include/squirrel.h';
import { SQFuncState } from './sqfuncstate.cpp';
import { SQInstruction } from './sqopcodes.h';
import { GetFullLoc, SQTree as qt } from '../../ast/create';
import { AST } from '../../ast';
import { SQSharedState } from './sqstate.cpp';
import toFastProperties from 'to-fast-properties';

export class SQFuncStateStruct {
    _returnexp!: number;
    _vlocals: SQLocalVarInfo[];
    _targetstack: number[];
    _stacksize!: number;
    _varparams!: boolean;
    _bgenerator!: boolean;
    _unresolvedbreaks: number[];
    _unresolvedcontinues: number[];
    _functions: SQFuncState[];
    _parameters: SQObject[]; // contains vargv & this
    _outervalues: SQOuterVar[];
    _instructions: SQInstruction[];
    _localvarinfos: SQLocalVarInfo[];
    _literals!: SQObject;
    _strings!: SQObject;
    _name!: SQObject;
    _sourcename: string | undefined;
    _nliterals!: number;
    _lineinfos: SQLineInfo[];
    _parent!: SQFuncState | null;
    // _scope_blocks
    _breaktargets: number[];
    _continuetargets: number[];
    _defaultparams: number[];
    _lastline!: number;
    _traps!: number;
    _outers!: number;
    _optimization = true;
    _sharedstate!: SQSharedState;
    _childstates: SQFuncState[];
// private:
    _errfunc!: CompilerErrorFunc;
    _errtarget: any;
    _ss!: SQSharedState;

    // --------------------------------------------------------
    // Custom

    _params: AST.Pattern[];
    _nodestack: AST.Node[];

    constructor() {
        this._instructions = [];
        this._functions = [];
        this._childstates = [];
        this._targetstack = [];
        this._parameters = [];
        this._defaultparams = [];
        this._lineinfos = [];
        this._params = [];
        this._vlocals = [];
        this._breaktargets = [];
        this._continuetargets = [];
        this._unresolvedbreaks = [];
        this._unresolvedcontinues = [];
        this._nodestack = [];
        this._localvarinfos = [];
        this._outervalues = [];
    }

    SnoozeOpt = (): void => {}
    GetCurrentPos = (): number => { return this._nodestack.length - 1; }
    GetInstruction = (pos: number): SQInstruction => { return this._instructions[pos]; }
    PopInstructions = (size: number): void => { for(let i=0;i<size;i++) this._instructions.pop(); }

    // Add parameter value
    AddDefaultParam = (trg: number) => {
        this._defaultparams.push(trg);
        this._params.push(qt.AssignmentPattern(this._params.pop()!, this._parent!.PopNode()));
    }

    protected AddParam = (name: SQObject, mode: number) => {
        switch (mode) {
            case 1:
                this._params.push(qt.RestElement(this._ss._loc));
                break;
            case 2:
                this._params.push(qt.Identifier(name._unVal, this._ss._lastloc));
                break;
        }
    }

    Error = (err: string, loc?: AST.SourceLocation): void => {}

    assert = (v: any, err: string) => {
        if (!v) this.Error(err, this._ss._lastloc);
    }

    protected PushNode = (node: AST.Node) => {
        toFastProperties(node);
        this._nodestack.push(node);
    };

    protected TopNode = (): AST.Node | null => {
        return this._nodestack.at(-1) ?? null;
    };

    protected PopNode = (): AST.Node => {
        return this._nodestack.pop()!;
    };

    public NodeAt = (index: number) : AST.Node | null => {
        return this._nodestack.at(index);
    }

    public StackSize = (): number => this._nodestack.length;

    // -------------------------------------------------------------------------
    /*
        Parenthesis changes the location of parent nodes
        However, it is NOT stored on the node that has parenthesis
        To conform with standards:

        "( 1 )"
        - IntegerLiteral: range = 2,3, parenthesized = true
          - Stores fullLoc as 0,5, which includes parenthesis
        - ExpressionStatement: range = 0,5
          - Uses fullLoc when creating range
    */

    // -------------------------------------------------------------------------

    /** Wrap specific nodes with ExpressionStatement or Directive */
    UpdateStatement = (): void => {
        const node = this.TopNode();
        switch (node?.type) {
            case 'Identifier':
            case 'IntegerLiteral':
            case 'FloatLiteral':
            case 'BooleanLiteral':
            case 'NullLiteral':
            case 'ArrayExpression':
            case 'MemberExpression':
            case 'AssignmentExpression':
            case 'BinaryExpression':
            case 'UnaryExpression':
            case 'ThisExpression':
            case 'Base':
            case 'Root':
            case 'LogicalExpression':
            case 'UpdateExpression':
            case 'CallExpression':
            case 'ConditionalExpression':
            case 'SequenceExpression': {
                const child = this.PopNode();
                const loc = GetFullLoc(child);
                this.PushNode(qt.ExpressionStatement(child, loc));
                break;
            }
            case 'StringLiteral': {
                const child = <AST.StringLiteral>this.PopNode();
                const loc = GetFullLoc(child);
                this.PushNode(qt.Directive(child, loc));
                break;
            }
        }
    }
}
