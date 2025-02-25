import {
    CancellationToken,
    Color,
    ColorInformation,
    ColorPresentation,
    DocumentColorProvider,
    ProviderResult,
    Range,
    TextDocument,
    TextEdit,
} from "vscode";
import { requestProgram } from "../utils/program";
import { AST } from "../ast";
import { colorToRGB, getProgramColorInformation } from "../utils/color";

export class SquirrelDocumentColorProvider implements DocumentColorProvider {
    public enabled: boolean = true;

    provideDocumentColors(
        document: TextDocument,
        token: CancellationToken,
    ): ProviderResult<ColorInformation[]> {
        if (!this.enabled) return;
        return requestProgram(
            document,
            token,
            (program: AST.Program) => {
                return getProgramColorInformation(document, program);
            },
        );
    }

    provideColorPresentations(
        color: Color,
        context: { readonly document: TextDocument; readonly range: Range },
        token: CancellationToken,
    ): ProviderResult<ColorPresentation[]> {
        if (!this.enabled) return;
        const presentation = new ColorPresentation(" ");
        presentation.textEdit = new TextEdit(context.range, colorToRGB(color, context.document.getText(context.range)));
        return [presentation];
    }
}
