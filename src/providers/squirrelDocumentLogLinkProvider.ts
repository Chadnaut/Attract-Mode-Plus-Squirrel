import {
    CancellationToken,
    ProviderResult,
    TextDocument,
    DocumentLinkProvider,
    DocumentLink,
} from "vscode";
import { getLogLinks } from "../utils/log";

export class SquirrelDocumentLogLinkProvider implements DocumentLinkProvider {
    public enabled: boolean = true;

    provideDocumentLinks(
        document: TextDocument,
        token: CancellationToken,
    ): ProviderResult<DocumentLink[]> {
        if (!this.enabled) return;
        return getLogLinks(document);
    }
}
