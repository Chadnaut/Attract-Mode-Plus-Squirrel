/*
	see copyright notice in squirrel.h
*/
import { _OP, MAX_FUNC_STACKSIZE, MAX_LITERALS, NEW_SLOT_ATTRIBUTES_FLAG, NEW_SLOT_COMPUTED_FLAG, NEW_SLOT_JSON_FLAG, NEW_SLOT_STATIC_FLAG, SQOpcode, GetAssignmentOperator, GetBinaryOperator, GetUnaryOperator, GetLogicOperator, NEW_SLOT_METHOD_FLAG } from "./sqopcodes.h";
import { SQLineInfo, SQLocalVarInfo, SQOuterType, SQOuterVar } from "./sqfuncproto.h";
import { _table, UINT_MINUS_ONE } from "./sqobject.h";
import { OT, SQObject } from "../include/squirrel.h";
import { SQFuncStateStruct } from "./sqfuncstate.h";
import { CompilerErrorFunc } from "./sqcompiler.h";
import { GetFullLoc, SQTree as qt, SetFullLoc } from "../../ast/create";
import { SQSharedState } from "./sqstate.cpp";
import { AST } from "../../ast";

export class SQFuncState extends SQFuncStateStruct {

    constructor(ss: SQSharedState, parent: SQFuncState | null, efunc: CompilerErrorFunc, ed: any)
    {   super();
        this._nliterals = 0; // #L92
		this._literals = { _type: OT.TABLE, _unVal: new Map() };
		// this._strings = { _type: OT.TABLE, _unVal: new Map() };
        this._sharedstate = ss;
		this._lastline = 0;
		this._optimization = true;
        this._parent = parent;
		this._stacksize = 0;
		this._traps = 0;
		this._returnexp = 0;
        this._varparams = false;
		this._errfunc = efunc;
		this._errtarget = ed;
		this._bgenerator = false;
		this._outers = 0;
		this._ss = ss;

    }

    Error = (err: string, loc?: AST.SourceLocation): void => // #L111
    {
        this._errfunc(this._errtarget, { message: err, loc });
    }

    GetNumericConstant = (cons: number): SQObject => // L216
    {
        return this.GetConstant({ _type: OT.INTEGER, _unVal: cons });
    }

    GetNumericConstantF = (cons: number): SQObject =>
    {
        return this.GetConstant({ _type: OT.FLOAT, _unVal: cons });
    }

    GetConstant = (cons: SQObject): SQObject =>
    {
        let val: SQObject = { _type: OT.NULL, _unVal: 0 };
        if(!_table(this._literals).Get(cons, val))
        {
            let val: number | null = this._nliterals;
            _table(this._literals).NewSlot(cons, { _type: OT.INTEGER, _unVal: val });
            this._nliterals++;
            if (this._nliterals > MAX_LITERALS) {
                val = null;
                this.Error("internal compiler error: too many literals");
            }
        }
        return cons; // _integer(val);
    }

    SetIntructionParams = (pos: number, arg0: number, arg1: number, arg2: number, arg3: number = 0): void =>
    {
        // _instructions[pos]._arg0=(unsigned char)*((SQUnsignedInteger *)&arg0);
        // _instructions[pos]._arg1=(SQInt32)*((SQUnsignedInteger *)&arg1);
        // _instructions[pos]._arg2=(unsigned char)*((SQUnsignedInteger *)&arg2);
        // _instructions[pos]._arg3=(unsigned char)*((SQUnsignedInteger *)&arg3);
    }

    SetIntructionParam = (pos: number, arg: number, val: number): void =>
    {
        // switch(arg){
        // 	case 0:_instructions[pos]._arg0=(unsigned char)*((SQUnsignedInteger *)&val);break;
        // 	case 1:case 4:_instructions[pos]._arg1=(SQInt32)*((SQUnsignedInteger *)&val);break;
        // 	case 2:_instructions[pos]._arg2=(unsigned char)*((SQUnsignedInteger *)&val);break;
        // 	case 3:_instructions[pos]._arg3=(unsigned char)*((SQUnsignedInteger *)&val);break;
        // };
    }

