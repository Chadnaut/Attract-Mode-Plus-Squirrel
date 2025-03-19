import { getNodeComputed } from './meta';
import { getNodeDoc, getDocAttr } from "./../doc/find";
import { SymbolKind, DocumentSymbol, MarkdownString } from "vscode";
import { nodeToDocRange } from "./location";
import { AST } from "../ast";
import { addRootPrefix, getNewSlotAssignment } from "./root";
import { addBranchId, hasNodeId } from "./identifier";
import { metaSymbolNames } from "./kind";
import { getNodeVal } from "./definition";
import { getBranchClassDef, isNodeBlock, isSameBranch, nodeHasInit } from "./find";
import { getSuperDefs } from "./super";
import { getNodeEnumType } from "./enum";
import { getNodeChildren } from "./map";
import { getNodeAugmentVal } from './augment';

// -----------------------------------------------------------------------------

const nodeSymbolMap = new WeakMap<AST.Node, DocumentSymbolExtra>();

export const setNodeSymbol = (branch: AST.Node[], symbol: DocumentSymbolExtra) =>
    nodeSymbolMap.set(branch.at(-1), symbol);

export const hasNodeSymbol = (branch: AST.Node[]): boolean =>
    nodeSymbolMap.has(branch.at(-1));

export const getNodeSymbol = (branch: AST.Node[]): DocumentSymbolExtra =>
    nodeSymbolMap.get(branch.at(-1));

// -----------------------------------------------------------------------------

export class DocumentSymbolExtra extends DocumentSymbol {
    branch: AST.Node[];
    insertText?: string;
    documentation?: string | MarkdownString;
}

const importSymbolKinds = [
    SymbolKind.Class,
    SymbolKind.Function,
    SymbolKind.Field, // global
];

/** Remove meta functions from symbols */
export const filterMetaSymbols = (
    symbols: DocumentSymbolExtra[],
): DocumentSymbolExtra[] =>
    symbols.filter((symbol) => !metaSymbolNames.includes(symbol.name));

/**
 * Return only symbols that are allowed to be exported
 * - Class, Function, Root variables
 * - nodes with doc attr 'exports'
 */
export const filterImportableSymbols = (
    symbols: DocumentSymbolExtra[],
): DocumentSymbolExtra[] =>
    symbols.filter(
        (symbol) => {
            return importSymbolKinds.includes(symbol.kind) ||
            !!getNewSlotAssignment(symbol.branch).length ||
            getDocAttr(getNodeDoc(symbol.branch), "exports");
        }
    );

/**
 * Return only symbols attached to the root
 * - Class, Function, Root (same as importable)
 * - NOT nodes flagged with @constant
 */
export const filterRootSymbols = (
    symbols: DocumentSymbolExtra[],
): DocumentSymbolExtra[] =>
    filterImportableSymbols(symbols).filter(
        (symbol) => {
            return !getDocAttr(getNodeDoc(symbol.branch), "constant");
        }
    );

/** Return only public symbols */
export const filterPublicSymbols = (
    symbols: DocumentSymbolExtra[],
): DocumentSymbolExtra[] =>
    symbols.filter((symbol) => {
        const docBlock = getNodeDoc(symbol.branch);
        return (
            !getDocAttr(docBlock, "private") &&
            !getDocAttr(docBlock, "protected")
        );
    });

/** Return protected (and public) symbols */
export const filterProtectedSymbols = (
    symbols: DocumentSymbolExtra[],
): DocumentSymbolExtra[] =>
    symbols.filter((symbol) => {
        const docBlock = getNodeDoc(symbol.branch);
        return !getDocAttr(docBlock, "private");
    });

/** Return non-ignored symbols */
export const filterAllowedSymbols = (
    symbols: DocumentSymbolExtra[],
    node: AST.Node,
): DocumentSymbolExtra[] =>
    symbols.filter((symbol) => {
        if (symbol.name === "constructor") return false;
        if (symbol.branch.at(-1) === node) return false;
        if (getDocAttr(getNodeDoc(symbol.branch), "ignore")) return false;
        return true;
    });

/**
 * Return unique symbols, ignoring later ones with same names
 * - Occurs with superclass or overloaded variations
 */
export const filterOverloadedSymbols = (
    symbols: DocumentSymbolExtra[]
): DocumentSymbolExtra[] =>
    symbols.filter((symbol, index) =>
        index === symbols.findIndex((s) => s.name === symbol.name));

/**
 * Return array of node *child* symbols, recursively up to maxDepth
 * - Does not include give node symbol
 * - `maxDepth` used to get imports (root level items) or superclass (methods)
 */
export const getNodeSymbols = (
    branch: AST.Node[],
    maxDepth: number = -1,
): DocumentSymbolExtra[] =>
    getNodeChildren(branch).flatMap((child) =>
        getNodeSymbolsRecursive(child, maxDepth),
    );

/**
 * Return symbols for all node ancestors
 * - does not include symbols with current declaration
 */
