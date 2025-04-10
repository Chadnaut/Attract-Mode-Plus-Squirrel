import {
    CompletionItem,
    DiagnosticSeverity,
    ParameterInformation,
    SymbolKind,
} from "vscode";
import { AST } from "../ast";
import { DocAttr } from "../doc/kind";
import { getBranchFunctionDef, getBranchWithConstructor } from "./find";
import { getNodeSignature, updateNodeSignature } from "./signature";
import {
    getFileCompletions,
    getNutCompletions,
    getNodeExpectedArgument,
} from "./import";
import {
    getAudioCompletions,
    getImageCompletions,
    getVideoCompletions,
    getShaderCompletions,
    getArtworkCompletions,
} from "./media";
import { getNodeCallData } from "./call";
import { createNodeArrayCompletions } from "./completion";
import { getNodeToken } from "./token";
import { getModuleCompletions } from "./module";
import { DocumentSymbolExtra } from "./symbol";
import { getNodeName } from "./identifier";
import { getBranchMetaCall } from "./meta";
import constants from "../constants";
import { getNodeDef } from "./definition";
import { DiagnosticError } from "./diagnostics";
import { getProgramCalls } from "./map";
import { getConfigValue } from "./config";

export class ParameterInformationExtra extends ParameterInformation {
    attribute?: DocAttr;
    rest?: boolean;
}

const restNodeMap = new WeakSet<AST.Node>();

export const setRestNode = (branch: AST.Node[]) =>
    restNodeMap.add(branch.at(-1));

/** Returns true if rest node */
export const isRestNode = (branch: AST.Node[]): boolean =>
    restNodeMap.has(branch.at(-1));

/** Return array of param symbols for entire branch */
export const getParamSymbols = (branch: AST.Node[]): DocumentSymbolExtra[] => {
    const symbols = [];
    let b = branch;
    while (b.length) {
        b = getBranchFunctionDef(b.slice(0, -1));
        symbols.push(
            ...getNodeParams(b).map((param) => {
                const name = isRestNode(param) ? "vargv" : getNodeName(param);
                return <DocumentSymbolExtra>{
                    name,
                    kind: SymbolKind.Variable,
                    branch: param,
                    insertText: name,
                    documentation: getNodeParamInfo(param)?.documentation,
                };
            }),
        );
    }
    return symbols;
};

/**
 * Return array of node params, or empty array
 * - Node must have params (does not search/traverse since it's used on extra-init)
 * - Params will consist of Identifier, AssignmentPattern or RestElement nodes
 */
export const getNodeParams = (branch: AST.Node[]): AST.Node[][] => {
    const node = branch.at(-1);
    switch (node?.type) {
        case "ClassExpression":
        case "ClassDeclaration": {
            // SPECIAL: classes inherit their constructors params
            return getNodeParams(getBranchWithConstructor(branch));
        }
        case "MethodDefinition":
            return ((<AST.MethodDefinition>node).value?.params ?? []).map(
                (n) => [...branch, n],
            );
        case "FunctionDeclaration":
            return ((<AST.FunctionDeclaration>node).params ?? []).map((n) => [
                ...branch,
                n,
            ]);
        case "FunctionExpression":
            return ((<AST.FunctionExpression>node).params ?? []).map((n) => [
                ...branch,
                n,
            ]);
        case "LambdaExpression":
            return ((<AST.LambdaExpression>node).params ?? []).map((n) => [
                ...branch,
                n,
            ]);
        default:
            return [];
    }
};

/**
 * Return true if node ID is parameter (not AssignmentPattern)
 */
export const getNodeIsParameter = (branch: AST.Node[]): boolean =>
    getNodeToken(branch.at(-1)) === "parameter";

const nodeParamInfoMap = new WeakMap<AST.Node, ParameterInformationExtra>();

/**
 * Return ParameterInformation for a parameter definition node
 * - Info contain label highlight start and end
 * - Used to highlight part of a signature during completion
 */
export const getNodeParamInfo = (
    branch: AST.Node[],
): ParameterInformationExtra | undefined => {
    const node = branch.at(-1);
    if (!getNodeIsParameter(branch)) return;
    if (!nodeParamInfoMap.has(node)) {
        // fetching the signature updates will call setNodeParamInfo
        getNodeSignature(getBranchFunctionDef(branch));
    }
    return nodeParamInfoMap.get(node);
};

export const setNodeParamInfo = (
    node: AST.Node,
    info: ParameterInformationExtra,
) => {
    nodeParamInfoMap.set(node, info);
};