    AllocStackPos = (): number =>
    {
        const npos = this._vlocals.length;
        this._vlocals.push(<SQLocalVarInfo>{ _name: { _type: OT.NULL, _unVal: 0 }, _start_op: 0, _end_op: 0, _pos: 0 });
        if (this._vlocals.length > this._stacksize) {
            if (this._stacksize > MAX_FUNC_STACKSIZE) this.Error("internal compiler error: too many locals");
            this._stacksize = this._vlocals.length;
        }
        return npos;
    }

    PushTarget = (n: number = -1): number => // #L271
    {
        if (n != -1){
            this._targetstack.push(n);
            return n;
        }
        n = this.AllocStackPos();
    	this._targetstack.push(n);
        return n;
    }

    // GetUpTarget = (n: number = -1): number => {
    //     return this._targetstack[((this._targetstack.length-1)-n)];
    // }

    TopTarget = (): number => {
        return this._targetstack.at(-1);
    }
    PopTarget = (): number =>
    {
        const npos = this._targetstack.at(-1);
        this.assert(npos < this._vlocals.length, "internal compiler assertion: invalid command");
        const t = this._vlocals[npos];
        if (t?._name._type == OT.NULL) {
            this._vlocals.pop();
        }
        this._targetstack.pop();
        return npos;
    }

    GetStackSize = (): number =>
    {
        return this._vlocals.length;
    }

    CountOuters(stacksize: number): number
    {
        let outers = 0;
        let k = this._vlocals.length - 1;
        while (k >= stacksize) {
            const lvi = this._vlocals[k];
            k--;
            if(lvi._end_op == UINT_MINUS_ONE) { //this means is an outer
                outers++;
            }
        }
        return outers;
    }

    SetStackSize = (n: number): void =>
    {
        let size = this._vlocals.length;
        while (size > n) {
            size--;
            let lvi: SQLocalVarInfo = this._vlocals.at(-1)!;
            if (lvi._name._type != OT.NULL) {
                if (lvi._end_op == UINT_MINUS_ONE) { //this means is an outer
                    this._outers--;
                }
                lvi._end_op = this.GetCurrentPos();
                this._localvarinfos.push(lvi);
            }
            this._vlocals.pop();
        }
    };

    IsConstant = (name: SQObject, e: SQObject): boolean =>
    {
        let val: SQObject = { _type: OT.NULL, _unVal: 0 };
        if (this._sharedstate._consts.Get(name, val)) {
            e._type = val._type; e._unVal = val._unVal;
            return true;
        }
        return false;
    };

    IsLocal = (stkpos: number): boolean =>
    {
        if (stkpos >= this._vlocals.length) return false;
        else if (this._vlocals[stkpos]?._name._type != OT.NULL) return true;
        return false;
    };

    PushLocalVariable = (name: SQObject): number =>
    {
        const pos = this._vlocals.length;
        const lvi = <SQLocalVarInfo>{
            _name: name,
            _start_op: this.GetCurrentPos() + 1,
            _pos: this._vlocals.length};
        this._vlocals.push(lvi);
        if (this._vlocals.length > this._stacksize) this._stacksize = this._vlocals.length;
        return pos;
    };



    GetLocalVariable = (name: SQObject): number =>
    {
        let locals = this._vlocals.length;
        while (locals >= 1) {
            const lvi = this._vlocals[locals-1];
            // if (lvi._name._type == name._type && lvi._name._unVal == name._unVal) {
            if (lvi._name._type == OT.STRING && lvi._name._unVal == name._unVal) {
                return locals - 1;
            }
            locals--;
        }
        return -1;
    };

    MarkLocalAsOuter = (pos: number): void =>
    {
        const lvi = this._vlocals[pos];
        lvi._end_op = UINT_MINUS_ONE;
        this._outers++;
    }

    GetOuterVariable = (name: SQObject): number =>
    {
        const outers = this._outervalues.length;
        for (let i = 0; i<outers; i++) {
            if (this._outervalues[i]._name._unVal == name._unVal)
                return i;
        }
        let pos = -1;
        if (this._parent) {
            pos = this._parent.GetLocalVariable(name);
            if (pos == -1) {
                pos = this._parent.GetOuterVariable(name);
                if (pos != -1) {
                    this._outervalues.push(<SQOuterVar>{ _name: name, _src: { _type: OT.INTEGER, _unVal: pos }, _type: SQOuterType.otOUTER }); //local
                    return this._outervalues.length - 1;
                }
            }
            else {
                this._parent.MarkLocalAsOuter(pos);
                this._outervalues.push(<SQOuterVar>{ _name: name, _src: { _type: OT.INTEGER, _unVal: pos }, _type: SQOuterType.otLOCAL}); //local
                return this._outervalues.length - 1;


            }
        }
        return -1;
    }

