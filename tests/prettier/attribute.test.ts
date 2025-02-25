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

describe("Attribute", () => {

    it("ClassExpression", () => {
        const response = format("local x = class </a=1,b=2/> {}");
        expect(response).toBe("local x = class </ a = 1, b = 2 /> {};\n");
    });

    it("ClassExpression, long", () => {
        const response = format("local x = class </aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa=1,bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb=2/> {}");
        expect(response).toBe("local x = class\n</\n    aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa = 1,\n    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb = 2\n/>\n{};\n");
    });

    it("Class", () => {
        const response = format(" class foo </a=1/> {} ");
        expect(response).toBe("class foo </ a = 1 /> {}\n");
    });

    it("Property", () => {
        const response = format(" class foo { </a=1/> x = 1; } ");
        expect(response).toBe("class foo {\n    </ a = 1 />\n    x = 1;\n}\n");
    });

    it("Method", () => {
        const response = format(" class foo { </a=1/> function x() {} } ");
        expect(response).toBe("class foo {\n    </ a = 1 />\n    function x() {}\n}\n");
    });

});
