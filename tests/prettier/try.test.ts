import { describe, expect, it } from "@jest/globals";
import { format, dump } from "../utils";

describe("Try", () => {
    it("TryStatement", async () => {
        const response = await format("  try {  a  } catch  (e)  { b }  ");
        expect(response).toBe("try {\n    a;\n} catch (e) {\n    b;\n}\n");
    });

    it("ThrowStatement", async () => {
        const response = await format("  throw   x  ");
        expect(response).toBe("throw x;\n");
    });

});
