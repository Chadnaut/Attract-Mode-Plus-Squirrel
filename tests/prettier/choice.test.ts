import { describe, expect, it } from "@jest/globals";
import { format, dump, parse } from "../utils";

describe("Choice", () => {

    it("If", async () => {
        const response = await format(" if  ( 1  ) { a }");
        expect(response).toBe("if (1) {\n    a;\n}\n");
    });

    it("If, braceless", async () => {
        const response = await format(" if  ( 1  ) a");
        expect(response).toBe("if (1) a;\n");
    });

    it("If Else", async () => {
        const response = await format(" if  ( 1  ) { a }  else  { b }");
        expect(response).toBe("if (1) {\n    a;\n} else {\n    b;\n}\n");
    });

    it("If Else If", async () => {
        const response = await format(" if  ( 1  ) { a }  else  if ( 2 )  { b }");
        expect(response).toBe("if (1) {\n    a;\n} else if (2) {\n    b;\n}\n");
    });

    it("If Some", async () => {
        const response = await format("if (value_test == 1 || value_test == 2 ) {}");
        expect(response).toBe("if (value_test == 1 || value_test == 2) {\n}\n");
    });

    it("If Many", async () => {
        const response = await format("if (value_test == 1 || value_test == 2 || value_test == 3 || value_test == 4 || value_test == 5 || value_test == 6 || value_test == 7 || value_test == 8) {}");
        expect(response).toBe("if (\n"
            + "    value_test == 1 ||\n"
            + "    value_test == 2 ||\n"
            + "    value_test == 3 ||\n"
            + "    value_test == 4 ||\n"
            + "    value_test == 5 ||\n"
            + "    value_test == 6 ||\n"
            + "    value_test == 7 ||\n"
            + "    value_test == 8\n"
            + ") {\n}\n"
        )
    });

    it("Switch", async () => {
        const response = await format(" switch (x) { case 1:a;case 2:b;}");
        expect(response).toBe("switch (x) {\n    case 1:\n        a;\n    case 2:\n        b;\n}\n");
    });

});
