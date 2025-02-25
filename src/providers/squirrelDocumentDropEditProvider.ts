import { forwardSlash } from "./../utils/file";
import {
    CancellationToken,
    DataTransfer,
    DocumentDropEdit,
    DocumentDropEditProvider,
    Position,
    ProviderResult,
    TextDocument,
    Uri,
} from "vscode";
import {
    getRelativeNutPath,
    isSupportedNut,
} from "../utils/import";
import {
    isSupportedAudio,
    isSupportedImage,
    isSupportedVideo,
} from "../utils/media";
import { requestProgram } from "../utils/program";
import { AST } from "../ast";
import * as path from "path";
import { trimModuleName } from "../utils/module";

export class SquirrelDocumentDropEditProvider
    implements DocumentDropEditProvider
{
    public enabled: boolean = true;

    provideDocumentDropEdits(
        document: TextDocument,
        position: Position,
        dataTransfer: DataTransfer,
        token: CancellationToken,
    ): ProviderResult<DocumentDropEdit> {
        if (!this.enabled) return;
        return requestProgram(document, token, (program: AST.Program) => {
            const nutPath =
                getRelativeNutPath(program.sourceName) ??
                path.dirname(program.sourceName);
            if (!nutPath) return;

            const uriList = [];
            dataTransfer.forEach((item, mimeType) => {
                if (mimeType !== "text/uri-list") return;
                uriList.push(...item.value.split(/[\r\n]+/));
            });

            const edits = [];
            uriList.forEach((value) => {
                const uri = Uri.parse(value);
                const p = forwardSlash(path.relative(nutPath, uri.fsPath));
                const isNut = isSupportedNut(p);
                const moduleName = isNut ? trimModuleName(p) : undefined;

                if (moduleName) return edits.push(`fe.load_module("${moduleName}")\n`);
                if (isNut) return edits.push(`fe.do_nut("${p}")\n`);
                if (isSupportedImage(p)) return edits.push(`fe.add_image("${p}")\n`);
                if (isSupportedVideo(p)) return edits.push(`fe.add_image("${p}")\n`);
                if (isSupportedAudio(p)) return edits.push(`fe.add_sound("${p}")\n`);
                return edits.push(`${p}\n`);
            });

            return new DocumentDropEdit(edits.join(""));
        });
    }
}
