import { AST } from "../ast";
import {
    filenameHasExtension,
    forwardSlash,
    getFirstValidFilename,
    readDir,
} from "./file";
import constants from "../constants";
import { CompletionItem, CompletionItemKind } from "vscode";
import * as path from "path";
import { resolveBinaryExpression } from "./binary";
import { getDocAttr, getNodeDoc } from "../doc/find";
import { getBranchEndingAtType, getBranchProgram } from "./find";
import { getCallExpressionName } from "./call";
import { getConfigValue } from "./config";

/** Returns true if Nut is supported */
export const isSupportedNut = (filename: string): boolean =>
    filenameHasExtension(filename, [constants.LANGUAGE_EXTENSION]);

/**
 * Returns true if program is global
 * - Only "assets" programs can be global
 */
export const isProgramGlobal = (program: AST.Program): boolean => {
    if (!program) return false;
    if (!program.sourceName) return false;
    if (program.sourceName.indexOf(constants.ASSETS_PATH) === -1) return false;
    return !!getDocAttr(getNodeDoc([program]), "global");
};

/**
 * Return valid filename from a StringLiteral node
 * - If string is arg of CallExpression attempt to find import filename
 * - NOTE: Checking filenames is slow
 */
export const getNodeLink = (branch: AST.Node[]): string | undefined => {
    const node = branch.at(-1);
    if (node?.type !== "StringLiteral") return;

    // If within a call, try to get the filename
    const callBranch = getBranchEndingAtType(branch, "CallExpression");
    if (callBranch.length) {
        const filename = getNodeImportFilename(callBranch);
        if (filename) return filename;
    }

    // Try resolving the immediate value...
    let value = (<AST.StringLiteral>node).value;
    const sourceName = getBranchProgram(branch).sourceName;

    // ...unless its part of a binary expression, in which case resolve it
    const binBranch = branch.slice(0);
    if (binBranch.at(-2)?.type === "BinaryExpression") {
        while (binBranch.at(-2).type === "BinaryExpression") binBranch.pop();
        value = resolveBinaryExpression(binBranch, sourceName);
    }

    return getRelativeFilename(value, sourceName);
};

/** Return the layout/plugin path from the name, require for relative do_nuts */
export const getRelativeNutPath = (name: string): string | undefined =>
    RegExp(
        `^(.*?[\\\\/](?:${constants.FE_LAYOUTS_PATH}|${constants.FE_PLUGINS_PATH})[\\\\/][^\\\\/]+[\\\\/])`,
        "i",
    ).exec(name)?.[1];

/** Attempt to resolve absolute, or relative to owner filename */
export const getRelativeFilename = (
    value: string,
    sourceName: string,
): string | undefined => {
    if (!value) return;
    if (typeof value !== "string") return;
    if (!value.match(/\.[^\.]+$/)) return; // must have ext
    value = value.trim();

    // maybe absolute path
    const filenames = [value];

    // maybe relative to owner
    const nutPath = getRelativeNutPath(sourceName);
    if (nutPath) filenames.push(path.join(nutPath, value));

    return getFirstValidFilename(filenames);
};

/** Get the module name from the path, or undefined */
export const getImportModuleName = (filename: string): string | undefined => {
    if (!filename) return;
    const basePath = getConfigValue(constants.ATTRACT_MODE_PATH, "");
    const modules = path.join(basePath, constants.FE_MODULES_PATH);
    let rel = forwardSlash(path.relative(modules, filename));
    if (!rel) return;
    if (rel.charAt(0) === ".") return;
    const index = rel.indexOf("/");
    return index !== -1
        ? rel.slice(0, index)
        : path.basename(rel, constants.LANGUAGE_EXTENSION);
};

/**
 * Add potential `fe.do_nut` or `fe.load_module` filename to the imports array
 * - Attempts to resolve argument, may call getNodeVal & getNodeDef
 * - Returns undefined if the method does not match, or the value is to be ignored
 * - Returns empty string if the method matches, but no filename found - gets flagged as missing
 */
export const getNodeImportFilename = (
    branch: AST.Node[],
    methods: string[] = [],
): string | undefined => {
    const node = branch.at(-1);
    if (node?.type !== "CallExpression") return;

    const args = (<AST.CallExpression>node).arguments;
    if (!args.length) return;

    const method = getCallExpressionName(branch);
    if (!method || (methods.length && !methods.includes(method))) return;

    const program = getBranchProgram(branch);
    const b = branch.concat(args.slice(0, 1));
    const sourceName = program.sourceName;
    const value = resolveBinaryExpression(b, sourceName);
    if (!value) return;

    // ignore values with magic tokens
    if (value.indexOf("[") !== -1) return;

    switch (method) {
        case constants.SQ_DOFILE: {
            const basePath = getConfigValue(constants.ATTRACT_MODE_PATH, "");
            return getFirstValidFilename([value, path.join(basePath, value)]) ?? "";
        }
        case constants.FE_ADD_IMAGE:
        case constants.FE_ADD_MUSIC:
        case constants.FE_ADD_SOUND:
        case constants.FE_DO_NUT: {
            return getRelativeFilename(value, sourceName) ?? "";
        }
        case constants.FE_LOAD_MODULE: {
            const basePath = getConfigValue(constants.ATTRACT_MODE_PATH, "");
            if (isSupportedNut(value)) {
                // value is nut file
                return getFirstValidFilename([
                    path.join(basePath, constants.FE_MODULES_PATH, value),
                ]) ?? "";
            } else {
                // value may be folder, or nut file within folder
                return getFirstValidFilename([
                    path.join(
                        basePath,
                        constants.FE_MODULES_PATH,
                        value + constants.LANGUAGE_EXTENSION,
                    ),
                    path.join(
                        basePath,
                        constants.FE_MODULES_PATH,
                        value,
                        constants.FE_MODULE_FILENAME,
                    ),
                ]) ?? "";
            }
        }
        // case constants.FE_ADD_ARTWORK: {
        //     return value;
        // }
    }
};

/** Return all nut files relative to nut path */
export const getNutCompletions = (sourceName: string): CompletionItem[] => {
    const nutPath = getRelativeNutPath(sourceName);
    if (!nutPath) return [];

    const self = path.relative(nutPath, sourceName);

    return readDir(nutPath, true)
        .filter((name) => isSupportedNut(name) && name !== self)
        .map((name) => new CompletionItem(name, CompletionItemKind.File));
};

