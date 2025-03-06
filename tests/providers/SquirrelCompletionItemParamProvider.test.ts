import { describe, expect, it } from "@jest/globals";
import { SquirrelCompletionItemParamProvider } from "../../src/providers/squirrelCompletionItemParamProvider";
import { MockTextDocument, parseExtra as parse } from "../utils";
import { CompletionTriggerKind, Position, Event, commands } from "vscode";
import { addProgram } from "../../src/utils/program";

jest.spyOn(commands, "executeCommand").mockImplementation((name, uri): any => {
    return { then: (cb) => { cb(); } };
});

const t = { isCancellationRequested: false, onCancellationRequested: <Event<any>>{} };

describe("SquirrelCompletionItemParamProvider", () => {

    it("Creates", () => {
        const s = new SquirrelCompletionItemParamProvider()
        expect(s).toBeTruthy();
    });

    it("Disabled", () => {
        const s = new SquirrelCompletionItemParamProvider()
        const d = new MockTextDocument("");
        const p = new Position(0, 0);
        s.enabled = false;

        expect(s.provideCompletionItems(d, p, t,
            { triggerKind: CompletionTriggerKind.TriggerCharacter, triggerCharacter: "" }
        )).toBeUndefined();
    });

    it("Invalid Trigger", async () => {
        const s = new SquirrelCompletionItemParamProvider()
        const d = new MockTextDocument("");
        const p = new Position(0, 0);
        const r = { triggerKind: CompletionTriggerKind.TriggerCharacter, triggerCharacter: undefined };

        expect(s.provideCompletionItems(d, p, t, r)).toBeUndefined();
    });

    it("Empty", async () => {
        const s = new SquirrelCompletionItemParamProvider()
        const d = new MockTextDocument("id");
        const p = new Position(1, 4);
        const r = { triggerKind: CompletionTriggerKind.TriggerCharacter, triggerCharacter: "." };
        addProgram(d.uri.path, parse(d.getText()));

        expect(await s.provideCompletionItems(d, p, t, r)).toBeUndefined();
    });

    it("Invalid", async () => {
        const s = new SquirrelCompletionItemParamProvider()
        const d = new MockTextDocument("value");
        const p = new Position(0, 3);
        const r = { triggerKind: CompletionTriggerKind.TriggerCharacter, triggerCharacter: "." };
        addProgram(d.uri.path, parse(d.getText()));

        expect(await s.provideCompletionItems(d, p, t, r)).toBeUndefined();
    });

    it("Valid", async () => {
        const s = new SquirrelCompletionItemParamProvider()
        const d = new MockTextDocument(`value("")`);
        const p = new Position(0, 7);
        const r = { triggerKind: CompletionTriggerKind.TriggerCharacter, triggerCharacter: "." };
        addProgram(d.uri.path, parse(d.getText()));

        expect(await s.provideCompletionItems(d, p, t, r)).toBeTruthy();
    });

});
