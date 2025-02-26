import {
    CancellationToken,
    Position,
    ProviderResult,
    SignatureHelp,
    SignatureHelpContext,
    SignatureHelpProvider,
    TextDocument,
} from "vscode";
import { getSignatureHelp } from "../utils/signature";
import { docPosToPos } from "../utils/location";
import { requestProgram } from "../utils/program";
import { AST } from "../ast";

export class SquirrelSignatureHelpProvider implements SignatureHelpProvider {
    public enabled: boolean = true;

    provideSignatureHelp(
        document: TextDocument,
        position: Position,
        token: CancellationToken,
        context: SignatureHelpContext,
    ): ProviderResult<SignatureHelp> {
        if (!this.enabled) return;
        return requestProgram(
            document,
            token,
            (program: AST.Program) => {
                const text = document.getText();
                const pos = docPosToPos(document, position);
                return getSignatureHelp(text, program, pos);
            },
        );
    }
}
