import {
    CancellationToken,
    CompletionContext,
    CompletionItem,
    CompletionItemProvider,
    Position,
    ProviderResult,
    TextDocument,
} from "vscode";
import { getCompletions } from "../utils/completion";
import { docPosToPos } from "../utils/location";
import { requestProgram } from "../utils/program";
import { AST } from "../ast";
import { getBranchAtPos } from "../utils/find";

export class SquirrelCompletionItemProvider implements CompletionItemProvider {
    public enabled: boolean = true;

    provideCompletionItems(
        document: TextDocument,
        position: Position,
        token: CancellationToken,
        context: CompletionContext,
    ): ProviderResult<CompletionItem[]> {
        if (!this.enabled) return;
        return requestProgram(
            document,
            token,
            (program: AST.Program) => {
                const pos = docPosToPos(document, position);
                return getCompletions(getBranchAtPos(program, pos));
            },
        );
    }
}
