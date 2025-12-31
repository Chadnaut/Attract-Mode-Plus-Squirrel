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
import { getConfigValue } from "./config";
import { getNodeArgExpectedLabels } from "./params";
import { getModulePath } from "./module";
import { getArtworkCompletionLabels } from "./media";

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

    // Attempt to get call filename
    const callBranch = getBranchEndingAtType(branch, ["CallExpression"]);
    if (callBranch.length) {
        const filename = getNodeImportFilename([...callBranch, node]);
        if (filename) return filename;
    }

    // Try resolving the immediate value...
    let value = (<AST.StringLiteral>node).value;
    const sourceName = getBranchProgram(branch).sourceName;

    // ...unless its part of a binary expression, in which case resolve it
    const binBranch = [...branch];
    if (binBranch.at(-2)?.type === "BinaryExpression") {
        while (binBranch.at(-2).type === "BinaryExpression") binBranch.pop();
        value = resolveBinaryExpression(binBranch, sourceName);
    }

    return getRelativePath(value, sourceName);
};

/** Return the layout/plugin path from the name, require for relative do_nuts */
export const getRelativeNutPath = (name: string): string | undefined =>
    RegExp(
        `^(.*?[\\\\/](?:${constants.FE_LAYOUTS_PATH}|${constants.FE_PLUGINS_PATH})[\\\\/][^\\\\/]+[\\\\/])`,
        "i",
    ).exec(name)?.[1];

/** Attempt to resolve relative path, or absolute path */
export const getRelativePath = (
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

/** Attempt to resolve app path, or absolute path */
export const getAppPath = (value: string): string | undefined => {
    const basePath = getConfigValue(constants.ATTRACT_MODE_PATH, "");
    return getFirstValidFilename([value, path.join(basePath, value)]);
};

const nodeFilenameMap = new WeakMap<AST.Node, string>();

/**
 * Return valid filename for call argument
 * - Returns string on success
 * - Returns `""` on fail
 * - Return undefined if not applicable
 */
export const getNodeImportFilename = (
    branch: AST.Node[],
): string | undefined => {
    const labels = getNodeArgExpectedLabels(branch);
    if (labels.includes(constants.EXP_ARTWORK)) return;
    return getNodeExpectedArgument(branch);
};

/**
 * Validate CallExpression argument that has expected values
 * - Attempts to resolve binaryExpression argument, may call getNodeVal & getNodeDef
 * - Returns a string if a value is expected AND is valid
 * - Returns `""` if a value is expected and NOT valid
 * - Returns `undefined` if a value not expected
 */
export const getNodeExpectedArgument = (
    branch: AST.Node[],
): string | undefined => {
    const arg = branch.at(-1);
    if (!arg) return;
    if (nodeFilenameMap.has(arg)) return nodeFilenameMap.get(arg);

    const sourceName = getBranchProgram(branch).sourceName;
    const value = resolveBinaryExpression(branch, sourceName);

    // If value not resolved then ignore
    // - Also ignore values with magic token brackets in them
    if (!value || value.indexOf("[") !== -1) {
        nodeFilenameMap.set(arg, undefined);
        return;
    }

    const labels = getNodeArgExpectedLabels(branch);

    let result;
    for (const label of labels) {
        switch (label) {
            case constants.EXP_MODULE:
                result = getModulePath(value) ?? "";
                break;
            case constants.EXP_FILE:
                result = getAppPath(value) ?? "";
                break;
            case constants.EXP_ARTWORK:
                result = getArtworkCompletionLabels().includes(value)
                    ? value
                    : "";
                break;
            case constants.EXP_NUT:
            case constants.EXP_IMAGE:
            case constants.EXP_VIDEO:
            case constants.EXP_AUDIO:
            case constants.EXP_SHADER:
                result = getRelativePath(value, sourceName) ?? "";
                break;
        }
        if (result) break;
    }

    nodeFilenameMap.set(arg, result);
    return result;
};

/** Return all files relative to app path */
export const getFileCompletions = (sourceName: string): CompletionItem[] => {
    const basePath = getConfigValue(constants.ATTRACT_MODE_PATH);
    if (!basePath) return [];

    const self = path.relative(basePath, sourceName);
    return readDir(basePath, true)
        .filter((name) => name !== self)
        .map((name) => new CompletionItem(forwardSlash(name), CompletionItemKind.File));
};

/** Return nut files relative to layout path */
export const getNutCompletions = (sourceName: string): CompletionItem[] => {
    const basePath = getRelativeNutPath(sourceName);
    if (!basePath) return [];

    const self = path.relative(basePath, sourceName);
    return readDir(basePath, true)
        .filter((name) => isSupportedNut(name) && name !== self)
        .map((name) => new CompletionItem(forwardSlash(name), CompletionItemKind.File));
};
