import { describe, expect, it } from "@jest/globals";
import { SquirrelDocumentDropEditProvider } from "../../src/providers/squirrelDocumentDropEditProvider";
import { MockTextDocument, parseExtra as parse } from "../utils";
import { CompletionTriggerKind, Position, Event, commands, DataTransfer, Uri } from "vscode";
import { addProgram } from "../../src/utils/program";


import * as utilImport from "../../src/utils/import";
import constants from "../../src/constants";

let relPath = "";
jest.spyOn(utilImport, "getRelativeNutPath").mockImplementation((n): string => relPath);

jest.spyOn(commands, "executeCommand").mockImplementation((name, uri): any => {
    return { then: (cb) => { cb(); } };
});

jest.replaceProperty(constants, "FE_MODULES_PATH", "modules");
jest.mock('../../src/utils/config.ts', () => ({
    ...jest.requireActual('../../src/utils/config.ts'),
    getConfigValue: (name) => {
        switch (name) {
            case constants.ATTRACT_MODE_PATH:
                return "C:/am";
        }
    }
}));

beforeEach(() => {
    relPath = "path";
})

const t = { isCancellationRequested: false, onCancellationRequested: <Event<any>>{} };

describe("SquirrelDocumentDropEditProvider", () => {

    it("Creates", () => {
        const s = new SquirrelDocumentDropEditProvider()
        expect(s).toBeTruthy();
    });

    it("Disabled", () => {
        const s = new SquirrelDocumentDropEditProvider();
        const d = new MockTextDocument("");
        const p = new Position(0, 0);
        const dt = { forEach: () => {} } as unknown as DataTransfer;
        s.enabled = false;

        expect(s.provideDocumentDropEdits(d, p, dt, t)).toBeUndefined();
    });

    it("No Path", async () => {
        const s = new SquirrelDocumentDropEditProvider();
        const d = new MockTextDocument("");
        const p = new Position(0, 0);
        const dt = { forEach: () => {} } as unknown as DataTransfer;
        const program = parse(d.getText());
        addProgram(d.uri.path, program);
        program.sourceName = undefined;

        expect((await s.provideDocumentDropEdits(d, p, dt, t)).insertText).toBe("");
    });

    it("Empty, with source", async () => {
        const s = new SquirrelDocumentDropEditProvider();
        const d = new MockTextDocument("");
        const p = new Position(0, 0);
        const dt = { forEach: () => {} } as unknown as DataTransfer;
        const program = parse(d.getText());
        addProgram(d.uri.path, program);
        relPath = undefined;
        program.sourceName = "mock.nut";

        expect((await s.provideDocumentDropEdits(d, p, dt, t)).insertText).toBe("");
    });

    it("Empty, no source", async () => {
        const s = new SquirrelDocumentDropEditProvider();
        const d = new MockTextDocument("");
        const p = new Position(0, 0);
        const dt = { forEach: () => {} } as unknown as DataTransfer;
        const program = parse(d.getText());
        addProgram(d.uri.path, program);
        relPath = undefined;
        program.sourceName = undefined;

        expect((await s.provideDocumentDropEdits(d, p, dt, t))).toBeUndefined();
    });

    it("Invalid", async () => {
        const s = new SquirrelDocumentDropEditProvider();
        const d = new MockTextDocument("");
        const p = new Position(0, 0);
        const dt = { forEach: (cb) => { cb({value:"C:/mock.txt"}, "text/bad-list"); }
        } as unknown as DataTransfer;
        addProgram(d.uri.path, parse(d.getText()));
        relPath = "C:/";

        expect((await s.provideDocumentDropEdits(d, p, dt, t)).insertText).toBe("");
    });

    it("File", async () => {
        const s = new SquirrelDocumentDropEditProvider();
        const d = new MockTextDocument("");
        const p = new Position(0, 0);
        const dt = { forEach: (cb) => { cb({value:"C:/mock.txt"}, "text/uri-list"); }
        } as unknown as DataTransfer;
        addProgram(d.uri.path, parse(d.getText()));
        relPath = "C:/";

        expect((await s.provideDocumentDropEdits(d, p, dt, t)).insertText).toBe("mock.txt\n");
    });

    it("Module", async () => {
        const s = new SquirrelDocumentDropEditProvider();
        const d = new MockTextDocument("");
        const p = new Position(0, 0);
        const dt = { forEach: (cb) => { cb({value:"C:/am/modules/mock/module.nut"}, "text/uri-list"); }
        } as unknown as DataTransfer;
        addProgram(d.uri.path, parse(d.getText()));
        // relPath = "C:/";

        expect((await s.provideDocumentDropEdits(d, p, dt, t)).insertText).toBe(`fe.load_module("mock")\n`);
    });

    it("Nut", async () => {
        const s = new SquirrelDocumentDropEditProvider();
        const d = new MockTextDocument("");
        const p = new Position(0, 0);
        const dt = { forEach: (cb) => { cb({value:"C:/am/layouts/file.nut"}, "text/uri-list"); }
        } as unknown as DataTransfer;
        addProgram(d.uri.path, parse(d.getText()));
        relPath = "C:/";

        expect((await s.provideDocumentDropEdits(d, p, dt, t)).insertText).toBe(`fe.do_nut("am/layouts/file.nut")\n`);
    });

    it("Image", async () => {
        const s = new SquirrelDocumentDropEditProvider();
        const d = new MockTextDocument("");
        const p = new Position(0, 0);
        const dt = { forEach: (cb) => { cb({value:"C:/am/layouts/image.png"}, "text/uri-list"); }
        } as unknown as DataTransfer;
        addProgram(d.uri.path, parse(d.getText()));
        relPath = "C:/";

        expect((await s.provideDocumentDropEdits(d, p, dt, t)).insertText).toBe(`fe.add_image("am/layouts/image.png")\n`);
    });

    it("Video", async () => {
        const s = new SquirrelDocumentDropEditProvider();
        const d = new MockTextDocument("");
        const p = new Position(0, 0);
        const dt = { forEach: (cb) => { cb({value:"C:/am/layouts/image.avi"}, "text/uri-list"); }
        } as unknown as DataTransfer;
        addProgram(d.uri.path, parse(d.getText()));
        relPath = "C:/";

        expect((await s.provideDocumentDropEdits(d, p, dt, t)).insertText).toBe(`fe.add_image("am/layouts/image.avi")\n`);
    });

    it("Audio", async () => {
        const s = new SquirrelDocumentDropEditProvider();
        const d = new MockTextDocument("");
        const p = new Position(0, 0);
        const dt = { forEach: (cb) => { cb({value:"C:/am/layouts/music.mp3"}, "text/uri-list"); }
        } as unknown as DataTransfer;
        addProgram(d.uri.path, parse(d.getText()));
        relPath = "C:/";

        expect((await s.provideDocumentDropEdits(d, p, dt, t)).insertText).toBe(`fe.add_sound("am/layouts/music.mp3")\n`);
    });

});
