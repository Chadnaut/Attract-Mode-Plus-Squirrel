import { describe, expect, it } from "@jest/globals";
import { copyFile, dirExists, fileExists, forwardSlash, getValidFilename, makeDir, parseExtensionList, pathNormalize, readDir, readDirWithTypes, readFile, readJson, removeDir, /*unwatchStream, watchStream,*/ writeFile } from "../../src/utils/file";

let fileContent = "123";
let fileValue = 123;
let existsSync;
let isDirectory;
let isFile;
let mkdirSync;
let rmdirSync;
let readdirSync;
let writeFileSync;
let readFileSync;
let copyFileSync;
let watchFileLister;
let lstats;
let openErr;
let readErr;
let consoleErr;
jest.mock("fs", () => ({
    ...jest.requireActual("fs"),
    mkdirSync: () => { if (!mkdirSync) throw "error"; },
    rmdirSync: () => { if (!rmdirSync) throw "error"; },
    readdirSync: () => { if (readdirSync) { return [1,2,3] } else { throw "error"; } },
    writeFileSync: () => { if (!writeFileSync) throw "error"; },
    readFileSync: () => { if (readFileSync) { return fileContent } else { throw "error"; } },
    copyFileSync: () => { if (!copyFileSync) throw "error"; },
    existsSync: () => existsSync,
    lstatSync: () => ({
        isDirectory: () => isDirectory,
        isFile: () => isFile,
    }),
    watchFile: (filename, options, listener) => { watchFileLister = listener },
    unwatchFile: () => {},

    lstat: (filename, callback) => { callback(false, lstats); },
    open: (filename, callback) => { callback(openErr, {}); },
    close: () => {},
    read: (data, buffer: Buffer, offset, length, position, callback) => {
        buffer.fill(new TextEncoder().encode(fileContent));
        callback(readErr, buffer.length - 1);
    },
}));

beforeEach(() => {
    fileContent = "123";
    fileValue = 123;
    readdirSync = false;
    rmdirSync = false;
    writeFileSync = false;
    readFileSync = false;
    copyFileSync = false;
    mkdirSync = false;
    existsSync = false;
    isDirectory = false;
    isFile = false;
    watchFileLister = null;
    lstats = null;
    openErr = false;
    readErr = false;
    consoleErr = false;
    console.error = () => { consoleErr = true; };
});

