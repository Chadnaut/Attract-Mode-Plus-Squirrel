/*	see copyright notice in squirrel.h */
import { SQObject } from '../include/squirrel.h';
import { SQTable } from './sqtable.cpp';

export const UINT_MINUS_ONE = 0xFFFFFFFF; // #L10

export const _table = (ob: SQObject): SQTable =>
    new SQTable(ob._unVal)
