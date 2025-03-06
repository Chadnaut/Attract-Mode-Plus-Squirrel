import {
    CancellationToken,
    DocumentSemanticTokensProvider,
    ProviderResult,
    SemanticTokens,
    TextDocument,
} from "vscode";
import { getSemanticTokens } from "../utils/token";
import { requestProgram } from "../utils/program";
import { AST } from "../ast";

export class SquirrelDocumentSemanticTokensProvider
    implements DocumentSemanticTokensProvider
{
    public enabled: boolean = true;

    provideDocumentSemanticTokens(
        document: TextDocument,
        token: CancellationToken,
    ): ProviderResult<SemanticTokens> {
        if (!this.enabled) return;
        return requestProgram(
            document,
            token,
            (program: AST.Program) => {
                return getSemanticTokens(program);
            },
        );
    }
}
