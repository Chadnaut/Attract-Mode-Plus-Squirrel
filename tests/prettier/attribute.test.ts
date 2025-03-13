import { describe, expect, it } from "@jest/globals";
import { format, dump } from "../utils";

describe("Attribute", () => {

    it("ClassExpression", async () => {
        const response = await format("local x = class </a=1,b=2/> {}");
        expect(response).toBe("local x = class </ a = 1, b = 2 /> {};\n");
    });

    it("ClassExpression, long", async () => {
        const response = await format("local x = class </aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa=1,bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb=2/> {}");
        expect(response).toBe("local x = class\n</\n    aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa = 1,\n    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb = 2\n/>\n{};\n");
    });

    it("Class", async () => {
        const response = await format(" class foo </a=1/> {} ");
        expect(response).toBe("class foo </ a = 1 /> {}\n");
    });

    it("Property", async () => {
        const response = await format(" class foo { </a=1/> x = 1; } ");
        expect(response).toBe("class foo {\n    </ a = 1 />\n    x = 1;\n}\n");
    });

    it("Method", async () => {
        const response = await format(" class foo { </a=1/> function x() {} } ");
        expect(response).toBe("class foo {\n    </ a = 1 />\n    function x() {}\n}\n");
    });

    // -------------------------------------------------------------------------

    it("Class Comments", async () => {
        const response = await format(" class foo /*1*/ </ /*2*/ a=1 /*3*/ /> /*4*/ {} ");
        expect(response).toBe("class foo /*1*/ </ /*2*/ a = 1 /*3*/ /> /*4*/ {}\n");
    });

    it("Func Comments", async () => {
        const response = await format(" class foo { /*1*/ </ /*2*/ a=1 /*3*/ /> /*4*/\n function x() {} } ");
        expect(response).toBe("class foo {\n    /*1*/ </ /*2*/ a = 1 /*3*/ /> /*4*/\n    function x() {}\n}\n");
    });

    it("Prop Comments", async () => {
        const response = await format(" class foo { /*1*/ </ /*2*/ a=1 /*3*/ /> /*4*/\n x = 1 } ");
        expect(response).toBe("class foo {\n    /*1*/ </ /*2*/ a = 1 /*3*/ /> /*4*/\n    x = 1;\n}\n");
    });

    // -------------------------------------------------------------------------

    it("Attr multi line", async () => {
        const options = { attrSingleLine: false };
        const response = await format('class foo { </ aaaaaaaaaaaaa = 1, bbbbbbbbbbbbb = 2, ccccccccccccc = 3, ddddddddddddd = 4 /> function bar() {} }', options);
        expect(response).toBe('class foo {\n    </\n        aaaaaaaaaaaaa = 1,\n        bbbbbbbbbbbbb = 2,\n        ccccccccccccc = 3,\n        ddddddddddddd = 4\n    />\n    function bar() {}\n}\n');
    });

    it("Attr single line", async () => {
        const options = { attrSingleLine: true };
        const response = await format('class foo { </ aaaaaaaaaaaaa = 1, bbbbbbbbbbbbb = 2, ccccccccccccc = 3, ddddddddddddd = 4 /> function bar() {} }', options);
        expect(response).toBe('class foo {\n    </ aaaaaaaaaaaaa = 1, bbbbbbbbbbbbb = 2, ccccccccccccc = 3, ddddddddddddd = 4 />\n    function bar() {}\n}\n');
    });

    // -------------------------------------------------------------------------

    it("Attr multi same line", async () => {
        const options = { attrSingleLine: false, attrSameLine: true };
        const response = await format('class foo { </ aaaaaaaaaaaaa = 1, bbbbbbbbbbbbb = 2, ccccccccccccc = 3, ddddddddddddd = 4 /> key = 123; }', options);
        expect(response).toBe('class foo {\n    </\n        aaaaaaaaaaaaa = 1,\n        bbbbbbbbbbbbb = 2,\n        ccccccccccccc = 3,\n        ddddddddddddd = 4\n    /> key = 123;\n}\n');
    });

    it("Attr single same line", async () => {
        const options = { attrSingleLine: true, attrSameLine: true };
        const response = await format('class foo { </ aaaaaaaaaaaaa = 1, bbbbbbbbbbbbb = 2, ccccccccccccc = 3, ddddddddddddd = 4 /> key = 123; }', options);
        expect(response).toBe('class foo {\n    </ aaaaaaaaaaaaa = 1, bbbbbbbbbbbbb = 2, ccccccccccccc = 3, ddddddddddddd = 4 /> key = 123;\n}\n');
    });

});
