import { getWordPrefix } from "../utils/document";
import {
    CancellationToken,
    CompletionContext,
    CompletionItem,
    CompletionItemKind,
    CompletionItemProvider,
    Position,
    ProviderResult,
    TextDocument,
} from "vscode";
import { requestProgram, getProgramImports } from "../utils/program";
import { AST } from "../ast";
import { docPosToPos } from "../utils/location";
import { getBranchAtPos } from "../utils/find";
import { getSnippetCompletions } from "../doc/snippets";
import { hasNodeDec } from "../utils/definition";
import { getCommentAtPosition } from "../doc/find";

const wordRegex = new RegExp(/^[A-Za-z_ ]/);

export class SquirrelCompletionItemSnippetProvider
    implements CompletionItemProvider
{
    public enabled: boolean = true;

    provideCompletionItems(
        document: TextDocument,
        position: Position,
        token: CancellationToken,
        context: CompletionContext,
    ): ProviderResult<CompletionItem[]> {
        if (!this.enabled) return;

        const wordPrefix = getWordPrefix(document, position, 1);
        if (wordPrefix && !wordRegex.test(wordPrefix)) return;

        return requestProgram(document, token, (program: AST.Program) => {
            const pos = docPosToPos(document, position);
            if (getCommentAtPosition(program, pos)) return;

            const branch = getBranchAtPos(program, pos);
            const isProperty = branch.at(-2)?.type === "PropertyDefinition";
            if (!isProperty && hasNodeDec(<AST.Identifier>branch.at(-1))) return;
            const kinds = isProperty ? [CompletionItemKind.Property] : [CompletionItemKind.Snippet, CompletionItemKind.Keyword];

            return [program, ...getProgramImports(program)]
                .flatMap((p) => getSnippetCompletions(p))
                .filter((item) => kinds.includes(item.kind));
        });
    }
}
