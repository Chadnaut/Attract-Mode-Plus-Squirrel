import {
    beforeEach,
    describe,
    fdescribe,
    expect,
    it,
    fit,
} from "@jest/globals";
import { parse, lineLoc, dump } from "../utils";
import { SQVM } from "../../src/squirrel/squirrel/sqvm.cpp";
import { SQTable } from "../../src/squirrel/squirrel/sqtable.cpp";
import { OT, SQObject } from "../../src/squirrel/include/squirrel.h";
import { _OP, GetAssignmentOperator, GetBinaryOperator, GetLogicOperator, GetUnaryOperator } from "../../src/squirrel/squirrel/sqopcodes.h";
import { SQCompilerStruct } from "../../src/squirrel/squirrel/sqcompiler.h";
import { SQFuncStateStruct } from "../../src/squirrel/squirrel/sqfuncstate.h";
import { SQLexer } from "../../src/squirrel/squirrel/sqlexer.cpp";
import { AST, SQTree as qt } from '../../src/ast';
import { SQCompiler } from "../../src/squirrel/squirrel/sqcompiler.cpp";
import { SQFuncState } from "../../src/squirrel/squirrel/sqfuncstate.cpp";
import { SQSharedState } from "../../src/squirrel/squirrel/sqstate.cpp";
import { SQLocalVarInfo, SQOuterVar } from "../../src/squirrel/squirrel/sqfuncproto.h";

/*
    These tests probe un-reachable code in the compiler
    - Remnants of the original C++ code remain for completeness / unfound edge cases
    - These tests simply check the methods do not throw
*/

describe("Misc", () => {
    it("SQFuncState", () => {
        const n = new SQFuncState(new SQSharedState(), null, () => {}, null);
        expect(() => n.UpdateStatement()).not.toThrow();
        expect(() => n.Error(undefined, undefined)).not.toThrow();

        n._nodestack.push(<AST.StringLiteral>{ type: "StringLiteral" });
        expect(() => n.UpdateStatement()).not.toThrow();

        expect(n.GetNumericConstant(123)).toEqual({ _type: OT.INTEGER, _unVal: 123});
        expect(n.GetNumericConstantF(123)).toEqual({ _type: OT.FLOAT, _unVal: 123});

        const s = new SQFuncStateStruct();
        expect(() => s.Error(undefined, undefined)).not.toThrow();

        const m = new SQFuncState(new SQSharedState(), null, () => {}, null);
        m._outervalues.push(<SQOuterVar>{ _name: { _type: OT.NULL, _unVal: 0 }});

        n._parent = m;
        n.GetOuterVariable(<SQObject>{ _type: OT.NULL, _unVal: 0 });

        n._outervalues.push(<SQOuterVar>{ _name: { _type: OT.NULL, _unVal: 0 }});
        n.GetOuterVariable(<SQObject>{ _type: OT.NULL, _unVal: 0 });
    });

    it("FullLoc", () => {
        const s = new SQFuncStateStruct();
        const n = qt.Identifier("name");
        s.SetFullLoc(n, n.loc);
        expect(s.GetFullLoc(n)).toBe(n.loc);
        expect(s.GetFullLoc(undefined)).toBeUndefined();
    });

    it("SQTable", () => {
        const n = new SQTable();
        expect(n.Get({ _type: OT.NULL, _unVal: null }, undefined)).toBe(false);
        expect(n.NewSlot({ _type: OT.STRING, _unVal: "test" }, undefined)).toBe(true);
        expect(n.NewSlot({ _type: OT.STRING, _unVal: "test" }, undefined)).toBe(false);
    });

    it("SQOpCodes", () => {
        expect(GetLogicOperator(undefined)).toBe("||");
        expect(GetAssignmentOperator(undefined)).toBe("+=");
        expect(GetUnaryOperator(undefined)).toBe("-");
        expect(GetBinaryOperator(undefined)).toBe("+");
        expect(GetBinaryOperator(_OP.BITW)).toBe("&");
        expect(GetBinaryOperator(_OP.CMP)).toBe(">");
    });

    it("SQCompilerStruct", () => {
        const n = new SQCompilerStruct();
        expect(() => n.Lex()).not.toThrow();
        expect(() => n.ResolveBreaks(undefined, undefined)).not.toThrow();
        expect(() => n.ResolveContinues(undefined, undefined, undefined)).not.toThrow();
        expect(() => n.Error(undefined)).not.toThrow();
        expect(() => n.assert(0, 'err')).not.toThrow();
    });

    it("SQCompiler", () => {
        const s = new SQCompiler(new SQVM(new SQSharedState()), (text:string):string=>"", "", "", true, null, true);
        s._fs = new SQFuncState(s._vm._sharedstate, null, () => {}, s);
        expect(() => s.BEGIN_SCOPE()).not.toThrow();

        s._fs.PushLocalVariable({ _type: OT.NULL, _unVal: 0 });
        s._fs.MarkLocalAsOuter(0);
        s._fs.PushLocalVariable({ _type: OT.BOOL, _unVal: 0 });
        s._fs.MarkLocalAsOuter(1);

        expect(() => s.RESOLVE_OUTERS()).not.toThrow();
        expect(() => s.END_SCOPE()).not.toThrow();

        expect(() => s.BEGIN_BREAKBLE_BLOCK()).not.toThrow();
        expect(() => s.END_BREAKBLE_BLOCK()).not.toThrow();
    });

    it("SQLexer", () => {
        const n = new SQLexer(new SQSharedState(), ()=>"", undefined, undefined, undefined);
        expect(n.Tok2Str("err")).toBeNull();
    });
});
