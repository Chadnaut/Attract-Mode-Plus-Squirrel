import {
    DocumentSymbolExtra,
    filterMetaSymbols,
    filterAllowedSymbols,
    filterProtectedSymbols,
    filterPublicSymbols,
    filterImportableSymbols,
    getAncestorSymbols,
    getNodeExtendedSymbols,
    getNodeSymbols,
    filterRootSymbols,
    filterOverloadedSymbols,
    getNodeAugmentSymbols,
} from "./symbol";
import {
    CompletionItem,
    CompletionItemKind,
    CompletionItemLabel,
    CompletionItemTag,
    Position,
    Range,
    SymbolTag,
    TextEdit,
} from "vscode";
import { getBranchClassDef, getBranchProgram, isSameBranch } from "./find";
import { symbolToCompletionKind } from "./kind";
import { getDocAttr, getNodeDoc } from "../doc/find";
import { getProgramImports } from "./program";
import { AST } from "../ast";
import { getNodeTypeDef } from "./type";
import { getSuperDefs } from "./super";
import { getNodeSignature } from "./signature";
import { adjustDocPos } from "./location";
import { addRootPrefix, nodeHasRootPrefix, removeRootPrefix } from "./root";
import { getNodeDef, getNodeVal } from "./definition";
import { stringToNode } from "./create";
import { isValidName } from "./identifier";
import constants from "../constants";
import * as path from "path";

export const uniqueCompletions = (
    completions: CompletionItem[],
): CompletionItem[] =>
    completions.filter(
        (a, index, arr) =>
            arr.findIndex((b) => a.detail === b.detail) === index,
    );

/** Return array of completion items for node at branch end */
export const getCompletions = (branch: AST.Node[]): CompletionItem[] => {
    const node = branch.at(-1);
    if (node?.type !== "Identifier") return [];

    if (node.extra?.root && node.loc.start.line !== node.loc.end.line) {
        // a root node that starts on one line, and ends of another
        // - `:: \n global` - is parsed as `::global`
        // - but it makes more sense to be separate and suggest completions for ::
    } else if (branch.at(-2)?.type === "MemberExpression") {
        return [];
    }

    // Symbols from current program
    let symbols = getAncestorSymbols(branch);

    // Symbols from extended classes
    const classDef = getBranchClassDef(branch);
    if (classDef.length) {
        getSuperDefs(classDef).forEach((superClass) => {
            let classSymbols = getNodeSymbols(superClass, 0);
            classSymbols = filterProtectedSymbols(classSymbols);
            symbols.push(...classSymbols);
        });
    }

    // Symbols from imported files
    const program = getBranchProgram(branch);
    getProgramImports(program).forEach((refProgram) => {
        let refSymbols = getNodeSymbols([refProgram], 0);
        refSymbols = filterImportableSymbols(refSymbols);
        refSymbols = filterPublicSymbols(refSymbols);
        symbols.push(...refSymbols);
    });

    // remove ignored symbols
    symbols = filterAllowedSymbols(symbols, node);

    // only root symbols if given node has '::'
    if (nodeHasRootPrefix(node)) symbols = filterRootSymbols(symbols);

    return symbolsToCompletions(branch, symbols, false);
};

/**
 * Return array of member completions for node at branch end
 * - Does NOT filterImportableSymbols, since imported functions may return non-importable objects
 */
export const getMemberCompletions = (branch: AST.Node[]): CompletionItem[] => {
    const node = branch.at(-1);
    if (!node) return [];
    let symbols = getNodeAugmentSymbols(branch).concat(
        getNodeExtendedSymbols(branch),
    );
    symbols = filterOverloadedSymbols(symbols);
    symbols = filterMetaSymbols(symbols);
    symbols = filterAllowedSymbols(symbols, node);
    return symbolsToCompletions(branch, symbols, true);
};

/** Return array of TYPE member completions for node at branch end */
export const getTypeMemberCompletions = (
    branch: AST.Node[],
): CompletionItem[] => {
    const node = branch.at(-1);
    if (!node) return [];
    let symbols = [];

    const nodeType = getNodeTypeDef(branch);
    if (nodeType.length && !isSameBranch(nodeType, getNodeDef(branch))) {
        symbols.push(...getNodeExtendedSymbols(nodeType));
    }

    symbols = filterOverloadedSymbols(symbols);
    symbols = filterMetaSymbols(symbols);
    symbols = filterAllowedSymbols(symbols, node);
    return symbolsToCompletions(branch, symbols, true);
};

/** Create completionItems from all symbols */
const symbolsToCompletions = (
    branch: AST.Node[],
    symbols: DocumentSymbolExtra[],
    isMember: boolean,
): CompletionItem[] =>
    symbols.map((symbol) => symbolsToCompletion(branch, symbol, isMember));

