import {
    CancellationToken,
    CompletionContext,
    CompletionItem,
    CompletionItemKind,
    CompletionItemProvider,
    CompletionTriggerKind,
    Position,
    ProviderResult,
    TextDocument,
} from "vscode";
import { docPosToPos } from "../utils/location";
import { AST } from "../ast";
import { getBranchAtPos } from "../utils/find";
import { requestProgram, getProgramImports } from "../utils/program";
import { getSnippetCompletions } from "../doc/snippets";

/*
    NOTE: computed["property"] StringLiterals are converted to Identifiers
    - MagicTokens don't work there anyway

    Full completion functionality within strings requires vscode editor.quickSuggestions options
    - This is disabled by default, and requires extra handling so other completions don't appear in strings
    - Otherwise, only the triggerCharacter '[' shows completions, which will be hidden when focus is lost
*/

export class SquirrelCompletionItemMagicProvider
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
        if (context.triggerKind === CompletionTriggerKind.TriggerCharacter && !context.triggerCharacter) return;

        return requestProgram(
            document,
            token,
            (program: AST.Program) => {
                const pos = docPosToPos(document, position);
                const branch = getBranchAtPos(program, pos);
                if (branch.at(-1)?.type !== "StringLiteral") return [];
                return [program, ...getProgramImports(program)]
                    .flatMap((p) => getSnippetCompletions(p))
                    .filter((item) => item.kind === CompletionItemKind.Event);
            },
        );
    }
}
