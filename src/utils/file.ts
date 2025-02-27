import * as path from "path";
import * as fs from "fs";

/**
 * Create key for data storage from path
 * - resolve symlink
 * - remove specials
 * - case and slash formatting
 */
export const pathNormalize = (name: string): string =>
    forwardSlash(
        path.normalize(fs.existsSync(name) ? fs.realpathSync(name) : name),
    )
        .toUpperCase()
        .replace(/^[\\/]*(.*?)[\\/]*$/, "$1");

/** Replace all back-slashes with forward-slashes */
export const forwardSlash = (path: string): string => path.replace(/\\/g, "/");

// -----------------------------------------------------------------------------

/**
 * Returns true if filename has extension
 * - Extensions array must be lowercase
 */
export const filenameHasExtension = (
    filename: string,
    extensions: string[],
): boolean =>
    filename && extensions.includes(path.extname(filename).toLowerCase());

/**
 * Parse delimited string for extensions and return array
 */
export const parseExtensionList = (value: string): string[] =>
    value
        .replace(/[ ,;|]+/g, ";")
        .split(";")
        .map((ext) => {
            ext = ext.toLowerCase().replace(/^\./, "").trim();
            if (ext) return `.${ext}`;
        })
        .filter((ext) => ext);

// -----------------------------------------------------------------------------

/** Return true if path exists and is a folder */
export const dirExists = (dirname: string): boolean =>
    fs.existsSync(dirname) && fs.lstatSync(dirname).isDirectory();

/** Make dir and return true on success */
export const makeDir = (dirname: string): boolean => {
    try {
        fs.mkdirSync(dirname);
        return dirExists(dirname);
    } catch (_err) {
        return false;
    }
};

/** Delete dir and return true on success */
export const removeDir = (dirname: string): boolean => {
    try {
        fs.rmdirSync(dirname);
        return !dirExists(dirname);
    } catch (_err) {
        return false;
    }
};

/** Return array of paths within dir */
export const readDir = (
    dirname: string,
    recursive: boolean = false,
): string[] => {
    try {
        return fs.readdirSync(dirname, { encoding: "utf8", recursive });
    } catch (err) {
        return [];
    }
};

/** Return array of Dirent items within dir */
export const readDirWithTypes = (
    dirname: string,
    recursive: boolean = false,
): fs.Dirent[] => {
    try {
        return fs.readdirSync(dirname, {
            encoding: "utf8",
            withFileTypes: true,
            recursive,
        });
    } catch (err) {
        return [];
    }
};

// -----------------------------------------------------------------------------

/** Return true if exists and is a file */
export const fileExists = (filename: string): boolean =>
    fs.existsSync(filename) && fs.lstatSync(filename).isFile();

/** Return normalized filename if it exists, and is a file */
export const getValidFilename = (filename: unknown): string | undefined => {
    if (!filename) return;
    if (typeof filename !== "string") return;
    const f = path.normalize(filename);
    if (!fileExists(f)) return;
    return f;
};

/** Return first valid filename from array */
export const getFirstValidFilename = (
    filenames: string[],
): string | undefined => {
    // Return first valid name, otherwise undefined
    for (const filename of filenames) {
        const validFilename = getValidFilename(filename);
        if (validFilename) return validFilename;
    }
};

/** Write file, return true on success */
export const writeFile = (filename: string, contents: string): boolean => {
    try {
        fs.writeFileSync(filename, contents, { encoding: "utf8" });
        return true;
    } catch (_err) {
        return false;
    }
};

/** Copy file, return true on success */
export const copyFile = (srcFile: string, dstFile: string): boolean => {
    try {
        fs.copyFileSync(srcFile, dstFile);
        return fileExists(dstFile);
    } catch (_err) {
        return false;
    }
};

/** Return file contents, or undefined if missing or invalid */
export const readFile = (
    filename: string,
    options: { encoding: BufferEncoding; flag?: string } = { encoding: "utf8" },
): string | undefined => {
    filename = getValidFilename(filename);
    if (!filename) return;

    try {
        return fs.readFileSync(filename, options);
    } catch (_err) {
        console.error(_err);
    }
};

/** Return json file content, or undefined if missing or invalid */
export const readJson = (filename: string): any => {
    const content = readFile(filename);
    if (!content) return;
    try {
        return JSON.parse(content);
    } catch (_err) {
        console.error(_err);
    }
};
