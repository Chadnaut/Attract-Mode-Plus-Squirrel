import {
    CancellationToken,
    commands,
    TextDocument,
    Disposable,
    workspace,
    DiagnosticSeverity,
} from "vscode";
import { SquirrelParser } from "../squirrel/parser";
import { createNodeMaps } from "./map";
import { readFile, pathNormalize } from "./file";
import { getSemanticTokens } from "./token";
import { getOpenTabPaths } from "./document";
import { AST } from "../ast";
import { addProgramErrors } from "./diagnostics";
import { getBranchProgram } from "./find";
import { filterBranchCallMethods, getCallExpressionName } from "./call";
import { getConfigValue } from "./config";
import { getNodeImportFilename, isProgramGlobal } from "./import";
import { DocAttr, getKindOrder } from "../doc/kind";
import { uniqueFilter } from "./array";
import { getProgramArtworks } from "./media";
import { trimModuleName, getModuleInfo } from "./module";
import constants from "../constants";

// -----------------------------------------------------------------------------

const programImportNameMap = new WeakMap<AST.Program, string[]>();

/** Add import value to the given program (`fe.do_nut`, `fe.load_module`) */
export const addProgramImportName = (program: AST.Program, name: string) => {
    if (!name) return;
    if (!programImportNameMap.has(program))
        programImportNameMap.set(program, []);
    const map = programImportNameMap.get(program);
    if (!map.includes(name)) map.push(name);
};

/** Return array of unique import values (`fe.do_nut`, `fe.load_module`) */
export const getProgramImportNames = (program: AST.Program): string[] => {
    return programImportNameMap.has(program)
        ? programImportNameMap.get(program)
        : [];
};

// -----------------------------------------------------------------------------

const programModuleNameMap = new WeakMap<AST.Program, string[]>();

/** Add import module name to the given program (`fe.load_module`) */
export const addProgramModuleName = (program: AST.Program, name: string) => {
    if (!name) return;
    if (!programModuleNameMap.has(program))
        programModuleNameMap.set(program, []);
    const map = programModuleNameMap.get(program);
    if (!map.includes(name)) map.push(name);
};

/** Return array of unique module names */
export const getProgramModuleNames = (program: AST.Program): string[] => {
    return programModuleNameMap.has(program)
        ? programModuleNameMap.get(program)
        : [];
};

// -----------------------------------------------------------------------------

/** Return attributes describing imported items
 * - Modules, Artwork resources
 */
export const getImportAttrs = (program: AST.Program): DocAttr[] => {
    const attrs: DocAttr[] = [];

    const programs = [program, ...getProgramImports(program)].filter(
        (p) => !isProgramGlobal(p),
    );

    const modules: DocAttr[] = programs
        .flatMap((p) => getProgramModuleNames(p))
        .filter(uniqueFilter)
        .map((name) => {
            const module = trimModuleName(name);
            if (!module) return;
            const info = getModuleInfo(name);
            return {
                kind: "module",
                name: info.name,
                documentation:
                    `${info.version} ${info.native ? "(Included with AM)" : info.url}`.trim(),
            };
        })
        .filter((n) => n);
    modules.sort((a, b) => a.name.localeCompare(b.name));
    attrs.push(...modules);

    let artworkLabels = programs
        .flatMap((p) => getProgramArtworks(p))
        .filter(uniqueFilter);

    if (artworkLabels.length) {
        artworkLabels.sort();
        attrs.push({
            kind: "artwork",
            documentation: `${artworkLabels.join(", ")}`,
        });
    }

    attrs.sort((a, b) => getKindOrder(a.kind) - getKindOrder(b.kind));
    return attrs;
};

// -----------------------------------------------------------------------------

export const addImportCalls = (branches: AST.Node[][]) => {
    const showMissing =
        !!getConfigValue(constants.ATTRACT_MODE_PATH) &&
        getConfigValue(constants.SHOW_MISSING_ENABLED, true);

    filterBranchCallMethods(branches, [
        constants.FE_LOAD_MODULE,
        constants.FE_DO_NUT,
        constants.SQ_DOFILE,
    ]).forEach((branch) => {
        const filename = getNodeImportFilename(branch);
        const isModule =
            getCallExpressionName(branch) === constants.FE_LOAD_MODULE;
        if (showMissing && filename === "") {
            const args = (<AST.CallExpression>branch.at(-1)).arguments;
            const message = isModule
                ? constants.MODULE_MISSING_MESSAGE
                : constants.FILE_MISSING_MESSAGE;
            addProgramErrors(
                getBranchProgram(branch),
                [{ message, loc: args[0].loc }],
                DiagnosticSeverity.Warning,
            );
        }

        if (isModule) addProgramModuleName(getBranchProgram(branch), filename);
        addProgramImportName(getBranchProgram(branch), filename);
    });
};

