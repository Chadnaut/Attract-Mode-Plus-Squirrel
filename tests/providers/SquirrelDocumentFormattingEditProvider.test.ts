import { describe, expect, it } from "@jest/globals";
import { SquirrelDocumentFormattingEditProvider } from "../../src/providers/squirrelDocumentFormattingEditProvider";
import { MockTextDocument } from "../utils";
import { Event, commands } from "vscode";

jest.spyOn(commands, "executeCommand").mockImplementation((name, uri): any => {
    return { then: (cb) => { cb(); } };
});

const t = { isCancellationRequested: false, onCancellationRequested: <Event<any>>{} };

describe("SquirrelDocumentFormattingEditProvider", () => {

    it("Creates", () => {
        const s = new SquirrelDocumentFormattingEditProvider()
        expect(s).toBeTruthy();
    });

    it("Disabled", () => {
        const s = new SquirrelDocumentFormattingEditProvider()
        const d = new MockTextDocument("");
        s.enabled = false;
        expect(s.provideDocumentFormattingEdits(d, {} as any, t)).toBeUndefined();
    });

    it("Cancels", async () => {
        const s = new SquirrelDocumentFormattingEditProvider()
        const d = new MockTextDocument("content");
        expect(await s.provideDocumentFormattingEdits(d, {} as any, { isCancellationRequested: true } as any)).toBeUndefined();
    });

    it("Errors", async () => {
        const s = new SquirrelDocumentFormattingEditProvider()
        const d = new MockTextDocument("do {}");

        let error;
        jest.spyOn(console, "error").mockImplementation((...args) => {error = args});

        expect(await s.provideDocumentFormattingEdits(d, {} as any, t)).toBeUndefined();
        expect(error).not.toBeUndefined();
    });

    it("Formats", async () => {
        const s = new SquirrelDocumentFormattingEditProvider()
        const d = new MockTextDocument("mock");

        expect(await s.provideDocumentFormattingEdits(d, {} as any, t)).toHaveLength(1);
    });

});
