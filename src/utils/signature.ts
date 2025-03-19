import { MarkdownString, SignatureHelp, SignatureInformation } from "vscode";
import { getNodeDef, getNodeVal } from "./definition";
import {
    getNodeIsParameter,
    getNodeCallParamInfo,
    getNodeParamInfo,
    getNodeParams,
    ParameterInformationExtra,
    setNodeParamInfo,
    setNodeCallParamInfo,
    isRestNode,
    limitParamIndex,
} from "./params";
import { AST } from "../ast";
import {
    getBranchCallable,
    getBranchClassDef,
    getBranchId,
    getNodeArrayElementType,
    getNodeOverloads,
} from "./find";
import { getDocAttr, getNodeDoc } from "../doc/find";
import { addBranchId, getNodeName } from "./identifier";
import { nodeToSquirrelType, SquirrelType } from "./kind";
import { getNodeReturn } from "./return";
import { DocAttr } from "../doc/kind";
import { getNodeCallData } from "./call";
import { getNodeToken } from "./token";
import { getBranchMetaCall, getNodeMeta } from "./meta";
import { formatDocumentation, formatVersion } from "../doc/markdown";
import { attrToNode } from "./create";

/** Create SignatureHelp object */
export const getSignatureHelp = (
    documentText: string,
    program: AST.Program,
    pos: AST.Position,
    activeSignature?: number,
): SignatureHelp | undefined => {
    const callData = getNodeCallData(documentText, program, pos);
    if (!callData) return;

    let { branch, paramIndex } = callData;
    const node = branch.at(-1);
    const signatureHelp = new SignatureHelp();

    getNodeOverloads(branch).forEach((overloadBranch, i) => {
        let infoBranch = overloadBranch;

        // SPECIAL - use meta _call signature help info
        const branchCall = getBranchMetaCall(overloadBranch);
        if (branchCall.length) infoBranch = branchCall;
        const call = getDocAttr(getNodeDoc(branchCall), "description");

        const n = overloadBranch.at(-1);
        const docBlock = getNodeDoc(overloadBranch);//infoBranch);
        const signature = getNodeSignature(overloadBranch);
        const parameters = getNodeCallParamInfo(infoBranch);
        paramIndex = limitParamIndex(paramIndex, parameters);

        const documentation = getDocAttr(docBlock, "description");
        const version = getDocAttr(docBlock, "version");

        const contents = new MarkdownString();
        contents.supportHtml = true;
        contents.isTrusted = true;
        if (documentation) contents.appendMarkdown(formatDocumentation(documentation));
        if (documentation && call) contents.appendMarkdown("\n\n");
        if (call) contents.appendMarkdown(formatDocumentation(call));
        if (version) contents.appendMarkdown(formatVersion(version));

        const signatureInfo = new SignatureInformation(signature, contents);
        signatureInfo.parameters.push(...parameters);
        signatureHelp.signatures.push(signatureInfo);

        if (n === node) signatureHelp.activeSignature = i;
    });

    signatureHelp.activeParameter = paramIndex;
    if (activeSignature !== undefined) {
        signatureHelp.activeSignature = activeSignature;
    }

    return signatureHelp;
};

const nodeSignatureMap = new WeakMap<AST.Node, string>();

/**
 * Return node signature string for nodeValue nodes
 * - FunctionDeclaration = function foo(x: any): null
 */
export const getNodeSignature = (branch: AST.Node[]): string | undefined => {
    const node = branch.at(-1);
    if (!node) return;
    if (!nodeSignatureMap.has(node)) updateNodeSignature(branch);
    return nodeSignatureMap.get(node);
};

/** Return type suffix string with colon separator */
const formatReturnType = (type: string): string => {
    if (type === "*" || type === undefined) type = "any";
    return `: ${type}`;
};

/**
 * Return class name node belongs to
 * - Container class for regular nodes
 * - Superclass for "base" node
 */
