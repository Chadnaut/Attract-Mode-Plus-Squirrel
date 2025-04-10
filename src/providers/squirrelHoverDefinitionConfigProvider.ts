import {
    CancellationToken,
    commands,
    Disposable,
    Hover,
    HoverProvider,
    Position,
    ProviderResult,
    TextDocument,
} from "vscode";
import { docPosToPos } from "../utils/location";
import { AST } from "../ast";
import { requestProgram } from "../utils/program";
import { getBranchAtPos } from "../utils/find";
import {
    formatCommand,
    formatUserConfig,
    getFormatInfo,
} from "../utils/format";

export class SquirrelHoverDefinitionConfigProvider
    implements HoverProvider, Disposable
{
    private disposables: Disposable[];
    public enabled: boolean = true;

    constructor() {
        const command = commands.registerCommand(
            formatCommand,
            formatUserConfig,
        );
        this.disposables = [command];
    }

    public dispose() {
        this.disposables.forEach((item) => item?.dispose());
    }

    provideHover(
        document: TextDocument,
        position: Position,
        token: CancellationToken,
    ): ProviderResult<Hover> {
        if (!this.enabled) return;

        return requestProgram(document, token, (program: AST.Program) => {
            const pos = docPosToPos(document, position);
            const branch = getBranchAtPos(program, pos);
            return getFormatInfo(document, branch);
        });
    }
}
