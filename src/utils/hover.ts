import { appendDocToMarkdown, createDocMarkdown } from "../doc/markdown";
import { Hover, MarkdownString } from "vscode";
import { getNodeDef } from "./definition";
import { getBranchAtPos } from "./find";
import { getNodeDoc } from "../doc/find";
import { AST } from "../ast";
import constants from "../constants";
import { getNodeLink } from "./import";
import { nodeToDocSelRange } from "./location";
import { getImageMarkdownString } from "./media";
import { DocAttr } from "../doc/kind";
import { getNodeSignature } from "./signature";
import { getNodeParamInfo } from "./params";
import { getBranchMetaCall } from "./meta";

/** Return hover info for node at position */
export const getHoverInfo = (branch: AST.Node[]): Hover | undefined => {
    const node = branch.at(-1);

    switch (node?.type) {
        case "Base":
        case "ThisExpression":
        case "RestElement":
        case "Identifier":
            break;
        default:
            return;
    }

    const nodeDef = getNodeDef(branch);
    const signature = getNodeSignature(nodeDef.length ? nodeDef : branch);
    let infoBranch = nodeDef;

    const contents = new MarkdownString();
    contents.supportHtml = true;
    contents.isTrusted = true;
    contents.appendCodeblock(signature, constants.LANGUAGE_ID);

    const nodeDoc = getNodeDoc(nodeDef);
    if (nodeDoc?.markdown) contents.appendMarkdown(nodeDoc.markdown.value);

    // SPECIAL - use meta _call hover info
    const branchCall = getBranchMetaCall(branch);
    appendDocToMarkdown(getNodeDoc(branchCall), contents);
    if (branchCall.length) infoBranch = branchCall;

    const paramInfo = getNodeParamInfo(infoBranch);
    if (paramInfo) {
        const attr = paramInfo.attribute;
        const attrs = attr
            ? [
                  <DocAttr>{
                      kind: "description",
                      documentation: attr.documentation,
                  },
                  attr,
              ]
            : [];
        const markdown = createDocMarkdown(attrs);
        if (markdown) contents.appendMarkdown(markdown.value);
    }

    return new Hover(contents, nodeToDocSelRange(node));
};

/** Return hover image for node at position */
export const getHoverImage = (
    program: AST.Program,
    pos: AST.Position,
    sourceName: string,
): Hover | undefined => {
    const branch = getBranchAtPos(program, pos);
    const node = branch.at(-1);
    if (node?.type !== "StringLiteral") return;

    const filename = getNodeLink(branch);
    const contents = getImageMarkdownString(filename, sourceName, constants.HOVER_IMAGE_SIZE_SM);
    if (!contents) return;

    return new Hover(contents, nodeToDocSelRange(node));
};
