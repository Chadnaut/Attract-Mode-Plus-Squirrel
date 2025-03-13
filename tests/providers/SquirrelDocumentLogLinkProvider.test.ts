import { describe, expect, it } from "@jest/globals";
import { SquirrelDocumentLogLinkProvider } from "../../src/providers/squirrelDocumentLogLinkProvider";
import { MockTextDocument, parseExtra as parse } from "../utils";
import { Event, commands } from "vscode";
import { addProgram } from "../../src/utils/program";

jest.spyOn(commands, "executeCommand").mockImplementation((name, uri): any => {
    return { then: (cb) => { cb(); } };
});

const t = { isCancellationRequested: false, onCancellationRequested: <Event<any>>{} };

describe("SquirrelDocumentLogLinkProvider", () => {

    it("Creates", () => {
        const s = new SquirrelDocumentLogLinkProvider()
        expect(s).toBeTruthy();
    });

    it("Disabled", () => {
        const s = new SquirrelDocumentLogLinkProvider()
        const d = new MockTextDocument("");
        s.enabled = false;

        expect(s.provideDocumentLinks(d, t)).toBeUndefined();
    });

    it("Valid", async () => {
        const s = new SquirrelDocumentLogLinkProvider()
        const d = new MockTextDocument("value");
        addProgram(d.uri.path, parse(d.getText()));

        expect(await s.provideDocumentLinks(d, t)).toHaveLength(0);
    });

});
