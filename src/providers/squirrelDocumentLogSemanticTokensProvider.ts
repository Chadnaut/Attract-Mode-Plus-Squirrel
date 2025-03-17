import {
    CancellationToken,
    DocumentSemanticTokensProvider,
    ProviderResult,
    SemanticTokens,
    SemanticTokensBuilder,
    TextDocument,
} from "vscode";
import { tokenLegend } from "../utils/token";
import { getLogLinks } from "../utils/log";

export class SquirrelDocumentLogSemanticTokensProvider
    implements DocumentSemanticTokensProvider
{
    public enabled: boolean = true;

    provideDocumentSemanticTokens(
        document: TextDocument,
        token: CancellationToken,
    ): ProviderResult<SemanticTokens> {
        if (!this.enabled) return;

        const builder = new SemanticTokensBuilder(tokenLegend);
        const links = getLogLinks(document);
        links.forEach((link) => builder.push(link.range, "link"));
        const semanticTokens = builder.build();

        return semanticTokens;
    }
}