export const getAncestorSymbols = (
    branch: AST.Node[],
): DocumentSymbolExtra[] => {
    const symbols = [];
    const exclude = [];
    let inBlock = true;
    let i = branch.length;

    while (--i > 0) {
        const b = branch.slice(0, i);
        const n = b.at(-1);
        symbols.push(...getNodeSymbols(b, 0));

        if (inBlock && nodeHasInit(n)) {
            exclude.push(...symbols, getNodeSymbol(addBranchId(b)));
            inBlock = false;
        }
        if (isNodeBlock(n)) inBlock = false;
    }

    // unique, and not excluded
    return symbols.filter(
        (symbol, index, arr) =>
            arr.indexOf(symbol) === index && !exclude.includes(symbol),
    );
};

/**
 * Return hierarchy of node symbols, recursively adding children up to maxDepth
 * - Includes symbol for the given node
 */
const getNodeSymbolsRecursive = (
    branch: AST.Node[],
    maxDepth: number,
    depth: number = 0,
): DocumentSymbolExtra[] => {
    const node = branch.at(-1);

    const symbols: DocumentSymbolExtra[] = [];

    // Get the node symbol
    const symbol = hasNodeId(node) ? getNodeSymbol(addBranchId(branch)) : undefined;

    // Add the symbol to the list (no expressions!)
    if (symbol) symbols.push(symbol);

    // depth limit reached
    if (maxDepth >= 0 && depth > maxDepth) return symbols;

    // Add children symbols
    const children = getNodeChildren(branch)
        .flatMap((child) => {
            return getNodeSymbolsRecursive(child, maxDepth, depth + 1);
        });
    if (!symbol) return children; // No root, return children

    // If a base symbol exists, create a hierarchy
    symbol.children = children;
    return symbols;
};

/**
 * Create symbol and attach it to identifier
 */
export const updateNodeSymbol = (
    branch: AST.Node[],
    kind: SymbolKind,
    name?: string,
) => {
    const id = <AST.Identifier>branch.at(-1);
    if (!id) return;
    if (!name) name = id.name;
    if (!name) return;

    let symbolName = name;
    let insertText = getNodeComputed(id) ?? name;

    let rangeNode: AST.Identifier | AST.MemberExpression = id;

    // SymbolKind.Field is used exclusively for root vars
    if (kind === SymbolKind.Field && id.extra?.root) {
        symbolName = addRootPrefix(name);
        insertText = addRootPrefix(insertText);
    }

    const range = nodeToDocRange(rangeNode);
    const selectionRange = nodeToDocRange(id);
    if (!range?.contains(selectionRange)) return;

    const symbol = new DocumentSymbolExtra(
        symbolName,
        "",
        kind,
        range,
        selectionRange,
    );

    symbol.branch = branch;
    symbol.insertText = insertText;
    setNodeSymbol(branch, symbol);
};

/**
 * Return symbols, plus superclass symbols
 */
export const getNodeExtendedSymbols = (
    branch: AST.Node[],
): DocumentSymbolExtra[] => {
    const node = branch.at(-1);
    if (!node) return [];
    const symbols: DocumentSymbolExtra[] = [];
    const nodeValue = getNodeVal(branch);
    if (!nodeValue.length) return [];

    const nodeType = nodeValue.at(-1).type;

    switch (nodeType) {
        // The node to find members for is a ClassDeclaration
        case "ClassDeclaration":
        case "ClassExpression": {
            const nodeClassDef = getBranchClassDef(branch);
            const valueClassDef = getBranchClassDef(nodeValue);
            const isOwner =
                node.type === "ThisExpression" &&
                isSameBranch(nodeClassDef, valueClassDef);

            const isExtended =
                node.type === "Base" &&
                getSuperDefs(nodeClassDef).map(n => n.at(-1)).includes(valueClassDef.at(-1));

            const valueSymbols = getNodeSymbols(valueClassDef, 0);
            const superClasses = getSuperDefs(valueClassDef);

            const superSymbols = superClasses.flatMap((superClassDef) =>
                getNodeSymbols(superClassDef, 0),
            );

            if (isOwner) {
                symbols.push(
                    ...valueSymbols,
                    ...filterProtectedSymbols(superSymbols),
                );
            } else if (isExtended) {
                symbols.push(
                    ...filterProtectedSymbols(valueSymbols),
                    ...filterProtectedSymbols(superSymbols),
                );
            } else {
                symbols.push(
                    ...filterPublicSymbols(valueSymbols),
                    ...filterPublicSymbols(superSymbols),
                );
            }
            break;
        }
        case "LambdaExpression":
        case "MethodDefinition":
        case "FunctionDeclaration":
        case "FunctionExpression": {
            // don't return function symbols
            break;
        }
        // case "Identifier":
        //     // param typed completion
        //     symbols.push(...getNodeSymbols(getInstanceTypeDef(branch), 0));
        //     break;
        default: {
            if (getNodeEnumType(branch)) break;
            symbols.push(...getNodeSymbols(nodeValue, 0));
            break;
        }
    }

    return symbols;
};

/**
 * Returns symbols for augments attribute
 */
export const getNodeAugmentSymbols = (
    branch: AST.Node[],
): DocumentSymbolExtra[] =>
    getNodeExtendedSymbols(getNodeAugmentVal(branch));
