import { describe, expect, it } from "@jest/globals";
import { format, dump } from "../utils";

describe("While", () => {
    it("WhileStatement", async () => {
        const response = await format("  while ( 1 ){  a  }");
        expect(response).toBe("while (1) {\n    a;\n}\n");
    });
    it("DoWhileStatement", async () => {
        const response = await format(" do {a}  while ( 1 )");
        expect(response).toBe("do {\n    a;\n} while (1);\n");
    });

});
