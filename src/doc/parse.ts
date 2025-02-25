import { CompletionItem, CompletionItemKind } from "vscode";
import { AST } from "../ast";
import { SquirrelType } from "../utils/kind";
import { DocAttr } from "./kind";
import { META_KINDS } from "../utils/meta";
import { NamedDocAttrKinds } from "./snippets";

const expectedRegex = RegExp(/^([^\(]*)\((.*?)\)$/);
const docBlockRegex = RegExp(
    // /(?:[\t ]*\*)? ?(?:@(?<kind>[^\s]+))? *(?:{(?<type>[^}]*)})? *(?<doc>(?<rest>\.{3})?(?<name>\$?[_A-Za-z][._A-Za-z0-9]*)? *(?:<(?<link>[^>]*)>)?[ \t\-]*(?<dh>\* ?)?(?<desc>[\w\W]*?(?=\n[\t ]*\*?[\t ]*@|$)\n?))/g
    /(?:[\t ]*\*)? ?(?:@(?<kind>[^\s]+))? *(?:{(?<type>[^}]*)})? *(?<doc>(?<rest>\.{3})?(?<name>\$?[._A-Za-z0-9]*)? *(?:<(?<link>[^>]*)>)?[ \t\-]*(?<dh>\* ?)?(?<desc>[\w\W]*?(?=\n[\t ]*\*?[\t ]*@|$)\n?))/g
);

/** Create completions from "expected" attribute */
const parseExpected = (
    type: string,
): { type: string; expected: CompletionItem[] } => {
    let expected = [];
    const m = expectedRegex.exec(type ?? "");
    if (m) {
        type = m[1] || SquirrelType.ANY;
        expected = m[2].split("|").map((label) => {
            const item = new CompletionItem({ label }, CompletionItemKind.Constant);
            item.commitCharacters = ['"'];
            return item;
        });
    }
    return { type, expected };
};

/** Parse commentBlock text and return array of docblock attributes */
export const parseCommentAttrs = (comment: AST.CommentBlock): DocAttr[] => {
    if (!comment || comment.type !== "CommentBlock" || !comment.docBlock)
        return [];

    return parseDocAttrs(comment.value, comment.loc?.start);
}

export const parseDocAttrs = (value: string, pos: AST.Position = { line: 0, column: 0, index: 0 }): DocAttr[] => {
    const attrs: DocAttr[] = [];

    let match;
    let lastIndex = -1;
    docBlockRegex.lastIndex = 0;
    while ((match = docBlockRegex.exec(value))) {
        if (lastIndex === docBlockRegex.lastIndex) break; // abort if no more matches
        lastIndex = docBlockRegex.lastIndex;
        if (!match[0].trim()) continue; // skip empty matches

        const groups = match.groups;
        const originalKind = groups['kind'];
        const named = NamedDocAttrKinds.includes(originalKind);
        const kind = originalKind ?? "description";
        const { type, expected } = parseExpected(groups['type']);
        const doc = groups['doc'];
        // if rest found (...) it will become "name", and name will become "rest"
        const rest = named ? (groups['rest'] ? groups['name'] : undefined) : undefined;
        let name = named ? (groups['rest'] ? groups['rest'] : groups['name']) : undefined;
        const link = named ? groups['link'] : undefined;
        const desc = groups['desc'];
        let documentation = (groups['dh'] || "") + (named ? desc : doc).replace(/^(?:[\t ]*\*)? ?/gm, "").trim();

        // special case for urls
        if (name && documentation.indexOf("://") === 0) {
            documentation = name + documentation;
            name = undefined;
        }

        let loc: AST.SourceLocation = null;
        if (META_KINDS.includes(kind) && name) {
            // Find property name location for nav / deprecation highlight
            // - Requires another regex to find exact location
            const propRegex = RegExp(`^[\\t\\* ]*@${kind} *(?:{[^}]+})? *${name}`, 'gm');
            const propMatch = propRegex.exec(value);
            const propIndex = propRegex.lastIndex;

            const slice = value.slice(0, propIndex).trimEnd();
            const line = pos.line + slice.split(/\r?\n/).length - 1;
            const column = propMatch[0].length;
            const n = name.length;
            const index = pos.index + propIndex + 3; // 3 == "/**"

            loc = {
                start: { line, column: column - n, index: index - n },
                end: { line, column, index }
            };
        }

        attrs.push({ kind, type, expected, rest, name, link, documentation, loc });
    }

    return attrs;
};
