/*
see copyright notice in squirrel.h
*/
import { OT, SQObject } from '../include/squirrel.h';

export class SQTable {
    _nodes: Map<string, SQObject>;

    constructor(table?: Map<string, SQObject>) {
        this._nodes = table ?? new Map<string, SQObject>();
    }

    Get = (key: SQObject, val: SQObject): boolean => {
        if (key._type == OT.NULL) return false;
        if (!this._nodes.has(key._unVal)) return false;
        const n = this._nodes.get(key._unVal);
        val._type = n._type; val._unVal = n._unVal;
        return true;
    }

    NewSlot = (key: SQObject, val: SQObject): boolean => {
        const isNew = !this._nodes.has(key._unVal);
        this._nodes.set(key._unVal, val);
        return isNew;
    }
}
