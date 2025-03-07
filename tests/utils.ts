import { TextDocument, Position, Range, EndOfLine, Uri } from "vscode";
import * as prettier from "prettier/standalone";
import { ParserOptions, SquirrelParser } from "../src/squirrel/parser";
import { SQTree as qt } from "../src/ast";
import { AST } from "../src/ast";
import { createNodeMaps } from "../src/utils/map";
import { getSemanticTokens } from "../src/utils/token";
import { addProgramErrors } from "../src/utils/diagnostics";
import { iswalnum } from "../src/squirrel/include/std";
import { getPrettierOptions } from "../src/utils/config";

const baseOptions = getPrettierOptions();

/** Shortcut for console.dir */
export const dump = (obj: any) => console.dir(obj, { depth: null });

let _errors: string[] = [];

const _parse = (text: string, options: ParserOptions): AST.Program | null => {
    const parser = new SquirrelParser(options);
    const program = parser.parse(text);
    const errors = parser.errors();
    _errors = errors.map(({ message }) => message);
    return program;
};

const _parseExtra = (text: string, options: ParserOptions): AST.Program | null => {
    const parser = new SquirrelParser(options);
    const program = parser.parse(text);
    const errors = parser.errors();
    _errors = errors.map(({ message }) => message);

    addProgramErrors(program, errors);
    createNodeMaps(program);
    getSemanticTokens(program);

    return program;
}

/** Parse and return node, throw on error */
export const parse = (text: string, options: ParserOptions = {}): AST.Program | null =>
    _parse(text, { throwOnError: true, sourcename: "", ...options });

/** Parse and return node, do not throw */
export const parseForce = (text: string, options: ParserOptions = {}): AST.Program | null =>
    _parse(text, { throwOnError: false, sourcename: "", ...options });

/** Parse with extra properties added */
export const parseExtra = (text: string, options: ParserOptions = {}): AST.Program | null =>
    _parseExtra(text, { throwOnError: true, sourcename: "", ...options });

/** ParseForce with extra properties added */
export const parseForceExtra = (text: string, options: ParserOptions = {}): AST.Program | null =>
    _parseExtra(text, { throwOnError: false, sourcename: "", ...options });

export const errors = (): string[] =>
    _errors;

/** Shortcut for single-line locations for test */
export const lineLoc = (start: number, end: number): AST.SourceLocation => ({
    start: qt.Position(1, start, start),
    end: qt.Position(1, end, end),
});

/** Shortcut to create a position on line 1 */
export const pos = (column: number): AST.Position =>
    qt.Position(1, column, column);

// const options = getPrettierOptions();
// const format = async (text: string): Promise<string> =>
//     await prettier.format(text, options);

export const format = async (code: string, options = {}): Promise<string> =>
    // synchronizedPrettier.format.call(synchronizedPrettier, code, {
    await prettier.format(code, {
        ...baseOptions,
        parser: "squirrel",
        trailingComma: "none", // "none" | "es5"

        objectCurlySpacing: true,
        arrayBracketSpacing: false,
        computedPropertySpacing: false,
        spaceInParens: false,
        condenseParens: false,
        reduceParens: true,
        attrSingleLine: false,
        attrSpacing: true,
        printWidth: 80,
        tabWidth: 4,
        useTabs: false,
        semi: true,
        braceStyle: "1tbs", // JS
        ...options
    });

export const formatCPP = async (code: string, options = {}): Promise<string> =>
    // synchronizedPrettier.format.call(synchronizedPrettier, code, {
    await prettier.format(code, {
        ...baseOptions,
        parser: "squirrel",
        trailingComma: "none", // "none" | "es5"

        objectCurlySpacing: true,
        arrayBracketSpacing: true,
        computedPropertySpacing: true,
        spaceInParens: true,
        condenseParens: false,
        reduceParens: true,
        attrSingleLine: false,
        attrSpacing: true,
        printWidth: 80,
        tabWidth: 4,
        useTabs: false,
        semi: true,
        braceStyle: "allman", // CPP
        ...options
    });

export class MockTextDocument implements TextDocument {
    value: string;
    undefRange = false;
    constructor(value: string) { this.value = value; }
    uri: Uri = Uri.parse("mock");
    fileName: string;
    isUntitled: boolean;
    languageId: string;
    version: number;
    isDirty: boolean;
    isClosed: boolean;
    eol: EndOfLine;
    lineCount: number;
    save(): Thenable<boolean> { throw new Error("Method not implemented."); }
    lineAt(position: unknown): import("vscode").TextLine { throw new Error("Method not implemented."); }
    offsetAt(position: Position): number {
        try {
            const lines = this.value.split("\n");
            const line = lines[position.line].slice(0, position.character);
            return lines.slice(0, position.line - 1).concat([line]).join("\n").length;
        } catch (err) {
            return this.value.length;
        }
    }
    validateRange(range: Range): Range { throw new Error("Method not implemented."); }
    validatePosition(position: Position): Position { throw new Error("Method not implemented."); }
    getText = (range?: Range) => range ? this.value.slice(range.start.character, range.end.character) : this.value;
    positionAt = (index: number) => new Position(0, index);
    getWordRangeAtPosition = (pos: Position) => {
        if (this.undefRange) return;
        if (!pos) return;
        let start = pos.character;
        let end = pos.character;
        let n = this.value.length;
        while ((start >= 0) && iswalnum(this.value[start])) { start--; };
        while ((end < n) && iswalnum(this.value[end])) { end++; };
        return new Range(0, start+1, 0, end);
    }
}
