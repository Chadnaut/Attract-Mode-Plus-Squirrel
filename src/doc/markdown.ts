import { MarkdownString } from "vscode";
import { DocAttr } from "./kind";
import { META_KINDS } from "../utils/meta";

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
    let { name, documentation } = attr;
    const text = name ? `${name} ${documentation}` : documentation;
    let output = "";

    let m;
    verRegex.lastIndex = 0;
    while ((m = verRegex.exec(text))) {
        const label = m[1].replace("_", " ");
        const url = m[2];
        if (output) output += " ";
        output += `<small><a href="${url}">\`${label}\`</a></small>`;
    }
    return output ? `\n\n${output}` : formatDefault(attr);
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
            case "description":
            case "inheritdoc!":
            case "inheritdoc":
            case "variation":
            case "external":
            case "constant":
            case "version":
            case "method":
            case "ignore":
            case "class":
            case "alias":
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

    for (const attr of attrs) {
        switch (attr.kind) {
            case "version": {
                md.appendMarkdown(formatVersion(attr));
            }
        }
    }

    md.value = md.value.trim();

    return md;
};
