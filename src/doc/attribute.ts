import { AST } from "../ast";
import { getNodeDef } from "../utils/definition";
import { getBranchBlock, getBranchId, getBranchWithInitValue } from "../utils/find";
import { addBranchId } from "../utils/identifier";
import { nodeToSquirrelType } from "../utils/kind";
import { getNodeChildren } from "../utils/map";
import { isRestNode } from "../utils/params";
import { isClassDef, getSuperDef } from "../utils/super";
import { getNodeDoc, getAttrByKind, getDocAttr } from "./find";
import { DocAttr, DocBlock } from "./kind";

/**
 * Create attribute for a parameter
 * - Returns undefined if node is invalid
 */
export const createParamAttr = (branch: AST.Node[]): DocAttr | undefined => {
    const node = branch.at(-1);
    switch (node?.type) {
        case "Identifier": {
            const name = getBranchId(branch).name;
            const rest = isRestNode(branch) ? "vargv" : "";
            return { kind: "param", type: "*", name: `${name}${rest}` };
        }
        case "AssignmentPattern": {
            const { left, right } = <AST.AssignmentPattern>node;
            const name = getBranchId([...branch, left])?.name ?? "";
            const type = nodeToSquirrelType([...branch, right]);
            return { kind: "param", type, name };
        }
    }
};

// -----------------------------------------------------------------------------

/** Update doc attribute inheritance */
export const updateDocAttr = (docBlock: DocBlock, branch: AST.Node[]) => {
    const attrs = [];
    for (const attr of docBlock.attributes) {
        switch (attr.kind) {
            case "inheritdoc!":
            case "inheritdoc": {
                // copy entire docblock
                const nodeDef = getNodeDef(branch);
                let doc: DocBlock;
                if (isClassDef(nodeDef)) {
                    doc = getNodeDoc(addBranchId(getSuperDef(nodeDef)));
                } else {
                    doc = getNodeDoc(addBranchId(getNodeDef(getBranchWithInitValue(nodeDef))));
                }
                // do not copy @ignore
                if (doc) attrs.push(...((attr.kind === "inheritdoc!")
                    ? doc.attributes
                    : doc.attributes.filter((attr) => attr.kind !== "ignore")));
                break;
            }
            case "variation": {
                // inherit variation description (must be a sibling)
                const siblings = getNodeChildren(getBranchBlock(branch));
                const sibling = siblings.find((child) => getBranchId(child)?.name === attr.name);
                const doc = getNodeDoc(sibling ?? []);
                // copy description over if none
                if (!getAttrByKind(attrs, "description")) {
                    const variationDesc = getDocAttr(doc, "description");
                    if (variationDesc) attrs.push(variationDesc);
                }
                break;
            }
            default: {
                attrs.push(attr);
                break;
            }
        }
    }
    docBlock.attributes = attrs;
};
