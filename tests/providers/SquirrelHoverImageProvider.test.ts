import { describe, expect, it } from "@jest/globals";
import { SquirrelHoverImageProvider } from "../../src/providers/squirrelHoverImageProvider";
import { MockTextDocument, parseExtra as parse } from "../utils";
import { CompletionTriggerKind, Position, Event, commands, Hover } from "vscode";
import { addProgram } from "../../src/utils/program";
import { forwardSlash } from "../../src/utils/file";
import * as path from "path";

jest.spyOn(commands, "executeCommand").mockImplementation((name, uri): any => {
    return { then: (cb) => { cb(); } };
});

const t = { isCancellationRequested: false, onCancellationRequested: <Event<any>>{} };

describe("SquirrelHoverImageProvider", () => {

    it("Creates", () => {
        const s = new SquirrelHoverImageProvider()
        expect(s).toBeTruthy();
    });

    it("Disabled", () => {
        const s = new SquirrelHoverImageProvider()
        const d = new MockTextDocument("");
        const p = new Position(0, 0);
        s.enabled = false;

        expect(s.provideHover(d, p, t)).toBeUndefined();
    });

    it("None", async () => {
        const s = new SquirrelHoverImageProvider()
        const d = new MockTextDocument(`"string"`);
        const p = new Position(0, 3);
        addProgram(d.uri.path, parse(d.getText()));

        expect(await s.provideHover(d, p, t)).toBeUndefined();
    });

    it("Valid", async () => {
        const s = new SquirrelHoverImageProvider()
        const d = new MockTextDocument(`"${forwardSlash(path.join(__dirname, "../samples/layout/simple_nut.png"))}"`);
        const p = new Position(0, 3);
        addProgram(d.uri.path, parse(d.getText()));

        expect(await s.provideHover(d, p, t)).toBeInstanceOf(Hover);
    });

});
