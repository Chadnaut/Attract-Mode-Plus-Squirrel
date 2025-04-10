import {
    CancellationToken,
    CompletionContext,
    CompletionItem,
    CompletionItemProvider,
    Position,
    ProviderResult,
    TextDocument,
} from "vscode";
import {
    formatQuoteCompletions,
    getMemberCompletions,
    formatMemberCompletions,
    getTypeMemberCompletions,
    uniqueCompletions,
} from "../utils/completion";
import { docPosToPos } from "../utils/location";
import { AST } from "../ast";
import { getBranchAtPos, getNodeBeforePos, getMemberCompletionBranch } from "../utils/find";
import { requestProgram } from "../utils/program";
import { getCommentAtPosition } from "../doc/find";

export class SquirrelCompletionItemMemberProvider
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

        return requestProgram(
            document,
            token,
            (program: AST.Program) => {
                const pos = docPosToPos(document, position);
                if (getCommentAtPosition(program, pos)) return;

                const branchPos = getBranchAtPos(program, pos);

                // exit if trigger character WITHIN literal
                const node = branchPos.at(-1);
                switch (node?.type) {
                    case "StringLiteral":
                    case "FloatLiteral":
                    case "IntegerLiteral":
                        return;
                }

                const branchBefore = getNodeBeforePos(program, pos);

                let branch = branchBefore;
                if (!branch.length) branch = branchPos;
                if (!branch.length) return;

                // quote is for computed member["completions"]
                // - exit if quote triggered, but is NOT the opening quote
                const quote = context.triggerCharacter === '"';
                if (quote && pos.index !== branch.at(-1).loc.start.index + 1) return;

                const b = getMemberCompletionBranch(branch);
                if (!b) return;

                // WARNING - Invalid member expression (missing obj) will mis-fire completion

                let memberCompletions = getMemberCompletions(b);
                if (quote) return formatQuoteCompletions(memberCompletions);

                const typeCompletions = getTypeMemberCompletions(b);
                const completions = uniqueCompletions(memberCompletions.concat(typeCompletions));

                return formatMemberCompletions(completions, position);
            },
        );
    }
}
