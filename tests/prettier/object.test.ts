import { describe, expect, it } from "@jest/globals";
import { format, dump } from "../utils";

describe("Table", () => {
    it("block", async () => {
        const response = await format(' {  } ');
        expect(response).toBe('{\n}\n');
    });

    it("block, body", async () => {
        const response = await format(' {  local x = 1; const y = 2; } ');
        expect(response).toBe('{\n    local x = 1;\n    const y = 2;\n}\n');
    });

    it("block, nested", async () => {
        const response = await format(' { { x = 1 } } ');
        expect(response).toBe('{\n    {\n        x = 1;\n    }\n}\n');
    });

    it("table", async () => {
        const response = await format('  local  x  = {   y = 1 } ');
        expect(response).toBe('local x = { y = 1 };\n');
    });

    it("json", async () => {
        const response = await format('  local  x  = {   "y": 1 } ');
        expect(response).toBe('local x = { "y": 1 };\n');
    });

    it("computed", async () => {
        const response = await format('  local  x  = {   ["x"+"y"] =  1 } ');
        expect(response).toBe('local x = { ["x" + "y"] = 1 };\n');
    });
});
