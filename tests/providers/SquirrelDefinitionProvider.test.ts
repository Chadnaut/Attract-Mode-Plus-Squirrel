import { describe, expect, it } from "@jest/globals";
import { SquirrelDefinitionProvider } from "../../src/providers/squirrelDefinitionProvider";
import { MockTextDocument, parseExtra as parse } from "../utils";
import { Position, Event, commands } from "vscode";
import { addProgram } from "../../src/utils/program";
import * as utilFind from "../../src/utils/find";
import * as utilImport from "../../src/utils/import";

let isGlobal = false;
jest.spyOn(utilFind, "getBranchProgram").mockImplementation((n): any => isGlobal ? {...n[0]} : n[0]);
jest.spyOn(utilImport, "isProgramGlobal").mockImplementation((n): any => isGlobal);

jest.spyOn(commands, "executeCommand").mockImplementation((name, uri): any => {
    return { then: (cb) => { cb(); } };
});

beforeEach(() => {
    isGlobal = false;
})

const t = { isCancellationRequested: false, onCancellationRequested: <Event<any>>{} };

describe("SquirrelDefinitionProvider", () => {

    it("Creates", () => {
        const s = new SquirrelDefinitionProvider()
        expect(s).toBeTruthy();
    });

    it("Disabled", () => {
        const s = new SquirrelDefinitionProvider()
        const d = new MockTextDocument("");
        const p = new Position(0, 0);
        s.enabled = false;

        expect(s.provideDefinition(d, p, t)).toBeUndefined();
    });

    it("Empty", async () => {
        const s = new SquirrelDefinitionProvider()
        const d = new MockTextDocument("");
        const p = new Position(0, 0);
        addProgram(d.uri.path, parse(d.getText()));

        expect(await s.provideDefinition(d, p, t)).toBeUndefined();
    });

    it("Invalid pos", async () => {
        const s = new SquirrelDefinitionProvider()
        const d = new MockTextDocument("");
        const p = new Position(1, 0);
        addProgram(d.uri.path, parse(d.getText()));

        expect(await s.provideDefinition(d, p, t)).toBeUndefined();
    });

    it("Switch", async () => {
        const s = new SquirrelDefinitionProvider()
        const d = new MockTextDocument("switch (x) { case 1: break; }");
        const p = new Position(0, 15);
        addProgram(d.uri.path, parse(d.getText()));

        expect(await s.provideDefinition(d, p, t)).toHaveLength(1);
    });

    it("Return", async () => {
        const s = new SquirrelDefinitionProvider()
        const d = new MockTextDocument("function foo() { return 123; }");
        const p = new Position(0, 20);
        addProgram(d.uri.path, parse(d.getText()));

        expect(await s.provideDefinition(d, p, t)).toHaveLength(1);
    });

    it("Base", async () => {
        const s = new SquirrelDefinitionProvider()
        const d = new MockTextDocument("function foo() { base; }");
        const p = new Position(0, 19);
        addProgram(d.uri.path, parse(d.getText()));

        expect(await s.provideDefinition(d, p, t)).toBeUndefined();
    });

    it("This", async () => {
        const s = new SquirrelDefinitionProvider()
        const d = new MockTextDocument("function foo() { this; }");
        const p = new Position(0, 19);
        addProgram(d.uri.path, parse(d.getText()));

        expect(await s.provideDefinition(d, p, t)).toBeUndefined();
    });

    it("Rest", async () => {
        const s = new SquirrelDefinitionProvider()
        const d = new MockTextDocument("function foo(...) {}");
        const p = new Position(0, 14);
        addProgram(d.uri.path, parse(d.getText()));

        expect(await s.provideDefinition(d, p, t)).toHaveLength(1);
    });

    it("Global", async () => {
        const s = new SquirrelDefinitionProvider()
        const d = new MockTextDocument("value");
        const p = new Position(0, 0);
        addProgram(d.uri.path, parse(d.getText()));
        isGlobal = true;

        expect(await s.provideDefinition(d, p, t)).toBeUndefined();
    });

    it("Bad Loc", async () => {
        const s = new SquirrelDefinitionProvider()
        const d = new MockTextDocument("local value; value;");
        const p = new Position(0, 15);
        const program = parse(d.getText());
        addProgram(d.uri.path, program);
        program.body[0]["declarations"][0].id = null;
        program.body[0]["declarations"][0].loc = null;

        expect(await s.provideDefinition(d, p, t)).toHaveLength(1);
    });

    it("Valid", async () => {
        const s = new SquirrelDefinitionProvider()
        const d = new MockTextDocument("value");
        const p = new Position(0, 0);
        addProgram(d.uri.path, parse(d.getText()));

        expect(await s.provideDefinition(d, p, t)).toHaveLength(1);
    });
});