describe("File", () => {
    it("parseExtensionList", () => {
        expect(parseExtensionList("TXT")).toEqual([".txt"]);
        expect(parseExtensionList(".TXT")).toEqual([".txt"]);
        expect(parseExtensionList(".TXT,JPG")).toEqual([".txt", ".jpg"]);
        expect(parseExtensionList(".TXT;JPG")).toEqual([".txt", ".jpg"]);
        expect(parseExtensionList(".TXT JPG")).toEqual([".txt", ".jpg"]);
        expect(parseExtensionList(".TXT|JPG")).toEqual([".txt", ".jpg"]);
    });

    it("pathNormalize", () => {
        expect(pathNormalize("/path/here/")).toBe("PATH/HERE");
        expect(pathNormalize("\\path\\here\\")).toBe("PATH/HERE");
    });

    it("forwardSlash", () => {
        expect(forwardSlash("\\path\\here\\")).toBe("/path/here/");
    });

    it("dirExists", () => {
        existsSync = true;
        isDirectory = true;
        expect(dirExists(__dirname)).toBe(true);

        existsSync = false;
        isDirectory = true;
        expect(dirExists(__dirname)).toBe(false);

        existsSync = true;
        isDirectory = false;
        expect(dirExists(__dirname)).toBe(false);
    });

    it("makeDir", () => {
        mkdirSync = true;
        existsSync = true;
        isDirectory = true;
        expect(makeDir(__dirname)).toBe(true);

        mkdirSync = false;
        existsSync = true;
        isDirectory = true;
        expect(makeDir(__dirname)).toBe(false);

        mkdirSync = true;
        existsSync = false;
        isDirectory = true;
        expect(makeDir(__dirname)).toBe(false);

        mkdirSync = true;
        existsSync = true;
        isDirectory = false;
        expect(makeDir(__dirname)).toBe(false);
    });

    it("removeDir", () => {
        rmdirSync = true;
        existsSync = false;
        isDirectory = false;
        expect(removeDir(__dirname)).toBe(true);

        rmdirSync = false;
        existsSync = true;
        isDirectory = true;
        expect(removeDir(__dirname)).toBe(false);

        rmdirSync = true;
        existsSync = false;
        isDirectory = true;
        expect(removeDir(__dirname)).toBe(true);

        rmdirSync = true;
        existsSync = true;
        isDirectory = false;
        expect(removeDir(__dirname)).toBe(true);
    });

    it("readDir", () => {
        readdirSync = true;
        expect(readDir(__dirname).length).toBeGreaterThan(0);

        readdirSync = false;
        expect(readDir(__dirname)).toHaveLength(0);
    });

    it("readDirWithTypes", () => {
        readdirSync = true;
        expect(readDirWithTypes(__dirname).length).toBeGreaterThan(0);

        readdirSync = false;
        expect(readDirWithTypes(__dirname)).toHaveLength(0);
    });

    it("fileExists", () => {
        existsSync = true;
        isFile = true;
        expect(fileExists(__filename)).toBe(true);

        existsSync = false;
        isFile = true;
        expect(fileExists(__filename)).toBe(false);

        existsSync = true;
        isFile = false;
        expect(fileExists(__filename)).toBe(false);
    });

    it("getValidFilename", () => {
        existsSync = false;
        isFile = false;
        expect(getValidFilename(__filename)).toEqual(undefined);

        existsSync = true;
        isFile = true;
        expect(getValidFilename(__filename)).toEqual(__filename);

        expect(getValidFilename(undefined)).toEqual(undefined);
        expect(getValidFilename(123)).toEqual(undefined);

    });

    it("writeFile, sync", () => {
        writeFileSync = true;
        expect(writeFile(__filename, "123")).toBe(true);
    });

    it("writeFile, nosync", () => {
        writeFileSync = false;
        expect(writeFile(__filename, "123")).toBe(false);
    });

    it("copyFile, sync", () => {
        copyFileSync = true;
        existsSync = true;
        isFile = true;
        expect(copyFile("src.file", "dest.file")).toBe(true);
    });

    it("copyFile, missing", () => {
        copyFileSync = false;
        existsSync = true;
        isFile = true;
        expect(copyFile("src.file", "dest.file")).toBe(false);
    });

    it("copyFile, error", () => {
        copyFileSync = false;
        existsSync = false;
        isFile = false;
        expect(copyFile("src.file", "dest.file")).toBe(false);
    });

    it("readFile, sync", () => {
        consoleErr = false;
        readFileSync = true;
        existsSync = true;
        isFile = true;
        expect(readFile(__filename)).toBe(fileContent);
    });

    it("readFile, readerr", () => {
        consoleErr = false;
        readFileSync = false;
        existsSync = true;
        isFile = true;
        expect(readFile(__filename)).toBeUndefined();
        expect(consoleErr).toBe(true);
    });

    it("readFile, error", () => {
        consoleErr = false;
        existsSync = true;
        isFile = false;
        readFileSync = true;
        expect(readFile(__filename)).toBeUndefined();
    });

    it("readJson, sync", () => {
        fileContent = "123";
        consoleErr = false;
        readFileSync = true;
        existsSync = true;
        isFile = true;
        expect(readJson(__filename)).toBe(123);
    });

    it("readJson, parseerr", () => {
        fileContent = "bad";
        consoleErr = false;
        readFileSync = true;
        existsSync = true;
        isFile = true;
        expect(readJson(__filename)).toBeUndefined();
        expect(consoleErr).toBe(true);
    });

    it("readJson, readerr", () => {
        consoleErr = false;
        readFileSync = false;
        existsSync = true;
        isFile = true;
        expect(readJson(__filename)).toBeUndefined();
        expect(consoleErr).toBe(true);
    });

    it("readJson, error", () => {
        consoleErr = false;
        existsSync = true;
        isFile = false;
        readFileSync = true;
        expect(readJson(__filename)).toBeUndefined();
    });


    // it("watchFile", async () => {
    //     readFileSync = true;
    //     existsSync = true;
    //     isFile = true;
    //     lstats = { nlink: 1, size: 0 };

    //     let response = undefined;
    //     let call = (content) => { response = content };
    //     const callback = (content: string) => { call(content); };
    //     watchStream(__filename, 500, callback);

    //     watchFileLister({ nlink: 0, size: 0 });
    //     expect(response).toBeUndefined();

    //     watchFileLister({ nlink: 1, size: 0 });
    //     expect(response).toBeUndefined();

    //     watchFileLister({ nlink: 1, size: 0 }, {});
    //     expect(response).toBeUndefined();

    //     watchFileLister({ nlink: 1, size: -1 }, { size: 1 });
    //     expect(response).toBeUndefined();

    //     openErr = true;
    //     watchFileLister({ nlink: 1, size: fileContent.length }, { size: 0 });
    //     expect(response).toBeUndefined();
    //     openErr = false;

    //     readErr = true;
    //     watchFileLister({ nlink: 1, size: fileContent.length }, { size: 0 });
    //     expect(response).toBeUndefined();
    //     readErr = false;

    //     await new Promise((resolve) => {
    //         call = (content) => { response = content; resolve(true) };
    //         watchFileLister({ nlink: 1, size: fileContent.length }, { size: 0 });
    //     })
    //     expect(response).toBe(fileContent);

    //     expect(unwatchStream(__filename, callback)).toBeUndefined();
    // });

});
