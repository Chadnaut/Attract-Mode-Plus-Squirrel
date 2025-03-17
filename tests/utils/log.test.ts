import { getLogLinks } from './../../src/utils/log';
import { describe, expect, it } from "@jest/globals";
import { MockTextDocument } from '../utils';

describe("Log", () => {

    it("none", () => {
        expect(getLogLinks(new MockTextDocument("error: link"))).toHaveLength(0);
        expect(getLogLinks(new MockTextDocument("error: link more"))).toHaveLength(0);
        expect(getLogLinks(new MockTextDocument("error: link."))).toHaveLength(0);
    });

    it("link line", () => {
        const link = getLogLinks(new MockTextDocument("error: C:\\link line [2]"))[0];
        expect(link.target.fsPath).toBe("c:\\link");
        expect(link.target.fragment).toBe("L2,0");

        expect(link.range.start.line).toBe(0);
        expect(link.range.start.character).toBe(7);
        expect(link.range.end.line).toBe(0);
        expect(link.range.end.character).toBe(14);
    });

    it("link line, column", () => {
        const link = getLogLinks(new MockTextDocument("error: C:\\link line = (2) column = (3)"))[0];
        expect(link.target.fsPath).toBe("c:\\link");
        expect(link.target.fragment).toBe("L2,3");
    });

    it("link", () => {
        expect(getLogLinks(new MockTextDocument("error: C:\\link"))[0].target.fsPath).toBe("c:\\link");
        expect(getLogLinks(new MockTextDocument("error: C:\\link more"))[0].target.fsPath).toBe("c:\\link");
        expect(getLogLinks(new MockTextDocument("error: C:\\link."))[0].target.fsPath).toBe("c:\\link");

        expect(getLogLinks(new MockTextDocument("error: C:\\link\\"))[0].target.fsPath).toBe("c:\\link\\");
        expect(getLogLinks(new MockTextDocument("error: C:\\link\\ more"))[0].target.fsPath).toBe("c:\\link\\");
        expect(getLogLinks(new MockTextDocument("error: C:\\link\\."))[0].target.fsPath).toBe("c:\\link\\");

        expect(getLogLinks(new MockTextDocument("error: C:\\link\\file.nut"))[0].target.fsPath).toBe("c:\\link\\file.nut");
        expect(getLogLinks(new MockTextDocument("error: C:\\link\\file.nut more"))[0].target.fsPath).toBe("c:\\link\\file.nut");
        expect(getLogLinks(new MockTextDocument("error: C:\\link\\file.nut."))[0].target.fsPath).toBe("c:\\link\\file.nut");

        expect(getLogLinks(new MockTextDocument("error: C:\\link.extra\\sub\\file.extra.nut"))[0].target.fsPath).toBe("c:\\link.extra\\sub\\file.extra.nut");
        expect(getLogLinks(new MockTextDocument("error: C:\\link.extra\\sub\\file.extra.nut more"))[0].target.fsPath).toBe("c:\\link.extra\\sub\\file.extra.nut");
        expect(getLogLinks(new MockTextDocument("error: C:\\link.extra\\sub\\file.extra.nut."))[0].target.fsPath).toBe("c:\\link.extra\\sub\\file.extra.nut");

        expect(getLogLinks(new MockTextDocument("error: /link"))[0].target.fsPath).toBe("\\link");
        expect(getLogLinks(new MockTextDocument("error: /link more"))[0].target.fsPath).toBe("\\link");
        expect(getLogLinks(new MockTextDocument("error: /link."))[0].target.fsPath).toBe("\\link");
    });

});
