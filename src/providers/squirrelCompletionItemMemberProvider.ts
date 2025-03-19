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
import { getBranchAtPos, getNodeBeforePos, getNodeIsDecId } from "../utils/find";
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

                const branchBefore = getNodeBeforePos(program, pos);
                const branchPos = getBranchAtPos(program, pos);
                let branch = branchBefore;

                if (!branch.length) branch = branchPos;
                if (!branch.length) return;

                // quote is for computed member["completions"]
                // - exit if quote triggered, but is NOT opening quote
                const quote = context.triggerCharacter === '"';
                if (quote && pos.index !== branch.at(-1).loc.start.index + 1) return;

                // exit if trigger character WITHIN literal
                if (branchPos.at(-1).type === "StringLiteral") return;
                if (branchPos.at(-1).type === "FloatLiteral") return;
                if (branchPos.at(-1).type === "IntegerLiteral") return;

                // find completions from id parent
                if (branch.at(-1).type === "Identifier") {
                    branch = branch.slice(0, -1);
                }

                // find completions from member object
                if (branch.at(-1).type === "MemberExpression") {
                    branch = [...branch, (<AST.MemberExpression>branch.at(-1)).object];
                }

                // exit if node is declaration id
                if (getNodeIsDecId(branch)) return;

                // WARNING - Invalid member expression (missing obj) will mis-fire completion

                let memberCompletions = getMemberCompletions(branch);
                if (quote) return formatQuoteCompletions(memberCompletions);

                const typeCompletions = getTypeMemberCompletions(branch);
                const completions = uniqueCompletions(memberCompletions.concat(typeCompletions));

                return formatMemberCompletions(completions, position);
            },
        );
    }
}
