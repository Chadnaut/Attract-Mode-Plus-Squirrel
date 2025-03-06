import { describe, expect, it } from "@jest/globals";
import { SquirrelReferenceProvider } from "../../src/providers/squirrelReferenceProvider";
import { MockTextDocument, parseExtra as parse } from "../utils";
import { CompletionTriggerKind, Position, Event, commands } from "vscode";
import { addProgram } from "../../src/utils/program";

jest.spyOn(commands, "executeCommand").mockImplementation((name, uri): any => {
    return { then: (cb) => { cb(); } };
});

const t = { isCancellationRequested: false, onCancellationRequested: <Event<any>>{} };

describe("SquirrelReferenceProvider", () => {

    it("Creates", () => {
        const s = new SquirrelReferenceProvider()
        expect(s).toBeTruthy();
    });

    it("Disabled", () => {
        const s = new SquirrelReferenceProvider()
        const d = new MockTextDocument("");
        const p = new Position(0, 0);
        s.enabled = false;

        expect(s.provideReferences(d, p, null, t)).toBeUndefined();
    });

    it("String", async () => {
        const s = new SquirrelReferenceProvider()
        const d = new MockTextDocument(`"string"`);
        const p = new Position(0, 3);
        addProgram(d.uri.path, parse(d.getText()));

        expect(await s.provideReferences(d, p, null, t)).toBeUndefined();
    });

    it("Invalid pos", async () => {
        const s = new SquirrelReferenceProvider()
        const d = new MockTextDocument("value");
        const p = new Position(1, 3);
        addProgram(d.uri.path, parse(d.getText()));

        expect(await s.provideReferences(d, p, null, t)).toBeUndefined();
    });

    it("Valid", async () => {
        const s = new SquirrelReferenceProvider()
        const d = new MockTextDocument("value");
        const p = new Position(0, 3);
        addProgram(d.uri.path, parse(d.getText()));

        expect(await s.provideReferences(d, p, null, t)).toHaveLength(1);
    });
});