const nodeArgsParamInfoMap = new WeakMap<
    AST.Node,
    ParameterInformationExtra[]
>();

/** Return array of ParameterInformation for a callable definition */
export const getNodeArgsParamInfo = (
    branch: AST.Node[],
): ParameterInformationExtra[] => {
    const node = branch.at(-1);
    if (!node) return [];
    if (!nodeArgsParamInfoMap.has(node)) {
        nodeArgsParamInfoMap.set(node, []);
        // call method to update signature plus param info
        updateNodeSignature(branch);
    }
    return nodeArgsParamInfoMap.get(node);
};

export const setNodeArgsParamInfo = (
    node: AST.Node,
    info: ParameterInformationExtra[],
) => {
    nodeArgsParamInfoMap.set(node, info);
};

export const limitParamIndex = (
    index: number,
    parameters: ParameterInformationExtra[],
): number =>
    index >= parameters.length && parameters.at(-1)?.rest
        ? parameters.length - 1
        : index;

/** Get parameter suggestions for call at position */
export const getParamSuggestions = (
    documentText: string,
    program: AST.Program,
    pos: AST.Position,
): CompletionItem[] => {
    const callData = getNodeCallData(documentText, program, pos);
    if (!callData) return [];
    let { branch, paramIndex } = callData;
    let infoBranch = branch;

    // SPECIAL - use meta _call param suggestions
    const branchCall = getBranchMetaCall(branch);
    if (branchCall.length) infoBranch = branchCall;

    const parameters = getNodeArgsParamInfo(infoBranch);
    paramIndex = limitParamIndex(paramIndex, parameters);
    return getParamInfoSuggestions(program, parameters[paramIndex]);
};

/** Get param suggestions for a paramInfo object */
export const getParamInfoSuggestions = (
    program: AST.Program,
    paramInfo: ParameterInformationExtra,
): CompletionItem[] => {
    const expected = paramInfo?.attribute?.expected;
    if (!expected) return [];

    return expected.flatMap((item) => {
        const label = item.label["label"];
        if (label.indexOf("=") === 0) {
            // use a node's array values for completions
            return createNodeArrayCompletions(label.slice(1), program);
        } else {
            switch (label) {
                case constants.EXP_MODULE:
                    return getModuleCompletions();
                case constants.EXP_ARTWORK:
                    return getArtworkCompletions();
                case constants.EXP_FILE:
                    return getFileCompletions(program.sourceName);
                case constants.EXP_NUT:
                    return getNutCompletions(program.sourceName);
                case constants.EXP_IMAGE:
                    return getImageCompletions(program.sourceName);
                case constants.EXP_VIDEO:
                    return getVideoCompletions(program.sourceName);
                case constants.EXP_AUDIO:
                    return getAudioCompletions(program.sourceName);
                case constants.EXP_SHADER:
                    return getShaderCompletions(program.sourceName);
                default:
                    return [item]; // ???
            }
        }
    });
};

/** Get "expected" attribute for a CallExpression arg */
export const getNodeArgExpected = (branch: AST.Node[]): CompletionItem[] => {
    const arg = branch.at(-1);
    if (!arg) return [];

    const call = branch.slice(0, -1);
    const callNode = <AST.CallExpression>call.at(-1);
    if (callNode?.type !== "CallExpression") return [];
    const nodeDef = getNodeDef([...call, callNode.callee]);
    const paramInfos = getNodeArgsParamInfo(nodeDef);
    const index = limitParamIndex(callNode.arguments.indexOf(arg), paramInfos);

    const paramInfo = paramInfos[index];
    return paramInfo?.attribute?.expected ?? [];
};

export const getNodeArgExpectedLabels = (branch: AST.Node[]): string[] =>
    getNodeArgExpected(branch).map((exp) => exp.label["label"]);

/** Adds program errors for media that does not exist */
export const getProgramArgErrors = (
    program: AST.Program,
): DiagnosticError[] => {
    if (!getConfigValue(constants.ATTRACT_MODE_PATH)) return [];
    if (!getConfigValue(constants.SHOW_MISSING_ENABLED, true)) return [];

    const message = constants.FILE_MISSING_MESSAGE;
    const errors: DiagnosticError[] = [];
    getProgramCalls(program).forEach((branch) => {
        const callNode = <AST.CallExpression>branch.at(-1);
        callNode.arguments.forEach((arg, index) => {
            const value = getNodeExpectedArgument([...branch, arg]);
            if (value === "") {
                errors.push({
                    message,
                    loc: arg.loc,
                    severity: DiagnosticSeverity.Warning,
                });
            }
        });
    });

    return errors;
};
