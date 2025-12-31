/*	see copyright notice in squirrel.h */
import { AST } from '../../ast';
//

export const MAX_FUNC_STACKSIZE = 0xFF;
export const MAX_LITERALS = 0x7FFFFFFF;

export const enum BW { // BitWiseOP
	AND = 0,
	OR = 2,
	XOR = 3,
	SHIFTL = 4,
	SHIFTR = 5,
	USHIFTR = 6,
};

export const enum CMP { // CmpOP
	G = 0,
	GE = 2,
	L = 3,
	LE = 4,
	THREEW = 5
};

export const enum NOT { // NewObjectType
	TABLE = 0,
	ARRAY = 1,
	CLASS = 2
};

export const enum AAT { // AppendArrayType
	STACK = 0,
	LITERAL = 1,
	INT = 2,
	FLOAT = 3,
	BOOL = 4
};

export const enum _OP // SQOpcode #L39
{
    LINE=				0x00,
	LOAD=				0x01,
	LOADINT=			0x02,
	LOADFLOAT=			0x03,
	DLOAD=				0x04,
	TAILCALL=			0x05,
	CALL=				0x06,
	PREPCALL=			0x07,
	PREPCALLK=			0x08,
	GETK=				0x09,
	MOVE=				0x0A,
	NEWSLOT=			0x0B,
	DELETE=				0x0C,
	SET=				0x0D,
	GET=				0x0E,
	EQ=					0x0F,
	NE=					0x10,
	ADD=				0x11,
	SUB=				0x12,
	MUL=				0x13,
	DIV=				0x14,
	MOD=				0x15,
	BITW=				0x16,
	RETURN=				0x17,
	LOADNULLS=			0x18,
	LOADROOT=			0x19,
	LOADBOOL=			0x1A,
	DMOVE=				0x1B,
	JMP=				0x1C,
	// JNZ=				0x1D,
	JCMP=				0x1D,
	JZ=					0x1E,
	SETOUTER=			0x1F,
	GETOUTER=			0x20,
	NEWOBJ=				0x21,
	APPENDARRAY=		0x22,
	COMPARITH=			0x23,
	INC=				0x24,
	INCL=				0x25,
	PINC=				0x26,
	PINCL=				0x27,
	CMP=				0x28,
	EXISTS=				0x29,
	INSTANCEOF=			0x2A,
	AND=				0x2B,
	OR=					0x2C,
	NEG=				0x2D,
	NOT=				0x2E,
	BWNOT=				0x2F,
	CLOSURE=			0x30,
	YIELD=				0x31,
	RESUME=				0x32,
	FOREACH=			0x33,
	POSTFOREACH=		0x34,
	CLONE=				0x35,
	TYPEOF=				0x36,
	PUSHTRAP=			0x37,
	POPTRAP=			0x38,
	THROW=				0x39,
	NEWSLOTA=			0x3A,
	GETBASE=			0x3B,
	CLOSE=				0x3C,

    _RETURN =                       0x64,
    _YIELD =                        0x65,
    _BREAK_STATEMENT =              0x66,
    _CONTINUE_STATEMENT =           0x67,
    _WHILE_STATEMENT =              0x68,
    _DO_WHILE_STATEMENT =           0x69,
    _THROW =                        0x6A,
    _ASSIGNMENT_EXPRESSION =        0x6B,
    _CONDITIONAL_EXPRESSION =       0x6C,
    _LOGICAL_EXPRESSION =           0x6D,
    _CALL_EXPRESSION =              0x6E,
    _ROOT =                         0x6F,
    _DELETE =                       0x70,
    _UPDATE_EXPRESSION_PREFIX =     0x71,
    _UPDATE_EXPRESSION_SUFFIX =     0x72,
    _BLOCK_STATEMENT =              0x73,
    _THIS_EXPRESSION =              0x74,
    _BASE =                         0x75,
    _MEMBER_EXPRESSION =            0x76,
    _ARRAY_EXPRESSION =             0x77,
    _ARRAY_ELEMENT =                0x78,
    _OBJECT_EXPRESSION =            0x79,
    _PROPERTY =                     0x7A,
    _CLASS_EXPRESSION =             0x7B,
    _CLASS_EXPRESSION_BODY =        0x7C,
    _METHOD_PROPERTY_DEFINITION =   0x7D,
    _DEFINITION_BODY =              0x7E,
    _FUNCTION_DECLARATION =         0x7F,
    _FUNCTION_EXPRESSION =          0x80,
    _LAMBDA_EXPRESSION =            0x81,
    _MEMBER_PROPERTY =              0x82,
    _IDENTIFIER =                   0x83,
    _INTEGER_LITERAL =              0x84,
    _FLOAT_LITERAL =                0x85,
    _STRING_LITERAL =               0x86,
    _NULL_LITERAL =                 0x87,
    _BOOLEAN_LITERAL =              0x88,
    _SCALAR_LITERAL =               0x89,
    _UNDEFINED =                    0x8A,
    _EMPTY_STATEMENT =              0x8B,
    _PARENTHESIZED =                0x8C,
    _VARIABLE_DECLARATION =         0x8D,
    _VARIABLE_DECLARATOR =          0x8E,
    _VARIABLE_DECLARATOR_NULL =     0x8F,
    _IF_STATEMENT =                 0x90,
    _FOR_STATEMENT =                0x91,
    _FOR_IN_STATEMENT =             0x92,
    _SWITCH_STATEMENT =             0x93,
    _SWITCH_CASE =                  0x94,
    _CLASS_DECLARATION =            0x95,
    _ENUM_DECLARATION =             0x96,
    _ENUM_MEMBER =                  0x97,
    _TRY_STATEMENT =                0x98,
    _SEQUENCE_EXPRESSION =          0x99,
}

