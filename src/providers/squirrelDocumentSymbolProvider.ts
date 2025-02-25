import {
    CancellationToken,
    DocumentSymbol,
    DocumentSymbolProvider,
    ProviderResult,
    TextDocument,
} from "vscode";
import { getNodeSymbols } from "../utils/symbol";
import { addProgramDocument, getProgram } from "../utils/program";

// Fires every document change - keypress, cut, paste
export class SquirrelDocumentSymbolProvider implements DocumentSymbolProvider {
    public enabled: boolean = true;
    provideDocumentSymbols(
        document: TextDocument,
        token: CancellationToken,
    ): ProviderResult<DocumentSymbol[]> {
        if (!this.enabled) return;
        return new Promise((resolve, _reject) => {
            if (token.isCancellationRequested) return resolve(undefined);
            addProgramDocument(document);
            const program = getProgram(document.uri.fsPath);
            const symbols = getNodeSymbols([program]);
            resolve(symbols);
        });
    }
}
