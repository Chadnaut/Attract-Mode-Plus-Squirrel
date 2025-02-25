import {
    CancellationToken,
    FormattingOptions,
    OnTypeFormattingEditProvider,
    Position,
    ProviderResult,
    TextDocument,
    TextEdit,
    commands,
    Range,
    window,
} from "vscode";
import * as prettier from "prettier";
import { fullRange } from '../utils/document';
import constants from '../constants';
import { getPrettierOptions } from "../utils/config";

export class SquirrelOnTypeFormattingEditProvider
    implements OnTypeFormattingEditProvider
{
    // public enabled: boolean = true;
    public triggers = ["}", ";"];

    provideOnTypeFormattingEdits(
        document: TextDocument,
        position: Position,
        ch: string,
        options: FormattingOptions,
        token: CancellationToken,
    ): ProviderResult<TextEdit[]> {
        // if (!this.enabled) return;

        const lastLine = document.lineAt(position.line - 1).text.trim();
        const prevChar = lastLine.charAt(lastLine.length - 1);
        // const nextChar = document.getText(new Range(position, new Position(position.line, position.character + 1)));

        if (["{", "}"].includes(prevChar)) return;
        if (!lastLine) return;
        // if (!this.triggers.includes(prevChar)) return;

        return new Promise((resolve, _reject) => {
            prettier.format(document.getText(), getPrettierOptions()).then(
                (formatted: string) => {
                    resolve([TextEdit.replace(fullRange(document), formatted)]);
                },
                (_error) => {
                    window.showWarningMessage(
                        constants.FORMATTING_ERROR_MESSAGE,
                    );
                    resolve(undefined);
                },
            );
        });
    }
}
