import {
    CancellationToken,
    DocumentFormattingEditProvider,
    FormattingOptions,
    ProviderResult,
    TextDocument,
    TextEdit,
    window,
} from "vscode";
import { fullRange } from "../utils/document";
import constants from "../constants";
import * as prettier from "prettier";
import { getPrettierOptions } from "../utils/config";

export class SquirrelDocumentFormattingEditProvider
    implements DocumentFormattingEditProvider
{
    public enabled: boolean = true;

    provideDocumentFormattingEdits(
        document: TextDocument,
        options: FormattingOptions,
        token: CancellationToken,
    ): ProviderResult<TextEdit[]> {
        if (!this.enabled) return;
        return new Promise((resolve, _reject) => {
            prettier.format(document.getText(), getPrettierOptions()).then(
                (formatted: string) => {
                    if (token.isCancellationRequested)
                        return resolve(undefined);
                    resolve([TextEdit.replace(fullRange(document), formatted)]);
                },
                (error) => {
                    window.showWarningMessage(
                        constants.FORMATTING_ERROR_TITLE +
                            " " +
                            (error?.message ||
                                constants.FORMATTING_ERROR_MESSAGE),
                    );
                    resolve(undefined);
                },
            );
        });
    }
}
