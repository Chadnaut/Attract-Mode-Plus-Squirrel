import { describe, expect, it } from "@jest/globals";
import { SquirrelCompletionItemAttributeProvider } from "../../src/providers/squirrelCompletionItemAttributeProvider";
import { MockTextDocument, parseExtra as parse } from "../utils";
import { CompletionTriggerKind, Position, Event, commands } from "vscode";
import { addProgram } from "../../src/utils/program";

jest.spyOn(commands, "executeCommand").mockImplementation((name, uri): any => {
    return { then: (cb) => { cb(); } };
});

const t = { isCancellationRequested: false, onCancellationRequested: <Event<any>>{} };

describe("SquirrelCompletionItemAttributeProvider", () => {

    it("Creates", () => {
        const s = new SquirrelCompletionItemAttributeProvider()
        expect(s).toBeTruthy();
    });

    it("Disabled", () => {
        const s = new SquirrelCompletionItemAttributeProvider()
        const d = new MockTextDocument("");
        const p = new Position(0, 0);
        s.enabled = false;

        expect(s.provideCompletionItems(d, p, t,
            { triggerKind: CompletionTriggerKind.TriggerCharacter, triggerCharacter: "" }
        )).toBeUndefined();
    });

    it("Invalid Trigger", () => {
        const s = new SquirrelCompletionItemAttributeProvider()
        const d = new MockTextDocument("");
        const p = new Position(0, 0);
        const r = { triggerKind: CompletionTriggerKind.TriggerCharacter, triggerCharacter: undefined };

        expect(s.provideCompletionItems(d, p, t, r)).toBeUndefined();
    });

    it("Empty", async () => {
        const s = new SquirrelCompletionItemAttributeProvider()
        const d = new MockTextDocument("class foo {}");
        const p = new Position(0, 8);
        const r = { triggerKind: CompletionTriggerKind.TriggerCharacter, triggerCharacter: "/" };
        addProgram(d.uri.path, parse(d.getText()));

        expect(await s.provideCompletionItems(d, p, t, r)).toBeUndefined();
    });

    it("Valid", async () => {
        const s = new SquirrelCompletionItemAttributeProvider()
        const d = new MockTextDocument("class foo <//> {}");
        const p = new Position(0, 12);
        const r = { triggerKind: CompletionTriggerKind.TriggerCharacter, triggerCharacter: "/" };
        addProgram(d.uri.path, parse(d.getText()));

        expect(await s.provideCompletionItems(d, p, t, r)).toHaveLength(1);
    });

});
