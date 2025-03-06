import { AST } from "../ast";
import { getNodeDef, getNodeVal } from "./definition";
import {
    getBranchEndingAtType,
    getBranchId,
    getBranchWithConstructor,
    getNodeAfterPos,
    getBranchAtPos,
} from "./find";
import { posBefore } from "./location";
import { getNodeParams } from "./params";
import { isClassDef } from "./super";

/** Data type returns from getNodeCallData */
type nodeCallData = {
    branch: AST.Node[];
    paramIndex: number;
    paramLength: number;
};

/**
 * Return call definition node, plus the parameter index at pos
 * - Requires documentText in case pos is between params
 * - Since we don`t know if pos is before/after comma
 */
export const getNodeCallData = (
    documentText: string,
    program: AST.Program,
    pos: AST.Position,
): nodeCallData | undefined => {
    let posBranch = getBranchAtPos(program, pos);
    if (!posBranch.length) return;

    // find the CallExpression
    const callBranch = getBranchEndingAtType(posBranch, "CallExpression");
    if (!callBranch.length) return;

    // get the params, exit if none
    const call = <AST.CallExpression>callBranch.at(-1);
    callBranch.push(call.callee);
    let branch = getNodeDef(callBranch);
    let node = branch.at(-1);
    const nodeValue = getNodeVal(branch);
    const params = getNodeParams(nodeValue);
    const paramLength = params.length;
    if (!paramLength) return;

    // if calling a class, defer to the constructor method within
    if (isClassDef(branch)) {
        branch = getBranchWithConstructor(nodeValue);
        node = branch.at(-1);
    }

    // if target node is NOT a parameter, attempt to find the next one
    let posNode = posBranch.at(-1);
    const isBetweenNodes = posNode.type === "CallExpression";
    if (isBetweenNodes) {
        posBranch = getNodeAfterPos(program, pos);
        posNode = posBranch.at(-1);
    }

    // if no next node found...
    if (!posNode) {
        // if still inside the call, the pos must be AFTER the final arg
        if (posBefore(pos, call.loc.end)) {
            const paramIndex = Math.max(0, call.arguments.length - 1);
            return { branch, paramIndex, paramLength };
        }
        return;
    }

    // if target node IS the callee, exit
    if (posBranch.includes(call.callee)) return;

    // find target argument
    for (let i = 0, n = call.arguments.length; i < n; i++) {
        const arg = call.arguments[i];
        if (posBranch.includes(arg)) {
            // if on (or before) the first arg return it
            if (i === 0 || !isBetweenNodes) {
                const paramIndex = Math.min(params.length - 1, i);
                return { branch, paramIndex, paramLength };
            }
            // if between nodes, check the space between for commas
            // - this is where documentText is needed...
            const span = documentText
                .slice(pos.index, arg.loc.start.index)
                .trim();
            const paramIndex = Math.max(0, span.length ? i - 1 : i);
            return { branch, paramIndex, paramLength };
        }
    }
};

/**
 * Return name of call as string
 * - ie: "fe.add_artwork"
 */
export const getCallExpressionName = (branch: AST.Node[]): string => {
    const node = branch.at(-1);
    if (node?.type !== "CallExpression") return;

    const { callee } = <AST.CallExpression>node;

    let method;
    switch (callee?.type) {
        case "MemberExpression":
            const { object, property } = <AST.MemberExpression>callee;
            const name =
                getBranchId(branch.concat([callee], [object]))?.name ?? "";
            const prop = getBranchId(branch.concat([callee], [property]))?.name;
            method = `${name}.${prop}`;
            break;
        case "Identifier":
            method = (<AST.Identifier>callee).name;
            break;
    }

    return method;
};

/** Return branches with given call method names */
export const filterBranchCallMethods = (
    branches: AST.Node[][],
    methods: string[],
): AST.Node[][] =>
    branches.filter((branch) =>
        methods.includes(getCallExpressionName(branch)),
    );
