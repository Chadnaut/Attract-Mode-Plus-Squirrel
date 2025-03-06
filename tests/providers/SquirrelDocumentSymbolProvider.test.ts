import { describe, expect, it } from "@jest/globals";
import { SquirrelDocumentSymbolProvider } from "../../src/providers/squirrelDocumentSymbolProvider";
import { MockTextDocument, parseExtra as parse } from "../utils";
import { CompletionTriggerKind, Position, Event, commands } from "vscode";
import { addProgram } from "../../src/utils/program";

jest.spyOn(commands, "executeCommand").mockImplementation((name, uri): any => {
    return { then: (cb) => { cb(); } };
});

const t = { isCancellationRequested: false, onCancellationRequested: <Event<any>>{} };

describe("SquirrelDocumentSymbolProvider", () => {

    it("Creates", () => {
        const s = new SquirrelDocumentSymbolProvider()
        expect(s).toBeTruthy();
    });

    it("Disabled", () => {
        const s = new SquirrelDocumentSymbolProvider()
        const d = new MockTextDocument("");
        s.enabled = false;

        expect(s.provideDocumentSymbols(d, t)).toBeUndefined();
    });

    it("Cancel", async () => {
        const s = new SquirrelDocumentSymbolProvider()
        const d = new MockTextDocument("");
        const t = { isCancellationRequested: true, onCancellationRequested: <Event<any>>{} };
        addProgram(d.uri.path, parse(d.getText()));

        expect(await s.provideDocumentSymbols(d, t)).toBeUndefined();
    });

    it("Valid", async () => {
        const s = new SquirrelDocumentSymbolProvider()
        const d = new MockTextDocument("");
        addProgram(d.uri.path, parse(d.getText()));

        expect(await s.provideDocumentSymbols(d, t)).toBeTruthy();
    });

});
