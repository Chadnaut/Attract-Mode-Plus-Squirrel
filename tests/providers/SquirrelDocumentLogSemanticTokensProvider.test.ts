import { describe, expect, it } from "@jest/globals";
import { SquirrelDocumentLogSemanticTokensProvider } from "../../src/providers/squirrelDocumentLogSemanticTokensProvider";
import { MockTextDocument, parseExtra as parse } from "../utils";
import { Event, commands } from "vscode";

jest.spyOn(commands, "executeCommand").mockImplementation((name, uri): any => {
    return { then: (cb) => { cb(); } };
});

const t = { isCancellationRequested: false, onCancellationRequested: <Event<any>>{} };

describe("SquirrelDocumentLogSemanticTokensProvider", () => {

    it("Creates", () => {
        const s = new SquirrelDocumentLogSemanticTokensProvider()
        expect(s).toBeTruthy();
    });

    it("Disabled", () => {
        const s = new SquirrelDocumentLogSemanticTokensProvider()
        const d = new MockTextDocument("");
        s.enabled = false;

        expect(s.provideDocumentSemanticTokens(d, t)).toBeUndefined();
    });

    it("None", async () => {
        const s = new SquirrelDocumentLogSemanticTokensProvider()
        const d = new MockTextDocument("");

        expect(await s.provideDocumentSemanticTokens(d, t)).toHaveLength(0);
    });

    it("Valid", async () => {
        const s = new SquirrelDocumentLogSemanticTokensProvider()
        const d = new MockTextDocument("C:\\mock");

        expect(await s.provideDocumentSemanticTokens(d, t)).toHaveLength(1);
    });

});
