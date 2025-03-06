import {
    CancellationToken,
    DefinitionProvider,
    Position,
    ProviderResult,
    TextDocument,
    DefinitionLink,
    Uri,
} from "vscode";
import { getNodeDef } from "../utils/definition";
import {
    docPosToPos,
    posToDocPos,
    nodeToDocRange,
    nodeToDocSelRange,
} from "../utils/location";
import { getBranchAtPos, getBranchFunctionDef, getBranchProgram, getBranchId } from "../utils/find";
import { AST } from "../ast";
import { isProgramGlobal } from "../utils/import";
import { requestProgram } from "../utils/program";

export class SquirrelDefinitionProvider implements DefinitionProvider {
    public enabled: boolean = true;

    provideDefinition(
        document: TextDocument,
        position: Position,
        token: CancellationToken,
    ): ProviderResult<DefinitionLink[]> {
        if (!this.enabled) return;

        return requestProgram(
            document,
            token,
            (program: AST.Program) => {
                const pos = docPosToPos(document, position);
                const branch = getBranchAtPos(program, pos);
                const node = branch.at(-1);
                if (!node) return;

                let nodeDef: AST.Node[] = [];

                switch (node.type) {
                    case "SwitchCase":
                        // Special: "case" and "default" keywords resolve to "switch"
                        nodeDef = branch;
                        break;
                    case "ReturnStatement":
                        // Special: "return" keyword resolves to container function
                        nodeDef = getBranchFunctionDef(branch);
                        break;
                    case "Base":
                    case "ThisExpression":
                    case "RestElement":
                    case "Identifier":
                        nodeDef = getNodeDef(branch);
                        break;
                }

                if (!nodeDef.length) return;
                const nodeDefProgram = getBranchProgram(nodeDef);

                // Prevent linking to global nodes (language features)
                if (program !== nodeDefProgram && isProgramGlobal(nodeDefProgram)) return;

                // Go to definition node, possibly in another file
                const targetUri = Uri.file(nodeDefProgram.sourceName);
                const targetRange = nodeToDocRange(nodeDef.at(-1));
                const id = getBranchId(nodeDef);
                const originSelectionRange = nodeToDocSelRange(node);
                const targetSelectionRange = id
                    ? nodeToDocRange(id)
                    : nodeDef.at(-1).loc
                      ? document.getWordRangeAtPosition(
                            posToDocPos(nodeDef.at(-1).loc.start),
                        )
                      : targetRange;

                return [
                    <DefinitionLink>{
                        targetUri,
                        targetRange,
                        targetSelectionRange,
                        originSelectionRange,
                    },
                ];
            },
        );
    }
}
