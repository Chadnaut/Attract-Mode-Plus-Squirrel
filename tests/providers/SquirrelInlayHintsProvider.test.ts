import { describe, expect, it } from "@jest/globals";
import { SquirrelInlayHintsProvider } from "../../src/providers/squirrelInlayHintsProvider";
import { MockTextDocument, parseExtra as parse } from "../utils";
import { CompletionTriggerKind, Position, Event, commands, Range } from "vscode";
import { addProgram } from "../../src/utils/program";

jest.spyOn(commands, "executeCommand").mockImplementation((name, uri): any => {
    return { then: (cb) => { cb(); } };
});

const t = { isCancellationRequested: false, onCancellationRequested: <Event<any>>{} };

describe("SquirrelInlayHintsProvider", () => {

    it("Creates", () => {
        const s = new SquirrelInlayHintsProvider()
        expect(s).toBeTruthy();
    });

    it("Disabled", () => {
        const s = new SquirrelInlayHintsProvider()
        const d = new MockTextDocument("");
        const r = new Range(0, 0, 0, 0);
        s.enabled = false;
        s.enabled = true; // toggle to fire emitter
        s.enabled = false;

        expect(s.provideInlayHints(d, r, t)).toBeUndefined();
    });

    it("Valid", async () => {
        const s = new SquirrelInlayHintsProvider()
        const d = new MockTextDocument("");
        const r = new Range(0, 0, 0, 0);
        addProgram(d.uri.path, parse(d.getText()));

        expect(await s.provideInlayHints(d, r, t)).toHaveLength(0);
    });

});
