import { describe, expect, it } from "@jest/globals";
import { SquirrelCompletionItemMemberProvider } from "../../src/providers/squirrelCompletionItemMemberProvider";
import { MockTextDocument, parseForceExtra as parse } from "../utils";
import { CompletionTriggerKind, Position, Event, commands } from "vscode";
import { addProgram } from "../../src/utils/program";

jest.spyOn(commands, "executeCommand").mockImplementation((name, uri): any => {
    return { then: (cb) => { cb(); } };
});

const t = { isCancellationRequested: false, onCancellationRequested: <Event<any>>{} };

describe("SquirrelCompletionItemMemberProvider", () => {

    it("Creates", () => {
        const s = new SquirrelCompletionItemMemberProvider()
        expect(s).toBeTruthy();
    });

    it("Disabled", () => {
        const s = new SquirrelCompletionItemMemberProvider()
        const d = new MockTextDocument("");
        const p = new Position(0, 0);
        s.enabled = false;

        expect(s.provideCompletionItems(d, p, t,
            { triggerKind: CompletionTriggerKind.TriggerCharacter, triggerCharacter: "" }
        )).toBeUndefined();
    });

    it("Ignore Trigger", async () => {
        const s = new SquirrelCompletionItemMemberProvider()
        const d = new MockTextDocument("");
        const p = new Position(0, 0);
        const r = { triggerKind: CompletionTriggerKind.TriggerCharacter, triggerCharacter: undefined };
        addProgram(d.uri.path, parse(d.getText()));

        expect(await s.provideCompletionItems(d, p, t, r)).toEqual([]);
    });

    it("Comment", async () => {
        const s = new SquirrelCompletionItemMemberProvider()
        const d = new MockTextDocument("// comment");
        const p = new Position(0, 3);
        const r = { triggerKind: CompletionTriggerKind.TriggerCharacter, triggerCharacter: "." };
        addProgram(d.uri.path, parse(d.getText()));

        expect(await s.provideCompletionItems(d, p, t, r)).toBeUndefined();
    });

    it("Invalid pos", async () => {
        const s = new SquirrelCompletionItemMemberProvider()
        const d = new MockTextDocument("// comment");
        const p = new Position(1, 3);
        const r = { triggerKind: CompletionTriggerKind.TriggerCharacter, triggerCharacter: "." };
        addProgram(d.uri.path, parse(d.getText()));

        expect(await s.provideCompletionItems(d, p, t, r)).toBeUndefined();
    });

    it("Quote start", async () => {
        const s = new SquirrelCompletionItemMemberProvider()
        const d = new MockTextDocument(`"string"`);
        const p = new Position(0, 0);
        const r = { triggerKind: CompletionTriggerKind.TriggerCharacter, triggerCharacter: '"' };
        addProgram(d.uri.path, parse(d.getText()));

        expect(await s.provideCompletionItems(d, p, t, r)).toBeUndefined();
    });

    it("String", async () => {
        const s = new SquirrelCompletionItemMemberProvider()
        const d = new MockTextDocument(`"string"`);
        const p = new Position(0, 3);
        const r = { triggerKind: CompletionTriggerKind.TriggerCharacter, triggerCharacter: '.' };
        addProgram(d.uri.path, parse(d.getText()));

        expect(await s.provideCompletionItems(d, p, t, r)).toBeUndefined();
    });

    it("Integer", async () => {
        const s = new SquirrelCompletionItemMemberProvider()
        const d = new MockTextDocument(`123456`);
        const p = new Position(0, 3);
        const r = { triggerKind: CompletionTriggerKind.TriggerCharacter, triggerCharacter: '.' };
        addProgram(d.uri.path, parse(d.getText()));

        expect(await s.provideCompletionItems(d, p, t, r)).toBeUndefined();
    });

    it("Float", async () => {
        const s = new SquirrelCompletionItemMemberProvider()
        const d = new MockTextDocument(`1.23456`);
        const p = new Position(0, 3);
        const r = { triggerKind: CompletionTriggerKind.TriggerCharacter, triggerCharacter: '.' };
        addProgram(d.uri.path, parse(d.getText()));

        expect(await s.provideCompletionItems(d, p, t, r)).toBeUndefined();
    });

    it("String, After", async () => {
        const s = new SquirrelCompletionItemMemberProvider()
        const d = new MockTextDocument(`"string".`);
        const p = new Position(0, 9);
        const r = { triggerKind: CompletionTriggerKind.TriggerCharacter, triggerCharacter: '.' };
        addProgram(d.uri.path, parse(d.getText()));

        expect(await s.provideCompletionItems(d, p, t, r)).toEqual([]);
    });

    it("Id", async () => {
        const s = new SquirrelCompletionItemMemberProvider()
        const d = new MockTextDocument(`identifier`);
        const p = new Position(0, 3);
        const r = { triggerKind: CompletionTriggerKind.TriggerCharacter, triggerCharacter: '.' };
        addProgram(d.uri.path, parse(d.getText()));

        expect(await s.provideCompletionItems(d, p, t, r)).toEqual([]);
    });

    it("Member", async () => {
        const s = new SquirrelCompletionItemMemberProvider()
        const d = new MockTextDocument(`obj.prop`);
        const p = new Position(0, 5);
        const r = { triggerKind: CompletionTriggerKind.TriggerCharacter, triggerCharacter: '.' };
        addProgram(d.uri.path, parse(d.getText()));

        expect(await s.provideCompletionItems(d, p, t, r)).toEqual([]);
    });

    it("Completion", async () => {
        const s = new SquirrelCompletionItemMemberProvider()
        const d = new MockTextDocument(`local obj = { prop = 123 }; obj.`);
        const p = new Position(0, 32);
        const r = { triggerKind: CompletionTriggerKind.TriggerCharacter, triggerCharacter: '.' };
        addProgram(d.uri.path, parse(d.getText()));

        expect(await s.provideCompletionItems(d, p, t, r)).toHaveLength(1);
    });

    it("Computed", async () => {
        const s = new SquirrelCompletionItemMemberProvider()
        const d = new MockTextDocument(`local obj = { prop = 123 }; obj[""]`);
        const p = new Position(0, 33);
        const r = { triggerKind: CompletionTriggerKind.TriggerCharacter, triggerCharacter: '"' };
        addProgram(d.uri.path, parse(d.getText()));

        expect(await s.provideCompletionItems(d, p, t, r)).toHaveLength(1);
    });

    it("Identifier", async () => {
        const getItems = async (text: string, col?: number) => {
            const s = new SquirrelCompletionItemMemberProvider()
            const d = new MockTextDocument(text);
            const p = new Position(0, col ?? text.length);
            const r = { triggerKind: CompletionTriggerKind.TriggerCharacter, triggerCharacter: "." };
            addProgram(d.uri.path, parse(d.getText()));
            return s.provideCompletionItems(d, p, t, r);
        }

        expect(await getItems("local x = x.")).not.toBeUndefined();
        expect(await getItems("local x.")).toBeUndefined();
        expect(await getItems("function x.")).toBeUndefined();
        expect(await getItems("class x.")).toBeUndefined();
        expect(await getItems("class foo { x. }", 14)).toBeUndefined();
        expect(await getItems("local t = { x. }", 14)).toBeUndefined();
    });

});
