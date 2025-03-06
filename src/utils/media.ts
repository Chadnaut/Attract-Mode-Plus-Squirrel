import {
    CompletionItem,
    CompletionItemKind,
    DiagnosticSeverity,
    MarkdownString,
    Uri,
} from "vscode";
import * as path from "path";
import {
    fileExists,
    filenameHasExtension,
    forwardSlash,
    readDir,
    readFile,
} from "./file";
import {
    audioExtensions,
    imageExtensions,
    videoExtensions,
    shaderExtensions,
} from "./kind";
import { getNodeImportFilename, getRelativeNutPath } from "./import";
import constants from "../constants";
import { uniqueFilter } from "./array";
import { AST } from "../ast";
import { getBranchProgram } from "./find";
import { getConfigValue } from "./config";
import { addProgramErrors } from "./diagnostics";
import { filterBranchCallMethods, getCallExpressionName } from "./call";
import { resolveBinaryExpression } from "./binary";

const { readMediaAttributes } = require("leather");

// -----------------------------------------------------------------------------

const programArtworkMap = new WeakMap<AST.Program, string[]>();

export const addProgramArtwork = (program: AST.Program, name: string) => {
    if (!name) return;
    if (!programArtworkMap.has(program)) programArtworkMap.set(program, []);
    const map = programArtworkMap.get(program);
    if (!map.includes(name)) map.push(name);
};

export const getProgramArtworks = (program: AST.Program): string[] =>
    programArtworkMap.has(program) ? programArtworkMap.get(program) : [];

/** Return the value of and artwork call argument */
export const getArtworkCallLabel = (branch: AST.Node[]): string => {
    const node = branch.at(-1);
    if (node?.type !== "CallExpression") return;
    const args = (<AST.CallExpression>node).arguments;
    if (!args.length) return;

    if (getCallExpressionName(branch) !== constants.FE_ADD_ARTWORK) return;
    return resolveBinaryExpression(
        branch.concat(args.slice(0, 1)),
        getBranchProgram(branch).sourceName,
    );
};

/** Process calls to store artwork labels */
export const addArtworkCalls = (branches: AST.Node[][]) => {
    branches.forEach((branch) => {
        addProgramArtwork(
            getBranchProgram(branch),
            getArtworkCallLabel(branch),
        );
    });
};

/** Adds program errors for media that does not exist */
export const addMediaCalls = (branches: AST.Node[][]) => {
    const showMissing =
        !!getConfigValue(constants.ATTRACT_MODE_PATH) &&
        getConfigValue(constants.SHOW_MISSING_ENABLED, true);
    if (!showMissing) return;

    const message = constants.FILE_MISSING_MESSAGE;
    const mediaCalls = filterBranchCallMethods(branches, [
        constants.FE_ADD_IMAGE,
        constants.FE_ADD_MUSIC,
        constants.FE_ADD_SOUND,
    ]);
    const shaderCalls = filterBranchCallMethods(branches, [
        constants.FE_ADD_SHADER,
    ]);

    // media calls have a single filename as their first param
    mediaCalls.forEach((branch) => {
        const filename = getNodeImportFilename(branch, 0);
        if (filename === "") {
            const args = (<AST.CallExpression>branch.at(-1)).arguments;
            addProgramErrors(
                getBranchProgram(branch),
                [{ message, loc: args[0].loc }],
                DiagnosticSeverity.Warning,
            );
        }
    });

    // shader methods have up to 2 filenames
    shaderCalls.forEach((branch) => {
        for (let index = 1; index <= 2; index++) {
            const filename = getNodeImportFilename(branch, index);
            if (filename === "") {
                const args = (<AST.CallExpression>branch.at(-1)).arguments;
                addProgramErrors(
                    getBranchProgram(branch),
                    [{ message, loc: args[index].loc }],
                    DiagnosticSeverity.Warning,
                );
            }
        }
    });
};

// -----------------------------------------------------------------------------

/** Returns true if Image is supported */
export const isSupportedImage = (filename: string): boolean =>
    filenameHasExtension(filename, imageExtensions);

/** Returns true if Video is supported */
export const isSupportedVideo = (filename: string): boolean =>
    filenameHasExtension(filename, videoExtensions);

/** Returns true if Audio is supported */
export const isSupportedAudio = (filename: string): boolean =>
    filenameHasExtension(filename, audioExtensions);

/** Returns true if Shader is supported */
export const isSupportedShader = (filename: string): boolean =>
    filenameHasExtension(filename, shaderExtensions);

const byteExt = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

/** Format bytes number into a string that matches VSCode formatting */
export const formatBytes = (bytes: number): string => {
    let ext = 0;
    let b = 1024;
    while (bytes >= b && ext < byteExt.length) {
        bytes /= b;
        ext++;
    }
    const value =
        ext === 0
            ? bytes.toString()
            : bytes.toFixed(2).replace(/(\.\d)$/, "$10");
    return value + byteExt[ext];
};

/**
 * Return markdown string if image is valid
 * - VSCode accepts a subset of html tags - not all are documented however (VIDEO)
 * - https://github.com/microsoft/vscode/blob/6d2920473c6f13759c978dd89104c4270a83422d/src/vs/base/browser/markdownRenderer.ts#L296
 */
