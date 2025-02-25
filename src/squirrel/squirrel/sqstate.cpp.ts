/*	see copyright notice in squirrel.h */
import { AST } from '../../ast';
import { SQLexer } from './sqlexer.cpp';
import { SQTable } from './sqtable.cpp';
import { SQVM } from './sqvm.cpp';

export class SQSharedState {
    _consts = new SQTable();

    _loc!: AST.SourceLocation;
    _lastloc!: AST.SourceLocation;

    _lasterror!: string;
    _lex!: SQLexer;

    _compilererrorhandler = (_vm: SQVM, compilererror: string, sourcename: string, currentline: number, currentcolumn: number): void => {
        throw compilererror;
    };
}
