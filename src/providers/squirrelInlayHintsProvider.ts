import {
    CancellationToken,
    EventEmitter,
    InlayHint,
    InlayHintsProvider,
    ProviderResult,
    Range,
    TextDocument,
} from "vscode";
import { getInlayHints } from "../utils/hint";
import { docRangeToLoc } from "../utils/location";
import { requestProgram } from "../utils/program";
import { AST } from "../ast";

/**
 * Provide inlay hints for the specified range
 * - Called EVERY page scroll event
 * - Returns best-guess hints, NOT the activeSignature hint
 */
export class SquirrelInlayHintsProvider implements InlayHintsProvider {
    private _enabled: boolean = true;
    private changeEmitter = new EventEmitter<void>();

    onDidChangeInlayHints = this.changeEmitter.event;

    public set enabled(v: boolean) {
        const changed = (this._enabled !== v);
        this._enabled = v;
        if (changed) this.clearHints();
    }

    public get enabled(): boolean {
        return this._enabled;
    }

    public clearHints() {
        this.changeEmitter.fire();
    }

    provideInlayHints(
        document: TextDocument,
        range: Range,
        token: CancellationToken,
    ): ProviderResult<InlayHint[]> {
        if (!this.enabled) return;
        return requestProgram(
            document,
            token,
            (program: AST.Program) => {
                const loc = docRangeToLoc(document, range);
                const hints = getInlayHints([program], loc);
                return hints;
            },
        );
    }

    // resolveInlayHint(hint: InlayHint, token: CancellationToken): ProviderResult<InlayHint> {
    //     hint.label = "WUT";
    //     return hint; //  new InlayHint(hint.position, ) hint;
    // }

}
