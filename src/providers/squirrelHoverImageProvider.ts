import {
    CancellationToken,
    Hover,
    HoverProvider,
    Position,
    ProviderResult,
    TextDocument,
} from "vscode";
import { docPosToPos } from "../utils/location";
import { AST } from "../ast";
import { requestProgram } from "../utils/program";
import { getHoverImage } from "../utils/hover";

export class SquirrelHoverImageProvider implements HoverProvider {
    public enabled: boolean = true;

    provideHover(
        document: TextDocument,
        position: Position,
        token: CancellationToken,
    ): ProviderResult<Hover> {
        if (!this.enabled) return;

        return requestProgram(
            document,
            token,
            (program: AST.Program) => {
                const pos = docPosToPos(document, position);
                return getHoverImage(program, pos, document.uri.fsPath);
            },
        );
    }
}
