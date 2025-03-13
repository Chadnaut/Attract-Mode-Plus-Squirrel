import {
    CancellationToken,
    CompletionContext,
    CompletionItem,
    CompletionItemProvider,
    CompletionTriggerKind,
    Position,
    ProviderResult,
    Range,
    TextDocument,
} from "vscode";
import { docPosToPos, positionTranslate } from "../utils/location";
import { AST } from "../ast";
import { requestProgram } from "../utils/program";
import { getBranchAtPos } from "../utils/find";
import { getAttributeCompletions } from "../utils/attribute";
import constants from "../constants";

export class SquirrelCompletionItemAttributeProvider
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

        // Require prefix entered first
        const prefix = constants.ATTRIBUTE_PREFIX
        const prefixLen = prefix.length;
        const lastPos = positionTranslate(position, -prefixLen);
        if (document.getText(new Range(lastPos, position)) !== prefix) return;

        return requestProgram(
            document,
            token,
            (program: AST.Program) => {
                const pos = docPosToPos(document, position);
                const branch = getBranchAtPos(program, pos);
                return getAttributeCompletions(branch);
            },
        );
    }
}
