import {
    CancellationToken,
    ProviderResult,
    TextDocument,
    DocumentLinkProvider,
    DocumentLink,
    Uri,
} from "vscode";
import { requestProgram } from "../utils/program";
import { AST } from "../ast";
import { getNodeLink } from "../utils/import";
import { nodeToDocSelRange } from "../utils/location";
import { getProgramStrings } from "../utils/string";

// Fires every edit
export class SquirrelDocumentLinkProvider implements DocumentLinkProvider {
    private _enabled: boolean = true;

    public set enabled(v: boolean) {
        // const changed = (this._enabled !== v);
        this._enabled = v;
        // How to refresh document on changed?
        // - TextDocumentContentProvider onDidChange
    }
    public get enabled(): boolean {
        return this._enabled;
    }

    provideDocumentLinks(
        document: TextDocument,
        token: CancellationToken,
    ): ProviderResult<DocumentLink[]> {
        if (!this.enabled) return;
        return requestProgram(
            document,
            token,
            (program: AST.Program) => {
                return getProgramStrings(program).map((branch) => {
                    const filename = getNodeLink(branch);
                    if (!filename) return;
                    const node = branch.at(-1);
                    return <DocumentLink>{
                        target: Uri.file(filename),
                        range: nodeToDocSelRange(node),
                    };
                }).filter((link) => link);
            },
        );
    }
}
