import {
    CancellationToken,
    CompletionContext,
    CompletionItem,
    CompletionItemKind,
    CompletionItemProvider,
    CompletionTriggerKind,
    Position,
    ProviderResult,
    Range,
    TextDocument,
} from "vscode";
import { getCommentAtPosition } from "../doc/find";
import { docPosToPos, positionTranslate } from "../utils/location";
import { AST } from "../ast";
import { requestProgram } from "../utils/program";
import { getConfigValue } from "../utils/config";
import constants from "../constants";

export class SquirrelCompletionItemDocRuleProvider
    implements CompletionItemProvider
{
    public mode: string;

    getLen = (): number => {
        switch (this.mode) {
            case "print":
                return getConfigValue(constants.CODE_FORMATTING_PRINT_WIDTH) ?? 0;
            case "ruler":
                return getConfigValue("editor.rulers")[0] ?? 0;
            default:
                return 0;
        }
    }

    provideCompletionItems(
        document: TextDocument,
        position: Position,
        token: CancellationToken,
        context: CompletionContext,
    ): ProviderResult<CompletionItem[]> {
        const width = this.getLen();
        if (!width) return;
        if (context.triggerKind === CompletionTriggerKind.TriggerCharacter && !context.triggerCharacter) return;

        // Require a number of characters to be entered first
        const hr = context.triggerCharacter;
        const prefix = hr.repeat(constants.DOCBLOCK_HR_COUNT);
        const prefixLen = prefix.length;
        const lastPos = positionTranslate(position, -prefixLen);
        if (document.getText(new Range(lastPos, position)) !== prefix) return;

        // Exit early if line is full
        document.lineAt(position.line).text.length;
        const n = width - document.lineAt(position.line).text.length;
        if (n <= 0) return;

        return requestProgram(
            document,
            token,
            (program: AST.Program) => {
                // Must be within a comment
                const pos = docPosToPos(document, position);
                if (!getCommentAtPosition(program, pos)) return;

                const item = new CompletionItem("horizontal-rule", CompletionItemKind.Snippet);
                item.insertText = hr.repeat(n);
                return [item];
            },
        );
    }
}
