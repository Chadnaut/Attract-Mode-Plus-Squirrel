import { AST } from "../ast";
import { getNodeDoc, getDocAttr } from "../doc/find";
import { getNodeCall } from "./call";
import { getNodeVal } from "./definition";
import { getBranchWithConstructor } from "./find";
import { getNodeName } from "./identifier";
import { getNodeParams } from "./params";
import { isClassDef } from "./super";

/**
 * Returns augments attribute node value
 * - Class constructor may specify a param for @ augments
 * - The def of this param is added to the completions for this class
 * - Used to assist "wrapper" classes to return better completions
 * - NOTE: the actual forwarding of wrapper get/set must be added by the user
 */
export const getNodeAugmentVal = (
    branch: AST.Node[],
): AST.Node[] => {
    const val = getNodeVal(branch);
    if (!isClassDef(val)) return [];

    const call = getNodeCall(branch);
    if (!call.length) return [];

    const constBranch = getBranchWithConstructor(val);
    if (!constBranch.length) return [];

    const doc = getNodeDoc(constBranch);
    const attr = getDocAttr(doc, "augments");
    if (!attr) return [];

    const paramNames = getNodeParams(constBranch).map((b) => getNodeName(b));
    const index = paramNames.indexOf(attr.name);
    if (index == -1) return [];

    const arg = (<AST.CallExpression>call.at(-1)).arguments[index];
    if (!arg) return [];

    return getNodeVal([...branch, arg]);
}