// -----------------------------------------------------------------------------

const programMap = new Map<string, AST.Program>();

/** Store program by key */
export const addProgram = (name: string, program: AST.Program) =>
    programMap.set(getProgramKey(name), program);

/** Get program by name */
export const getProgram = (name: string): AST.Program | undefined =>
    programMap.get(getProgramKey(name));

/** Remove program by name */
export const removeProgram = (name: string) =>
    programMap.delete(getProgramKey(name));

/** Return true if cache exists for name */
export const getProgramExists = (name: string): boolean =>
    programMap.has(getProgramKey(name));

/** Return number of programs in cache */
export const getProgramSize = (): number => programMap.size;

/** Delete all programs */
export const deletePrograms = () => programMap.clear();

/** Creates standardized program key from a path value */
export const getProgramKey = (name: string): string =>
    name ? pathNormalize(name) : undefined;

// -----------------------------------------------------------------------------

export class ProgramProvider extends Disposable {
    private disposables: Disposable[];

    constructor() {
        super(undefined);
        this.disposables = [
            workspace.onDidCloseTextDocument(() => {
                prunePrograms();
            }),
        ];
    }

    public dispose() {
        deletePrograms();
        this.disposables.forEach((item) => item.dispose());
    }
}

// -----------------------------------------------------------------------------

/**
 * Called by providers that need access to the program AST
 * - Will only call executeDocumentSymbolProvider once per "group of requests"
 * - Populates ProgramCache with program AST, then fires the callback
 */
export const requestProgram = <T>(
    document: TextDocument,
    token: CancellationToken,
    callback: (node: AST.Program) => T | Promise<T>,
): Promise<T> => {
    return new Promise((resolve, _reject) => {
        if (token.isCancellationRequested) return resolve(undefined);
        const command = commands.executeCommand(
            "vscode.executeDocumentSymbolProvider",
            document.uri,
        );
        if (!command) resolve(undefined);
        command.then(() => {
            const program = getProgram(document.uri.fsPath);
            if (!program) return resolve(undefined);

            Promise.resolve(callback(program)).then((response) => {
                resolve(response);
            });
        });
    });
};

/** Add an editor document program */
export const addProgramDocument = (document: TextDocument) =>
    addProgramText(document.uri.fsPath, document.getText());

/** Add a file program, return true on success */
export const addProgramFile = (filename: string): boolean => {
    const content = readFile(filename);
    addProgramText(filename, content ?? ""); // add even on fail to prevent future attempts
    return !!content;
};

/** Add a text program */
export const addProgramText = (name: string, text: string) => {
    removeProgram(name);
    const parser = new SquirrelParser({
        sourcename: name,
        throwOnError: false,
    });

    try {
        const program = parser.parse(text); // parse text to AST
        addProgram(name, program); // store for traversal
        addProgramErrors(program, parser.errors()); // store for diagnostics
        createNodeMaps(program); // map id and definitions
        getSemanticTokens(program); // add token and deprecations
    } catch (error) {
        console.error("Parser Error", error);
        addProgram(name, undefined);
    }
};

// -----------------------------------------------------------------------------

/** Remove unused programs (except globals) */
export const prunePrograms = () => {
    const paths = getOpenTabPaths().map((name) => getProgramKey(name));
    [...programMap.keys()]
        .filter(
            (name) =>
                !paths.includes(name) && !isProgramGlobal(getProgram(name)),
        )
        .forEach((name) => removeProgram(name));
};

/**
 * Return all imported programs for completions & definitions
 * - Does not include the given program
 */
export const getProgramImports = (program: AST.Program): AST.Program[] => {
    if (!program) return [];
    const { sourceName } = program;
    const sourceKey = getProgramKey(sourceName);
    const imports = getProgramImportsRecursive(sourceName);

    return [...programMap.entries()]
        .filter(([key, program]) => {
            if (key === sourceKey) return false;
            if (imports.includes(key)) return true;
            if (isProgramGlobal(program)) return true;
        })
        .map(([_key, program]) => program);
};

/**
 * Return array of all import filenames, and their descendants
 * - Loads programs from files if not already cached
 */
const getProgramImportsRecursive = (
    filename: string,
    imports: string[] = [],
): string[] => {
    if (!getProgramExists(filename) && !addProgramFile(filename))
        return imports;
    getProgramImportNames(getProgram(filename)).forEach((name) => {
        const key = getProgramKey(name);
        if (!imports.includes(key)) {
            imports.push(key);
            getProgramImportsRecursive(name, imports);
        }
    });

    return imports;
};
