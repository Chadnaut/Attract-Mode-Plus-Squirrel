import { addProgram, addProgramDocument, addProgramFile, addProgramImportName, addProgramModuleName, addProgramText, prunePrograms, deletePrograms, getImportAttrs, getProgramImports, getProgram, getProgramExists, getProgramKey, getProgramSize, removeProgram, requestProgram, ProgramProvider } from "../../src/utils/program";
import { describe, expect, it } from "@jest/globals";
import { AST, SQTree as qt } from "../../src/ast";
import { CancellationToken, commands, Disposable, TabGroups, TabInputText, TextDocument, Uri, window, workspace } from "vscode";
import * as path from "path";
import constants from "../../src/constants";
import { setNodeDocBlock } from "../../src/doc/find";
import { parseExtra as parse, pos } from "../utils";

let parseThrow = false;
jest.mock('../../src/utils/config', () => ({
    ...jest.requireActual('../../src/utils/config'),
    getConfigValue: (configSection, defaultValue) => {
        switch (configSection) {
            case constants.SHOW_MISSING_ENABLED:
                return true;
            case constants.ATTRACT_MODE_PATH:
                return "";
            default:
                return false;
        }
    }
}));
jest.mock('../../src/squirrel/parser.ts', () => ({
    SquirrelParser: class {
        parse() {
            if (parseThrow) throw "Error";
            return {};
        }
        errors() {
            return [];
        }
    }
}));


const spyOnDidCloseTextDocument = jest.spyOn(workspace, "onDidCloseTextDocument");
spyOnDidCloseTextDocument.mockImplementation(
    (listener: (e: TextDocument) => any, thisArgs?: any, disposables?: Disposable[]): Disposable => {
        listener?.call(undefined);
        return new Disposable(() => {});
    }
);

beforeEach(() => {
    jest.spyOn(commands, "executeCommand").mockImplementation((command:string, ...args: any[]) => {
        return new Promise((e) => { e("a"); });
    });
});

afterEach(() => {
    parseThrow = false;
    deletePrograms();
});

