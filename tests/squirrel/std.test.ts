import { beforeEach, describe, expect, it, fit } from "@jest/globals";
import { iswalnum, iswalpha, iswcntrl, iswdigit, iswxdigit, wcstod } from "../../src/squirrel/include/std";

const ctrlChar = String.fromCharCode(127);

describe("STD", () => {

    it("iswdigit", () => {
        expect(iswdigit(undefined)).toBe(false);
        expect(iswdigit('_')).toBe(false);
        expect(iswdigit('A')).toBe(false);
        expect(iswdigit('a')).toBe(false);
        expect(iswdigit('Z')).toBe(false);
        expect(iswdigit('0')).toBe(true);
        expect(iswdigit('9')).toBe(true);
        expect(iswdigit(ctrlChar)).toBe(false);
    });

    it("iswxdigit", () => {
        expect(iswxdigit(undefined)).toBe(false);
        expect(iswxdigit('_')).toBe(false);
        expect(iswxdigit('A')).toBe(true);
        expect(iswxdigit('a')).toBe(true);
        expect(iswxdigit('Z')).toBe(false);
        expect(iswxdigit('0')).toBe(true);
        expect(iswxdigit('9')).toBe(true);
        expect(iswxdigit(ctrlChar)).toBe(false);
    });

    it("iswalpha", () => {
        expect(iswalpha(undefined)).toBe(false);
        expect(iswalpha('_')).toBe(false);
        expect(iswalpha('A')).toBe(true);
        expect(iswalpha('a')).toBe(true);
        expect(iswalpha('Z')).toBe(true);
        expect(iswalpha('0')).toBe(false);
        expect(iswalpha('9')).toBe(false);
        expect(iswalpha(ctrlChar)).toBe(false);
    });

    it("iswcntrl", () => {
        expect(iswcntrl(undefined)).toBe(false);
        expect(iswcntrl('_')).toBe(false);
        expect(iswcntrl('A')).toBe(false);
        expect(iswcntrl('a')).toBe(false);
        expect(iswcntrl('Z')).toBe(false);
        expect(iswcntrl('0')).toBe(false);
        expect(iswcntrl('9')).toBe(false);
        expect(iswcntrl(ctrlChar)).toBe(true);
    });

    it("iswalnum", () => {
        expect(iswalnum(undefined)).toBe(false);
        expect(iswalnum('_')).toBe(false);
        expect(iswalnum('A')).toBe(true);
        expect(iswalnum('a')).toBe(true);
        expect(iswalnum('Z')).toBe(true);
        expect(iswalnum('0')).toBe(true);
        expect(iswalnum('9')).toBe(true);
        expect(iswalnum(ctrlChar)).toBe(false);
    });

    it("wcstod", () => {
        expect(wcstod("123.456")).toBe(123.456);
        expect(wcstod("123.456e-10")).toBe(123.456e-10);
        expect(wcstod("123.456e+10")).toBe(123.456e+10);
    });

});