export type SQOpcode = _OP;

export type SQInstruction = {
	op: SQOpcode;
	_arg0: any;
	_arg1: any;
	_arg2: any;
	_arg3: any;
}

export const NEW_SLOT_ATTRIBUTES_FLAG =	0x01;
export const NEW_SLOT_STATIC_FLAG =		0x02;
export const NEW_SLOT_COMPUTED_FLAG =	0x04;
export const NEW_SLOT_JSON_FLAG =	    0x08; // extra
export const NEW_SLOT_METHOD_FLAG =	    0x10; // extra

export const GetLogicOperator = (op: _OP): AST.LogicalOperator => {
    switch (op) {
        default:
        case _OP.OR: return '||';
        case _OP.AND: return '&&';
    }
}

export const GetAssignmentOperator = (op: _OP): AST.AssignmentOperator => {
    switch (op) {
        default:
        case _OP.ADD: return "+=";
        case _OP.SUB: return "-=";
        case _OP.MUL: return "*=";
        case _OP.DIV: return "/=";
        case _OP.MOD: return "%=";
        case _OP.SET: return "=";
        case _OP.NEWSLOT: return "<-";
    }
}

export const GetUnaryOperator = (op: _OP): AST.UnaryOperator => {
    switch (op) {
        default:
        case _OP.NEG:    return '-';
        case _OP.NOT:    return '!';
        case _OP.BWNOT:  return '~';
        case _OP.TYPEOF: return 'typeof';
        case _OP.RESUME: return 'resume';
        case _OP.CLONE:  return 'clone';
    }
}

export const GetBinaryOperator = (op: _OP, _arg?: BW | CMP): AST.BinaryOperator => {
    switch (op) {
        default:
        case _OP.ADD: return "+";
        case _OP.SUB: return "-";
        case _OP.MUL: return "*";
        case _OP.DIV: return "/";
        case _OP.MOD: return "%";

        case _OP.EQ: return '==';
        case _OP.NE: return '!=';
        case _OP.EXISTS: return 'in';
        case _OP.INSTANCEOF: return 'instanceof';
        case _OP.BITW:
            switch (_arg) {
                default:
                case BW.AND: return '&';
                case BW.OR: return '|';
                case BW.XOR: return '^';
                case BW.SHIFTL: return '<<';
                case BW.SHIFTR: return '>>';
                case BW.USHIFTR: return '>>>';
            }
        case _OP.CMP:
            switch (_arg) {
                default:
                case CMP.G: return '>';
                case CMP.GE: return '>=';
                case CMP.L: return '<';
                case CMP.LE: return '<=';
                case CMP.THREEW: return '<=>';
            }
    }
}
