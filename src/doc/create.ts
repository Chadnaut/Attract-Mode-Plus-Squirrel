import { SymbolKind, MarkdownString } from "vscode";
import { AST } from "../ast";
import { setNodeDeprecated } from "../utils/deprecated";
import { getNodeAfterPos } from "../utils/find";
import { addBranchId } from "../utils/identifier";
import { getImportModuleName } from "../utils/import";
import { META_KINDS, attachMeta } from "../utils/meta";
import { hasNodeSymbol, getNodeSymbol } from "../utils/symbol";
import { setNodeToken } from "../utils/token";
import { getCommentDocBlock, getDocAttr, getDocTargetBranch, getNodeDoc, getNodeDocBlock, hasNodeDocBlock, setCommentDocBlock, setNodeDocBlock } from "./find";
import { DocBlock, DocAttr } from "./kind";
import { createDocMarkdown } from "./markdown";
import { createDocSnippetCompletions, addSnippetCompletion } from "./snippets";
import { NodeType } from "../ast/ast";
import { parseCommentAttrs } from "./parse";
import { updateDocAttr } from "./attribute";
import { setImportsAllowed } from "../utils/program";

// -----------------------------------------------------------------------------

/** Only Identifier and Program nodes are allowed to have docBlocks */
const ALLOWED_DOC_NODE_TYPES: NodeType[] = ["Identifier", "Program"];

// -----------------------------------------------------------------------------

/**
 * Parses comment attributes and returns docBlock object
 * - Does NOT create markdown
 */
export const createDoc = (comment?: AST.CommentBlock): DocBlock => {
    const doc: DocBlock = { attributes: parseCommentAttrs(comment), branch: [] };
    if (comment) {
        setCommentDocBlock(comment, doc);
        setNodeDocBlock(comment, doc);
    }
    return doc;
};

// -----------------------------------------------------------------------------

/**
 * Attach docblock to node
 * - If node already has a docBlock it will be un-attached
 */
export const attachDoc = (
    branch: AST.Node[],
    docBlock: DocBlock
) => {
    const node = branch.at(-1);
    if (!ALLOWED_DOC_NODE_TYPES.includes(node?.type)) return;
    if (hasNodeDocBlock(node)) {
        const doc = getNodeDocBlock(node);
        if (doc) doc.branch = [];
    }
    docBlock.branch = branch;
    setNodeDocBlock(node, docBlock);
};

// -----------------------------------------------------------------------------

/**
 * Update node symbols, deprecations, etc depending on docblock
 */
export const initDoc = (docBlock: DocBlock) => {
    const branch = docBlock.branch;
    if (!branch || !branch.length) return;

    const node = branch.at(-1);
    updateDocAttr(docBlock, branch); // uses imports (getNodeDef)

    const metaAttrs: DocAttr[][] = [];
    docBlock.branch = branch;

    docBlock.attributes.forEach((attribute) => {
        // meta property captures the subsequent attributes
        if (metaAttrs.length && !META_KINDS.includes(attribute.kind)) {
            metaAttrs.at(-1).push(attribute);
        } else {
            switch (attribute.kind) {
                case "deprecated": {
                    setNodeDeprecated(branch);
                    break;
                }
                case "type": {
                    // if type empty set as "*" to prevent existing completions
                    if (!attribute.type) attribute.type = "*";
                    break;
                }
                case "class": {
                    // adjust symbol to look like a Class
                    // - used to make `fe.prop` function appear as classes, rather than properties
                    if (hasNodeSymbol(branch))
                        getNodeSymbol(branch).kind = SymbolKind.Class;
                    break;
                }
                case "method": {
                    // adjust symbol to look like a MethodDefinition
                    // - used to make `fe.prop` function appear as methods, rather than properties
                    if (hasNodeSymbol(branch))
                        getNodeSymbol(branch).kind = SymbolKind.Method;
                    break;
                }
                case "enum": {
                    // adjust tokenType & symbol kind on target node
                    // - used to "cast" a table as an enum (enums cannot be exported)
                    // - removes table-type completions
                    // - does not affect signature or properties
                    setNodeToken(node, "enum");
                    if (hasNodeSymbol(branch))
                        getNodeSymbol(branch).kind = SymbolKind.Enum;
                    break;
                }
            }
        }
        // add new property attr, which capture subsequent meta
        if (META_KINDS.includes(attribute.kind)) {
            metaAttrs.push([attribute]);
        }
    });

    if (metaAttrs.length) attachMeta(branch, metaAttrs); // uses imports (getNodeDef)
    docBlock.markdown = createDocMarkdown(docBlock.attributes);
};

// -----------------------------------------------------------------------------

/**
 * Attach all docBlocks to their relevant nodes
 * - Must be done AFTER createNodeMaps as it uses traversal to find nodes
 */
export const attachProgramDocs = (program: AST.Program): AST.Program => {
    if (program?.type !== "Program") return program;
    setImportsAllowed(false); // sanity check

    const comments = program.comments.filter(
        (n) => n.type === "CommentBlock" && n.docBlock,
    );
    const docBlocks = [];

    // Process all docBlocks
    comments.forEach((comment, index) => {
        const docBlock: DocBlock = createDoc(<AST.CommentBlock>comment);
        docBlocks.push(docBlock);

        // docBlocks may contain magic completions, or a snippet
        createDocSnippetCompletions(docBlock, program)
            .filter((completion) => !!completion)
            .forEach((completion) => {
                addSnippetCompletion(program, completion);
            });

        // SPECIAL - first docblock gets attached to program
        let isProgramDoc = false;
        if (comment.loc.start.index === 0) {
            const kinds = docBlock.attributes.map((attr) => attr.kind);
            isProgramDoc = kinds.includes("package") || kinds.includes("author") || kinds.includes("version");
        }

        if (isProgramDoc) {
            attachDoc([program], docBlock);
        } else {
            // Attach docBlock to next node
            // - Earlier docBlocks resolving to the same node will be overridden!
            const branch = getDocTargetBranch(
                getNodeAfterPos(program, comment.loc.end),
            );
            attachDoc(addBranchId(branch), docBlock);
        }
    });

    // Create a package-level docBlock if none exists
    if (!hasNodeDocBlock(program)) {
        const name = getImportModuleName(program.sourceName);
        if (name) {
            setNodeDocBlock(program, <DocBlock>{
                attributes: [{ kind: "package", name }],
                markdown: new MarkdownString(""),
            });
        }
    }

    setImportsAllowed(true); // sanity check
    return program;
};

/** Init all program docBlocks */
export const initProgramDocs = (program: AST.Program) =>
    program.comments
        .filter((n) => n.type === "CommentBlock" && n.docBlock)
        .forEach((comment) => {
            initDoc(getCommentDocBlock(<AST.CommentBlock>comment))
        });

// -----------------------------------------------------------------------------

/**
 * Set type attribute on node doc
 * - Create doc and attr if none
 */
export const setDocNodeType = (branch: AST.Node[], type: string) => {
    let doc = getNodeDoc(branch);
    if (!doc) {
        doc = createDoc();
        attachDoc(branch, doc);
        initDoc(doc);
    }
    let attr = getDocAttr(doc, "type");
    if (!attr) {
        attr = { kind: "type" };
        doc.attributes.push(attr);
    }
    attr.type = type;
};
