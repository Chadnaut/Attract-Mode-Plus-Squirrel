/*	see copyright notice in squirrel.h */
import { SQObject } from '../include/squirrel.h';
//
//
//

export const enum SQOuterType { // #L7
	otLOCAL = 0,
	otOUTER = 1
};

export type SQOuterVar = { // #L12
	_type: SQOuterType;
	_name: SQObject;
	_src: SQObject;
};

export type SQLocalVarInfo = { // #L33
	_name: SQObject;
	_start_op: number;
	_end_op?: number;
	_pos: number;
};

export type SQLineInfo = { // #L49
    _line: number;
    _op: number;
};
