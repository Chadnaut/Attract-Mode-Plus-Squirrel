import { describe, expect, it } from "@jest/globals";
import { SquirrelCompletionItemDocProvider } from "../../src/providers/squirrelCompletionItemDocProvider";
import { MockTextDocument, parseForceExtra as parse } from "../utils";
import { CompletionTriggerKind, Position, Event, commands } from "vscode";
import { addProgram } from "../../src/utils/program";

jest.spyOn(commands, "executeCommand").mockImplementation((name, uri): any => {
    return { then: (cb) => { cb(); } };
});

const t = { isCancellationRequested: false, onCancellationRequested: <Event<any>>{} };

describe("SquirrelCompletionItemDocProvider", () => {

    it("Creates", () => {
        const s = new SquirrelCompletionItemDocProvider()
        expect(s).toBeTruthy();
    });

    it("Disabled", () => {
        const s = new SquirrelCompletionItemDocProvider()
        const d = new MockTextDocument("");
        const p = new Position(0, 0);
        s.enabled = false;

        expect(s.provideCompletionItems(d, p, t,
            { triggerKind: CompletionTriggerKind.TriggerCharacter, triggerCharacter: "" }
        )).toBeUndefined();
    });

    it("Invalid Trigger", () => {
        const s = new SquirrelCompletionItemDocProvider()
        const d = new MockTextDocument("");
        const p = new Position(0, 0);
        const r = { triggerKind: CompletionTriggerKind.TriggerCharacter, triggerCharacter: undefined };

        expect(s.provideCompletionItems(d, p, t, r)).toBeUndefined();
    });

    it("Empty", async () => {
        const s = new SquirrelCompletionItemDocProvider()
        const d = new MockTextDocument("");
        const p = new Position(0, 0);
        const r = { triggerKind: CompletionTriggerKind.TriggerCharacter, triggerCharacter: "." };
        addProgram(d.uri.path, parse(d.getText()));

        expect(await s.provideCompletionItems(d, p, t, r)).toBeUndefined();
    });

    it("Invalid", async () => {
        const s = new SquirrelCompletionItemDocProvider()
        const d = new MockTextDocument("local x = 1;");
        const p = new Position(0, 3);
        const r = { triggerKind: CompletionTriggerKind.TriggerCharacter, triggerCharacter: "." };
        addProgram(d.uri.path, parse(d.getText()));

        expect(await s.provideCompletionItems(d, p, t, r)).toBeUndefined();
    });

    it("String", async () => {
        const s = new SquirrelCompletionItemDocProvider()
        const d = new MockTextDocument(`"/** string */`);
        const p = new Position(0, 4);
        const r = { triggerKind: CompletionTriggerKind.TriggerCharacter, triggerCharacter: "." };
        addProgram(d.uri.path, parse(d.getText()));

        expect(await s.provideCompletionItems(d, p, t, r)).toBeUndefined();
    });

    it("Inner", async () => {
        const s = new SquirrelCompletionItemDocProvider()
        const d = new MockTextDocument(`/** /** inner */`);
        const p = new Position(0, 7);
        const r = { triggerKind: CompletionTriggerKind.TriggerCharacter, triggerCharacter: "." };
        addProgram(d.uri.path, parse(d.getText()));

        expect(await s.provideCompletionItems(d, p, t, r)).toBeUndefined();
    });

    it("Unfinished", async () => {
        const s = new SquirrelCompletionItemDocProvider()
        const d = new MockTextDocument("/** unfinished");
        const p = new Position(0, 3);
        const r = { triggerKind: CompletionTriggerKind.TriggerCharacter, triggerCharacter: "." };
        addProgram(d.uri.path, parse(d.getText()));

        expect((await s.provideCompletionItems(d, p, t, r)).length).toBeGreaterThan(0);
    });

    it("Comment", async () => {
        const s = new SquirrelCompletionItemDocProvider()
        const d = new MockTextDocument("/** comment */");
        const p = new Position(0, 3);
        const r = { triggerKind: CompletionTriggerKind.TriggerCharacter, triggerCharacter: "." };
        addProgram(d.uri.path, parse(d.getText()));

        expect((await s.provideCompletionItems(d, p, t, r)).length).toBeGreaterThan(0);
    });

});
