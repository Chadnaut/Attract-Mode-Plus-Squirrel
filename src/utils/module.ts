import * as path from "path";
import {
    fileExists,
    forwardSlash,
    getFirstValidFilename,
    readDirWithTypes,
    readFile,
} from "./file";
import constants from "../constants";
import { isSupportedNut } from "./import";
import { CompletionItem, CompletionItemKind } from "vscode";
import { ucfirst } from "./string";
import { getConfigValue } from "./config";
import { parseDocAttrs } from "../doc/parse";
import { getAttrByKind } from "../doc/find";

// -----------------------------------------------------------------------------

const docRegex = new RegExp(/^\/\*\*[\r\n]+([\w\W]+?)[\r\n]+ \*\//);
const commentRegex = new RegExp(
    /^\s*(\/\/|\/\*|#)*[^\d\-a-z"']*(.*?)(\*\/)*\s*$/i,
);

export const parseSummary = (
    value: string,
    limit: number = 0,
): string | undefined => {
    if (!value) return;

    let start = false;
    let open = false;
    const lines = (limit ? value.slice(0, limit) : value).split("\n");

    while (lines.length) {
        const line = lines.shift();
        if (!line) continue;
        commentRegex.lastIndex = 0;
        const commentMatch = commentRegex.exec(line);
        if (commentMatch) {
            const head = commentMatch[1];
            if (head === "/*") open = true;
            if (start && !open && !head) return;
            if (open || head) {
                start = true;
                if (commentMatch[0].indexOf("*/") >= 0) open = false;
                const body = commentMatch[2].trim();
                if (body.indexOf(" ") === -1) continue;
                if (body.indexOf("Attract-Mode") === 0) continue;
                return ucfirst(body);
            }
        }
    }
};

// -----------------------------------------------------------------------------

const versionRegex = new RegExp(
    /(?<!license, |with )(?:v|version) *(?:=|<\-)? *(\d+[^\s\t\r\n]*)\b/gim,
);

/** Returns the last found version number */
export const parseVersion = (value: string): string | undefined => {
    versionRegex.lastIndex = 0;
    let match, m;
    while ((m = versionRegex.exec(value))) match = m;
    if (!match) return;
    let version = match[1];
    return version;
};

// -----------------------------------------------------------------------------

const uriRegex = new RegExp(/http[^\s\r\n\t]+/);

export const parseUrl = (value: string): string | undefined => {
    uriRegex.lastIndex = 0;
    const match = uriRegex.exec(value);
    if (match) return match[0];

    // special case
    for (const key of Object.keys(constants.FE_URL_SPECIAL)) {
        if (value.indexOf(key) !== -1) return constants.FE_URL_SPECIAL[key];
    }
};

// -----------------------------------------------------------------------------

export type ModuleInfo = {
    filename: string;
    name: string;
    title: string;
    description: string;
    version: string;
    url: string;
    native: boolean;
};

/** Parse a file and return info found within its comments */
export const getModuleInfo = (filename: string, limit = 600): ModuleInfo => {
    const name = trimModuleName(filename);
    const title = name?.split("-").map(ucfirst).join(" ") ?? "";
    let description = "";
    let version = "";
    let url = "";
    let native = constants.FE_MODULES_BUILTIN.includes(name);

    const contents = readFile(filename);
    if (contents) {
        docRegex.lastIndex = 0;
        const doc = docRegex.exec(contents);
        if (doc) {
            // Use the file docblock if it exists
            const attrs = parseDocAttrs(doc[1]);
            description = getAttrByKind(attrs, "summary")?.documentation ?? "";
            version = getAttrByKind(attrs, "version")?.name ?? "";
            url = getAttrByKind(attrs, "url")?.documentation ?? "";
        } else {
            // Attempt to parse module details from the comments
            description = parseSummary(contents, limit) ?? "";
            if (description) {
                url = parseUrl(contents) || "";
                version = parseVersion(contents) || "";
            }
        }
    }

    if (!description) description = `${ucfirst(name)} Module`;

    return {
        name,
        title,
        filename,
        description,
        version,
        native,
        url,
    };
};

/**
 * Return module name from path
 * - Return undefined if not a module (may be support file within module folder)
 */
export const trimModuleName = (name: string): string | undefined => {
    if (!name) return;
    const basePath = getConfigValue(constants.ATTRACT_MODE_PATH, "");
    const modulePath = path.join(basePath, constants.FE_MODULES_PATH);
    const relPath = forwardSlash(path.relative(modulePath, name));

    if (relPath.startsWith("..") || path.isAbsolute(relPath)) return;
    // filename ends with module.nut, or not basepath

    const n = constants.FE_MODULE_FILENAME.length;
    if (name.slice(-n) === constants.FE_MODULE_FILENAME) {
        name = name.slice(0, -n);
    }
    return path.basename(name, constants.LANGUAGE_EXTENSION);
};

/**
 * Return array of module paths
 * - Scans folder to find new modules
 * - A path may be a file or folder
 */
export const getModulePaths = (): string[] => {
    const basePath = getConfigValue(constants.ATTRACT_MODE_PATH, "");
    const modulePath = path.join(basePath, constants.FE_MODULES_PATH);

    return readDirWithTypes(modulePath)
        .map((d) => {
            let name = path.join(d.parentPath, d.name);

            // module is a file in the modulePath
            if (d.isFile()) return isSupportedNut(name) ? name : undefined;

            // check for "module.nut" file within folder
            name = path.join(name, constants.FE_MODULE_FILENAME);
            if (fileExists(name)) return name;
        })
        .filter((name) => name);
};

/** Return module path from given name */
export const getModulePath = (value: string): string | undefined => {
    const basePath = getConfigValue(constants.ATTRACT_MODE_PATH, "");
    const mPath = path.join(basePath, constants.FE_MODULES_PATH);
    return getFirstValidFilename(
        isSupportedNut(value)
            ? [path.join(mPath, value)]
            : [
                  path.join(mPath, value + constants.LANGUAGE_EXTENSION),
                  path.join(mPath, value, constants.FE_MODULE_FILENAME),
              ],
    );
};

/**
 * Return array of module names for completion items
 * - Only includes root-level modules
 */
export const getModuleCompletions = (): CompletionItem[] => {
    return getModulePaths()
        .map((name) => trimModuleName(name))
        .filter((name) => name)
        .map((name) => new CompletionItem(name, CompletionItemKind.Module));
};