describe("Program", () => {
    it("creates", () => {
        const p = new ProgramProvider();
        spyOnDidCloseTextDocument.getMockImplementation().call(this);
        p.dispose();
        expect(p).toBeTruthy();
    });

    it("getImportAttrs, none", () => {
        const program = parse(`fe.load_module("core")`)
        expect(getImportAttrs(program)).toEqual([]);
    });

    it("getImportAttrs, valid", () => {
        const program = <AST.Program>{ sourceName: "mockProgram" };

        const mockModule = <AST.Program>{ sourceName: "mockModule" };
        addProgram("modules/mockModule", mockModule);
        addProgramImportName(program, "modules/mockModule");
        addProgramModuleName(program, "modules/mockModule");

        expect(getImportAttrs(program)).toEqual([ { kind: "module", name: "mockModule", documentation: "" }]);
    });

    it("getImportAttrs, invalid", () => {
        const program = <AST.Program>{ sourceName: "mockProgram" };

        const mockModule = <AST.Program>{ sourceName: "mockModule" };
        addProgram("bad/mockModule", mockModule); // <-- must be module path
        addProgramImportName(program, "bad/mockModule");
        addProgramModuleName(program, "bad/mockModule");

        expect(getImportAttrs(program)).toEqual([]);
    });

    it("Key", () => {
        expect(getProgramKey(undefined)).toBeUndefined();
        expect(getProgramKey('name')).toBe('NAME');
    });

    it("Add File", () => {
        const filename = path.join(__dirname, "../samples/format/home.src.nut");
        addProgramFile(filename);
        expect(getProgramExists(filename)).toBe(true);
    });

    it("Add Document", () => {
        const filename = "document";
        addProgramDocument(<TextDocument>{ uri: Uri.file(filename), getText: () => ''});
        expect(getProgramExists(filename)).toBe(true);
    });

    it("Ignores Case", () => {
        addProgramDocument(<TextDocument>{ uri: Uri.file("name"), getText: () => ''});
        addProgramDocument(<TextDocument>{ uri: Uri.file("NAME"), getText: () => ''});
        addProgramDocument(<TextDocument>{ uri: Uri.file("name/"), getText: () => ''});
        addProgramDocument(<TextDocument>{ uri: Uri.file("/name"), getText: () => ''});
        addProgramDocument(<TextDocument>{ uri: Uri.file("/name/"), getText: () => ''});
        expect(getProgramSize()).toBe(1);
    });

    it("adds & remove", () => {
        const key = "x";
        const program = qt.Program();
        expect(getProgram(key)).toBeUndefined();
        addProgram(key, program);
        expect(getProgram(key)).toBe(program);
        removeProgram(key);
        expect(getProgram(key)).toBeUndefined();
    });

    it("cleans", () => {
        jest.replaceProperty(window, "tabGroups", {
            all: [
                { tabs: [{ input: new TabInputText(Uri.file("p1")) }]},
            ]
        } as unknown as TabGroups);

        const program = qt.Program();
        expect(getProgram("p1")).toBeUndefined();
        expect(getProgram("p2")).toBeUndefined();
        addProgram("p1", program);
        addProgram("p2", program);
        expect(getProgram("p1")).toBe(program);
        expect(getProgram("p2")).toBe(program);
        prunePrograms();
        expect(getProgram("p1")).not.toBeUndefined();
        expect(getProgram("p2")).toBeUndefined();
    });

    it("addText fails gracefully", () => {
        let error;
        jest.spyOn(console, "error").mockImplementation((...args) => {error = args});

        parseThrow = true;
        addProgramText("a", "");
        expect(getProgram("a")).toEqual(undefined);
        expect(error).toBeTruthy();
    });

    it("requestProgram, valid", async () => {
        let response;
        const program = <AST.Program>{ sourceName: "a" };
        addProgram("a", program);
        await requestProgram(
            { uri: { fsPath: "a" } } as TextDocument,
            {} as CancellationToken,
            (r) => {response = r}
        );
        expect(response).toBe(program);
    });

    it("requestProgram, missing", async () => {
        let response;
        await requestProgram(
            { uri: { fsPath: "a" } } as TextDocument,
            {} as CancellationToken,
            (r) => {response = r}
        );
        expect(response).toBeUndefined();
    });

    it("requestProgram, cancel", async () => {
        let response;
        addProgram("a", <AST.Program>{ sourceName: "a" });
        await requestProgram(
            { uri: { fsPath: "a" } } as TextDocument,
            { isCancellationRequested: true } as CancellationToken,
            (r) => {response = r}
        );
        expect(response).toBeUndefined();
    });

    it("requestProgram, undefined", async () => {
        jest.spyOn(commands, "executeCommand").mockImplementation((command:string, ...args: any[]) => {
            return undefined;
        });

        let response;
        addProgram("a", <AST.Program>{ sourceName: "a" });
        await requestProgram(
            { uri: { fsPath: "a" } } as TextDocument,
            {} as CancellationToken,
            (r) => {response = r}
        );
        expect(response).toBeUndefined();
    });

    it("getProgramImports, undefined", () => {
        expect(getProgramImports(undefined)).toEqual([]);
    });

    it("getProgramImports, none", () => {
        const progA = <AST.Program>{ sourceName: "a" };
        const progB = <AST.Program>{ sourceName: "b" };
        const progC = <AST.Program>{ sourceName: "c" };
        addProgram("a", progA);
        addProgram("b", progB);
        addProgram("c", progC);
        expect(getProgramImports(progC)).toEqual([]);
    });

    it("getProgramImports, chain", () => {
        const progA = <AST.Program>{ sourceName: "a" };
        const progB = <AST.Program>{ sourceName: "b" };
        const progC = <AST.Program>{ sourceName: "c" };
        addProgramImportName(progB, "a");
        addProgramImportName(progC, "b");
        addProgram("a", progA);
        addProgram("b", progB);
        addProgram("c", progC);
        expect(getProgramImports(progC)).toEqual([progA, progB]);
    });

    it("getProgramImports, global", () => {
        jest.replaceProperty(constants, "ASSETS_PATH", "assetPath");
        const progA = <AST.Program>{ sourceName: "assetPath/a", type: "Program" };
        const progB = <AST.Program>{ sourceName: "b", type: "Program" };
        const progC = <AST.Program>{ sourceName: "c", type: "Program" };
        setNodeDocBlock(progA, { branch: [], attributes: [{ kind: "global" }] });
        addProgramImportName(progC, "b");
        addProgram("a", progA);
        addProgram("b", progB);
        addProgram("c", progC);
        expect(getProgramImports(progC)).toEqual([progA, progB]);
    });
});