const getClassName = (branch: AST.Node[]): string => {
    const nodeClassDef = getBranchClassDef(branch);
    const id = addBranchId(nodeClassDef);
    if (!id.length) return "";
    // Alias used with type-completions
    const alias = getDocAttr(getNodeDoc(id), "alias");
    return alias ? alias.name : getBranchId(id).name;
};

/** Return base className with node name as its member */
const getClassMemberName = (branch: AST.Node[], memberName: string): string => {
    const node = branch.at(-1);
    const classDef = getBranchClassDef(branch);
    const baseName = (classDef.at(-1) !== node && getBranchId(classDef) !== node) ? getClassName(branch) : "";
    return baseName ? `${baseName}.${memberName}` : memberName;
};

/** Return enum with node name */
const getEnumName = (branch: AST.Node[]): string => {
    return `${getBranchId(branch.slice(0, -1)).name}.${getBranchId(branch).name}`;
};

/**
 * Node type as a display value for signatures
 * - "class" to the actual class name
 * - "enum" to the actual enum name
 * - "array" to `[]`
 */
export const getNodeDisplayType = (
    branch: AST.Node[],
    allowSelf = true,
): string => {
    const nodeId = getBranchId(branch);

    let nodeValue = getNodeVal(branch);
    if (!nodeValue.length) nodeValue = branch;
    const nodeType = nodeToSquirrelType(nodeValue);

    switch (nodeType) {
        case SquirrelType.CLASS: {
            // use alias for display if it exists
            const idBranch = addBranchId(nodeValue);
            const alias = getDocAttr(getNodeDoc(idBranch), "alias");
            if (alias) return alias.name;
            // use name of class for display
            const id = getBranchId(idBranch);
            if (id && (allowSelf || id !== nodeId)) return id.name;
            break;
        }
        case SquirrelType.ENUM: {
            // use name of enum for return display
            const id = getBranchId(nodeValue);
            if (id && (allowSelf || id !== nodeId)) return id.name;
            break;
        }
        case SquirrelType.TABLE: {
            // use name of @enum table for return display
            const id = getBranchId(nodeValue.slice(0, -1));
            if (getNodeToken(id) !== "enum") break; // must be @enum
            return id.name;
        }
        case SquirrelType.ARRAY: {
            return `${getNodeArrayElementType(nodeValue)}[]`;
        }
    }

    return nodeType;
};

/** Create "(method) foo.bar(arg: any): integer" signature label used in completions */
const buildNodeSignature = (branch: AST.Node[]) => {

    const idBranch = branch;
    let prefix: string;

    // SPECIAL - use meta _call signature for completions
    const branchCall = getBranchMetaCall(branch);
    if (branchCall.length) {
        branch = branchCall;
        prefix = "function";
    }

    const node = branch.at(-1);
    switch (node.type) {
        case "Base":
            return "any";
        default: {
            let signature = "";
            signature += (prefix ?? getSignaturePrefix(branch)) + " "; // (method)
            signature += getSignatureName(idBranch); // foo.bar

            signature = signature.trim();
            if (!signature) return "any"; // exit early if no name or prefix

            signature += getSignatureParameters(branch, signature.length); // (arg: any)
            signature += getSignatureSuffix(branch); // : integer
            return signature;
        }
    }
}

/**
 * Create and stores node signature
 * - Also updates ParameterInformation
 * - Intended to be called on DEFINITIONS (rather than identifiers)
 */
export const updateNodeSignature = (branch: AST.Node[]) => {
    const node = branch.at(-1);
    if (!node) return;
    nodeSignatureMap.set(node, buildNodeSignature(branch));
};

/** Return `(prefix)` value signature */
const getSignaturePrefix = (branch: AST.Node[]): string => {
    let type = nodeToSquirrelType(branch) ?? "";

    switch (type) {
        case SquirrelType.METHOD:
            return "(method)";
        case SquirrelType.PARAMETER:
            return "(parameter)";
        case SquirrelType.PROPERTY: {
            const b = addBranchId(branch);
            const meta = getNodeMeta(b.at(-1));
            return meta ? `(${meta})` : "(property)";
        }
        case SquirrelType.ENUMMEMBER:
            return "(enum member)";
        case SquirrelType.GLOBAL:
            return "(global)";
        case SquirrelType.ANY:
            return "";
        default:
            return type;
    }
};

