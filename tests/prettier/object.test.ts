import {
    beforeEach,
    describe,
    fdescribe,
    expect,
    it,
    fit,
    xit,
} from "@jest/globals";
import { format, dump } from "../utils";

describe("Table", () => {
    it("block", () => {
        const response = format(' {  } ');
        expect(response).toBe('{\n}\n');
    });

    it("block, body", () => {
        const response = format(' {  local x = 1; const y = 2; } ');
        expect(response).toBe('{\n    local x = 1;\n    const y = 2;\n}\n');
    });

    it("block, nested", () => {
        const response = format(' { { x = 1 } } ');
        expect(response).toBe('{\n    {\n        x = 1;\n    }\n}\n');
    });

    it("table", () => {
        const response = format('  local  x  = {   y = 1 } ');
        expect(response).toBe('local x = { y = 1 };\n');
    });

    it("json", () => {
        const response = format('  local  x  = {   "y": 1 } ');
        expect(response).toBe('local x = { "y": 1 };\n');
    });

    it("computed", () => {
        const response = format('  local  x  = {   ["x"+"y"] =  1 } ');
        expect(response).toBe('local x = { ["x" + "y"] = 1 };\n');
    });
});
