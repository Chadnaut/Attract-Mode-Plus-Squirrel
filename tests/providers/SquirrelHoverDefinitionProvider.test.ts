import { describe, expect, it } from "@jest/globals";
import { SquirrelHoverDefinitionProvider } from "../../src/providers/squirrelHoverDefinitionProvider";
import { MockTextDocument, parseExtra as parse } from "../utils";
import { CompletionTriggerKind, Position, Event, commands, Hover } from "vscode";
import { addProgram } from "../../src/utils/program";

jest.spyOn(commands, "executeCommand").mockImplementation((name, uri): any => {
    return { then: (cb) => { cb(); } };
});

const t = { isCancellationRequested: false, onCancellationRequested: <Event<any>>{} };

describe("SquirrelHoverDefinitionProvider", () => {

    it("Creates", () => {
        const s = new SquirrelHoverDefinitionProvider()
        expect(s).toBeTruthy();
    });

    it("Disabled", () => {
        const s = new SquirrelHoverDefinitionProvider()
        const d = new MockTextDocument("");
        const p = new Position(0, 3);
        s.enabled = false;

        expect(s.provideHover(d, p, t)).toBeUndefined();
    });

    it("Empty", async () => {
        const s = new SquirrelHoverDefinitionProvider()
        const d = new MockTextDocument("");
        const p = new Position(0, 3);

        expect(await s.provideHover(d, p, t)).toBeUndefined();
    });

    it("Valid", async () => {
        const s = new SquirrelHoverDefinitionProvider()
        const d = new MockTextDocument("foo()");
        const p = new Position(0, 3);
        addProgram(d.uri.path, parse(d.getText()));

        expect(await s.provideHover(d, p, t)).toBeInstanceOf(Hover);
    });

});
