import { describe, expect, it } from "@jest/globals";
import { SquirrelDocumentColorProvider } from "../../src/providers/squirrelDocumentColorProvider";
import { MockTextDocument, parseExtra as parse } from "../utils";
import { Event, commands, Color, Range } from "vscode";
import { addProgram } from "../../src/utils/program";

jest.spyOn(commands, "executeCommand").mockImplementation((name, uri): any => {
    return { then: (cb) => { cb(); } };
});

const t = { isCancellationRequested: false, onCancellationRequested: <Event<any>>{} };

describe("SquirrelDocumentColorProvider", () => {

    it("Creates", () => {
        const s = new SquirrelDocumentColorProvider()
        expect(s).toBeTruthy();
    });

    it("Disabled", () => {
        const s = new SquirrelDocumentColorProvider()
        const d = new MockTextDocument("");
        s.enabled = false;

        expect(s.provideDocumentColors(d, t)).toBeUndefined();
    });

    it("DocColors, none", async () => {
        const s = new SquirrelDocumentColorProvider()
        const d = new MockTextDocument("");
        addProgram(d.uri.path, parse(d.getText()));

        expect(await s.provideDocumentColors(d, t)).toHaveLength(0);
    });

    it("DocColors, one", async () => {
        const s = new SquirrelDocumentColorProvider()
        const d = new MockTextDocument("x.set_rgb()");
        addProgram(d.uri.path, parse(d.getText()));

        expect(await s.provideDocumentColors(d, t)).toHaveLength(1);
    });

    it("Presentations, disabled", () => {
        const s = new SquirrelDocumentColorProvider()
        const d = new MockTextDocument("");
        const c = new Color(0, 0, 0, 0);
        const ctx = { document: d, range: new Range(0, 0, 0, 1) };
        s.enabled = false;

        expect(s.provideColorPresentations(c, ctx, t)).toBeUndefined();
    });

    it("Presentations", async () => {
        const s = new SquirrelDocumentColorProvider()
        const d = new MockTextDocument("");
        const c = new Color(0, 0, 0, 0);
        const ctx = { document: d, range: new Range(0, 0, 0, 1) };

        expect(await s.provideColorPresentations(c, ctx, t)).toHaveLength(1);
    });
});
