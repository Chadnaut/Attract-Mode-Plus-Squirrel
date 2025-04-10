import { Hover, MarkdownString, TextDocument, window } from "vscode";
import { getBranchClassDef } from "./find";
import { AST } from "../ast";
import { locToDocRange, nodeToDocSelRange } from "./location";
import { getNodeName } from "./identifier";
import { getNodeChildren } from "./map";
import constants from "../constants";

export const formatCommand = "attractPlusSquirrel.formatUserConfig";

let formatEditor;
let formatBranch;

export const setFormatTarget = (document?: TextDocument, branch?: AST.Node[]) => {
    formatBranch = branch;
    formatEditor = document ? window.visibleTextEditors.find(
        (editor) => editor.document === document,
    ) : undefined;
}

// Replace attribute-order-values with ascending values
// - Applies to last branch hovered over
export const formatUserConfig = () => {
    if (!formatEditor) return;
    if (!formatBranch) return;
    let i = 0;
    formatEditor.edit((editBuilder) => {
        getAttrOrderNodeVals(formatBranch).forEach((n) => {
            editBuilder.replace(locToDocRange(n.loc), String(i++));
        });
    });
    setFormatTarget();
};

/** Return array of attribute-order-value nodes for future replacement */
export const getAttrOrderNodeVals = (branch: AST.Node[]): AST.Node[] => {
    const results: AST.Node[] = [];
    const node = branch.at(-1);
    if (node.type === "PropertyDefinition") {
        const prop = <AST.PropertyDefinition>node;
        if (prop.attributes) {
            prop.attributes.properties.forEach((p) => {
                const id = <AST.Identifier>p.key;
                if (id.type === "Identifier" && id.name === "order") {
                    results.push(p.value);
                }
            });
            return results;
        }
    }
    getNodeChildren(branch).forEach((childBranch) => {
        results.push(...getAttrOrderNodeVals(childBranch));
    });
    return results;
};

/** Add button to hover info for UserConfig attribute order property */
export const getFormatInfo = (
    document: TextDocument,
    branch: AST.Node[],
): Hover | undefined => {
    setFormatTarget();

    const node = <AST.Identifier>branch.at(-1);
    if (node.type !== "Identifier") return;
    if (node.name !== "order") return;

    const prop = <AST.Property>branch.at(-2);
    if (prop.type !== "Property") return;

    const propDef = <AST.PropertyDefinition>branch.at(-4);
    if (propDef.type !== "PropertyDefinition") return;

    setFormatTarget(document, getBranchClassDef(branch));

    const command = `[${constants.UPDATE_ORDER}](command:${formatCommand})`;
    const contents = new MarkdownString();
    contents.supportHtml = true;
    contents.isTrusted = true;
    contents.appendMarkdown(command);
    return new Hover(contents, nodeToDocSelRange(node));
};
