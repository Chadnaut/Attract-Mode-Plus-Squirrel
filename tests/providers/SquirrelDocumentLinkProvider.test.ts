import { forwardSlash } from './../../src/utils/file';
import { describe, expect, it } from "@jest/globals";
import { SquirrelDocumentLinkProvider } from "../../src/providers/squirrelDocumentLinkProvider";
import { MockTextDocument, parseExtra as parse } from "../utils";
import { CompletionTriggerKind, Position, Event, commands } from "vscode";
import { addProgram } from "../../src/utils/program";

jest.spyOn(commands, "executeCommand").mockImplementation((name, uri): any => {
    return { then: (cb) => { cb(); } };
});

const t = { isCancellationRequested: false, onCancellationRequested: <Event<any>>{} };

describe("SquirrelDocumentLinkProvider", () => {

    it("Creates", () => {
        const s = new SquirrelDocumentLinkProvider()
        expect(s).toBeTruthy();
    });

    it("Disabled", () => {
        const s = new SquirrelDocumentLinkProvider()
        const d = new MockTextDocument("");
        s.enabled = false;

        expect(s.provideDocumentLinks(d, t)).toBeUndefined();
    });

    it("Empty", async () => {
        const s = new SquirrelDocumentLinkProvider()
        const d = new MockTextDocument("");
        addProgram(d.uri.path, parse(d.getText()));

        expect(await s.provideDocumentLinks(d, t)).toHaveLength(0);
    });

    it("String", async () => {
        const s = new SquirrelDocumentLinkProvider()
        const d = new MockTextDocument('"string"');
        addProgram(d.uri.path, parse(d.getText()));

        expect(await s.provideDocumentLinks(d, t)).toHaveLength(0);
    });

    it("Link", async () => {
        const s = new SquirrelDocumentLinkProvider()
        const d = new MockTextDocument(`"${forwardSlash(__filename)}"`);
        addProgram(d.uri.path, parse(d.getText()));

        expect(await s.provideDocumentLinks(d, t)).toHaveLength(1);
    });

});
