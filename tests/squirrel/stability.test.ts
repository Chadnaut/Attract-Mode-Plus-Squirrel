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
import { OT } from "../../src/squirrel/include/squirrel.h";
import { _OP, GetAssignmentOperator, GetBinaryOperator, GetLogicOperator, GetUnaryOperator, NEW_SLOT_METHOD_FLAG } from "../../src/squirrel/squirrel/sqopcodes.h";
import { SQCompilerStruct } from "../../src/squirrel/squirrel/sqcompiler.h";
import { SQFuncStateStruct } from "../../src/squirrel/squirrel/sqfuncstate.h";
import { SQLexer } from "../../src/squirrel/squirrel/sqlexer.cpp";
import { AST, SQTree as qt } from '../../src/ast';
import { SQCompiler } from "../../src/squirrel/squirrel/sqcompiler.cpp";
import { SQFuncState } from "../../src/squirrel/squirrel/sqfuncstate.cpp";
import { SQSharedState } from "../../src/squirrel/squirrel/sqstate.cpp";


const ops = [
    _OP._RETURN,
    _OP._YIELD,
    _OP._BREAK_STATEMENT,
    _OP._CONTINUE_STATEMENT,
    _OP._WHILE_STATEMENT,
    _OP._DO_WHILE_STATEMENT,
    _OP._THROW,
    _OP._ASSIGNMENT_EXPRESSION,
    _OP._CONDITIONAL_EXPRESSION,
    _OP._LOGICAL_EXPRESSION,
    _OP._CALL_EXPRESSION,
    _OP._ROOT,
    _OP._DELETE,
    _OP._UPDATE_EXPRESSION_PREFIX,
    _OP._UPDATE_EXPRESSION_SUFFIX,
    _OP._BLOCK_STATEMENT,
    _OP._THIS_EXPRESSION,
    _OP._BASE,
    _OP._MEMBER_EXPRESSION,
    _OP._ARRAY_EXPRESSION,
    _OP._ARRAY_ELEMENT,
    _OP._OBJECT_EXPRESSION,
    _OP._PROPERTY,
    _OP._CLASS_EXPRESSION,
    _OP._CLASS_EXPRESSION_BODY,
    _OP._METHOD_PROPERTY_DEFINITION,
    _OP._DEFINITION_BODY,
    _OP._FUNCTION_DECLARATION,
    _OP._FUNCTION_EXPRESSION,
    _OP._LAMBDA_EXPRESSION,
    _OP._MEMBER_PROPERTY,
    _OP._IDENTIFIER,
    _OP._INTEGER_LITERAL,
    _OP._FLOAT_LITERAL,
    _OP._STRING_LITERAL,
    _OP._NULL_LITERAL,
    _OP._BOOLEAN_LITERAL,
    _OP._SCALAR_LITERAL,
    _OP._UNDEFINED,
    _OP._EMPTY_STATEMENT,
    _OP._PARENTHESIZED,
    _OP._VARIABLE_DECLARATION,
    _OP._VARIABLE_DECLARATOR,
    _OP._VARIABLE_DECLARATOR_NULL,
    _OP._IF_STATEMENT,
    _OP._FOR_STATEMENT,
    _OP._FOR_IN_STATEMENT,
    _OP._SWITCH_STATEMENT,
    _OP._SWITCH_CASE,
    _OP._CLASS_DECLARATION,
    _OP._ENUM_DECLARATION,
    _OP._ENUM_MEMBER,
    _OP._TRY_STATEMENT,
    _OP._SEQUENCE_EXPRESSION,
];

describe("Stability", () => {

    it("AddInstruction, no stack", () => {
        const n = new SQFuncState(new SQSharedState(), null, () => {}, null);
        expect(() => {
            ops.forEach((op) => {
                n.AddInstruction(op);
            });
        }).not.toThrow();
    });

    it("AddInstruction, bad stack", () => {
        const n = new SQFuncState(new SQSharedState(), null, () => {}, null);
        expect(() => {
            ops.forEach((op) => {
                n._nodestack.push(null, null, null, null, null);
                n.AddInstruction(op);
            });
        }).not.toThrow();
    });

    it("AddInstruction, flags", () => {
        const n = new SQFuncState(new SQSharedState(), null, () => {}, null);

        expect(() => n.AddInstruction(_OP._METHOD_PROPERTY_DEFINITION, NEW_SLOT_METHOD_FLAG)).not.toThrow();
        expect(() => n.AddInstruction(_OP._SCALAR_LITERAL, 0, OT.STRING)).not.toThrow();
        expect(() => n.AddInstruction(_OP._SCALAR_LITERAL, 0, OT.INTEGER)).not.toThrow();
        expect(() => n.AddInstruction(_OP._SCALAR_LITERAL, 0, OT.FLOAT)).not.toThrow();
        expect(() => n.AddInstruction(_OP._TRY_STATEMENT, 0, 0)).not.toThrow();
    });

});
