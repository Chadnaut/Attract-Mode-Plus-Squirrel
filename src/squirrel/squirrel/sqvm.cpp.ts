/*
	see copyright notice in squirrel.h
*/
import { SQSharedState } from './sqstate.cpp';

// sqvm.h#L187
export const _ss = (vm: SQVM): SQSharedState => vm._sharedstate;

export class SQVM {
    _sharedstate: SQSharedState;

    constructor(ss: SQSharedState) {
        this._sharedstate = ss;
    }
}
