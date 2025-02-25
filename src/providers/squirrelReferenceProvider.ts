import { docPosToPos } from "../utils/location";
import {
    CancellationToken,
    Position,
    Location,
    ProviderResult,
    ReferenceContext,
    ReferenceProvider,
    TextDocument,
} from "vscode";
import { nodeToDocRange } from "../utils/location";
import { getBranchId, getBranchAtPos } from "../utils/find";
import { requestProgram } from "../utils/program";
import { AST } from "../ast";

export class SquirrelReferenceProvider implements ReferenceProvider {
    public enabled: boolean = true;

    provideReferences(
        document: TextDocument,
        position: Position,
        context: ReferenceContext,
        token: CancellationToken,
    ): ProviderResult<Location[]> {
        if (!this.enabled) return;
        return requestProgram(
            document,
            token,
            (program: AST.Program) => {
                const pos = docPosToPos(document, position);
                const branch = getBranchAtPos(program, pos);
                const node = branch.at(-1);
                if (node?.type !== "Identifier") return;

                const range = nodeToDocRange(getBranchId(branch));
                const location = new Location(document.uri, range);
                return [location]; // NOTE: supposed to be ALL instance locations
            },
        );
    }
}