/** Return `object.property` value for the signature */
const getSignatureName = (branch: AST.Node[]): string => {
    const b = addBranchId(branch);
    let name = getNodeName(b, true);
    const type = nodeToSquirrelType(branch);

    switch (type) {
        case SquirrelType.CLASS:
        case SquirrelType.CONSTRUCTOR:
            return getClassName(branch);
        case SquirrelType.METHOD:
            return getClassMemberName(branch, name);
        case SquirrelType.PROPERTY:
            return getClassMemberName(branch, name);
        case SquirrelType.ENUMMEMBER:
            return getEnumName(branch);
        default:
            return name;
    }
};

/** Get end of signature, usually ": type" suffix */
export const getSignatureSuffix = (branch: AST.Node[]): string => {
    const node = branch.at(-1);

    if (node.type === "ClassDeclaration") return "";
    if (node.type === "EnumDeclaration") return "";

    if (node.type === "EnumMember") {
        const { init } = <AST.EnumMember>node;
        return init ? ` = ${init.raw}` : formatReturnType("any");
    }

    const docType = getDocAttr(getNodeDoc(branch), "type")?.type;
    if (docType) return formatReturnType(docType);

    const nodeValue = getNodeVal(branch);
    const callableNode = getBranchCallable(nodeValue);
    if (callableNode.length) {
        const returnName = getNodeDisplayType(getNodeReturn(callableNode));
        return formatReturnType(returnName);
    }

    if (getNodeIsParameter(branch)) {
        const info = getNodeParamInfo(branch);
        return formatReturnType(info?.attribute?.type);
    }

    if (!nodeValue.at(-1)?.type) {
        return formatReturnType("any");
    }

    let nodeDef = getNodeDef(branch);
    if (nodeDef.length) {
        const nodeType = getNodeDisplayType(nodeDef, false);
        return formatReturnType(nodeType);
    }

    return "";
};

/**
 * Return signature string for params
 * - (a: string)
 * - Also store params info on node for inlay hints
 */
export const getSignatureParameters = (
    branch: AST.Node[],
    offset: number, // offset for param hint positioning
): string => {
    const node = branch.at(-1);
    const nodeValue = getNodeVal(branch);
    const callableNode = getBranchCallable(nodeValue).at(-1);
    let parameters: ParameterInformationExtra[] = [];
    let signature = "";

    if (callableNode) {
        switch (callableNode.type) {
            case "FunctionExpression":
            case "LambdaExpression":
                signature += ": function";
                break;
        }

        const docBlock = getNodeDoc(branch);
        const params = getNodeParams(nodeValue);

        signature += "(";
        parameters = params.map((paramBranch, i) => {
            const param = paramBranch.at(-1);
            if (i) signature += ", ";
            const start = signature.length;

            const isRest = isRestNode(paramBranch);
            const nodeName = isRest
                ? "..."
                : getBranchId(paramBranch).name;
            const sigName = getNodeName(paramBranch, true);

            let attr = getDocAttr(docBlock, "param", nodeName);
            if (!attr && param.type === "AssignmentPattern") {
                attr = <DocAttr>{
                    documentation: "",
                    type: nodeToSquirrelType(getNodeVal(paramBranch)),
                };
            }
            const optional = param.type === "AssignmentPattern" ? "?" : "";
            const displayType = attr?.type ? getNodeDisplayType([attrToNode(attr)]) : "any";
            signature += sigName + optional + formatReturnType(displayType);

            const info = new ParameterInformationExtra([
                offset + start,
                offset + signature.length,
            ]);
            if (attr) {
                info.documentation = attr.documentation;
                info.attribute = attr;
            }
            info.rest = isRest;

            setNodeParamInfo(param, info);
            return info;
        });
        signature += ")";
    }

    setNodeCallParamInfo(node, parameters);
    return signature;
};
