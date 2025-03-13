import { describe, expect, it } from "@jest/globals";
import { SquirrelSignatureHelpProvider } from "../../src/providers/squirrelSignatureHelpProvider";
import { MockTextDocument, parseExtra as parse } from "../utils";
import { CompletionTriggerKind, Position, Event, commands, SignatureHelp } from "vscode";
import { addProgram } from "../../src/utils/program";

jest.spyOn(commands, "executeCommand").mockImplementation((name, uri): any => {
    return { then: (cb) => { cb(); } };
});

const t = { isCancellationRequested: false, onCancellationRequested: <Event<any>>{} };

describe("SquirrelSignatureHelpProvider", () => {

    it("Creates", () => {
        const s = new SquirrelSignatureHelpProvider()
        expect(s).toBeTruthy();
    });

    it("Disabled", () => {
        const s = new SquirrelSignatureHelpProvider()
        const d = new MockTextDocument("");
        const p = new Position(0, 0);
        s.enabled = false;

        expect(s.provideSignatureHelp(d, p, t, null)).toBeUndefined();
    });

    it("Empty", async () => {
        const s = new SquirrelSignatureHelpProvider()
        const d = new MockTextDocument("");
        const p = new Position(0, 0);
        addProgram(d.uri.path, parse(d.getText()));

        expect(await s.provideSignatureHelp(d, p, t, null)).toBeUndefined();
    });

    it("Valid", async () => {
        const s = new SquirrelSignatureHelpProvider()
        const d = new MockTextDocument("function foo(x) {}; foo()");
        const p = new Position(0, 24);
        addProgram(d.uri.path, parse(d.getText()));

        expect(await s.provideSignatureHelp(d, p, t, null)).toBeInstanceOf(SignatureHelp);
    });

});
