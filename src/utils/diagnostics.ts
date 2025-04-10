import {
    Diagnostic,
    DiagnosticSeverity,
    languages,
    TextDocument,
    window,
    workspace,
    Disposable,
    DiagnosticTag,
} from "vscode";
import constants from "../constants";
import { requestProgram } from "./program";
import { AST } from "../ast";
import { locOverlapsLoc, locToDocRange, nodeToDocRange } from "./location";
import { getDeprecateNodes } from "./deprecated";
import { CompilerError } from "../squirrel/squirrel/sqcompiler.h";

// -----------------------------------------------------------------------------

export type DiagnosticError = CompilerError & {
    severity: DiagnosticSeverity;
};

const programErrorMap = new WeakMap<AST.Program, DiagnosticError[]>();

/** Store compilation errors for the given program */
export const addProgramErrors = (
    program: AST.Program,
    errors: DiagnosticError[],
) => {
    if (!program) return;
    if (!programErrorMap.has(program)) programErrorMap.set(program, []);
    programErrorMap.get(program).push(...errors);
};

/** Return compilation errors for the given program */
export const getProgramErrors = (program: AST.Program): DiagnosticError[] =>
    programErrorMap.has(program) ? programErrorMap.get(program) : [];

// -----------------------------------------------------------------------------

const diagnosticsMap = new WeakMap<AST.Program, Diagnostic[]>();

export const getDiagnostics = (program: AST.Program): Diagnostic[] =>
    diagnosticsMap.has(program) ? diagnosticsMap.get(program) : [];

export const hasDiagnostics = (program: AST.Program): boolean =>
    diagnosticsMap.has(program);

export const setDiagnostics = (
    program: AST.Program,
    diagnostics: Diagnostic[],
) => diagnosticsMap.set(program, diagnostics);

// -----------------------------------------------------------------------------

/**
 * Return true if node has an error overlapping it
 * - Intended to prevent inlayHint, but unused
 */
export const getNodeHasError = (
    program: AST.Program,
    node: AST.Node,
): boolean => {
    for (const error of getProgramErrors(program)) {
        if (locOverlapsLoc(node.loc, error.loc)) return true;
    }
    return false;
};

/** Diagnostics for squirrel */
export class SquirrelDiagnostics extends Disposable {
    private _enabled: boolean = true;
    private disposables: Disposable[];
    public collection = languages.createDiagnosticCollection(
        constants.LANGUAGE_ID,
    );

    constructor() {
        super(undefined);

        this.disposables = [
            this.collection,
            window.onDidChangeActiveTextEditor((editor) => {
                this.refresh(editor?.document);
            }),
            workspace.onDidChangeTextDocument((editor) => {
                this.refresh(editor?.document);
            }),
            workspace.onDidCloseTextDocument((document) => {
                this.delete(document);
            }),
        ];
    }

    public dispose() {
        this.disposables.forEach((item) => item?.dispose());
    }

    public set enabled(value: boolean) {
        this._enabled = value;
        if (this._enabled) {
            // give the import errors a tick so they can be added to the list
            setTimeout(() => this.refreshAll());
        } else {
            this.collection?.clear();
        }
    }

    public get enabled(): boolean {
        return this._enabled;
    }

    /** Text document has been closed */
    public delete = (document: TextDocument) => {
        if (!document) return;
        if (document.languageId !== constants.LANGUAGE_ID) return;
        this.collection.delete(document.uri);
    };

    /** Refresh all visible text editors */
    public refreshAll = async () =>
        Promise.all(
            window.visibleTextEditors.map(
                async (editor) => await this.refresh(editor?.document),
            ),
        );

    /** Cache program diagnostics */
    private getProgramDiagnostics = (program: AST.Program) => {
        if (hasDiagnostics(program)) return getDiagnostics(program);

        let diagnostics = [];

        // add diagnostic tags to draw strike-throughs
        getDeprecateNodes(program).forEach((node) => {
            const diagnostic = new Diagnostic(
                nodeToDocRange(node),
                "Deprecated",
                DiagnosticSeverity.Hint,
            );
            diagnostic.tags = [DiagnosticTag.Deprecated];
            diagnostics.push(diagnostic);
        });

        // add error tags to draw red-squiggly-underlines
        getProgramErrors(program).forEach(({ message, loc, severity }) => {
            diagnostics.push(
                new Diagnostic(locToDocRange(loc), message, severity),
            );
        });

        setDiagnostics(program, diagnostics);
        return diagnostics;
    };

    // Update diagnostics collection from cache
    public refresh = async (document?: TextDocument) => {
        if (!this.enabled) return;
        if (!document) return;
        if (document.languageId !== constants.LANGUAGE_ID) return;
        return await requestProgram(
            document,
            { isCancellationRequested: false, onCancellationRequested: null },
            (program: AST.Program) => {
                this.collection.set(
                    document.uri,
                    this.getProgramDiagnostics(program),
                );
            },
        );
    };
}
