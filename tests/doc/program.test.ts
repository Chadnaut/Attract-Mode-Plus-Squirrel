import { describe, expect, it } from "@jest/globals";
import { parseExtra as parse, pos } from "../utils";
import { getDocCompletionsAtPos, getDocProgramCompletions } from "../../src/doc/completion";
import constants from "../../src/constants";
import { AST } from "../../src/ast";
import * as path from "path";
import { addProgramImportName, addProgramModuleName, addProgram } from "../../src/utils/program";

jest.replaceProperty(constants, "FE_MODULES_PATH", "modules");
jest.replaceProperty(constants, "FE_LAYOUTS_PATH", "tests");
jest.mock('../../src/utils/config.ts', () => ({
    ...jest.requireActual('../../src/utils/config.ts'),
    getConfigValue: (name) => {
        switch (name) {
            case constants.ATTRACT_MODE_PATH:
                return "";
            case constants.PACKAGE_AUTHOR:
                return "mock_author";
            case constants.PACKAGE_URL:
                return "mock_url";
            default:
                return path.join(__dirname, "../samples")
        }
    }
}));

describe("Doc Program Completion", () => {

    it("getDocCompletionsAtPos", () => {
        const program = parse("");
        expect(getDocCompletionsAtPos(program, pos(0))).toBeTruthy();
        expect(getDocCompletionsAtPos(program, pos(3))).toBeTruthy();
    });

    it("getDocProgramCompletions, modules", () => {
        const program = <AST.Program>{ sourceName: "mockProgram" };

        const mockModule = <AST.Program>{ sourceName: "mockModule" };
        const core = <AST.Program>{ sourceName: "core" };
        addProgram("modules/mockModule", mockModule);
        addProgram("modules/core", core);

        addProgramImportName(program, "modules/mockModule");
        addProgramModuleName(program, "modules/mockModule");
        addProgramImportName(program, "modules/core");
        addProgramModuleName(program, "modules/core");

        const value = getDocProgramCompletions(program)[0].insertText["value"];
        expect(value).toContain("@requires");
        expect(value).toContain("@module core (Included with AM)");
        expect(value).toContain("@module mockModule");
        expect(value.indexOf("@module core")).toBeLessThan(value.indexOf("@module mockModule"));
    });

    it("getDocCompletionsAtPos, boilerplate", () => {
        const program = parse(``);
        const value = getDocCompletionsAtPos(program, pos(3))[0].insertText["value"];
        expect(value).toContain("@summary A short description.");
        expect(value).toContain("@version 0.0.1");
        expect(value).toContain("@author mock_author");
        expect(value).toContain("@url mock_url");
    });

    it("getDocCompletionsAtPos, artwork", () => {
        const program = parse(`fe.add_artwork("art1"); fe.add_artwork("art2")`);
        const value = getDocCompletionsAtPos(program, pos(3))[0].insertText["value"];
        expect(value).toContain("@requires");
        expect(value).toContain("@artwork art1, art2");
    });

});
