import { describe, expect, it } from "@jest/globals";
import { SquirrelHoverDefinitionConfigProvider } from "../../src/providers/squirrelHoverDefinitionConfigProvider";
import { MockTextDocument, parseExtra as parse } from "../utils";
import { Position, Event, commands, Hover } from "vscode";
import { addProgram } from "../../src/utils/program";

let commandItem;
jest.spyOn(commands, "executeCommand").mockImplementation((name, uri): any => {
    return { then: (cb) => { cb(); } };
});
jest.spyOn(commands, "registerCommand").mockImplementation((name, callback): any => {
    return commandItem;
});

beforeEach(() => {
    commandItem = { dispose: () => {} };
})

const t = { isCancellationRequested: false, onCancellationRequested: <Event<any>>{} };

describe("SquirrelHoverDefinitionConfigProvider", () => {

    it("Creates", () => {
        const s = new SquirrelHoverDefinitionConfigProvider()
        expect(s).toBeTruthy();
    });

    it("Disabled", () => {
        const s = new SquirrelHoverDefinitionConfigProvider()
        const d = new MockTextDocument("");
        const p = new Position(0, 3);
        s.enabled = false;
        expect(s.provideHover(d, p, t)).toBeUndefined();
    });

    it("Disposes", () => {
        const s = new SquirrelHoverDefinitionConfigProvider()
        expect(() => s.dispose()).not.toThrow();
    });

    it("Disposes Empty", () => {
        commandItem = null;
        const s = new SquirrelHoverDefinitionConfigProvider()
        expect(() => s.dispose()).not.toThrow();
    });

    it("Empty", async () => {
        const s = new SquirrelHoverDefinitionConfigProvider()
        const d = new MockTextDocument("");
        const p = new Position(0, 3);
        expect(await s.provideHover(d, p, t)).toBeUndefined();
    });

    it("Invalid", async () => {
        const s = new SquirrelHoverDefinitionConfigProvider()
        const d = new MockTextDocument("class foo { prop = 1 }");
        const p = new Position(0, 14);
        addProgram(d.uri.path, parse(d.getText()));
        expect(await s.provideHover(d, p, t)).toBeUndefined();
    });

    it("No Attribute", async () => {
        const s = new SquirrelHoverDefinitionConfigProvider()
        const d = new MockTextDocument("class UserConfig { prop = 1 }");
        const p = new Position(0, 21);
        addProgram(d.uri.path, parse(d.getText()));
        expect(await s.provideHover(d, p, t)).toBeUndefined();
    });

    it("Wrong Attr Prop", async () => {
        const s = new SquirrelHoverDefinitionConfigProvider()
        const d = new MockTextDocument(`class UserConfig { </ name="abc" /> prop = 1 }`);
        const p = new Position(0, 24);
        addProgram(d.uri.path, parse(d.getText()));
        expect(await s.provideHover(d, p, t)).toBeUndefined();
    });

    it("Valid", async () => {
        const s = new SquirrelHoverDefinitionConfigProvider()
        const d = new MockTextDocument(`class UserConfig { </ order=123 /> prop = 1 }`);
        const p = new Position(0, 24);
        addProgram(d.uri.path, parse(d.getText()));
        expect(await s.provideHover(d, p, t)).toBeInstanceOf(Hover);
    });

});
