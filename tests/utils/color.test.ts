import { describe, expect, it } from "@jest/globals";
import { dump, MockTextDocument, parseExtra as parse, pos } from "../utils";
import { getBranchAtPos } from "../../src/utils/find";
import { addProgramColorCall, colorToRGB, getNodeColorInformation, getProgramColorInformation } from "../../src/utils/color";
import { Color } from "vscode";

describe("Color", () => {

    it("getProgramColorInformation, invalid", () => {
        const t = new MockTextDocument("");
        expect(getProgramColorInformation(t, undefined).length).toBe(0);
    });

    it("addProgramColorCall, invalid", () => {
        const t = new MockTextDocument("");
        const program = parse(t.getText())
        expect(addProgramColorCall(program, [])).toBeUndefined();
        expect(getProgramColorInformation(t, program).length).toBe(0);
    });

    it("addProgramColorCall", () => {
        const t = new MockTextDocument("call_rgb(0,0,0);");
        const program = parse(t.getText());
        expect(getProgramColorInformation(t, program).length).toBe(1);
    });

    it("getNodeColorInformation, invalid", () => {
        const t = new MockTextDocument("call()");
        const program = parse(t.getText());
        const n = getBranchAtPos(program, pos(2)).slice(0, -1);
        expect(getNodeColorInformation(t, [])).toBeUndefined();
        expect(getNodeColorInformation(t, n)).toBeUndefined();
    });

    it("getNodeColorInformation, none", () => {
        const t = new MockTextDocument("call_rgb();");
        const program = parse(t.getText());
        const n = getBranchAtPos(program, pos(2)).slice(0, -1);
        expect(getNodeColorInformation(t, n).color).toEqual(new Color(0,0,0,1));
    });

    it("getNodeColorInformation, short", () => {
        const t = new MockTextDocument("call_rgb(255,0);");
        const program = parse(t.getText());
        const n = getBranchAtPos(program, pos(2)).slice(0, -1);
        expect(getNodeColorInformation(t, n).color).toEqual(new Color(1,0,0,1));
    });

    it("getNodeColorInformation, bad args", () => {
        const t = new MockTextDocument(`call_rgb("255",0,0);`);
        const program = parse(t.getText());
        const n = getBranchAtPos(program, pos(2)).slice(0, -1);
        expect(getNodeColorInformation(t, n)).toBeUndefined();
    });

    it("getNodeColorInformation", () => {
        const t = new MockTextDocument("call_rgb(255,0,0);");
        const program = parse(t.getText());
        const n = getBranchAtPos(program, pos(2)).slice(0, -1);
        expect(getNodeColorInformation(t, n).color).toEqual(new Color(1,0,0,1));
    });

    it("colorToRGB", () => {
        expect(colorToRGB(new Color(1,0,0,0))).toBe("255, 0, 0");
    });

    it("colorToRGB, format", () => {
        expect(colorToRGB(new Color(1,0,0,0), "0,0,  0")).toBe("255,0,  0");
    });

    it("colorToRGB, end bracket", () => {
        expect(colorToRGB(new Color(1,0,0,0), ")")).toBe("255, 0, 0)");
    });

});
