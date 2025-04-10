import { describe, expect, it } from "@jest/globals";
import { SquirrelCompletionItemMemberProvider } from "../../src/providers/squirrelCompletionItemMemberProvider";
import { MockTextDocument, parseForceExtra as parse } from "../utils";
import { CompletionTriggerKind, Position, Event, commands } from "vscode";
import { addProgram } from "../../src/utils/program";

jest.spyOn(commands, "executeCommand").mockImplementation((name, uri): any => {
    return { then: (cb) => { cb(); } };
});

const t = { isCancellationRequested: false, onCancellationRequested: <Event<any>>{} };

const getItems = async (text: string, col?: number) => {
    const s = new SquirrelCompletionItemMemberProvider()
    const d = new MockTextDocument(text);
    const p = new Position(0, col ?? text.length);
    const r = { triggerKind: CompletionTriggerKind.TriggerCharacter, triggerCharacter: "." };
    addProgram(d.uri.path, parse(d.getText()));
    return s.provideCompletionItems(d, p, t, r);
}

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

        // no branch
        expect(await s.provideCompletionItems(d, p, t, r)).toBeUndefined();
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

    it("Computed, opening quote", async () => {
        const s = new SquirrelCompletionItemMemberProvider()
        const d = new MockTextDocument(`local obj = { prop = 123 }; obj[""]`);
        const p = new Position(0, 33); // opening quote
        const r = { triggerKind: CompletionTriggerKind.TriggerCharacter, triggerCharacter: '"' };
        addProgram(d.uri.path, parse(d.getText()));

        expect(await s.provideCompletionItems(d, p, t, r)).toHaveLength(1);
    });

    it("Computed, not opening quote", async () => {
        const s = new SquirrelCompletionItemMemberProvider()
        const d = new MockTextDocument(`local obj = { prop = 123 }; obj[""]`);
        const p = new Position(0, 34); // NOT opening quote
        const r = { triggerKind: CompletionTriggerKind.TriggerCharacter, triggerCharacter: '"' };
        addProgram(d.uri.path, parse(d.getText()));

        expect(await s.provideCompletionItems(d, p, t, r)).toBeUndefined();
    });

    it("Period", async () => {
        expect(await getItems(".")).toBeUndefined();
    });

    it("Const Identifier", async () => {
        expect(await getItems("const x")).toBeUndefined();
    });

    it("Const Identifier Member", async () => {
        // property gets parse as a StringLiteral. then rejected early
        expect(await getItems("const x.")).toBeUndefined();
    });

    it("Local Identifier", async () => {
        expect(await getItems("local x")).toBeUndefined();
    });

    it("Local Identifier Member", async () => {
        expect(await getItems("local x.")).toBeUndefined();
    });

    it("Enum Identifier", async () => {
        expect(await getItems("enum x")).toBeUndefined();
    });

    it("Enum Identifier Member", async () => {
        expect(await getItems("enum x.")).toBeUndefined();
    });

    it("Function Identifier", async () => {
        expect(await getItems("function x")).toBeUndefined();
    });

    it("Function Identifier Member", async () => {
        expect(await getItems("function x.")).toBeUndefined();
    });

    it("Function Param", async () => {
        expect(await getItems("function x (y) {}", 13)).toBeUndefined();
    });

    it("Function Expression Param", async () => {
        expect(await getItems("local x = function (y) {}", 21)).toBeUndefined();
    });

    it("Class Identifier", async () => {
        expect(await getItems("class x")).toBeUndefined();
    });

    it("Class Identifier Member", async () => {
        expect(await getItems("class x.")).toBeUndefined();
    });

    it("PropertyDefinition", async () => {
        expect(await getItems("class foo { x }", 13)).toBeUndefined();
    });

    it("PropertyDefinition Member", async () => {
        expect(await getItems("class foo { x. }", 14)).toBeUndefined();
    });

    it("MemberDefinition Identifier", async () => {
        expect(await getItems("class foo { function x() {} }", 22)).toBeUndefined();
    });

    it("Table Key", async () => {
        expect(await getItems("local t = { x }", 13)).toBeUndefined();
    });

    it("Table Key Member", async () => {
        expect(await getItems("local t = { x. }", 14)).toBeUndefined();
    });

    it("Identifier", async () => {
        expect(await getItems("x")).toBeUndefined();
    });

    it("Local Init", async () => {
        // undefined this is a regular completion, not a member completion!
        expect(await getItems("local xyz = 123; local t = x")).toBeUndefined();
    });

    it("Local Init Member", async () => {
        const items = await getItems("local x = { y = 123 } local t = x.");
        expect(items).toHaveLength(1);
        expect(items[0].label["label"]).toBe("y");
    });

    it("Local Init Member Deep", async () => {
        const items = await getItems("local x = { y = { z = 123 } } } local t = x.y.");
        expect(items).toHaveLength(1);
        expect(items[0].label["label"]).toBe("z");
    });

    it("Member", async () => {
        const items = await getItems("local x = { y = 123 }; x.");
        expect(items).toHaveLength(1);
        expect(items[0].label["label"]).toBe("y");
    });

    it("Member Arr", async () => {
        const items = await getItems("local x = [{ y = 123 }]; x[0].",);
        expect(items).toHaveLength(1);
        expect(items[0].label["label"]).toBe("y");
    });

    it("Lends Array", async () => {
        const items = await getItems("/** @lends */ class ArrayExpression { function len1() {} }; /** @lends */ class StringLiteral { function len2() {} }; /** @type {array(string)} */ local x = []; x.");
        expect(items).toHaveLength(1);
        expect(items[0].label["label"]).toBe("len1");
    });

    it("Lends Array Element", async () => {
        const items = await getItems(`/** @lends */ class StringLiteral { function len2() {} }; local x = ["abc"]; x[0].`);
        expect(items).toHaveLength(1);
        expect(items[0].label["label"]).toBe("len2");
    });

    it("Lends Typed Array Element", async () => {
        const items = await getItems("/** @lends */ class ArrayExpression { function len1() {} }; /** @lends */ class StringLiteral { function len2() {} }; /** @type {array(string)} */ local x = []; x[0].");
        expect(items).toHaveLength(1);
        expect(items[0].label["label"]).toBe("len2");
    });

    it("Lends String", async () => {
        const items = await getItems(`/** @lends */ class StringLiteral { function len1() {} }; "abc".`);
        expect(items).toHaveLength(1);
        expect(items[0].label["label"]).toBe("len1");
    });

    it("Lends Array Element String", async () => {
        const items = await getItems(`/** @lends */ class StringLiteral { function len1() {} }; local x = ["abc"] x[0].`);
        expect(items).toHaveLength(1);
        expect(items[0].label["label"]).toBe("len1");
    });

    it("Class Real Prop", async () => {
        const items = await getItems("class foo { a = 1; b = 2 }; local f = foo(); f.a. f.b", 49);
        expect(items).toHaveLength(0);
    });

    it("Class Type Prop", async () => {
        const items = await getItems("class foo { a = 1; b = 2 }; /** @type {foo} */ local f; f.a. f.b", 60);
        expect(items).toHaveLength(0);
    });

    it("Class Type Prop Table", async () => {
        const items = await getItems("class foo { a = { b = 123 } }; /** @type {foo} */ local f; f.a.");
        expect(items).toHaveLength(1);
    });

    it("Class Real Prop Lends", async () => {
        const items = await getItems("/** @lends */ class IntegerLiteral { function mock() {} } class foo { a = 1; b = 2 }; local f = foo(); f.a. f.b", 107);
        expect(items).toHaveLength(1);
        expect(items[0].label["label"]).toBe("mock");
    });

    it("Class Type Prop Lends", async () => {
        const items = await getItems("/** @lends */ class IntegerLiteral { function mock() {} } class foo { a = 1; b = 2 }; /** @type {foo} */ local f; f.a. f.b", 118);
        expect(items).toHaveLength(1);
        expect(items[0].label["label"]).toBe("mock");
    });

    it("Member After", async () => {
        const items = await getItems("local x = { y = 123 }; x.y; x.");
        expect(items).toHaveLength(1);
        expect(items[0].label["label"]).toBe("y");
    });

    it("Member Between", async () => {
        const items = await getItems("local x = { y = 123 }; x. x.y;", 25);
        expect(items).toHaveLength(1);
        expect(items[0].label["label"]).toBe("y");
    });

    it("Member Between Single", async () => {
        const items = await getItems("local x = { y = { z = 123 } }; x.y. x", 35);
        expect(items).toHaveLength(1);
        expect(items[0].label["label"]).toBe("z");
    });

    it("Member Between Deep", async () => {
        const items = await getItems("local x = { y = { z = 123 } }; x.y. x.y.z;", 35);
        expect(items).toHaveLength(1);
        expect(items[0].label["label"]).toBe("z");
    });

    it("Member Between Misc", async () => {
        const items = await getItems("local x = { y = 123 }; x. local z = 123;", 25);
        expect(items).toHaveLength(1);
        expect(items[0].label["label"]).toBe("y");
    });

    it("Array Element Table", async () => {
        const items = await getItems("local arr = [{x=123}]; arr[0].");
        expect(items).toHaveLength(1);
        expect(items[0].label["label"]).toBe("x");
    });

    it("Array Element Table Between", async () => {
        const items = await getItems("local arr = [{x=123}]; arr[0]. arr[1]", 30);
        expect(items).toHaveLength(1);
        expect(items[0].label["label"]).toBe("x");
    });

    it("Const Init", async () => {
        // cannot assign var to const
        // - `x` gets parsed as a StringLiteral, since const expects scalar
        // - then it gets rejected early for being a string
        expect(await getItems("const t = x")).toBeUndefined();
    });

    it("Const Init Member", async () => {
        // incorrectly parsed as member expression
        // - const is obj, "" as prop
        expect(await getItems("const t = x.")).toBeUndefined();
    });

});
