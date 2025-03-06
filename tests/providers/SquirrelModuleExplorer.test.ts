import { describe, expect, it } from "@jest/globals";
import { AttractModuleTreeDataProvider, SquirrelModuleExplorer } from "../../src/providers/squirrelModuleExplorer";
import { Uri, commands, window } from "vscode";

const modulePaths = ['a', 'b'];
let info = {};
jest.mock("../../src/utils/module", () => ({
    getModuleInfo: () => info,
    getModulePaths: () => modulePaths,
    trimModuleName: (n) => n
}));

jest.spyOn(commands, "registerCommand").mockImplementation((name, cb): any => {
    cb();
});

jest.spyOn(window, "createTreeView").mockImplementation((name, obj): any => {
    return { dispose: () => {} }
});

beforeEach(() => {
    info = {};
});

describe("SquirrelModuleExplorer", () => {

    it("Creates", () => {
        const s = new SquirrelModuleExplorer()
        expect(s).toBeTruthy();
    });

    it("Disposes", () => {
        const s = new SquirrelModuleExplorer()
        s.dispose();
        expect(s).toBeTruthy();
    });

    it("dataProvider", () => {
        const s = new AttractModuleTreeDataProvider()
        expect(s).toBeTruthy();
    });

    it("getTreeItem", async () => {
        const s = new AttractModuleTreeDataProvider()
        expect(await s.getTreeItem({ label: "label", resource: Uri.parse("mock") })).toBeTruthy();
    });

    it("getChildren", async () => {
        const s = new AttractModuleTreeDataProvider()
        expect(await s.getChildren({ label: "label", resource: Uri.parse("mock") })).toHaveLength(modulePaths.length);
    });

    it("handleDrag", async () => {
        const s = new AttractModuleTreeDataProvider()
        expect(() => s.handleDrag([{ resource: Uri.parse("mock") }] as any, { set: () => {} } as any, null)).not.toThrow();
    });

    it("getTreeItem, description", async () => {
        info = {
            description: "mock",
        }
        const s = new AttractModuleTreeDataProvider()
        expect((await s.getTreeItem({ label: "label", resource: Uri.parse("mock") })).description).toBe("mock");
    });

    it("getTreeItem, version", async () => {
        info = {
            name: "name",
            description: "mock",
            version: "version"
        }
        const s = new AttractModuleTreeDataProvider()
        expect((await s.getTreeItem({ label: "label", resource: Uri.parse("mock") })).description).toBe("version - mock");
    });

});
