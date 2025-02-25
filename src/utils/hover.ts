import { createDocMarkdown } from "../doc/markdown";
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

    const def = getNodeDef(branch);
    const docBlock = getNodeDoc(def);
    const signature = getNodeSignature(def.length ? def : branch);

    const contents = new MarkdownString();
    contents.supportHtml = true;
    contents.appendCodeblock(signature, constants.LANGUAGE_ID);
    if (docBlock?.markdown) contents.appendMarkdown(docBlock.markdown.value);

    const paramInfo = getNodeParamInfo(def); // (branch)
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
