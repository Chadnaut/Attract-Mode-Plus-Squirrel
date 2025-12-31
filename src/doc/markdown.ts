import { MarkdownString } from "vscode";
import { DocAttr, DocBlock } from "./kind";
import { META_KINDS } from "../utils/meta";
import { ucfirst } from "../utils/string";

// -----------------------------------------------------------------------------

/**
 * Format description for popups
 * - single line desc gets dash
 * - multiline desc starts on next line
 */
const formatDesc = (desc: string): string => {
    if (!desc) return "";
    if (desc.indexOf("\n") !== -1) return `\n\n${desc}`;
    return ` — ${desc}`;
};

/** Create markdown-style link */
const formatLink = (name: string, link: string): string => {
    if (!name && !link) return "";
    if (!link) return ` ${name}`;
    return ` [${name}](${link})`;
};

export const formatDocumentation = (attr: DocAttr): string => {
    const { documentation } = attr;
    return documentation; // `\n\n${documentation}`;
};

const formatParam = (attr: DocAttr): string => {
    const { kind, rest, name, documentation } = attr;
    const desc = formatDesc(documentation);
    return "\n\n" + `@${kind} \`${name}${rest ?? ""}\`${desc}`.trim();
};

const formatReturns = (attr: DocAttr): string => {
    const { kind, documentation } = attr;
    if (!documentation) return "";
    const desc = formatDesc(documentation);
    return `\n\n` + `@${kind}${desc}`.trim();
};

const formatDefault = (attr: DocAttr): string => {
    const { kind, name, link, documentation } = attr;
    if (!kind) return "";
    const href = formatLink(name, link);
    const desc = formatDesc(documentation);
    return `\n\n` + `@${kind}${href}${desc}`.trim();
};

const verRegex = new RegExp(/([^\r\n\t]*?) (http[^\s\t\r\n]+)[\s\t\r\n]*/g)

export const formatVersion = (attr: DocAttr): string => {
    let { kind, name, documentation } = attr;
    const text = name ? `${name} ${documentation}` : documentation;
    let output = "";

    let m;
    verRegex.lastIndex = 0;
    while ((m = verRegex.exec(text))) {
        const label = m[1].replace("_", " ");
        const url = m[2];
        output += `<a href="${url}">\`${label}\`</a> `;
    }

    if (output) output = `${ucfirst(kind)} ${output}`.trim();
    return output ? output : formatDefault(attr);
};

// -----------------------------------------------------------------------------

/** Create CompletionItem documentation */
export const createDocMarkdown = (
    attrs: DocAttr[],
): MarkdownString | undefined => {
    if (!attrs?.length) return;
    const md = new MarkdownString();
    md.supportHtml = true;

    for (const attr of attrs) {
        switch (attr.kind) {
            case "description": {
                // add the description before other content
                md.appendMarkdown(formatDocumentation(attr));
                break;
            }
        }
    }

    for (const attr of attrs) {
        if (META_KINDS.includes(attr.kind)) break;
        switch (attr.kind) {
            case "constructor":
            case "description": // prints first
            case "inheritdoc!":
            case "inheritdoc":
            case "variation":
            case "augments":
            case "external":
            case "constant":
            case "version": // prints last
            case "since":
            case "global":
            case "method":
            case "ignore":
            case "class":
            case "alias":
            case "lends":
            case "type":
            case "enum":
                // do not display these attributes
                break;
            case "param":
                md.appendMarkdown(formatParam(attr));
                break;
            case "returns":
                md.appendMarkdown(formatReturns(attr));
                break;
            default:
                md.appendMarkdown(formatDefault(attr));
                break;
        }
    }

    let footer = "";
    for (const attr of attrs) {
        switch (attr.kind) {
            case "version":
            case "since":
                footer += formatVersion(attr) + " ";
                break;
        }
    }
    if (footer) md.appendMarkdown(`\n\n<small>${footer.trim()}</small>`);

    md.value = md.value.trim();

    return md;
};

/** Append DocBlock markdown (if any) to target markdown, adds newlines if content exists */
export const appendDocToMarkdown = (doc: DocBlock, md: MarkdownString) => {
    if (!doc?.markdown) return;
    if (md.value) md.appendMarkdown("\n\n");
    md.appendMarkdown(doc.markdown.value);
}

/** Return MarkdownString value */
export const getMarkdownValue = (obj: string | MarkdownString): string =>
    (typeof obj === "string") ? obj : obj.value;