/** Return array of commit character for completionItemKind */
export const getCommitCharacters = (kind: CompletionItemKind): string[] => {
    switch (kind) {
        case CompletionItemKind.Class:
        case CompletionItemKind.Method:
        case CompletionItemKind.Property:
        case CompletionItemKind.Field:
        case CompletionItemKind.Function:
        case CompletionItemKind.Variable:
            return [".", "("];
        case CompletionItemKind.Constructor:
            return ["("];
        case CompletionItemKind.Enum:
        case CompletionItemKind.EnumMember:
        case CompletionItemKind.Constant:
            return ["."];
        case CompletionItemKind.Event: // magic
            return ["]"];
        default:
            return [];
    }
};

/**
 * Return completion description
 * - Package name if available, otherwise filename
 * - Do not use relative name, as symlinked path create very long ../../ trails
 */
export const getCompletionDescription = (
    program?: AST.Program,
    targetProgram?: AST.Program,
): string | undefined => {
    if (!program) return;
    let name = getDocAttr(getNodeDoc([program]), "package")?.name;
    if (name) return name;
    name = path.basename(program.sourceName);
    if (
        name === constants.FE_LAYOUT_FILENAME ||
        name === constants.FE_MODULE_FILENAME ||
        name === constants.FE_PLUGIN_FILENAME
    ) {
        name = path.basename(program.sourceName.slice(0, -name.length));
    }
    return name;
};

/** Create completionItem from symbol */
const symbolsToCompletion = (
    branch: AST.Node[],
    symbol: DocumentSymbolExtra,
    isMember: boolean,
): CompletionItem | undefined => {
    let name = symbol.name;
    const program = getBranchProgram(branch);
    const node = branch.at(-1);

    // Add '::' prefix if thats how the init node was written
    const root = isMember ? false : nodeHasRootPrefix(node);
    // const localName = removeRootPrefix(name);
    const labelName = root ? addRootPrefix(name) : name;
    const insertText = root
        ? removeRootPrefix(symbol.insertText)
        : symbol.insertText;

    const docBlock = getNodeDoc(symbol.branch);
    const signature = getNodeSignature(symbol.branch);
    const label = <CompletionItemLabel>{
        label: labelName,
        description: getCompletionDescription(
            getBranchProgram(symbol.branch),
            program,
        ),
    };

    const kind = symbolToCompletionKind(symbol.kind);
    const item = new CompletionItem(label, kind);
    item.detail = signature;
    item.insertText = insertText;
    item.commitCharacters = getCommitCharacters(kind);

    item.tags = symbol.tags?.includes(SymbolTag.Deprecated)
        ? [CompletionItemTag.Deprecated]
        : [];

    item.sortText = removeRootPrefix(labelName);
    item.filterText = removeRootPrefix(labelName);
    // item.filterText = item.sortText = localName.toLowerCase();
    // item.filterText = localName.toLowerCase();
    if (docBlock?.markdown) item.documentation = docBlock.markdown;

    return item;
};

/** Ensure completions suitable to go inside quote marks */
export const formatQuoteCompletions = (
    items: CompletionItem[],
): CompletionItem[] =>
    items.map((item) => {
        const insertText = String(item.insertText);
        const m = insertText.match(/^"(.*?)"$/);
        if (m) item.insertText = m[1];
        return item;
    });

/** Ensure completions suitable for use as a member node */
export const formatMemberCompletions = (
    items: CompletionItem[],
    pos: Position,
): CompletionItem[] =>
    items.map((item) => {
        const insertText = String(item.insertText);
        const m = insertText.match(/^"(.*?)"$/);
        if (m) {
            if (isValidName(m[1])) {
                item.insertText = m[1];
            } else {
                item.insertText = `[${insertText}]`;
                item.additionalTextEdits = [
                    TextEdit.delete(new Range(adjustDocPos(pos, -1), pos)),
                ];
            }
        }
        return item;
    });

export const createNodeArrayCompletions = (
    name: string,
    program: AST.Program,
): CompletionItem[] => {
    const node = stringToNode(name);

    const branch = [program, node];
    const arr = <AST.ArrayExpression>getNodeVal(branch).at(-1);
    if (arr?.type === "ArrayExpression") {
        const description = getCompletionDescription(program);
        return arr.elements
            .map((child) => child["value"])
            .filter((value) => value !== undefined)
            .map((label) => {
                const item = new CompletionItem(
                    { label, description },
                    CompletionItemKind.Keyword,
                );
                item.commitCharacters = ['"'];
                item.sortText = `${description}.${label}`;
                return item;
            });
    }
    return [];
};
