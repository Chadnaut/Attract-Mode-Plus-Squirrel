import { describe, expect, it } from "@jest/globals";
import { getCompletions, getMemberCompletions, formatMemberCompletions, formatQuoteCompletions, getCommitCharacters, getCompletionDescription, createNodeArrayCompletions, getTypeMemberCompletions, uniqueCompletions } from "../../src/utils/completion";
import { dump, parseForceExtra as parse, pos } from "../utils";
import { getBranchAtPos } from "../../src/utils/find";
import { SQTree as qt } from "../../src/ast";
import { commands, CompletionItem, CompletionItemKind, CompletionItemTag, Position } from "vscode";
import { addProgramImportName, addProgram, deletePrograms } from "../../src/utils/program";

beforeEach(() => {
    const spyExecuteCommand = jest.spyOn(commands, "executeCommand");
    spyExecuteCommand.mockImplementation((command:string, ...args: any[]) => {
        return new Promise((e) => { e(undefined); });
    });
});

afterEach(() => {
    deletePrograms();
});

describe("Completion", () => {
    it("getCompletions, none", () => {
        const program = parse("v");
        const items = getCompletions(getBranchAtPos(program, pos(1)));
        expect(items.length).toBe(0);
        expect(getCompletions([]).length).toBe(0);
    });

    it("getCompletions, program", () => {
        const program = parse("v");
        const items = getCompletions([program.body[0]["expression"]]);
        expect(items.length).toBe(0);
    });

    it("getCompletions, root", () => {
        const program = parse("::root <- 123; r");
        const items = getCompletions(getBranchAtPos(program, pos(16)));
        expect(items.length).toBe(1);
        expect(items[0].label["label"]).toBe("::root");
        expect(items[0].insertText).toBe("::root"); // <- turn 'r' into '::root'
    });

    it("getCompletions, root prefix", () => {
        const program = parse("::root <- 123; ::");
        const items = getCompletions(getBranchAtPos(program, pos(17)));
        expect(items.length).toBe(1);
        expect(items[0].label["label"]).toBe("::root");
        expect(items[0].insertText).toBe("root"); // <-- turn '::' into '::root'
    });

    it("getCompletions, module", () => {
        const program = parse("/** @package Here */\nlocal xx = { yy = 1}; xx");
        const items = getCompletions(getBranchAtPos(program, qt.Position(2, 23, null)));
        expect(items.length).toBe(1);
        expect(items[0].label["description"]).toBe("Here");
    });

    it("getCompletions, deprecated", () => {
        const program = parse("/** @deprecated */\nlocal xx = { yy = 1}; xx");
        const items = getCompletions(getBranchAtPos(program, qt.Position(2, 23, null)));
        expect(items.length).toBe(1);
        expect(items[0].tags).toContain(CompletionItemTag.Deprecated);
    });

    it("getCompletions, not current declaration", () => {
        const program = parse("local x = 1; local y = x");
        const items = getCompletions(getBranchAtPos(program, pos(24)));
        expect(items.length).toBe(1);
    });

    it("getCompletions, allow outer declaration", () => {
        const program = parse("local foo = function() { local x = 1; local y = x }");
        const items = getCompletions(getBranchAtPos(program, pos(49)));
        expect(items.length).toBe(2);
    });

    it("getCompletions, member", () => {
        const program = parse("obj.prop.");
        const items = getCompletions(getBranchAtPos(program, pos(9)));
        expect(items.length).toBe(0);
    });

    it("getCompletions, single", () => {
        const program = parse("class foo {}; v");
        const items = getCompletions(getBranchAtPos(program, pos(15)));
        expect(items.length).toBe(1);
        expect(items[0].insertText).toBe("foo");
    });

    it("getCompletions, multiple", () => {
        const program = parse("class foo {}; function bar() {}; v");
        const items = getCompletions(getBranchAtPos(program, pos(34)));
        expect(items.length).toBe(2);
        expect(items[0].insertText).toBe("foo");
        expect(items[1].insertText).toBe("bar");
    });

    it("getCompletions, @ignore", () => {
        const program = parse("/** @ignore */ function foo() {}; f");
        const items = getCompletions(getBranchAtPos(program, pos(35)));
        expect(items.length).toBe(0);
    });

    it("getCompletions, not self", () => {
        const program = parse("class a local b = 123;");
        const items = getCompletions(getBranchAtPos(program, pos(7)));
        expect(items.length).toBe(1);
        expect(items[0].insertText).toBe("b");
    });

    it("getCompletions, referenced", () => {
        const progA = parse("function foo() {}; class c {}; root <- 123; local var = 123", { sourcename: "a" });
        const progB = parse("function bar() {} x", { sourcename: "b" });
        addProgramImportName(progB, "a")

        addProgram("a", progA);
        addProgram("b", progB);
        const items = getCompletions(getBranchAtPos(progB, pos(19)));
        const values = items.map((item) => item.insertText);
        expect(values.length).toBe(4);
        expect(values).toContain("foo");
        expect(values).toContain("c");
        expect(values).toContain("root");
        expect(values).toContain("bar");
    });

    it("getCompletions, root capture", () => {
        const program = parse("root <- 123; :: \n root");
        const items = getCompletions(getBranchAtPos(program, pos(15)));
        expect(items.length).toBe(1);
    });

    // -------------------------------------------------------------------------

    it("getMemberCompletions, undefined", () => {
        const program = parse("{}");
        const items = getMemberCompletions(getBranchAtPos(program, pos(1)));

        expect(items.length).toBe(0);
        expect(getMemberCompletions([]).length).toBe(0);
    });

    it("getMemberCompletions, none", () => {
        const program = parse("local a = 1; a");
        const items = getMemberCompletions(getBranchAtPos(program, pos(14)));
        expect(items.length).toBe(0);
    });

    it("getMemberCompletions, function return", () => {
        const program = parse("function foo() { return { a = 1 }; } foo()");
        const items = getMemberCompletions(getBranchAtPos(program, pos(42)));
        expect(items.length).toBe(1);
    });

    it("getMemberCompletions, multiple", () => {
        const program = parse("local a = { x = 1, y = 2 }; a");
        const items = getMemberCompletions(getBranchAtPos(program, pos(29)));
        expect(items.length).toBe(2);
        expect(items[0].insertText).toBe("x");
        expect(items[1].insertText).toBe("y");
    });

    it("getMemberCompletions, class none", () => {
        const program = parse("class foo { }; local f = foo(); f");
        const items = getMemberCompletions(getBranchAtPos(program, pos(33)));
        expect(items.length).toBe(0);
    });

    it("getMemberCompletions, class copy", () => {
        const program = parse("class foo { }; local f = foo; f");
        const items = getMemberCompletions(getBranchAtPos(program, pos(31)));
        expect(items.length).toBe(0);
    });

    it("getMemberCompletions, class body", () => {
        const program = parse("class foo { bar = 123; function moo() { this. }};");
        const items = getMemberCompletions(getBranchAtPos(program, pos(44)));
        expect(items.length).toBe(2);
    });

    it("getMemberCompletions, class override", () => {
        const program = parse("class foo { bar = 123; } class moo extends foo { bar = 456; } moo().");
        const items = getMemberCompletions(getBranchAtPos(program, pos(67)));
        expect(items.length).toBe(1); // both have bar, should override
    });

    it("getMemberCompletions, class constructor", () => {
        const program = parse("class foo { bar = 123; constructor() {} function moo() { this. }};");
        const items = getMemberCompletions(getBranchAtPos(program, pos(61)));
        expect(items.length).toBe(2); // omit constructor
    });

    it("getMemberCompletions, public", () => {
        const program = parse("class foo { p = 1 }; local f = foo(); f");
        const items = getMemberCompletions(getBranchAtPos(program, pos(39)));
        expect(items.length).toBe(1);
        expect(items[0].insertText).toBe("p");
    });

    it("getMemberCompletions, LambdaExpression", () => {
        const program = parse("local foo = @() 123; foo");
        const items = getMemberCompletions(getBranchAtPos(program, pos(25)));
        expect(items.length).toBe(0);
    });

    it("getMemberCompletions, MethodDefinition", () => {
        const program = parse("class foo { function bar() {} }; foo().bar");
        const items = getMemberCompletions(getBranchAtPos(program, pos(42)));
        expect(items.length).toBe(0);
    });

    it("getMemberCompletions, FunctionDeclaration", () => {
        const program = parse("function foo() {} foo");
        const items = getMemberCompletions(getBranchAtPos(program, pos(21)));
        expect(items.length).toBe(0);
    });

    it("getMemberCompletions, FunctionExpression", () => {
        const program = parse("local foo = function() {}; foo");
        const items = getMemberCompletions(getBranchAtPos(program, pos(28)));
        expect(items.length).toBe(0);
    });

    it("getMemberCompletions, base", () => {
        const program = parse("class foo { x = 123 } class bar extends foo { constructor() { base } }");
        const items = getMemberCompletions(getBranchAtPos(program, pos(66)));
        expect(items.length).toBe(1);
        expect(items[0].insertText).toBe("x");
    });

    it("getMemberCompletions, lambda", () => {
        const program = parse("local foo = @() 123; foo");
        const items = getMemberCompletions(getBranchAtPos(program, pos(24)));
        expect(items.length).toBe(0);
    });

    it("getMemberCompletions, array", () => {
        const program = parse("class foo { bar = 123 }; local f = [foo()]; f[0].");
        const items = getMemberCompletions(getBranchAtPos(program, pos(48)));
        expect(items.length).toBe(1);
        expect(items[0].insertText).toBe('bar');
    });

    it("getMemberCompletions, array index", () => {
        const program = parse("local arr = [{ x = 1 }]; arr[0].");
        const items = getMemberCompletions(getBranchAtPos(program, pos(31)));
        expect(items.length).toBe(1);
        expect(items[0].insertText).toBe('x');
    });

    it("getMemberCompletions, array key", () => {
        const program = parse(`local arr = [{ x = 1 }, { y = 1 }]; arr["0"].`);
        const items = getMemberCompletions(getBranchAtPos(program, pos(44)));
        expect(items.length).toBe(1);
        expect(items[0].insertText).toBe('y');
    });

    it("getMemberCompletions, type self", () => {
        const program = parse("/** @type {foo} */ class foo { bar = 123 }; foo()");
        const items = getMemberCompletions(getBranchAtPos(program, pos(49)));
        expect(items.length).toBe(1);
        expect(items[0].insertText).toBe('bar');
    });

    it("getCompletions, type self overload class", () => {
        const program = parse("/** @type {foo} */ class foo { bar = 123; bar = 456; bar = 789; }; foo()");
        const items = getCompletions(getBranchAtPos(program, pos(72)));
        expect(items.length).toBe(0);
    });

    it("getMemberCompletions, type self overload class", () => {
        const program = parse("/** @type {foo} */ class foo { bar = 123; bar = 456; bar = 789; }; foo()");
        const items = getMemberCompletions(getBranchAtPos(program, pos(72)));
        expect(items.length).toBe(1);
    });

    it("getMemberCompletions, type self overload table", () => {
        const program = parse("/** @type {foo} */ local foo = { bar = 123, bar = 456, bar = 789 }; foo");
        const items = getMemberCompletions(getBranchAtPos(program, pos(71)));
        expect(items.length).toBe(1);
    });

    it("getMemberCompletions, type with extends", () => {
        const program = parse("/** @type {foo} */ class foo { function bar() {} } /** @returns {foo} */ function moo() {} local x = moo(); x");
        const b = getBranchAtPos(program, pos(109));

        // @returns is followed by resolveNodeVal
        // - both `getMemberCompletions` and `getTypeMemberCompletions` return same result

        const items1 = getMemberCompletions(b);
        expect(items1.length).toBe(1);
        expect(items1[0].insertText).toBe("bar");

        const items2 = getTypeMemberCompletions(b);
        expect(items2.length).toBe(1);
        expect(items2[0].insertText).toBe("bar");

        let items3 = uniqueCompletions([...items1, ...items2]);
        expect(items3.length).toBe(1);
    });

    it("getMemberCompletions, type array class", () => {
        const program = parse("/** @lends */ class Instance { function len() {} }; /** @type {foo} */ class foo { function bar() {} } local x = [foo]; x[0]");
        const b = getBranchAtPos(program, pos(124));

        const items1 = getMemberCompletions(b);
        expect(items1.length).toBe(1);
        expect(items1[0].insertText).toBe("bar");

        const items2 = getTypeMemberCompletions(b);
        expect(items2.length).toBe(0); // <-- fixed, was 1
        // expect(items2[0].insertText).toBe("bar");

        // let items3 = uniqueCompletions([...items1, ...items2]);
        // expect(items3.length).toBe(1);
    });

    // -------------------------------------------------------------------------

    it("getMemberCompletions, overloads", () => {
        const program = parse(`
        class foo {
            function bar(a) {}
            function bar(a,b) {}
            function bar(a,b,c) {}
        }
        `);
        const items = getMemberCompletions(getBranchAtPos(program, qt.Position(2, 15, 0)));
        expect(items.length).toBe(1); // do not show overload completions
        expect(items[0].insertText).toBe('bar');
    });

    // -------------------------------------------------------------------------

    it("formatQuoteCompletions, quoted", () => {
        const items = [{ insertText: '"quoted"' } as CompletionItem];
        const quoted = formatQuoteCompletions(items);
        expect(quoted[0].insertText).toBe('quoted');
    });

    // -------------------------------------------------------------------------

    it("formatMemberCompletions, valid", () => {
        const items = [{ insertText: "\"valid\"" } as CompletionItem];
        const pos = new Position(10, 10);
        const quoted = formatMemberCompletions(items, pos);
        expect(quoted[0].insertText).toBe('valid');
    });

    it("formatMemberCompletions, computed", () => {
        const items = [{ insertText: "\"in valid\"" } as CompletionItem];
        const pos = new Position(10, 10);
        const quoted = formatMemberCompletions(items, pos);
        expect(quoted[0].insertText).toBe('["in valid"]');
    });

    // -------------------------------------------------------------------------


    // -------------------------------------------------------------------------

    it("getCommitCharacters", () => {
        expect(getCommitCharacters(undefined)).toEqual([]);
        expect(getCommitCharacters(CompletionItemKind.Color)).toEqual([]);

        expect(getCommitCharacters(CompletionItemKind.Event)).toEqual(["]"]);
        expect(getCommitCharacters(CompletionItemKind.Class)).toEqual([".", "("]);
        expect(getCommitCharacters(CompletionItemKind.Method)).toEqual([".", "("]);
        expect(getCommitCharacters(CompletionItemKind.Property)).toEqual([".", "("]);
        expect(getCommitCharacters(CompletionItemKind.Field)).toEqual([".", "("]);
        expect(getCommitCharacters(CompletionItemKind.Function)).toEqual([".", "("]);
        expect(getCommitCharacters(CompletionItemKind.Variable)).toEqual([".", "("]);
        expect(getCommitCharacters(CompletionItemKind.Constructor)).toEqual(["("]);
        expect(getCommitCharacters(CompletionItemKind.Enum)).toEqual(["."]);
        expect(getCommitCharacters(CompletionItemKind.EnumMember)).toEqual(["."]);
        expect(getCommitCharacters(CompletionItemKind.Constant)).toEqual(["."]);
    });

    // -------------------------------------------------------------------------

    it("getCompletionDescription, module", () => {
        const program = parse("/** @package mock */");
        expect(getCompletionDescription(program)).toEqual("mock");
    });

    it("getCompletionDescription, path", () => {
        const program = parse("", { sourcename: "path/here/subdir" });
        const targetProgram = parse("", { sourcename: "path/here" });
        expect(getCompletionDescription(program, targetProgram)).toEqual("subdir");
    });

    it("getCompletionDescription, file", () => {
        const program = parse("", { sourcename: "path/here/file.nut" });
        const targetProgram = parse("", { sourcename: "path/here" });
        expect(getCompletionDescription(program, targetProgram)).toEqual("file.nut");
    });

    it("getCompletionDescription, folder", () => {
        const program1 = parse("", { sourcename: "path/here/layout.nut" });
        expect(getCompletionDescription(program1)).toEqual("here");

        const program2 = parse("", { sourcename: "path/here/module.nut" });
        expect(getCompletionDescription(program2)).toEqual("here");

        const program3 = parse("", { sourcename: "path/here/plugin.nut" });
        expect(getCompletionDescription(program3)).toEqual("here");
    });

    // -------------------------------------------------------------------------

    it("createNodeArrayCompletions", () => {
        const program = parse(`local arr = ["a","b","c"];`);
        const completions = createNodeArrayCompletions("arr", program);
        expect(completions.length).toBe(3);
    });

    it("createNodeArrayCompletions, invalid", () => {
        const program = parse(`local arr = ["a","b","c"];`);
        const completions = createNodeArrayCompletions("", program);
        expect(completions.length).toBe(0);
    });

});
