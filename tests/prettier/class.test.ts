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

describe("Class", () => {
    it("ClassExpression", () => {
        const response = format("  local  x  =   class{}");
        expect(response).toBe("local x = class {};\n");
    });
    it("ClassDeclaration", () => {
        const response = format("  class foo {}");
        expect(response).toBe("class foo {}\n");
    });
    it("Extends", () => {
        const response = format("  class foo   extends   bar {}");
        expect(response).toBe("class foo extends bar {}\n");
    });
    it("Namespace", () => {
        const response = format("  class foo.bar {} ");
        expect(response).toBe("class foo.bar {}\n");
    });
    it("MethodDefinition", () => {
        const response = format("  class foo { function x(a) {b} } ");
        expect(response).toBe("class foo {\n    function x(a) {\n        b;\n    }\n}\n");
    });
    it("MethodDefinition, static", () => {
        const response = format("  class foo { static function x(a) {b} } ");
        expect(response).toBe("class foo {\n    static function x(a) {\n        b;\n    }\n}\n");
    });
    it("PropertyDefinition", () => {
        const response = format("  class foo { x = 1 } ");
        expect(response).toBe("class foo {\n    x = 1;\n}\n");
    });
    it("PropertyDefinition, computed", () => {
        const response = format('  class foo { ["x"] = 1 } ');
        expect(response).toBe('class foo {\n    ["x"] = 1;\n}\n');
    });
    it("PropertyDefinition, static", () => {
        const response = format('  class foo { static x = 1 } ');
        expect(response).toBe("class foo {\n    static x = 1;\n}\n");
    });
    it("Constructor", () => {
        const response = format('  class foo { constructor  (x) {} } ');
        expect(response).toBe("class foo {\n    constructor(x) {}\n}\n");
    });

});
