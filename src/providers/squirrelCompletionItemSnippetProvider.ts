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
        if (wordPrefix === ".") return;
        if (wordPrefix === "\"") return;
        if (wordPrefix === "*") return;

        return requestProgram(
            document,
            token,
            (program: AST.Program) => {
                const pos = docPosToPos(document, position);
                const branch = getBranchAtPos(program, pos);
                const isProperty = branch.at(-2)?.type === "PropertyDefinition";
                const completions = [program, ...getProgramImports(program)]
                    .flatMap((p) => getSnippetCompletions(p))
                    .filter(
                        (item) =>
                            item.kind !== CompletionItemKind.Event &&
                            (isProperty || item.kind !== CompletionItemKind.Property),
                    );
                return completions;
            },
        );
    }
}
