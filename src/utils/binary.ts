import { getDocAttr } from '../doc/find';
import { AST } from "../ast";
import constants from "../constants";
import { getNodeDoc } from "../doc/find";
import { getNodeVal } from "./definition";
import { getRelativeNutPath } from "./import";
import * as path from "path";
import { getConfigValue } from './config';

/**
 * Resolve a SIMPLE binary expression to improve import completions
 * - fe.module_dir + "file.nut"
 * - Only resolves a limited set of identifier
 * - Only resolves 'fe' member expressions
 */
export const resolveBinaryExpression = (branch: AST.Node[], sourceName: string, limited = false): string | undefined => {
    const node = branch.at(-1);
    switch (node?.type) {
        case "Identifier": {
            const value = getNodeVal(branch);
            if (node === value.at(-1)) return;
            return resolveBinaryExpression(value, sourceName, true);
        }
        case "MemberExpression": {
            const m = <AST.MemberExpression>node;
            const obj = m.object;
            if (obj.type !== "Identifier") return;
            if ((<AST.Identifier>obj).name !== "fe") return;
            return resolveBinaryExpression(getNodeVal(branch), sourceName, true);
        }
        case "StringLiteral": {
            const docblock = getNodeDoc(branch.slice(0, -1));
            const external = getDocAttr(docblock, "external")?.name;
            switch (external) {
                case "$module_dir":
                    return path.dirname(sourceName) + "/";
                case "$script_dir":
                    return getRelativeNutPath(sourceName);
                case "$FeConfigDirectory":
                    return getConfigValue(constants.ATTRACT_MODE_PATH, "").replace(/[\\/]$/, "") + "/";
                default:
                    return limited ? undefined : (<AST.StringLiteral>node).value;
            }
        }
        case "BinaryExpression": {
            const { left, right, operator } = <AST.BinaryExpression>node;
            if (operator !== "+") return;
            const leftVal = resolveBinaryExpression([...branch, left], sourceName);
            if (typeof leftVal !== "string") return;
            const rightVal = resolveBinaryExpression([...branch, right], sourceName);
            if (typeof rightVal !== "string") return;
            return leftVal + rightVal;
        }
    }
}
