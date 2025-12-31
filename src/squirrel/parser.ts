import { CompilerErrorFunc, CompilerError } from "./squirrel/sqcompiler.h";
import { SQCompiler } from "./squirrel/sqcompiler.cpp";
import { SQLEXREADFUNC } from "./include/squirrel.h";
import { SQVM } from "./squirrel/sqvm.cpp";
import { SQTree as qt } from "../ast/create";
import { AST } from "../ast";
import { SQSharedState } from "./squirrel/sqstate.cpp";

export type ParserOptions = {
    sourcename?: string;
    throwOnError?: boolean;
}

export class SquirrelParser {
    private sourcename: string;
    private throwOnError: boolean;
    private readIndex: number = 0;
    private _errors: CompilerError[];

    private readf: SQLEXREADFUNC = (text: string): number =>
        text.charCodeAt(this.readIndex++) || 0;

    private efunc: CompilerErrorFunc = (
        _target: any,
        s: CompilerError,
    ): void => {
        this._errors.push(s);
        if (this.throwOnError) throw s.message;
    };

    constructor(options?: ParserOptions) {
        this.sourcename = options?.sourcename ?? "script";
        this.throwOnError = options?.throwOnError ?? true;
    }

    public errors = (): CompilerError[] => this._errors;

    /**
     * Parse text and return node, throws on failure
     * - If raiseError will throw before return
     */
    public parse = (text: string): AST.Program => {
        this.readIndex = 0;
        this._errors = [];
        const ss = new SQSharedState();
        const vm = new SQVM(ss);
        const c = new SQCompiler(
            vm,
            this.readf,
            text,
            this.sourcename,
            true,
            this.efunc,
            true,
        );
        let o: any = qt.Program();
        c.Compile(o);
        return o;
    };
}
