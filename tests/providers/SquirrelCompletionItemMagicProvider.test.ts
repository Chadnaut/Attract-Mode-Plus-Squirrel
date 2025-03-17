import { describe, expect, it } from "@jest/globals";
import { SquirrelCompletionItemMagicProvider } from "../../src/providers/squirrelCompletionItemMagicProvider";
import { MockTextDocument, parseForceExtra as parse } from "../utils";
import { CompletionTriggerKind, Position, Event, commands, CompletionItem, CompletionItemKind } from "vscode";
import { addProgram } from "../../src/utils/program";
import { addSnippetCompletion } from "../../src/doc/snippets";

jest.spyOn(commands, "executeCommand").mockImplementation((name, uri): any => {
    return { then: (cb) => { cb(); } };
});

const t = { isCancellationRequested: false, onCancellationRequested: <Event<any>>{} };

describe("SquirrelCompletionItemMagicProvider", () => {

    it("Creates", () => {
        const s = new SquirrelCompletionItemMagicProvider()
        expect(s).toBeTruthy();
    });

    it("Disabled", () => {
        const s = new SquirrelCompletionItemMagicProvider()
        const d = new MockTextDocument("");
        const p = new Position(0, 0);
        s.enabled = false;

        expect(s.provideCompletionItems(d, p, t,
            { triggerKind: CompletionTriggerKind.TriggerCharacter, triggerCharacter: "" }
        )).toBeUndefined();
    });

    it("Invalid Trigger", () => {
        const s = new SquirrelCompletionItemMagicProvider()
        const d = new MockTextDocument("");
        const p = new Position(0, 0);
        const r = { triggerKind: CompletionTriggerKind.TriggerCharacter, triggerCharacter: undefined };

        expect(s.provideCompletionItems(d, p, t, r)).toBeUndefined();
    });

    it("Empty", async () => {
        const s = new SquirrelCompletionItemMagicProvider()
        const d = new MockTextDocument("id");
        const p = new Position(1, 4);
        const r = { triggerKind: CompletionTriggerKind.TriggerCharacter, triggerCharacter: "." };
        addProgram(d.uri.path, parse(d.getText()));

        expect(await s.provideCompletionItems(d, p, t, r)).toBeUndefined();
    });

    it("String", async () => {
        const s = new SquirrelCompletionItemMagicProvider()
        const d = new MockTextDocument(`"string"`);
        const p = new Position(0, 4);
        const r = { triggerKind: CompletionTriggerKind.TriggerCharacter, triggerCharacter: "." };

        const program = parse(d.getText());
        addProgram(d.uri.path, program);
        const comp = { kind: CompletionItemKind.Event } as CompletionItem;
        addSnippetCompletion(program, comp);

        expect(await s.provideCompletionItems(d, p, t, r)).toEqual([comp]);
    });

});