export const getImageMarkdownString = (
    filename: string,
    sourceName: string,
    size: number,
): MarkdownString | undefined => {
    if (!fileExists(filename)) return;
    const isImage = isSupportedImage(filename);
    const isVideo = isSupportedVideo(filename);
    if (!isImage && !isVideo) return;

    const autoplay = getConfigValue(constants.HOVER_VIDEO_AUTOPLAY);
    const controls = autoplay ? "muted autoplay loop" : "controls loop";

    // let width = size; //constants.HOVER_IMAGES_WIDTH;
    // let height = size; //constants.HOVER_IMAGES_HEIGHT;
    const pad = constants.HOVER_IMAGES_PADDING;
    const tw = size + pad;
    const th = size + pad;

    const mediaAttr = readMediaAttributes(filename);
    let { width: w, height: h, size: s } = mediaAttr;
    if (!w || !h) return;
    const filesize = formatBytes(s);

    // Markdown only accepts relative images
    const basePath = path.dirname(sourceName) + "/";
    const relFilename = path.relative(basePath, filename);

    let mw = w;
    let mh = h;
    if (mw > size || mh > size) {
        mw = Math.round((size / h) * w);
        mh = Math.round(size);
        if (mw > size) {
            mw = Math.round(size);
            mh = Math.round((size / w) * h);
        }
    }

    const media = isImage
        ? `<img width="${mw}" height="${mh}" src="${relFilename}"/>`
        : `<video width="${mw}" height="${mh}" ${controls}><source src="${relFilename}"/></video>`;
    const table = `<table width="${tw}" height="${th}"><tr><td align="center">${media}</td></tr></table>`;

    const label = `<table width="${tw}"><tr><td>${w}x${h}</td><td align="right">${filesize}</td></tr></table>`;

    const contents = new MarkdownString();
    contents.supportHtml = true;
    contents.baseUri = Uri.file(basePath);
    contents.appendMarkdown(table + label);
    contents.isTrusted = true;
    return contents;
};

/** Return filename completions */
export const getMediaCompletions = (
    sourceName: string,
    condition: (name) => boolean,
    size: number,
): CompletionItem[] => {
    const nutPath = getRelativeNutPath(sourceName);
    if (!nutPath) return [];

    return readDir(nutPath, true)
        .filter((name) => condition(name))
        .map((name) => {
            name = forwardSlash(name);
            const item = new CompletionItem(name, CompletionItemKind.File);
            item.commitCharacters = ['"'];
            item.documentation = getImageMarkdownString(
                path.join(nutPath, name),
                sourceName,
                size,
            );
            return item;
        });
};

/** Return all image files relative to nut path */
export const getImageCompletions = (sourceName: string): CompletionItem[] =>
    getMediaCompletions(
        sourceName,
        isSupportedImage,
        constants.HOVER_IMAGE_SIZE_LG,
    );

/** Return all video files relative to nut path */
export const getVideoCompletions = (sourceName: string): CompletionItem[] =>
    getMediaCompletions(
        sourceName,
        isSupportedVideo,
        constants.HOVER_IMAGE_SIZE_LG,
    );

/** Return all audio files relative to nut path */
export const getAudioCompletions = (sourceName: string): CompletionItem[] =>
    getMediaCompletions(sourceName, isSupportedAudio, 0);

/** Return all shader files relative to nut path */
export const getShaderCompletions = (sourceName: string): CompletionItem[] =>
    getMediaCompletions(sourceName, isSupportedShader, 0);

// -----------------------------------------------------------------------------

let artworkDir: string;
let artworkScanLabels: string[] = [];
let artworkCompletions: CompletionItem[] = [];

/**
 * Combine config list of label with scanned labels
 * - snap,marquee,flyer,wheel
 */
export const refreshArtworkLabels = () => {
    artworkCompletions = scanArtworkLabels()
        .concat(
            getConfigValue(constants.ATTRACT_MODE_ARTWORK, "")
                .replace(/[ ,;|]+/g, ";")
                .split(";"),
        )
        .map((label) => label.trim())
        .filter((label) => label)
        .filter(uniqueFilter)
        .map((label) => new CompletionItem(label, CompletionItemKind.Keyword));
};

const artworkRegex = new RegExp(/^artwork\s+(?<label>[^\s]+)/gm);

/** Scan all emulator config for artwork resource labels */
export const scanArtworkLabels = () => {
    if (!getConfigValue(constants.SCAN_ARTWORK_ENABLED)) {
        artworkDir = "";
        return [];
    }
    const dir = getConfigValue(constants.ATTRACT_MODE_PATH, "");
    if (artworkDir === dir) return artworkScanLabels;

    artworkDir = dir;
    const emuDir = path.join(dir, constants.FE_EMULATORS_PATH);
    const files = readDir(emuDir);
    artworkScanLabels = files
        .filter((file) => filenameHasExtension(file, [".cfg"]))
        .flatMap((file) => {
            artworkRegex.lastIndex = 0;
            const content = readFile(path.join(emuDir, file));
            let match: RegExpExecArray;
            const emuLabels = [];
            while ((match = artworkRegex.exec(content))) {
                emuLabels.push(match.groups.label);
            }
            return emuLabels;
        })
        .map((label) => label.trim())
        .filter((label) => label)
        .filter(uniqueFilter);
    return artworkScanLabels;
};

export const getArtworkCompletions = (): CompletionItem[] => artworkCompletions;
