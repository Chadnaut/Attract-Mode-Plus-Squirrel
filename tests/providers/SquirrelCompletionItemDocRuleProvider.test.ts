import { describe, expect, it } from "@jest/globals";
import { SquirrelCompletionItemDocRuleProvider } from "../../src/providers/squirrelCompletionItemDocRuleProvider";
import { MockTextDocument, parseExtra as parse } from "../utils";
import { CompletionTriggerKind, Position, Event, commands } from "vscode";
import { addProgram } from "../../src/utils/program";
import constants from "../../src/constants";

jest.spyOn(commands, "executeCommand").mockImplementation((name, uri): any => {
    return { then: (cb) => { cb(); } };
});

let editorRulers = [15];
let printWidth = 10;
jest.replaceProperty(constants, "DOCBLOCK_HR_COUNT", 2);
jest.mock('../../src/utils/config.ts', () => ({
    ...jest.requireActual('../../src/utils/config.ts'),
    getConfigValue: (configSection, defaultValue) => {
        switch (configSection) {
            case "editor.rulers":
                return editorRulers;
            case constants.CODE_FORMATTING_PRINT_WIDTH:
                return printWidth;
            default:
                return false;
        }
    }
}));

beforeEach(() => {
    editorRulers = [15];
    printWidth = 10;
});

const t = { isCancellationRequested: false, onCancellationRequested: <Event<any>>{} };

describe("SquirrelCompletionItemDocRuleProvider", () => {

    it("Creates", () => {
        const s = new SquirrelCompletionItemDocRuleProvider()
        expect(s).toBeTruthy();
    });

    it("Disabled", () => {
        const s = new SquirrelCompletionItemDocRuleProvider()
        const d = new MockTextDocument("");
        const p = new Position(0, 0);
        s.mode = "";

        expect(s.provideCompletionItems(d, p, t,
            { triggerKind: CompletionTriggerKind.TriggerCharacter, triggerCharacter: "" }
        )).toBeUndefined();
    });

    it("Invalid Trigger", () => {
        const s = new SquirrelCompletionItemDocRuleProvider()
        const d = new MockTextDocument("");
        const p = new Position(0, 0);
        const r = { triggerKind: CompletionTriggerKind.TriggerCharacter, triggerCharacter: undefined };
        s.mode = "print";

        expect(s.provideCompletionItems(d, p, t, r)).toBeUndefined();
    });

    it("Empty", async () => {
        const s = new SquirrelCompletionItemDocRuleProvider()
        const d = new MockTextDocument("");
        const p = new Position(0, 0);
        const r = { triggerKind: CompletionTriggerKind.TriggerCharacter, triggerCharacter: "-" };
        addProgram(d.uri.path, parse(d.getText()));
        s.mode = "print";

        expect(await s.provideCompletionItems(d, p, t, r)).toBeUndefined();
    });

    it("No Prefix", async () => {
        const s = new SquirrelCompletionItemDocRuleProvider()
        const d = new MockTextDocument("// -");
        const p = new Position(0, 4);
        const r = { triggerKind: CompletionTriggerKind.TriggerCharacter, triggerCharacter: "-" };
        addProgram(d.uri.path, parse(d.getText()));
        s.mode = "print";

        expect(await s.provideCompletionItems(d, p, t, r)).toBeUndefined();
    });

    it("Full", async () => {
        const s = new SquirrelCompletionItemDocRuleProvider()
        const d = new MockTextDocument("// -------");
        const p = new Position(0, 10);
        const r = { triggerKind: CompletionTriggerKind.TriggerCharacter, triggerCharacter: "-" };
        addProgram(d.uri.path, parse(d.getText()));
        s.mode = "print";

        expect(await s.provideCompletionItems(d, p, t, r)).toBeUndefined();
    });

    it("No comment", async () => {
        const s = new SquirrelCompletionItemDocRuleProvider()
        const d = new MockTextDocument(`"----"`);
        const p = new Position(0, 5);
        const r = { triggerKind: CompletionTriggerKind.TriggerCharacter, triggerCharacter: "-" };
        addProgram(d.uri.path, parse(d.getText()));
        s.mode = "print";

        expect(await s.provideCompletionItems(d, p, t, r)).toBeUndefined();
    });

    it("Invalid, no ruler", async () => {
        const s = new SquirrelCompletionItemDocRuleProvider()
        const d = new MockTextDocument("// --");
        const p = new Position(0, 5);
        const r = { triggerKind: CompletionTriggerKind.TriggerCharacter, triggerCharacter: "-" };
        addProgram(d.uri.path, parse(d.getText()));
        s.mode = "ruler";
        editorRulers = [];

        expect(await s.provideCompletionItems(d, p, t, r)).toBeUndefined();
    });

    it("Invalid, no print", async () => {
        const s = new SquirrelCompletionItemDocRuleProvider()
        const d = new MockTextDocument("// --");
        const p = new Position(0, 5);
        const r = { triggerKind: CompletionTriggerKind.TriggerCharacter, triggerCharacter: "-" };
        addProgram(d.uri.path, parse(d.getText()));
        s.mode = "print";
        printWidth = null;

        expect(await s.provideCompletionItems(d, p, t, r)).toBeUndefined();
    });

    it("Valid, Print", async () => {
        const s = new SquirrelCompletionItemDocRuleProvider()
        const d = new MockTextDocument("// --");
        const p = new Position(0, 5);
        const r = { triggerKind: CompletionTriggerKind.TriggerCharacter, triggerCharacter: "-" };
        addProgram(d.uri.path, parse(d.getText()));
        s.mode = "print";
        printWidth = 10;

        const items = await s.provideCompletionItems(d, p, t, r);
        expect(items).toHaveLength(1);
        expect(items[0].insertText).toBe("-----");
    });

    it("Valid, Ruler", async () => {
        const s = new SquirrelCompletionItemDocRuleProvider()
        const d = new MockTextDocument("// --");
        const p = new Position(0, 5);
        const r = { triggerKind: CompletionTriggerKind.TriggerCharacter, triggerCharacter: "-" };
        addProgram(d.uri.path, parse(d.getText()));
        s.mode = "ruler";
        editorRulers = [15];

        const items = await s.provideCompletionItems(d, p, t, r);
        expect(items).toHaveLength(1);
        expect(items[0].insertText).toBe("----------");
    });

    it("Valid, Insert", async () => {
        const s = new SquirrelCompletionItemDocRuleProvider()
        const d = new MockTextDocument("// --XXXXXX");
        const p = new Position(0, 5);
        const r = { triggerKind: CompletionTriggerKind.TriggerCharacter, triggerCharacter: "-" };
        addProgram(d.uri.path, parse(d.getText()));
        s.mode = "ruler";
        editorRulers = [15];

        const items = await s.provideCompletionItems(d, p, t, r);
        expect(items).toHaveLength(1);
        expect(items[0].insertText).toBe("----");
    });

});