    /** Mode 1 = RestElement, Mode 2 = Identifier */
    AddParameter = (name: SQObject, mode: number = 0): void =>
    {
        this.PushLocalVariable(name);
        this._parameters.push(name); this.AddParam(name, mode);
    }

    AddLineInfos = (line: number, lineop: boolean, force?: boolean): void =>
    {
        if (this._lastline != line || force ) {
            const li: SQLineInfo = {
                _line: line, _op: this.GetCurrentPos()+1 };
            if (lineop) this.AddInstruction(_OP.LINE, 0, line);
            if (this._lastline != line) {
            	this._lineinfos.push(li);
            }
            this._lastline = line;
        }
    }

    DiscardTarget = (): void =>
    {
        const discardedtarget = this.PopTarget();
        // const size = this._instructions.length;
        // if (size > 0 && this._optimization) {
        //     SQInstruction &pi = _instructions[size-1];//previous instruction
        //     switch(pi.op) {
        //     case _OP._SET:case _OP._NEWSLOT:case _OP._SETOUTER:case _OP._CALL:
        //         if(pi._arg0 == discardedtarget) {
        //             pi._arg0 = 0xFF;
        //         }
        //     }
        // }
    }

    AddInstruction = (_op: SQOpcode, ...args: any[]): void => // L#450
    {
        let [_arg0, _arg1, _arg2, _arg3, _arg4] = args;
        // const i = <SQInstruction>{ op: _op, _arg0, _arg1, _arg2, _arg3 };
        // const pi = this._instructions[this._instructions.length - 2]; // previous instruction

        switch (_op) {
            case _OP.ADD: case _OP.SUB: case _OP.MUL: case _OP.DIV: case _OP.MOD: {
                const right = this.PopNode();
                const left = this.PopNode();
                const loc = qt.LocSpan(GetFullLoc(left), GetFullLoc(right));
                this.PushNode(qt.BinaryExpression(GetBinaryOperator(_op), left, right, loc));
                break;
            }
            case _OP.EXISTS: case _OP.INSTANCEOF: case _OP.BITW: case _OP.EQ: case _OP.NE: case _OP.CMP: {
                if (_arg3 == undefined) break;
                const right = this.PopNode();
                const left = this.PopNode();
                const loc = qt.LocSpan(GetFullLoc(left), GetFullLoc(right));
                this.PushNode(qt.BinaryExpression(GetBinaryOperator(_op, _arg3), left, right, loc));
                break;
            }
            case _OP.NEG: case _OP.NOT: case _OP.BWNOT: case _OP.TYPEOF: case _OP.RESUME: case _OP.CLONE: {
                const operator = GetUnaryOperator(_op);
                const node = this.PopNode();
                const loc = qt.LocSpan(_arg2, GetFullLoc(node));
                const exp = qt.UnaryExpression(operator, node, true, loc);
                this.PushNode(exp);
                break;
            }
            case _OP._RETURN: {
                const node = (this._returnexp >= 0) ? this._nodestack.splice(this._returnexp, 1)[0] : null;
                const loc = qt.LocSpan(_arg3, GetFullLoc(node));
                this.PushNode(qt.ReturnStatement(node, loc));
                break;
            }
            case _OP._YIELD: {
                const node = (this._returnexp >= 0) ? this._nodestack.splice(this._returnexp, 1)[0] : null;
                const loc = qt.LocSpan(_arg3, GetFullLoc(node));
                this.PushNode(qt.YieldExpression(node, loc));
                break;
            }
            case _OP._BREAK_STATEMENT: {
                this.PushNode(qt.BreakStatement(_arg2));
                break;
            }
            case _OP._CONTINUE_STATEMENT: {
                this.PushNode(qt.ContinueStatement(_arg2));
                break;
            }
            case _OP._WHILE_STATEMENT: {
                const body = this.PopNode();
                const test = this.PopNode();
                const loc = qt.LocSpan(_arg2, GetFullLoc(body));
                this.PushNode(qt.WhileStatement(test, body, loc));
                break;
            }
            case _OP._DO_WHILE_STATEMENT: {
                const test = this.PopNode();
                const body = this.PopNode();
                this.PushNode(qt.DoWhileStatement(body, test, _arg2));
                break;
            }
            case _OP._THROW: {
                const node = this.PopNode();
                const loc = qt.LocSpan(_arg1, GetFullLoc(node));
                this.PushNode(qt.ThrowStatement(node, loc));
                break;
            }
            case _OP._ASSIGNMENT_EXPRESSION: {
                const right = this.PopNode();
                const left = this.PopNode();
                this.PushNode(qt.AssignmentExpression(GetAssignmentOperator(_arg3), left, right));
                break;
            }
            case _OP._CONDITIONAL_EXPRESSION: {
                const alternate = this.PopNode();
                const consequent = this.PopNode();
                const test = this.PopNode();
                const loc = qt.LocSpan(GetFullLoc(test), GetFullLoc(alternate));
                this.PushNode(qt.ConditionalExpression(test, consequent, alternate, loc));
                break;
            }
            case _OP._LOGICAL_EXPRESSION: {
                const right = this.PopNode();
                const left = this.PopNode();
                this.PushNode(qt.LogicalExpression(GetLogicOperator(_arg2), left, right));
                break;
            }
            case _OP._CALL_EXPRESSION: {
                const nargs = Math.max(0, _arg3 - 1);
                const callArgs = this._nodestack.splice(-nargs, nargs);
                const id = this.PopNode();
                const loc = qt.LocSpan(GetFullLoc(id), _arg4);
                this.PushNode(qt.CallExpression(id, callArgs, loc));
                break;
            }
            case _OP._BASE: {
                this.PushNode(qt.Base(_arg1));
                break;
            }
            case _OP._ROOT: {
                this.PushNode(qt.Root(_arg1));
                break;
            }
            case _OP._NULL_LITERAL: {
                this.PushNode(qt.NullLiteral(_arg2));
                break;
            }
            case _OP._UNDEFINED: {
                // push a placeholder if a compiler Expression doesn't create a node as expected
                this.PushNode(qt.Undefined(qt.SourceLocation(_arg0?.end, _arg0?.end)));
                break;
            }
            case _OP._VARIABLE_DECLARATOR_NULL: {
                this.PushNode(qt.VariableDeclarator(<AST.Identifier>this.PopNode(), null));
                break;
            }
            case _OP._BOOLEAN_LITERAL: {
                this.PushNode(qt.BooleanLiteral(_arg1 == 1, _arg2));
                break;
            }
            case _OP._OBJECT_EXPRESSION: {
                const attributes = (_arg1 == 1);
                this.PushNode(qt.ObjectExpression([], attributes, _arg3));
                break;
            }
            case _OP._CLASS_EXPRESSION: {
                const attributes = (_arg2 != -1) ? <AST.ObjectExpression>this.PopNode() : null;
                const superClass = (_arg1 != -1) ? this.PopNode() : null;
                // Loc not known
                this.PushNode(qt.ClassExpression(qt.ClassBody([]), superClass, attributes));
                break;
            }
            case _OP._CLASS_EXPRESSION_BODY: {
                const exp = <AST.ClassExpression>this.TopNode();
                const loc = qt.LocSpan(_arg0, GetFullLoc(exp?.body));
                qt.LocUpdate(exp, loc);
                break;
            }
            case _OP._ARRAY_EXPRESSION: {
                // Loc not known
                this.PushNode(qt.ArrayExpression([]));
                break;
            }
            case _OP._ARRAY_ELEMENT: {
                const element = this.PopNode();
                const arr = <AST.ArrayExpression>this.TopNode();
                arr?.elements?.push(element);
                break;
            }
            case _OP._PROPERTY: {
                const value = this.PopNode();
                const key = this.PopNode();
                const obj =<AST.ObjectExpression>this.TopNode();
                const computed = !!(_arg0 & NEW_SLOT_COMPUTED_FLAG);
                const json = !!(_arg0 & NEW_SLOT_JSON_FLAG);
                const loc = qt.LocSpan(_arg3, GetFullLoc(value ?? key));
                const prop = qt.Property("init", key, value, computed, json, loc);
                obj?.properties?.push(prop);
                break;
            }
            case _OP._METHOD_PROPERTY_DEFINITION: {
                const value = this.PopNode();
                const key = this.PopNode();
                const isstatic = !!(_arg0 & NEW_SLOT_STATIC_FLAG);
                const hasattrs = !!(_arg0 & NEW_SLOT_ATTRIBUTES_FLAG);
                const computed = !!(_arg0 & NEW_SLOT_COMPUTED_FLAG);
                const method = !!(_arg0 & NEW_SLOT_METHOD_FLAG);
                const attributes = hasattrs ? <AST.ObjectExpression>this.PopNode() : null;
                const loc = qt.LocSpan(attributes ? GetFullLoc(attributes) : _arg4, GetFullLoc(value ?? key));
                let prop;

                if (method) {
                    const kind = ((<AST.Identifier>key)?.name === "constructor") ? "constructor" : "method";
                    prop = qt.MethodDefinition(kind, key, <AST.FunctionExpression>value, isstatic, attributes, loc);
                } else {
                    prop = qt.PropertyDefinition(key, value, computed, isstatic, attributes, loc);
                }
                (<AST.ClassExpression>this.TopNode())?.body?.body?.push(prop);
                break;
            }
            case _OP._DEFINITION_BODY: {
                const node = this.TopNode();
                const body = (node?.type === "ClassExpression") ? (<AST.ClassExpression>node).body : node;
                qt.LocUpdate(body, _arg0);
                break;
            }
            case _OP._FUNCTION_DECLARATION: {
                const func = this._functions[_arg1];
                const params = func?._params;
                const local = _arg3 == 1;
                const id = <AST.Identifier>this.PopNode();
                const body = <AST.FunctionBody>func?.PopNode();
                this.PushNode(qt.FunctionDeclaration(
                    id,
                    params,
                    body,
                    local,
                    qt.LocSpan(_arg4, GetFullLoc(body ?? params?.at(-1) ?? id))
                ));
                break;
            }
            case _OP._FUNCTION_EXPRESSION: {
                const func = this._functions[_arg1];
                const params = func?._params;
                const body = <AST.FunctionBody>func?.PopNode();
                this.PushNode(qt.FunctionExpression(
                    params,
                    body,
                    qt.LocSpan(_arg3, GetFullLoc(body ?? params?.at(-1)))
                ));
                break;
            }
            case _OP._LAMBDA_EXPRESSION: {
                const func = this._functions[_arg1];
                const params = func?._params;
                const body = <AST.FunctionBody>func?.PopNode();
                this.PushNode(qt.LambdaExpression(
                    params,
                    body,
                    qt.LocSpan(_arg3, GetFullLoc(body))
                ));
                break;
            }
            case _OP._MEMBER_PROPERTY: {
                const object = this.PopNode();
                const root = object?.type === "Root";
                const memberRoot = root || !!_arg1;
                const name = _arg2?._unVal;
                const propLoc = name ? _arg3 : (object?.loc ? qt.LocZeroEnd(object.loc) : _arg3); // hack for empty property
                const property = qt.Identifier(name, propLoc);
                const loc = qt.LocSpan(GetFullLoc(object), GetFullLoc(property));
                if (root) {
                    qt.LocUpdate(property, loc);
                    property.extra = { root: true };
                    this.PushNode(property);
                } else {
                    this.PushNode(qt.MemberExpression(object, property, false, memberRoot, loc));
                }
                break;
            }
            case _OP._THIS_EXPRESSION: {
                this.PushNode(qt.ThisExpression(_arg0));
                break;
            }
            case _OP._IDENTIFIER: {
                this.PushNode(qt.Identifier(_arg1?._unVal, _arg2));
                break;
            }
            case _OP._INTEGER_LITERAL: {
                this.PushNode(qt.IntegerLiteral(_arg1?._unVal, _arg1?._rawVal, _arg2));
                break;
            }
            case _OP._FLOAT_LITERAL: {
                this.PushNode(qt.FloatLiteral(_arg1?._unVal, _arg1?._rawVal, _arg2));
                break;
            }
            case _OP._STRING_LITERAL: {
                this.PushNode(qt.StringLiteral(_arg1?._unVal, _arg1?._rawVal, _arg2));
                break;
            }
            case _OP._SCALAR_LITERAL: {
                switch (_arg1?._type) {
                    default:
                    case OT.STRING:  this.PushNode(qt.StringLiteral(_arg1?._unVal, _arg1?._rawVal, _arg2)); break;
                    case OT.INTEGER: this.PushNode(qt.IntegerLiteral(_arg1._unVal, _arg1._rawVal, _arg2)); break;
                    case OT.FLOAT:   this.PushNode(qt.FloatLiteral(_arg1._unVal, _arg1._rawVal, _arg2)); break;
                    case OT.BOOL:    this.PushNode(qt.BooleanLiteral(!!_arg1._unVal, _arg2)); break;
                }
                break;
            }
            case _OP._EMPTY_STATEMENT: {
                this.PushNode(qt.EmptyStatement(_arg0));
                break;
            }
            case _OP._DELETE: {
                const node = this.PopNode();
                const loc = qt.LocSpan(_arg3, GetFullLoc(node));
                this.PushNode(qt.UnaryExpression("delete", node, true, loc));
                break;
            }
            case _OP._UPDATE_EXPRESSION_PREFIX: {
                const op: AST.UpdateOperator = (_arg3 == -1) ? "--" : "++";
                const node = this.PopNode();
                const loc = qt.LocSpan(_arg4, GetFullLoc(node));
                this.PushNode(qt.UpdateExpression(op, node, true, loc));
                break;
            }
            case _OP._UPDATE_EXPRESSION_SUFFIX: {
                const op: AST.UpdateOperator = (_arg3 == -1) ? "--" : "++";
                const node = this.PopNode();
                const loc = qt.LocSpan(GetFullLoc(node), _arg4);
                this.PushNode(qt.UpdateExpression(op, node, false, loc));
                break;
            }
            case _OP._BLOCK_STATEMENT: {
                this.PushNode(qt.BlockStatement(this._nodestack.splice(-_arg0, _arg0), _arg1));
                break;
            }
            case _OP._VARIABLE_DECLARATOR: {
                const init = this.PopNode();
                const id = <AST.Identifier>this.PopNode();
                this.PushNode(qt.VariableDeclarator(id, init));
                break;
            }
            case _OP._VARIABLE_DECLARATION: {
                const kind = _arg0 ? "const" : "local";
                const nargs = _arg1;
                const decs = <AST.VariableDeclarator[]>this._nodestack.splice(-nargs, nargs);
                const loc = _arg2;
                if (decs.length) loc.end = GetFullLoc(decs.at(-1)).end;
                this.PushNode(qt.VariableDeclaration(kind, decs, loc));
                break;
            }
            case _OP._MEMBER_EXPRESSION: {
                const computed = !!_arg0;
                const property = this.PopNode();
                // if code invalid (obj missing) this will pop wrong node
                const object = this.PopNode();
                const root = object?.type === "Root";
                // use arg end to capture square bracket "object[property]"
                const loc = qt.LocSpan(GetFullLoc(object), _arg1);
                this.PushNode(qt.MemberExpression(object, property, computed, root, loc));
                break;
            }
            case _OP._PARENTHESIZED: {
                const node = this.TopNode();
                if (node) {
                    SetFullLoc(node, _arg0);
                    node.extra = { parenthesized: true };
                }
                break;
            }
            case _OP._IF_STATEMENT: {
                const alternate = _arg0 ? this.PopNode() : null;
                const consequent = this.PopNode();
                const test = this.PopNode();
                const loc = qt.LocSpan(_arg1, GetFullLoc(alternate ?? consequent))
                this.PushNode(qt.IfStatement(test, consequent, alternate, loc));
                break;
            }
            case _OP._FOR_STATEMENT: {
                const body = this.PopNode();
                const update = _arg2 ? this.PopNode() : null;
                const test = _arg1 ? this.PopNode() : null;
                const init = _arg0 ? this.PopNode() : null;
                const loc = qt.LocSpan(_arg3, GetFullLoc(body));
                this.PushNode(qt.ForStatement(init, test, update, body, loc));
                break;
            }
            case _OP._FOR_IN_STATEMENT: {
                const body = this.PopNode();
                const right = this.PopNode();
                const left = this.PopNode()!;
                const idxname = _arg0 ? this.PopNode()! : null;
                const loc = qt.LocSpan(_arg1, GetFullLoc(body));
                this.PushNode(qt.ForInStatement(idxname, left, right, body, loc))
                break;
            }
            case _OP._SWITCH_STATEMENT: {
                // Loc not known
                this.PushNode(qt.SwitchStatement(this.PopNode(), []));
                break;
            }
            case _OP._SWITCH_CASE: {
                const consequent = this._nodestack.splice(-_arg1, _arg1);
                const test = _arg0 ? this.PopNode() : null;
                const sw = <AST.SwitchStatement>this.TopNode();
                const loc = qt.LocSpan(_arg2, GetFullLoc(consequent.at(-1)) ?? GetFullLoc(test));
                sw?.cases?.push(qt.SwitchCase(test, consequent, loc));
                break;
            }
            case _OP._CLASS_DECLARATION: {
                const exp = <AST.ClassExpression>this.PopNode();
                const id = <AST.Pattern>this.PopNode();
                const loc = qt.LocSpan(_arg0, GetFullLoc(exp?.body));
                this.PushNode(qt.ClassDeclaration(id, exp?.body, exp?.superClass, exp?.attributes, loc));
                break;
            }
            case _OP._ENUM_DECLARATION: {
                // Loc not known
                this.PushNode(qt.EnumDeclaration(<AST.Identifier>this.PopNode(), []));
                break;
            }
            case _OP._ENUM_MEMBER: {
                let val = _arg0 ? <AST.EnumLiteral>this.PopNode() : null;
                const key = <AST.Identifier>this.PopNode();
                const en = <AST.EnumDeclaration>this.TopNode();
                en?.members?.push(qt.EnumMember(key, val));
                break;
            }
            case _OP._TRY_STATEMENT: {
                const body = <AST.BlockStatement>this.PopNode();
                const id = <AST.Pattern>this.PopNode();
                const block = <AST.BlockStatement>this.PopNode();
                const tloc = qt.LocSpan(_arg0, GetFullLoc(body) ?? _arg1?.end);
                const cloc = qt.LocSpan(_arg1, GetFullLoc(body));
                this.PushNode(qt.TryStatement(block, qt.CatchClause(id, body, cloc), tloc));
                break;
            }
            case _OP._SEQUENCE_EXPRESSION: {
                const right = this.PopNode();
                const left = this.PopNode();
                const seq = <AST.SequenceExpression>((right?.type == "SequenceExpression") ? right : qt.SequenceExpression([right]));
                if (left) seq.expressions.unshift(left);
                const head = seq.expressions[0];
                const tail = seq.expressions.at(-1);
                const loc = qt.LocSpan(GetFullLoc(head), GetFullLoc(tail));
                qt.LocUpdate(seq, loc);
                this.PushNode(seq);
                break;
            }
        }

        // this._optimization = true;
	    // this._instructions.push(i);
    }

    CreateString = (s: string, raw: string | undefined = undefined): SQObject => // #L582
    {
        const ns: SQObject = { _type: OT.STRING, _unVal: s, _rawVal: raw };
        // _table(this._strings).NewSlot(ns, { _type: OT.INTEGER, _unVal: 1 });
        return ns;
    }

    CreateTable = (): SQObject =>
    {
        const nt = { _type: OT.TABLE, _unVal: new Map()};
        // _table(this._strings).NewSlot(nt, { _type: OT.INTEGER, _unVal: 1 });
        return nt;
    }

    BuildProto = (): AST.Program =>
    {
        const program = qt.Program(this._nodestack, this._ss._lex._comments, qt.SourceLocation(qt.Position(1, 0, 0), this._ss._loc.end));
        program.sourceName = this._sourcename;
        return program;
    }

    PushChildState = (ss: SQSharedState): SQFuncState => {
        let child;
        child = new SQFuncState(ss, this, this._errfunc, this._errtarget);
        this._childstates.push(child);
        return child;
    };

    PopChildState = (): void =>
    {
        const child = this._childstates.at(-1);
        // sq_delete(child, SQFuncState);
        this._childstates.pop();
    }
}
