import { getAttrByKind, getNodeDocBlock } from '../../src/doc/find';
import {
    beforeEach,
    describe,
    fdescribe,
    expect,
    it,
    fit,
} from "@jest/globals";
import { parseExtra as parse, pos, dump } from "../utils";
import { createDocMarkdown, formatVersion } from "../../src/doc/markdown";
import { AST, SQTree as qt } from '../../src/ast';
import { getDocAttr, getNodeDoc } from "../../src/doc/find";
import { MarkdownString } from "vscode";
import { getBranchAtPos } from "../../src/utils/find";
import { createDoc } from '../../src/doc/create';

describe("Doc Markdown", () => {

    it("formatVersion", () => {
        const name = "ver";
        const url = "http://web.site";
        expect(formatVersion({ name, documentation: url })).toBe(`\n\n<small><a href="${url}">\`${name}\`</a></small>`);
        expect(formatVersion({ name, documentation: `${url} ${name} ${url}` })).toBe(`\n\n<small><a href="${url}">\`${name}\`</a></small> <small><a href="${url}">\`${name}\`</a></small>`);
        expect(formatVersion({ })).toBe(``);
    });

    it("description", () => {
        const db = createDoc(qt.CommentBlock("doc\nblock\n\nhere", true));
        expect(db).toHaveProperty("attributes");
        expect(getDocAttr(db, "description").documentation).toBe("doc\nblock\n\nhere");
    });

    it("inline @ symbol", () => {
        const db = createDoc(qt.CommentBlock("@returns {type} desc @inline", true));
        expect(getDocAttr(db, "returns").documentation).toBe("desc @inline");
        expect(createDocMarkdown(db.attributes).value).toContain("returns");
    });

    it("createDocMarkdown, invalid", () => {
        expect(createDocMarkdown([])).toBeUndefined();
    });

    it("createDocMarkdown, variation", () => {
        const program = parse(`
            /** Test */
            function foo() {}
            /** @variation foo */
            function foo() {}
        `);
        const f1 = getNodeDoc([program, program.body[0]]).attributes[0]?.documentation;
        const f2 = getNodeDoc([program, program.body[1]]).attributes[0]?.documentation;
        expect(f1).toEqual(f2);
    });

    it("createDocMarkdown variation, no parent", () => {
        const program = parse(`
            /** Test */
            function foo() {}
            /** @variation no_parent_exists */
            function foo() {}
            "string"
        `);
        const f1 = getNodeDoc([program, program.body[0]]).attributes[0]?.documentation;
        const f2 = getNodeDoc([program, program.body[1]]).attributes[0]?.documentation;
        expect(f1).not.toEqual(f2);
    });

    it("createDocMarkdown inheritdoc", () => {
        const program = parse("/** Here */ local x = 1; /** @inheritdoc */ local y = x;")
        const n = getBranchAtPos(program, pos(51));
        const d = getNodeDoc(n);
        expect(d.markdown.value).toContain("Here");
    });

    it("createDocMarkdown inheritdoc excludes ignore", () => {
        const program = parse("/** @ignore */ local x = 1; /** @inheritdoc */ local y = x;")
        const n = getBranchAtPos(program, pos(54));
        const d = getNodeDoc(n);
        expect(getAttrByKind(d.attributes, "ignore")).toBeFalsy();
    });

    it("createDocMarkdown inheritdoc class", () => {
        const program = parse("/** Here */ class x {}; /** @inheritdoc */ class y extends x {};")
        const n = getBranchAtPos(program, pos(50));
        const d = getNodeDoc(n);
        expect(d.markdown.value).toContain("Here");
    });

    it("createDocMarkdown inheritdoc! includes ignore", () => {
        const program = parse("/** @ignore */ local x = 1; /** @inheritdoc! */ local y = x;")
        const n = getBranchAtPos(program, pos(55));
        const d = getNodeDoc(n);
        expect(getAttrByKind(d.attributes, "ignore")).toBeTruthy();
    });

    it("returns prints with desc", () => {
        const db = createDoc(qt.CommentBlock("@returns {type} desc", true));
        expect(createDocMarkdown(db.attributes).value).toContain("returns");
    });

    it("returns ignored without desc", () => {
        const db = createDoc(qt.CommentBlock("@returns {type}", true));
        expect(createDocMarkdown(db.attributes).value).toBe("");
    });

    it("multiple attr works", () => {
        const db = createDoc(qt.CommentBlock("@package \n @global", true));
        expect(getDocAttr(db, "package")).toBeTruthy();
        expect(getDocAttr(db, "global")).toBeTruthy();
        expect(getDocAttr(db, "description")).toBeFalsy();
    });

    it("invalid attr read anyway", () => {
        const db = createDoc(qt.CommentBlock("@package \n @-global \n @enum", true));
        expect(getDocAttr(db, "package")).toBeTruthy();
        expect(getDocAttr(db, "global")).toBeFalsy();
        expect(getDocAttr(db, "-global")).toBeTruthy();
        expect(getDocAttr(db, "enum")).toBeTruthy();
    });

    it("carriage returns in docblock", () => {
        const db = createDoc(qt.CommentBlock("* Desc \n @param", true));
        expect(getDocAttr(db, "param")).toBeTruthy();
        expect(getDocAttr(db, "description").documentation).toBe("Desc");
    });

    it("param with type", () => {
        const db = createDoc(qt.CommentBlock("@param {type} name desc", true));
        expect(db).toHaveProperty("attributes");
        const attr = getDocAttr(db, "param", "name");
        expect(attr.kind).toBe("param");
        expect(attr.type).toBe("type");
        expect(attr.name).toBe("name");
        expect(attr.documentation).toBe("desc");
    });

    it("param with multiline", () => {
        const db = createDoc(qt.CommentBlock("@param {type} name desc\nmultiline", true));
        expect(db).toHaveProperty("attributes");
        const attr = getDocAttr(db, "param", "name");
        expect(attr.kind).toBe("param");
        expect(attr.type).toBe("type");
        expect(attr.name).toBe("name");
        expect(attr.documentation).toBe("desc\nmultiline");
        expect(createDocMarkdown(db.attributes).value).toBe("@param `name`\n\ndesc\nmultiline");
    });

    it("author with name", () => {
        const db = createDoc(qt.CommentBlock("@author name desc", true));
        expect(db).toHaveProperty("attributes");
        const attr = getDocAttr(db, "author");
        expect(attr.kind).toBe("author");
        expect(attr.name).toBe("name");
        expect(attr.documentation).toBe("desc");
    });

    it("author name and link", () => {
        const db = createDoc(qt.CommentBlock("@author name<link> desc", true));
        expect(db).toHaveProperty("attributes");
        const attr = getDocAttr(db, "author");
        expect(attr.kind).toBe("author");
        expect(attr.name).toBe("name");
        expect(attr.link).toBe("link");
        expect(attr.documentation).toBe("desc");
        expect(createDocMarkdown(db.attributes).value).toBe("@author [name](link) — desc");
    });

    it("version", () => {
        const db = createDoc(qt.CommentBlock("@version name", true));
        expect(db).toHaveProperty("attributes");
        const attr = getDocAttr(db, "version");
        expect(attr.kind).toBe("version");
        expect(attr.name).toBe("name");

        const md = createDocMarkdown(db.attributes);
        expect(md.value).not.toContain("href");
    });

    it("version, link", () => {
        const db = createDoc(qt.CommentBlock("@version name http://link", true));
        expect(db).toHaveProperty("attributes");
        const attr = getDocAttr(db, "version");
        expect(attr.kind).toBe("version");
        expect(attr.name).toBe("name");
        expect(attr.documentation).toBe("http://link");

        const md = createDocMarkdown(db.attributes);
        expect(md.value).toContain("href");
    });

    it("multiline attr doc", () => {
        const db = createDoc(qt.CommentBlock("@class d1\nd2", true));
        expect(db).toHaveProperty("attributes");
        const attr = getDocAttr(db, "class");
        expect(attr.kind).toBe("class");
        expect(attr.documentation).toBe("d1\nd2");
    });

    it("createDocMarkdown allows undefined", () => {
        expect(createDocMarkdown([])).toBeUndefined();
        expect(createDocMarkdown(undefined)).toBeUndefined();
        expect(createDocMarkdown([{}])).toBeInstanceOf(MarkdownString);
    });

    it("getNodeSignature, meta property captures", () => {
        const db = createDoc(qt.CommentBlock("Here\n@property {integer} prop \n @default 123", true, qt.SourceLocation(pos(0), pos(44))));
        expect(createDocMarkdown(db.attributes).value).toBe("Here");
    });

    it("property captures following attributes", () => {
        const program = parse("/** Desc \n @property prop \n @returns {string} */ class foo {}");
        const n = getBranchAtPos(program, qt.Position(3, 29, null)).slice(0, -1);
        const doc = createDocMarkdown(getNodeDoc(n).attributes);
        expect(doc.value).toBe("Desc");
    });
});
