import { describe, expect, it } from "@jest/globals";
import { SquirrelCompletionItemDocMemberProvider } from "../../src/providers/squirrelCompletionItemDocMemberProvider";
import { MockTextDocument, parseExtra as parse } from "../utils";
import { CompletionTriggerKind, Position, Event, commands, CompletionItemKind, CompletionItem } from "vscode";
import { addProgram } from "../../src/utils/program";
import { addSnippetCompletion } from "../../src/doc/snippets";
import { stringToCompletionKind } from "../../src/utils/kind";

jest.spyOn(commands, "executeCommand").mockImplementation((name, uri): any => {
    return { then: (cb) => { cb(); } };
});

const t = { isCancellationRequested: false, onCancellationRequested: <Event<any>>{} };

describe("SquirrelCompletionItemDocMemberProvider", () => {

    it("Creates", () => {
        const s = new SquirrelCompletionItemDocMemberProvider()
        expect(s).toBeTruthy();
    });

    it("Disabled", () => {
        const s = new SquirrelCompletionItemDocMemberProvider()
        const d = new MockTextDocument("");
        const p = new Position(0, 0);
        s.enabled = false;

        expect(s.provideCompletionItems(d, p, t,
            { triggerKind: CompletionTriggerKind.TriggerCharacter, triggerCharacter: "" }
        )).toBeUndefined();
    });

    it("Invalid Trigger", () => {
        const s = new SquirrelCompletionItemDocMemberProvider()
        const d = new MockTextDocument("");
        const p = new Position(0, 0);
        const r = { triggerKind: CompletionTriggerKind.TriggerCharacter, triggerCharacter: undefined };

        expect(s.provideCompletionItems(d, p, t, r)).toBeUndefined();
    });

    it("Empty", async () => {
        const s = new SquirrelCompletionItemDocMemberProvider()
        const d = new MockTextDocument("");
        const p = new Position(0, 0);
        const r = { triggerKind: CompletionTriggerKind.TriggerCharacter, triggerCharacter: "." };
        addProgram(d.uri.path, parse(d.getText()));

        expect(await s.provideCompletionItems(d, p, t, r)).toBeUndefined();
    });

    it("Comment", async () => {
        const s = new SquirrelCompletionItemDocMemberProvider()
        const d = new MockTextDocument("/** comment */");
        const p = new Position(0, 3);
        const r = { triggerKind: CompletionTriggerKind.TriggerCharacter, triggerCharacter: "." };

        const program = parse(d.getText());
        addProgram(d.uri.path, program);
        addSnippetCompletion(program, { kind: stringToCompletionKind("attr") } as CompletionItem);

        expect((await s.provideCompletionItems(d, p, t, r))).toHaveLength(1);
    });

});
