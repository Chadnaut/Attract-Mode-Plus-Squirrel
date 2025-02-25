import { describe, expect, it } from "@jest/globals";
import { parseExtra as parse, pos } from "../utils";
import { getCompletions, getMemberCompletions } from "../../src/utils/completion";
import { getNodeAtPos, getBranchAtPos } from "../../src/utils/find";

describe("Private", () => {

    it("public, self", () => {
        const program = parse("class foo { pub = 1; function bar() { p }};");
        const items = getCompletions(getBranchAtPos(program, pos(39)));
        const values = items.map((item) => item.insertText);
        expect(items.length).toBe(3);
        expect(values).toContain("pub");
        expect(values).toContain("bar");
        expect(values).toContain("foo");
    });

    it("public, instance", () => {
        const program = parse("class foo { pub = 1; }; foo()");
        const items = getMemberCompletions(getBranchAtPos(program, pos(26)));
        const values = items.map((item) => item.insertText);
        expect(items.length).toBe(1);
        expect(values).toContain("pub");
    });

    it("public, base", () => {
        const program = parse("class foo { pub = 1; }; class bar extends foo { function moo() { base } }");
        const items = getMemberCompletions(getBranchAtPos(program, pos(69)));
        const values = items.map((item) => item.insertText);
        expect(items.length).toBe(1);
        expect(values).toContain("pub");
    });

    it("public, extend def", () => {
        const program = parse("class foo { pub = 1; }; class bar extends foo { function moo() { p } }");
        const items = getCompletions(getBranchAtPos(program, pos(66)));
        const values = items.map((item) => item.insertText);
        expect(items.length).toBe(4);
        expect(values).toContain("moo");
        expect(values).toContain("foo");
        expect(values).toContain("bar");
        expect(values).toContain("pub");
    });

    it("public, extend exp", () => {
        const program = parse("local foo = class { pub = 1; }; class bar extends foo { function moo() { p } }");
        const items = getCompletions(getBranchAtPos(program, pos(74)));
        const values = items.map((item) => item.insertText);
        // expect(items.length).toBe(4);
        expect(values).toContain("moo");
        expect(values).toContain("foo");
        expect(values).toContain("bar");
        expect(values).toContain("pub");
    });

    it("public, extend instance", () => {
        const program = parse("class foo { pub = 1; }; class bar extends foo { function moo() { p } }; bar()");
        const items = getMemberCompletions(getBranchAtPos(program, pos(73)));
        const values = items.map((item) => item.insertText);
        expect(items.length).toBe(2);
        expect(values).toContain("moo");
        expect(values).toContain("pub");
    });

    it("public, extended multiple", () => {
        const program = parse("class foo { pub = 1; }; class bar extends foo {} class who extends bar { function moo() { p } }");
        const items = getCompletions(getBranchAtPos(program, pos(91)));
        const values = items.map((item) => item.insertText);
        expect(items.length).toBe(5);
        expect(values).toContain("moo");
        expect(values).toContain("foo");
        expect(values).toContain("who");
        expect(values).toContain("bar");
        expect(values).toContain("pub");
    });

    it("public, extended multiple base", () => {
        const program = parse("class foo { pub = 1; }; class bar extends foo {} class who extends bar { function moo() { base } }");
        const items = getMemberCompletions(getBranchAtPos(program, pos(94)));
        const values = items.map((item) => item.insertText);
        expect(items.length).toBe(1);
        expect(values).toContain("pub");
    });

    // -------------------------------------------------------------------------

    it("private, self", () => {
        const program = parse("class foo { /** @private */ priv = 1; function bar() { p }};");
        const items = getCompletions(getBranchAtPos(program, pos(56)));
        const values = items.map((item) => item.insertText);
        expect(items.length).toBe(3);
        expect(values).toContain("priv");
        expect(values).toContain("bar");
        expect(values).toContain("foo");
    });

    it("private, instance", () => {
        const program = parse("class foo { /** @private */ priv = 1; }; foo()");
        const items = getMemberCompletions(getBranchAtPos(program, pos(43)));
        expect(items.length).toBe(0);
    });

    it("private, base", () => {
        const program = parse("class foo { /** @private */ priv = 1; }; class bar extends foo { function moo() { base } }");
        const items = getMemberCompletions(getBranchAtPos(program, pos(86)));
        expect(items.length).toBe(0);
    });

    it("private, extend def", () => {
        const program = parse("class foo { /** @private */ priv = 1; }; class bar extends foo { function moo() { p } }");
        const items = getCompletions(getBranchAtPos(program, pos(83)));
        const values = items.map((item) => item.insertText);
        expect(items.length).toBe(3);
        expect(values).toContain("moo");
        expect(values).toContain("foo");
        expect(values).toContain("bar");
    });

    it("private, extend exp", () => {
        const program = parse("local foo = class { /** @private */ priv = 1; }; class bar extends foo { function moo() { p } }");
        const items = getCompletions(getBranchAtPos(program, pos(91)));
        const values = items.map((item) => item.insertText);
        expect(items.length).toBe(3);
        expect(values).toContain("moo");
        expect(values).toContain("foo");
        expect(values).toContain("bar");
    });

    it("private, extended instance", () => {
        const program = parse("class foo { /** @private */ priv = 1; }; class bar extends foo { function moo() { p } }; bar()");
        const items = getMemberCompletions(getBranchAtPos(program, pos(91)));
        const values = items.map((item) => item.insertText);
        expect(items.length).toBe(1);
        expect(values).toContain("moo");
    });

    it("private, extended multiple", () => {
        const program = parse("class foo { /** @private */ priv = 1; }; class bar extends foo {} class who extends bar { function moo() { p } }");
        const items = getCompletions(getBranchAtPos(program, pos(108)));
        const values = items.map((item) => item.insertText);
        expect(items.length).toBe(4);
        expect(values).toContain("moo");
        expect(values).toContain("foo");
        expect(values).toContain("who");
        expect(values).toContain("bar");
    });

    it("private, extended multiple base", () => {
        const program = parse("class foo { /** @private */ priv = 1; }; class bar extends foo {} class who extends bar { function moo() { base } }");
        const items = getMemberCompletions(getBranchAtPos(program, pos(111)));
        expect(items.length).toBe(0);
    });

    // -------------------------------------------------------------------------

    it("protected, self", () => {
        const program = parse("class foo { /** @protected */ prot = 1; function bar() { p }};");
        const items = getCompletions(getBranchAtPos(program, pos(58)));
        const values = items.map((item) => item.insertText);
        expect(items.length).toBe(3);
        expect(values).toContain("prot");
        expect(values).toContain("bar");
        expect(values).toContain("foo");
    });

    it("protected, instance", () => {
        const program = parse("class foo { /** @protected */ prot = 1; }; foo().p");
        const items = getCompletions(getBranchAtPos(program, pos(50)));
        expect(items.length).toBe(0);
    });

    it("protected, base", () => {
        const program = parse("class foo { /** @protected */ prot = 1; }; class bar extends foo { function moo() { base } }");
        const items = getMemberCompletions(getBranchAtPos(program, pos(88)));
        const values = items.map((item) => item.insertText);
        expect(items.length).toBe(1);
        expect(values).toContain("prot");
    });

    it("protected, extend def", () => {
        const program = parse("class foo { /** @protected */ prot = 1; }; class bar extends foo { function moo() { p } }");
        const items = getCompletions(getBranchAtPos(program, pos(85)));
        const values = items.map((item) => item.insertText);
        expect(items.length).toBe(4);
        expect(values).toContain("moo");
        expect(values).toContain("foo");
        expect(values).toContain("bar");
        expect(values).toContain("prot");
    });

    it("protected, extend exp", () => {
        const program = parse("local foo = class { /** @protected */ prot = 1; }; class bar extends foo { function moo() { p } }");
        const items = getCompletions(getBranchAtPos(program, pos(93)));
        const values = items.map((item) => item.insertText);
        expect(items.length).toBe(4);
        expect(values).toContain("moo");
        expect(values).toContain("foo");
        expect(values).toContain("bar");
        expect(values).toContain("prot");
    });

    it("protected, extended instance", () => {
        const program = parse("class foo { /** @protected */ prot = 1; }; class bar extends foo { function moo() { p } }; bar()");
        const items = getMemberCompletions(getBranchAtPos(program, pos(93)));
        const values = items.map((item) => item.insertText);
        expect(items.length).toBe(1);
        expect(values).toContain("moo");
    });

    it("protected, extended multiple", () => {
        const program = parse("class foo { /** @protected */ prot = 1; }; class bar extends foo {} class who extends bar { function moo() { p } }");
        const items = getCompletions(getBranchAtPos(program, pos(110)));
        const values = items.map((item) => item.insertText);
        expect(items.length).toBe(5);
        expect(values).toContain("moo");
        expect(values).toContain("foo");
        expect(values).toContain("who");
        expect(values).toContain("bar");
        expect(values).toContain("prot");
    });

    it("protected, extended multiple base", () => {
        const program = parse("class foo { /** @protected */ prot = 1; }; class bar extends foo {} class who extends bar { function moo() { base } }");
        const items = getMemberCompletions(getBranchAtPos(program, pos(113)));
        const values = items.map((item) => item.insertText);
        expect(items.length).toBe(1);
        expect(values).toContain("prot");
    });

    it("protected, extended mixed base", () => {
        const program = parse("class foo { /** @protected */ prot = 1; }; local bar = class extends foo {} class who extends bar { function moo() { base } }");
        const items = getMemberCompletions(getBranchAtPos(program, pos(121)));
        const values = items.map((item) => item.insertText);
        expect(items.length).toBe(1);
        expect(values).toContain("prot");
    });

});
