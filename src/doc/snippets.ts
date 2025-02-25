import {
    CompletionItem,
    CompletionItemKind,
    CompletionItemLabel,
    MarkdownString,
    SnippetString,
} from "vscode";
import constants from "../constants";
import { loadSnippets } from "../utils/snippets";
import { AST } from "../ast";
import { DocAttr, DocBlock } from "./kind";
import { createDocMarkdown } from "./markdown";
import { stringToCompletionKind } from "../utils/kind";
import {
    createCompletionLabel,
    getCompletionDescription,
    getCommitCharacters,
} from "../utils/completion";
import { printDocAttrs } from "./print";
import { getBranchProgram } from "../utils/find";
import { CommentBlock } from "../ast/ast";
import { getCommentDocBlock } from "./find";
import { getImportAttrs } from "../utils/program";

export const docBlockSnippets = loadSnippets(constants.SNIPPETS_PATH);

/** Kinds of doc attributes with names */
export const NamedDocAttrKinds = docBlockSnippets
    .filter((snippet) =>
        snippet.insertText.valueOf()["value"].match(/(\${\d+:name}|\s\${1\|)/i),
    )
    .map((snippet) => (<CompletionItemLabel>snippet.label).label);

// -----------------------------------------------------------------------------

const programSnippetMap = new WeakMap<AST.Program, CompletionItem[]>();

export const addSnippetCompletion = (
    program: AST.Program,
    completion: CompletionItem,
) => {
    if (!programSnippetMap.has(program)) programSnippetMap.set(program, []);
    programSnippetMap.get(program).push(completion);
};

export const getSnippetCompletions = (
    program: AST.Program,
): CompletionItem[] =>
    programSnippetMap.has(program) ? programSnippetMap.get(program) : [];

// -----------------------------------------------------------------------------

export const getDocBlockSnippets = (
    comment: CommentBlock,
): CompletionItem[] => {
    let snippets = docBlockSnippets.slice(0);
    const doc = getCommentDocBlock(comment);
    if (doc?.branch.length === 1) {
        snippets = injectRequiresCompletion(
            getBranchProgram(doc.branch),
            snippets,
        );
    }
    return snippets;
};

/** Replace @requires snippet with package summary */
const injectRequiresCompletion = (
    program: AST.Program,
    snippets: CompletionItem[],
): CompletionItem[] => {
    let importText = printDocAttrs(getImportAttrs(program));
    if (importText) {
        const index = snippets.findIndex(
            (snippet) =>
                (<CompletionItemLabel>snippet.label).label === "requires",
        );

        const prev = snippets[index];
        const item = new CompletionItem(prev.label, prev.kind);
        item.documentation = prev.documentation;
        item.insertText =
            "requires\n" + importText.replace(/^ /gm, "").replace(/\n$/, "");

        snippets.splice(index, 1, item);
    }
    return snippets;
};

// -----------------------------------------------------------------------------

/**
 * Create snippet completions contained in a docblock
 */
export const createDocSnippetCompletions = (
    docBlock: DocBlock,
    program: AST.Program,
): CompletionItem[] => {
    if (!docBlock) return [];
    let description = "";
    const items = [];

    for (let i = 0; i < docBlock.attributes.length; i++) {
        const attr = docBlock.attributes[i];
        let kind: CompletionItemKind;

        switch (attr.kind) {
            case "magic": {
                kind = CompletionItemKind.Event;
                // no break
            }
            case "keyword": {
                let nextAttr: DocAttr = undefined;
                let snippetAttr = undefined;
                let done = false;
                const keyword_attrs = [];
                keyword_attrs.push({
                    kind: "description",
                    documentation: attr.documentation,
                });
                while (!done) {
                    nextAttr = docBlock.attributes[i + 1];
                    switch (nextAttr?.kind) {
                        case "snippet":
                            if (kind === undefined) kind = CompletionItemKind.Snippet;
                            snippetAttr = nextAttr;
                            i++;
                            break;
                        case "kind":
                            kind = stringToCompletionKind(nextAttr.name);
                            i++;
                            break;
                        case "magic":
                        case "keyword":
                            done = true;
                            break;
                        default:
                            if (nextAttr) {
                                keyword_attrs.push(nextAttr);
                                i++;
                            } else {
                                done = true;
                            }
                            break;
                    }
                }
                const item = createDocSnippetCompletion(
                    attr.name,
                    createDocMarkdown(keyword_attrs).value,
                    snippetAttr?.documentation ?? attr.name,
                    kind ?? CompletionItemKind.Keyword,
                    description,
                    program,
                );
                items.push(item);
                break;
            }
        }
    }

    return items;
};

/**
 * Create a single completion
 */
export const createDocSnippetCompletion = (
    name: string,
    documentation?: string,
    insertText?: string,
    kind?: CompletionItemKind,
    description?: string,
    program?: AST.Program,
): CompletionItem | undefined => {
    if (!name) return;
    CompletionItemKind.Property;
    const label = createCompletionLabel(
        name,
        getCompletionDescription(description, program),
    );
    const item = new CompletionItem(label, kind);
    if (documentation) {
        item.documentation = new MarkdownString();
        item.documentation.appendMarkdown(documentation);
        item.documentation.supportHtml = true;
    }
    item.insertText = new SnippetString(insertText);
    item.commitCharacters = getCommitCharacters(kind);

    // special hard-coded commits
    switch (insertText) {
        case "this":
        case "base":
            item.commitCharacters.push(".");
            break;
    }

    return item;
};
