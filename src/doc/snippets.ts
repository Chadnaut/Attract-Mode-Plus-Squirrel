import {
    CompletionItem,
    CompletionItemKind,
    CompletionItemLabel,
    MarkdownString,
    SnippetString,
} from "vscode";
import { AST } from "../ast";
import { DocAttr, DocBlock } from "./kind";
import { createDocMarkdown } from "./markdown";
import { stringToCompletionKind } from "../utils/kind";
import {
    getCompletionDescription,
    getCommitCharacters,
} from "../utils/completion";
import { printDocAttrs } from "./print";
import { getRequiredAttrs, getProgramImports } from "../utils/program";

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

export const getProgramSnippets = (program: AST.Program): CompletionItem[] => {
    if (!program) return [];
    return filterSnippets(
        program,
        [program, ...getProgramImports(program)].flatMap((p) =>
            getSnippetCompletions(p),
        ),
    );
};

/** Replace requires-type snippet with import summary */
export const filterSnippets = (
    program: AST.Program,
    snippets: CompletionItem[],
): CompletionItem[] => {
    const index = snippets.findIndex(
        (snippet) => (<CompletionItemLabel>snippet.label)?.label === "requires",
    );
    if (index == -1) return snippets;

    let importText = printDocAttrs(getRequiredAttrs(program));
    if (!importText) return snippets;
    importText = importText.replace(/^ /gm, "").replace(/\r?\n$/, "");

    const prev = snippets[index];
    const item = new CompletionItem(prev.label, prev.kind);
    item.documentation = prev.documentation;
    item.insertText = `requires\n${importText}`;

    snippets.splice(index, 1, item);
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

        if (attr.kind === "keyword") {
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
                        snippetAttr = nextAttr;
                        if (kind === undefined)
                            kind = CompletionItemKind.Snippet;
                        i++;
                        break;
                    case "kind":
                        kind = stringToCompletionKind(nextAttr.name);
                        i++;
                        break;
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
    const label = <CompletionItemLabel>{
        label: name,
        description: description || getCompletionDescription(program),
    };
    const item = new CompletionItem(label, kind);
    if (documentation) {
        item.documentation = new MarkdownString();
        item.documentation.appendMarkdown(documentation);
        item.documentation.supportHtml = true;
    }
    item.insertText = new SnippetString(insertText.replace(/\*\\\//g, '*/'));
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
