import { describe, expect, it } from "@jest/globals";
import { format, dump } from "../utils";

describe("Class", () => {
    it("ClassExpression", async () => {
        const response = await format("  local  x  =   class{}");
        expect(response).toBe("local x = class {};\n");
    });
    it("ClassDeclaration", async () => {
        const response = await format("  class foo {}");
        expect(response).toBe("class foo {}\n");
    });
    it("Extends", async () => {
        const response = await format("  class foo   extends   bar {}");
        expect(response).toBe("class foo extends bar {}\n");
    });
    it("Namespace", async () => {
        const response = await format("  class foo.bar {} ");
        expect(response).toBe("class foo.bar {}\n");
    });
    it("MethodDefinition", async () => {
        const response = await format("  class foo { function x(a) {b} } ");
        expect(response).toBe("class foo {\n    function x(a) {\n        b;\n    }\n}\n");
    });
    it("MethodDefinition, static", async () => {
        const response = await format("  class foo { static function x(a) {b} } ");
        expect(response).toBe("class foo {\n    static function x(a) {\n        b;\n    }\n}\n");
    });
    it("PropertyDefinition", async () => {
        const response = await format("  class foo { x = 1 } ");
        expect(response).toBe("class foo {\n    x = 1;\n}\n");
    });
    it("PropertyDefinition, computed", async () => {
        const response = await format('  class foo { ["x"] = 1 } ');
        expect(response).toBe('class foo {\n    ["x"] = 1;\n}\n');
    });
    it("PropertyDefinition, static", async () => {
        const response = await format('  class foo { static x = 1 } ');
        expect(response).toBe("class foo {\n    static x = 1;\n}\n");
    });
    it("Constructor", async () => {
        const response = await format('  class foo { constructor  (x) {} } ');
        expect(response).toBe("class foo {\n    constructor(x) {}\n}\n");
    });

});
