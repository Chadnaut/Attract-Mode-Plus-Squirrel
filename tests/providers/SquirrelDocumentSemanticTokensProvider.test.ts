import { describe, expect, it } from "@jest/globals";
import { SquirrelDocumentSemanticTokensProvider } from "../../src/providers/squirrelDocumentSemanticTokensProvider";
import { MockTextDocument, parseExtra as parse } from "../utils";
import { CompletionTriggerKind, Position, Event, commands } from "vscode";
import { addProgram } from "../../src/utils/program";

jest.spyOn(commands, "executeCommand").mockImplementation((name, uri): any => {
    return { then: (cb) => { cb(); } };
});

const t = { isCancellationRequested: false, onCancellationRequested: <Event<any>>{} };

describe("SquirrelDocumentSemanticTokensProvider", () => {

    it("Creates", () => {
        const s = new SquirrelDocumentSemanticTokensProvider()
        expect(s).toBeTruthy();
    });

    it("Disabled", () => {
        const s = new SquirrelDocumentSemanticTokensProvider()
        const d = new MockTextDocument("");
        s.enabled = false;

        expect(s.provideDocumentSemanticTokens(d, t)).toBeUndefined();
    });

    it("Valid", async () => {
        const s = new SquirrelDocumentSemanticTokensProvider()
        const d = new MockTextDocument("");
        addProgram(d.uri.path, parse(d.getText()));

        expect(await s.provideDocumentSemanticTokens(d, t)).toHaveLength(0);
    });

});
