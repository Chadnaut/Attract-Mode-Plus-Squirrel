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
import { docPosToPos } from "../utils/location";
import { AST } from "../ast";
import { getParamSuggestions } from "../utils/params";
import { getBranchAtPos } from "../utils/find";
import { requestProgram } from "../utils/program";

export class SquirrelCompletionItemParamProvider
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
                if (!branch.length) return;

                // exit if not opening quote
                const node = branch.at(-1);
                if (pos.index !== node.loc.start.index + 1) return;

                const text = document.getText();
                return getParamSuggestions(text, program, pos);
            },
        );
    }
}
