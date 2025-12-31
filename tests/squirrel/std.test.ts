import { beforeEach, describe, expect, it, fit } from "@jest/globals";
import { iswalnum, iswalpha, iswcntrl, iswdigit, iswxdigit, wcstod } from "../../src/squirrel/include/std";

const ctrlChar = String.fromCharCode(127);

describe("STD", () => {

    it("iswdigit", () => {
        expect(iswdigit('_'.charCodeAt(0))).toBe(false);
        expect(iswdigit('A'.charCodeAt(0))).toBe(false);
        expect(iswdigit('a'.charCodeAt(0))).toBe(false);
        expect(iswdigit('Z'.charCodeAt(0))).toBe(false);
        expect(iswdigit('0'.charCodeAt(0))).toBe(true);
        expect(iswdigit('9'.charCodeAt(0))).toBe(true);
        expect(iswdigit(ctrlChar.charCodeAt(0))).toBe(false);
    });

    it("iswxdigit", () => {
        expect(iswxdigit('_'.charCodeAt(0))).toBe(false);
        expect(iswxdigit('A'.charCodeAt(0))).toBe(true);
        expect(iswxdigit('a'.charCodeAt(0))).toBe(true);
        expect(iswxdigit('Z'.charCodeAt(0))).toBe(false);
        expect(iswxdigit('0'.charCodeAt(0))).toBe(true);
        expect(iswxdigit('9'.charCodeAt(0))).toBe(true);
        expect(iswxdigit(ctrlChar.charCodeAt(0))).toBe(false);
    });

    it("iswalpha", () => {
        expect(iswalpha('_'.charCodeAt(0))).toBe(false);
        expect(iswalpha('A'.charCodeAt(0))).toBe(true);
        expect(iswalpha('a'.charCodeAt(0))).toBe(true);
        expect(iswalpha('Z'.charCodeAt(0))).toBe(true);
        expect(iswalpha('0'.charCodeAt(0))).toBe(false);
        expect(iswalpha('9'.charCodeAt(0))).toBe(false);
        expect(iswalpha(ctrlChar.charCodeAt(0))).toBe(false);
    });

    it("iswcntrl", () => {
        expect(iswcntrl('_'.charCodeAt(0))).toBe(false);
        expect(iswcntrl('A'.charCodeAt(0))).toBe(false);
        expect(iswcntrl('a'.charCodeAt(0))).toBe(false);
        expect(iswcntrl('Z'.charCodeAt(0))).toBe(false);
        expect(iswcntrl('0'.charCodeAt(0))).toBe(false);
        expect(iswcntrl('9'.charCodeAt(0))).toBe(false);
        expect(iswcntrl(ctrlChar.charCodeAt(0))).toBe(true);
    });

    it("iswalnum", () => {
        expect(iswalnum('_'.charCodeAt(0))).toBe(false);
        expect(iswalnum('A'.charCodeAt(0))).toBe(true);
        expect(iswalnum('a'.charCodeAt(0))).toBe(true);
        expect(iswalnum('Z'.charCodeAt(0))).toBe(true);
        expect(iswalnum('0'.charCodeAt(0))).toBe(true);
        expect(iswalnum('9'.charCodeAt(0))).toBe(true);
        expect(iswalnum(ctrlChar.charCodeAt(0))).toBe(false);
    });

    it("wcstod", () => {
        expect(wcstod("123.456")).toBe(123.456);
        expect(wcstod("123.456e-10")).toBe(123.456e-10);
        expect(wcstod("123.456e+10")).toBe(123.456e+10);
    });

});
