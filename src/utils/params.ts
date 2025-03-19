import { CompletionItem, ParameterInformation, SymbolKind } from "vscode";
import { AST } from "../ast";
import { DocAttr } from "../doc/kind";
import { getBranchFunctionDef, getBranchWithConstructor } from "./find";
import { getNodeSignature, updateNodeSignature } from "./signature";
import { getNutCompletions } from "./import";
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
        symbols.push(...getNodeParams(b).map((param) => {
            const name = isRestNode(param) ? "vargv" : getNodeName(param);
            return <DocumentSymbolExtra>{
                name,
                kind: SymbolKind.Variable,
                branch: param,
                insertText: name,
                documentation: getNodeParamInfo(param)?.documentation,
            };
        }));
    }
    return symbols;
}

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
            return ((<AST.MethodDefinition>node).value?.params ?? []).map((n) => [...branch, n]);
        case "FunctionDeclaration":
            return ((<AST.FunctionDeclaration>node).params ?? []).map((n) => [...branch, n]);
        case "FunctionExpression":
            return ((<AST.FunctionExpression>node).params ?? []).map((n) => [...branch, n]);
        case "LambdaExpression":
            return ((<AST.LambdaExpression>node).params ?? []).map((n) => [...branch, n]);
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

/** Return parameterInfo for a parameter type node, or undefined */
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
    info: ParameterInformationExtra
) => {
    nodeParamInfoMap.set(node, info);
};


const nodeCallParamInfoMap = new WeakMap<AST.Node, ParameterInformationExtra[]>();

/** Return node parameter information array */
export const getNodeCallParamInfo = (
    branch: AST.Node[],
): ParameterInformationExtra[] => {
    const node = branch.at(-1);
    if (!node) return [];
    if (!nodeCallParamInfoMap.has(node)) {
        // call method to update signature plus param info
        updateNodeSignature(branch);
    }
    return nodeCallParamInfoMap.get(node);
};

export const setNodeCallParamInfo = (
    node: AST.Node,
    info: ParameterInformationExtra[]
) => {
    nodeCallParamInfoMap.set(node, info);
}

export const limitParamIndex = (
    index: number,
    parameters: ParameterInformationExtra[]
): number =>
    (index >= parameters.length && parameters.at(-1)?.rest)
        ? parameters.length - 1
        : index

/** Get parameter suggestions */
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

    const parameters = getNodeCallParamInfo(infoBranch);
    paramIndex = limitParamIndex(paramIndex, parameters);
    const expected = parameters[paramIndex]?.attribute?.expected;
    if (!expected) return [];

    return expected.flatMap((item) => {
        const label = item.label["label"];
        if (label.indexOf("=") === 0) {
            // use a node's array values for completions
            return createNodeArrayCompletions(label.slice(1), program);
        } else {
            switch (label) {
                case "$module":
                    return getModuleCompletions();
                case "$artwork":
                    return getArtworkCompletions();
                case "$nut":
                    return getNutCompletions(program.sourceName);
                case "$image":
                    return getImageCompletions(program.sourceName);
                case "$video":
                    return getVideoCompletions(program.sourceName);
                case "$audio":
                    return getAudioCompletions(program.sourceName);
                case "$shader":
                    return getShaderCompletions(program.sourceName);
                default:
                    return [item];
            }
        }
    });

    // return getNameCompletions(expected, program);
};
