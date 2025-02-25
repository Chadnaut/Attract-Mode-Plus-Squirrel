import { CompletionItem, CompletionItemKind, MarkdownString, SnippetString } from "vscode";
import { readJson } from "./file";
import * as path from "path";

/** Load snippets from file and return a CompletionItem array */
export const loadSnippets = (filename: string): CompletionItem[] => {
    const data = readJson(filename);
    if (!data) return [];

    const desc = path.basename(filename, ".code-snippets");

    return Object.keys(data).map((key) => {
        const { description, body } = data[key];
        const hasBody = body?.length > 0;
        const kind = hasBody ? CompletionItemKind.Snippet : CompletionItemKind.Keyword;
        const label = {
            label: key,
            description: desc,
        };
        const item = new CompletionItem(label, kind);
        if (description) {
            item.documentation = new MarkdownString();
            item.documentation.appendMarkdown(description);
            item.documentation.supportHtml = true;
        }
        item.insertText = hasBody ? new SnippetString(body.join("\n")) : key;

        return item;
    });
};
