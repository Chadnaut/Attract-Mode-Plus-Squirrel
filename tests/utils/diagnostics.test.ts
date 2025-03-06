import { describe, expect, it } from "@jest/globals";
import { dump, parseForceExtra as parse, parseForceExtra, pos } from "../utils";
import { getNodeAtPos } from "../../src/utils/find";
import { getDiagnostics, getNodeHasError, getProgramErrors, SquirrelDiagnostics } from "../../src/utils/diagnostics";
import { commands, Diagnostic, DiagnosticCollection, languages, TextDocument, TextEditor, Uri, window, workspace } from "vscode";
import { addProgramFile, deletePrograms } from "../../src/utils/program";
import * as path from "path";
import constants from "../../src/constants";

const fileGood = path.join(__dirname, "../samples/diagnostic/good.nut");
const fileError = path.join(__dirname, "../samples/diagnostic/error.nut");
const fileWarning = path.join(__dirname, "../samples/diagnostic/warning.nut");
const fileDeprecated = path.join(__dirname, "../samples/diagnostic/deprecated.nut");

const docGood = { uri: Uri.file(fileGood), languageId: "squirrel" } as TextDocument;
const docBad = { uri: Uri.file("mock.ts"), languageId: "typescript" } as TextDocument;
const docUgly = null;
const docError = { uri: Uri.file(fileError), languageId: "squirrel" } as TextDocument;
const docWarning = { uri: Uri.file(fileWarning), languageId: "squirrel" } as TextDocument;
const docDeprecated = { uri: Uri.file(fileDeprecated), languageId: "squirrel" } as TextDocument;

let getConfigValueFunc = (...any) => {};
jest.mock('../../src/utils/config.ts', () => ({
    ...jest.requireActual('../../src/utils/config.ts'),
    getConfigValue: (...any) => getConfigValueFunc(...any),
}));

beforeEach(() => {
    getConfigValueFunc = (v) => {
        switch (v) {
            case constants.ATTRACT_MODE_PATH: return "mock/path";
            case constants.SHOW_MISSING_ENABLED: return true;
            default: return "";
        }
    }

    jest.replaceProperty(window, "visibleTextEditors", [] as TextEditor[]);

    const spyExecuteCommand = jest.spyOn(commands, "executeCommand");
    spyExecuteCommand.mockImplementation((command:string, ...args: any[]) => {
        return new Promise((e) => { e(undefined); });
    });

    let collection: Map<Uri, Diagnostic[]> = new Map();
    collection["dispose"] = () => {}
    const spyCollection = jest.spyOn(languages, "createDiagnosticCollection");
    spyCollection.mockImplementation((name:string) => collection as unknown as DiagnosticCollection);

    // Must be cached for diagnostics will work
    deletePrograms();
    addProgramFile(fileGood);
    addProgramFile(fileError);
    addProgramFile(fileWarning);
    addProgramFile(fileDeprecated);
});


