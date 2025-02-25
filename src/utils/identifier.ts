import { AST } from "../ast";
import { getDocAttr, getNodeDoc } from "../doc/find";
import { getBranchFunctionDef, getBranchId } from "./find";
import { getNodeComputed, hasNodeComputed } from "./meta";
import { isRestNode } from "./params";
import { isNewSlotAssignment } from "./root";

/** Return true if value identifier name */
export const isValidName = (name: string): boolean =>
    !!name.match(/^[_A-Za-z][_A-Za-z0-9]*$/);

/** Return branch with identifier */
export const addBranchId = (
    branch: AST.Node[],
): AST.Node[] => {
    const b = getBranchWithId(branch);
    if (b.length && b.at(-1) === undefined) return [];
    return b;
};

/**
 * Find Identifier for node
 * - Variables, classes, functions are linked to ID's
 * - Usually by 'id' or 'key', and parent declarators for expressions
 * - Expressions resolve to their parent id
 */
const getBranchWithId = (
    branch: AST.Node[],
): AST.Node[] => {
    const node = branch.at(-1);
    switch (node?.type) {
        case "Identifier":
            // `ID`
            return branch;
        case "VariableDeclarator":
            // local `ID = 123`
            return branch.concat([<AST.Identifier>((<AST.VariableDeclarator>node).id)]);
        case "FunctionDeclaration": {
            // `function ID {}`
            const n = (<AST.FunctionDeclaration>node).id;
            const e = <AST.MemberExpression>n;
            if (e?.type === "MemberExpression") return branch.concat([e.property]);
            return branch.concat([n]);
        }
        case "Property":
            // class foo { `ID = value` }
            return branch.concat([<AST.Identifier>((<AST.Property>node).key)]);
        case "EnumDeclaration":
            // `enum ID {}`
            return branch.concat([<AST.Identifier>((<AST.EnumDeclaration>node).id)]);
        case "EnumMember":
            // enum e { `ID = value` }
            return branch.concat([<AST.Identifier>((<AST.EnumMember>node).id)]);
        case "ClassDeclaration": {
            // `class ID {}`
            const n = (<AST.ClassDeclaration>node).id;
            const e = <AST.MemberExpression>n;
            if (e?.type === "MemberExpression") return branch.concat([e.property]);
            return branch.concat([n]);
        }
        case "PropertyDefinition":
            // local obj = { `ID = val` }
            return branch.concat([<AST.Identifier>((<AST.PropertyDefinition>node).key)]);
        case "MethodDefinition":
            // class foo { `function ID() {}` }
            return branch.concat([<AST.Identifier>((<AST.MethodDefinition>node).key)]);
        case "AssignmentPattern":
            // SPECIAL: function param
            // function (`::ID = value`)
            return branch.concat([<AST.Identifier>((<AST.AssignmentPattern>node).left)]);
        case "AssignmentExpression":
            // SPECIAL: newslot declaration
            // `ID <- value`
            return isNewSlotAssignment([node])
                ? branch.concat([<AST.Identifier>(<AST.AssignmentExpression>node).left])
                : branch;
        case "FunctionExpression":
        case "ClassExpression":
        case "LambdaExpression":
            // Check parent of expressions
            return getBranchWithId(branch.slice(0, -1));
        default:
            return [];
    }
};

/**
 * Return true if give node has an ID
 * - Does not resolve expressions (doesn't use extra)
 */
export const hasNodeId = (
    node: AST.Node,
): boolean => {
    switch (node?.type) {
        case "Identifier":
        case "VariableDeclarator":
        case "FunctionDeclaration":
        case "Property":
        case "EnumDeclaration":
        case "EnumMember":
        case "ClassDeclaration":
        case "PropertyDefinition":
        case "MethodDefinition":
            return true;
        case "AssignmentExpression":
            return isNewSlotAssignment([node]);
        default:
            return false;
    }
};

/**
 * Return node id name for display
 * - If RestElement return docBlock rest name (or none)
 * - If computed return raw value with [square brackets]
 * - Otherwise return identifier name
 */
export const getNodeName = (branch: AST.Node[], spread = false): string => {
    const node = branch.at(-1);
    if (!node) return "";

    const id = getBranchId(branch);
    if (!id) return "";

    // id is computed value
    if (hasNodeComputed(id)) return `[${getNodeComputed(id)}]`;

    // id is converted RestElement, use "rest" attr which *may* contain name for it
    if (isRestNode(branch)) {
        const docblock = getNodeDoc(getBranchFunctionDef(branch));
        const attr = getDocAttr(docblock, "param", id.name);
        const name = attr?.rest ?? "";
        return spread ? `...${name}` : name;
    }

    return id.name;
};
