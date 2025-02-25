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
import { getHoverInfo } from "../utils/hover";
import { getBranchAtPos } from "../utils/find";

export class SquirrelHoverDefinitionProvider implements HoverProvider {
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
                const branch = getBranchAtPos(program, pos);
                return getHoverInfo(branch);
            },
        );
    }
}