describe("Diagnostics", () => {

    it("getDiagnostics, invalid", () => {
        expect(getDiagnostics(undefined)).toEqual([]);
    });

    it("getNodeHasError", () => {
        const program = parse("local xyz = ;");
        const node = getNodeAtPos(program, pos(2));
        expect(getNodeHasError(program, node)).toBe(true);
    });

    it("getNodeHasError, none", () => {
        const program = parse("local xyz = 123;");
        const node = getNodeAtPos(program, pos(2));
        expect(getNodeHasError(program, node)).toBe(false);
    });

    it("getNodeHasError, undefined", () => {
        expect(getNodeHasError(undefined, undefined)).toBe(false);
    });

    it("ignore file if disabled", async () => {
        const d = new SquirrelDiagnostics();
        d.enabled = false;

        await d.refresh(docGood);
        expect(d.collection["size"]).toBe(0); // wont add if disabled

        d.enabled = true; // enabled fires refreshAll NEXT tick
        await new Promise((r) => setTimeout(r, 0)); // wait a tick

        await d.refresh(docGood);
        expect(d.collection["size"]).toBe(1);
    });

    it("adds & deletes", async () => {
        const d = new SquirrelDiagnostics();

        await d.refresh(docGood);
        expect(d.collection["size"]).toBe(1);
        await d.refresh(docBad);
        expect(d.collection["size"]).toBe(1);
        await d.refresh(docUgly);
        expect(d.collection["size"]).toBe(1);
        await d.refresh(docError);
        expect(d.collection["size"]).toBe(2);

        await d.refresh(docDeprecated);
        expect(d.collection["size"]).toBe(3);
        await d.refresh(docDeprecated); // duplicate doesn't change size
        expect(d.collection["size"]).toBe(3);

        d.delete(docGood);
        expect(d.collection["size"]).toBe(2);
        d.delete(docBad);
        expect(d.collection["size"]).toBe(2);
        d.delete(docUgly);
        expect(d.collection["size"]).toBe(2);
        d.delete(docError);
        expect(d.collection["size"]).toBe(1);
        d.delete(docDeprecated);
        expect(d.collection["size"]).toBe(0);
    });

    it("collection", async () => {
        const d = new SquirrelDiagnostics();

        await d.refresh(docGood);
        expect(d.collection.get(docGood.uri)).toHaveLength(0);

        await d.refresh(docError);
        expect(d.collection.get(docError.uri).length).toBeGreaterThan(0);

        await d.refresh(docWarning);
        expect(d.collection.get(docWarning.uri).length).toBeGreaterThan(0);

        await d.refresh(docDeprecated); // contains deprecated node
        expect(d.collection.get(docDeprecated.uri).find((d) => d.tags?.length > 0)).not.toBeUndefined();

        expect(() => d.dispose()).not.toThrow();
    });

    it("visibleTextEditors", async () => {
        jest.replaceProperty(window, "visibleTextEditors", [
            null,
            { document: docGood },
            { document: docBad },
            { document: docDeprecated }
        ] as TextEditor[]);

        const d = new SquirrelDiagnostics();
        await d.refreshAll();
        expect(d.collection["size"]).toBe(2);
    });

    it("events", async () => {
        let onDidChangeActiveTextEditor;
        let onDidChangeTextDocument;
        let onDidCloseTextDocument;

        const spy1 = jest.spyOn(window, "onDidChangeActiveTextEditor");
        spy1.mockImplementation((cb) => { onDidChangeActiveTextEditor = cb; return null; });
        const spy2 = jest.spyOn(workspace, "onDidChangeTextDocument");
        spy2.mockImplementation((cb) => { onDidChangeTextDocument = cb; return { dispose: () => {} } });
        const spy3 = jest.spyOn(workspace, "onDidCloseTextDocument");
        spy3.mockImplementation((cb) => { onDidCloseTextDocument = cb; return { dispose: () => {} } });

        const d = new SquirrelDiagnostics();

        await d.refresh(docGood);
        expect(d.collection["size"]).toBe(1);

        onDidChangeActiveTextEditor({ document: docGood });
        onDidChangeActiveTextEditor(undefined);
        expect(d.collection["size"]).toBe(1);

        onDidChangeTextDocument({ document: docGood });
        onDidChangeTextDocument(undefined);
        expect(d.collection["size"]).toBe(1);

        onDidCloseTextDocument(docGood);
        onDidCloseTextDocument(undefined);
        expect(d.collection["size"]).toBe(0);

        expect(() => d.dispose()).not.toThrow();
    });

    it("getProgramErrors ignore missing without attract path", () => {
        getConfigValueFunc = (v) => {
            switch (v) {
                case constants.ATTRACT_MODE_PATH: return "";
                case constants.SHOW_MISSING_ENABLED: return true;
            }
        }
        const program = parse(`fe.load_module("mock")`)
        expect(getProgramErrors(program)).toHaveLength(0);
    });

    it("getProgramErrors catches missing module", () => {
        const program = parse(`fe.load_module("mock")`)
        expect(getProgramErrors(program)).toHaveLength(1);
    });

    it("getProgramErrors catches missing module nut", () => {
        const program = parse(`fe.load_module("mock.nut")`)
        expect(getProgramErrors(program)).toHaveLength(1);
    });

    it("getProgramErrors catches missing dofile", () => {
        const program = parse(`dofile("mock.nut")`)
        expect(getProgramErrors(program)).toHaveLength(1);
    });

    it("getProgramErrors catches missing do_nut", () => {
        const program = parse(`fe.do_nut("mock.nut")`)
        expect(getProgramErrors(program)).toHaveLength(1);
    });

    it("getProgramErrors ignores omitted do_nut", () => {
        const program = parse(`fe.do_nut()`)
        expect(getProgramErrors(program)).toHaveLength(0);
    });

    it("getProgramErrors ignores omitted do_nut", () => {
        const program = parseForceExtra(`local a; a <- 1;`)
        expect(getProgramErrors(program)).toHaveLength(1);
    });

});
