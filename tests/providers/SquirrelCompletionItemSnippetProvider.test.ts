import { describe, expect, it } from "@jest/globals";
import { SquirrelCompletionItemSnippetProvider } from "../../src/providers/squirrelCompletionItemSnippetProvider";
import { MockTextDocument, parseExtra as parse } from "../utils";
import { CompletionTriggerKind, Position, Event, commands, CompletionItemKind, CompletionItem } from "vscode";
import { addProgram } from "../../src/utils/program";
import { addSnippetCompletion } from "../../src/doc/snippets";

jest.spyOn(commands, "executeCommand").mockImplementation((name, uri): any => {
    return { then: (cb) => { cb(); } };
});

const t = { isCancellationRequested: false, onCancellationRequested: <Event<any>>{} };

describe("SquirrelCompletionItemSnippetProvider", () => {

    it("Creates", () => {
        const s = new SquirrelCompletionItemSnippetProvider()
        expect(s).toBeTruthy();
    });

    it("Disabled", () => {
        const s = new SquirrelCompletionItemSnippetProvider()
        const d = new MockTextDocument("");
        const p = new Position(0, 0);
        s.enabled = false;

        expect(s.provideCompletionItems(d, p, t,
            { triggerKind: CompletionTriggerKind.TriggerCharacter, triggerCharacter: "" }
        )).toBeUndefined();
    });

    it("Ignore", () => {
        const s = new SquirrelCompletionItemSnippetProvider()
        const d = new MockTextDocument(".");
        const p = new Position(0, 1);

        expect(s.provideCompletionItems(d, p, t,
            { triggerKind: CompletionTriggerKind.TriggerCharacter, triggerCharacter: "" }
        )).toBeUndefined();
    });

    it("Empty", async () => {
        const s = new SquirrelCompletionItemSnippetProvider()
        const d = new MockTextDocument(`value`);
        const p = new Position(1, 4);
        const r = { triggerKind: CompletionTriggerKind.TriggerCharacter, triggerCharacter: "." };
        addProgram(d.uri.path, parse(d.getText()));

        expect(await s.provideCompletionItems(d, p, t, r)).toHaveLength(0);
    });

    it("Property", async () => {
        const s = new SquirrelCompletionItemSnippetProvider()
        const d = new MockTextDocument(`class foo { x = 123 }`);
        const p = new Position(0, 17);
        const r = { triggerKind: CompletionTriggerKind.TriggerCharacter, triggerCharacter: "." };

        const program = parse(d.getText());
        addProgram(d.uri.path, program);
        addSnippetCompletion(program, { kind: CompletionItemKind.Property } as CompletionItem);
        addSnippetCompletion(program, { kind: CompletionItemKind.Event } as CompletionItem);
        addSnippetCompletion(program, { kind: CompletionItemKind.Color } as CompletionItem);

        expect(await s.provideCompletionItems(d, p, t, r)).toHaveLength(1);
    });

    it("Valid", async () => {
        const s = new SquirrelCompletionItemSnippetProvider()
        const d = new MockTextDocument(`value`);
        const p = new Position(0, 4);
        const r = { triggerKind: CompletionTriggerKind.TriggerCharacter, triggerCharacter: "." };

        const program = parse(d.getText());
        addProgram(d.uri.path, program);
        addSnippetCompletion(program, { kind: CompletionItemKind.Property } as CompletionItem);
        addSnippetCompletion(program, { kind: CompletionItemKind.Event } as CompletionItem);
        addSnippetCompletion(program, { kind: CompletionItemKind.Color } as CompletionItem);

        expect(await s.provideCompletionItems(d, p, t, r)).toHaveLength(1);
    });
});
