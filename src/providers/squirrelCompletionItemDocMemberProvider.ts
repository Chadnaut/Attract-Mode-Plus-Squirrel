import {
    CancellationToken,
    CompletionContext,
    CompletionItem,
    CompletionItemProvider,
    CompletionTriggerKind,
    Position,
    ProviderResult,
    TextDocument,
} from "vscode";
import { getCommentBlockAtPosition } from "../doc/find";
import { docPosToPos } from "../utils/location";
import { AST } from "../ast";
import { getProgramSnippets } from "../doc/snippets";
import { requestProgram } from "../utils/program";
import { stringToCompletionKind } from "../utils/kind";

/** DocBlock attribute completions */
export class SquirrelCompletionItemDocMemberProvider
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
                const comment = getCommentBlockAtPosition(program, pos);
                if (!comment) return;
                const kind = stringToCompletionKind("attr");
                return getProgramSnippets(program).filter((item) => item.kind === kind);
            },
        );
    }
}
