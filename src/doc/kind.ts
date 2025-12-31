import { CompletionItem, CompletionItemLabel, MarkdownString } from "vscode";
import { AST } from "../ast";
import { SourceLocation } from "../ast/ast";

/** Docblock type */
export type DocBlock = {
    attributes: DocAttr[];
    markdown?: MarkdownString;
    branch: AST.Node[];
};

/** Doc attribute type */
export type DocAttr = {
    kind?: string;
    type?: string;
    name?: string;
    rest?: string;
    link?: string;
    documentation?: string;
    expected?: CompletionItem[];
    loc?: SourceLocation;
};

const KIND_ORDER = [
    "description",
    "package",
    "summary",
    "version",
    "since",
    "author",
    "url",
    "requires",
    "artwork",
    "module",
];

/** Return weight for ordering attribute kinds */
export const getKindOrder = (kind: string): number => {
    const order = KIND_ORDER.findIndex((value) => value === kind);
    return order >= 0 ? order : KIND_ORDER.length;
};
