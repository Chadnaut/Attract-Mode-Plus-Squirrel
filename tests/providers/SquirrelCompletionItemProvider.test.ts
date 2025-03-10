import { describe, expect, it } from "@jest/globals";
import { SquirrelCompletionItemProvider } from "../../src/providers/squirrelCompletionItemProvider";
import { MockTextDocument, parseForceExtra as parse } from "../utils";
import { CompletionTriggerKind, Position, Event, commands } from "vscode";
import { addProgram } from "../../src/utils/program";

jest.spyOn(commands, "executeCommand").mockImplementation((name, uri): any => {
    return { then: (cb) => { cb(); } };
});

const t = { isCancellationRequested: false, onCancellationRequested: <Event<any>>{} };

describe("SquirrelCompletionItemProvider", () => {

    it("Creates", () => {
        const s = new SquirrelCompletionItemProvider()
        expect(s).toBeTruthy();
    });

    it("Disabled", () => {
        const s = new SquirrelCompletionItemProvider()
        const d = new MockTextDocument("");
        const p = new Position(0, 0);
        s.enabled = false;

        expect(s.provideCompletionItems(d, p, t,
            { triggerKind: CompletionTriggerKind.TriggerCharacter, triggerCharacter: "" }
        )).toBeUndefined();
    });

    it("Valid", async () => {
        const s = new SquirrelCompletionItemProvider()
        const d = new MockTextDocument("");
        const p = new Position(0, 0);
        const r = { triggerKind: CompletionTriggerKind.TriggerCharacter, triggerCharacter: "." };
        addProgram(d.uri.path, parse(d.getText()));

        expect(await s.provideCompletionItems(d, p, t, r)).toBeTruthy();
    });

    it("Identifier", async () => {
        const getItems = async (text: string, col?: number) => {
            const s = new SquirrelCompletionItemProvider()
            const d = new MockTextDocument(text);
            const p = new Position(0, col ?? text.length);
            const r = { triggerKind: CompletionTriggerKind.TriggerCharacter, triggerCharacter: "." };
            addProgram(d.uri.path, parse(d.getText()));
            return s.provideCompletionItems(d, p, t, r);
        }

        expect(await getItems("local x = x")).not.toBeUndefined();
        expect(await getItems("local x")).toBeUndefined();
        expect(await getItems("function x")).toBeUndefined();
        expect(await getItems("class x")).toBeUndefined();
        expect(await getItems("class foo { x }", 13)).toBeUndefined();
        expect(await getItems("local t = { x }", 13)).toBeUndefined();
    });

});
