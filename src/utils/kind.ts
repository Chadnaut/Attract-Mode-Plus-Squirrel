import { SymbolKind, CompletionItemKind } from "vscode";
import { AST } from "../ast";
import { NODE_TYPES, NodeType } from "../ast/ast";
import { isNewSlotAssignment } from "./root";
import { getNodeIsParameter } from "./params";
import { getBranchId, getBranchWithInitValue } from "./find";

/**
 * Image extensions listed in the AM docs
 */
export const imageExtensions = [
    ".png",
    ".jpg",
    ".jpeg",
    ".gif",
    ".bmp",
    ".tga",
];

/**
 * Common audio extensions, may not be compatible
 * https://en.wikipedia.org/wiki/Audio_file_format
 */
export const audioExtensions = [
    ".3gp",
    ".aa",
    ".aac",
    ".aax",
    ".act",
    ".aiff",
    ".alac",
    ".amr",
    ".ape",
    ".au",
    ".awb",
    ".dss",
    ".dvf",
    ".flac",
    ".gsm",
    ".iklax",
    ".ivs",
    ".m4a",
    ".m4b",
    ".m4p",
    ".mmf",
    ".movpkg",
    ".mp3",
    ".mpc",
    ".msv",
    ".nmf",
    ".ogg",
    ".oga",
    ".mogg",
    ".opus",
    ".ra",
    ".rm",
    ".raw",
    ".rf64",
    ".sln",
    ".tta",
    ".voc",
    ".vox",
    ".wav",
    ".wma",
    ".wv",
    ".webm",
    ".8svx",
    ".cda",
];

/**
 * Common video extensions, may not be compatible
 * https://en.wikipedia.org/wiki/Comparison_of_video_container_formats
 */
export const videoExtensions = [
    ".mkv",
    ".mk3d",
    ".mp4",
    ".m4v",
    ".mov",
    ".qt",
    ".asf",
    ".wmv",
    ".avi",
    ".mxf",
    ".m2p",
    ".ps",
    // ".ts",
    ".tsv",
    ".m2ts",
    ".mts",
    ".vob",
    ".evo",
    ".3gp",
    ".3g2",
    ".f4v",
    ".flv",
    ".ogv",
    ".ogx",
    ".webm",
    ".rmvb",
    ".divx",
];

export const shaderExtensions = [
    ".frag",
    ".fsh",
    ".fs",
    ".glfs",
    ".vert",
    ".vsh",
    ".vs",
    ".glvs",
    ".glsl",
    ".shader",
];

export const metaSymbolNames = [
    "_set",
    "_get",
    "_newslot",
    "_delslot",
    "_add",
    "_sub",
    "_mul",
    "_div",
    "_modulo",
    "_unm",
    "_typeof",
    "_cmp",
    "_call",
    "_cloned",
    "_nexti",
    "_tostring",
    "_inherited",
    "_newmember",
];

export enum SquirrelType {
    INTEGER = "integer",
    FLOAT = "float",
    STRING = "string",
    BOOLEAN = "boolean",
    NULL = "null",
    TABLE = "table",
    ARRAY = "array",
    CLASS = "class",
    CONSTRUCTOR = "constructor",
    PROPERTY = "property", // or getter+setter
    READONLY = "readonly", // getter
    WRITEONLY = "writeonly", // setter
    METHOD = "method",
    FUNCTION = "function",
    ENUM = "enum",
    ENUMMEMBER = "enummember",
    CONSTANT = "const",
    VARIABLE = "local",
    GLOBAL = "global",
    PARAMETER = "parameter",
    ANY = "*",
}

export type SquirrelMetaType =
    | SquirrelType.PROPERTY
    | SquirrelType.READONLY
    | SquirrelType.WRITEONLY;

const SquirrelTypeValues = Object.values(SquirrelType);
export { SquirrelTypeValues };

export const NodeLiteral: NodeType[] = [
    "IntegerLiteral",
    "FloatLiteral",
    "StringLiteral",
    "BooleanLiteral",
    "NullLiteral",
];

export const isNodeLiteral = (node: AST.Node): boolean =>
    NodeLiteral.includes(node?.type);

const symbolToCompletionKindMap = new Map<SymbolKind, CompletionItemKind>([
    [SymbolKind.File, CompletionItemKind.File],
    [SymbolKind.Module, CompletionItemKind.Module],
    [SymbolKind.Class, CompletionItemKind.Class],
    [SymbolKind.Method, CompletionItemKind.Method],
    [SymbolKind.Property, CompletionItemKind.Property],
    [SymbolKind.Field, CompletionItemKind.Field],
    [SymbolKind.Constructor, CompletionItemKind.Constructor],
    [SymbolKind.Enum, CompletionItemKind.Enum],
    [SymbolKind.Interface, CompletionItemKind.Interface],
    [SymbolKind.Function, CompletionItemKind.Function],
    [SymbolKind.Variable, CompletionItemKind.Variable],
    [SymbolKind.Constant, CompletionItemKind.Constant],
    [SymbolKind.EnumMember, CompletionItemKind.EnumMember],
    [SymbolKind.Struct, CompletionItemKind.Struct],
    [SymbolKind.Event, CompletionItemKind.Event],
    [SymbolKind.Operator, CompletionItemKind.Operator],
    [SymbolKind.TypeParameter, CompletionItemKind.TypeParameter],
]);

/** SymbolKind to CompletionItemKind  */
export const symbolToCompletionKind = (
    kind: SymbolKind,
): CompletionItemKind | undefined => symbolToCompletionKindMap.get(kind);

const stringToCompletionKindMap = new Map<string, CompletionItemKind>([
    ["file", CompletionItemKind.File],
    ["module", CompletionItemKind.Module],
    ["class", CompletionItemKind.Class],
    ["method", CompletionItemKind.Method],
    ["property", CompletionItemKind.Property],
    ["field", CompletionItemKind.Field],
    ["constructor", CompletionItemKind.Constructor],
    ["enum", CompletionItemKind.Enum],
    ["interface", CompletionItemKind.Interface],
    ["function", CompletionItemKind.Function],
    ["variable", CompletionItemKind.Variable],
    ["constant", CompletionItemKind.Constant],
    ["enummember", CompletionItemKind.EnumMember],
    ["struct", CompletionItemKind.Struct],
    ["event", CompletionItemKind.Event],
    ["operator", CompletionItemKind.Operator],
    ["typeparameter", CompletionItemKind.TypeParameter],
    // Special, used by keyword completion kinds
    ["magic", CompletionItemKind.Event],
    ["attr", CompletionItemKind.Constant],
]);

/** SymbolKind to CompletionItemKind  */
export const stringToCompletionKind = (
    kind: string,
): CompletionItemKind | undefined => stringToCompletionKindMap.get(kind);

const symbolToSquirrelTypeMap = new Map<SymbolKind, SquirrelType>([
    [SymbolKind.Class, SquirrelType.CLASS],
    [SymbolKind.Constructor, SquirrelType.CONSTRUCTOR],
    [SymbolKind.Method, SquirrelType.METHOD],
    [SymbolKind.Property, SquirrelType.PROPERTY],
    [SymbolKind.Constant, SquirrelType.CONSTANT],
    [SymbolKind.Field, SquirrelType.GLOBAL],
    [SymbolKind.Variable, SquirrelType.VARIABLE],
    [SymbolKind.Enum, SquirrelType.ENUM],
    [SymbolKind.EnumMember, SquirrelType.ENUMMEMBER],
    [SymbolKind.Function, SquirrelType.FUNCTION],
]);

/** SymbolKind to SquirrelType  */
export const symbolToSquirrelType = (
    kind: SymbolKind,
): SquirrelType | undefined => symbolToSquirrelTypeMap.get(kind);

// /** SquirrelType to SymbolKind  */
// export const squirrelToSymbolType = (type: SquirrelType): SymbolKind | undefined => {
//     for (let [key, value] of symbolToSquirrelTypeMap.entries()) {
//         if (value === type) return key;
//     }
// }

/**
 * Returns true if node, or its init value, can be called
 */
export const getNodeTypeCallable = (branch: AST.Node[]): AST.Node | undefined => {
    const node = branch.at(-1);
    switch (node?.type) {
        case "FunctionDeclaration":
        case "FunctionExpression":
        case "MethodDefinition":
        case "LambdaExpression":
        case "ClassDeclaration":
        case "ClassExpression":
            return node;
        case undefined:
            return;
        default: {
            return getNodeTypeCallable(getBranchWithInitValue(branch));
        }
    }
};

/**
 * NodeType to printable SquirrelType
 * - May do some traversal to find parameter type
 * - Note that squirrel doesn't actually have types...
 */
export const nodeToSquirrelType = (branch: AST.Node[]): SquirrelType | string => {
    const node = branch.at(-1);
    if (!node) return SquirrelType.NULL;
    switch (node.type) {
        case "IntegerLiteral":
            return SquirrelType.INTEGER;
        case "FloatLiteral":
            return SquirrelType.FLOAT;
        case "StringLiteral":
            return SquirrelType.STRING;
        case "BooleanLiteral":
            return SquirrelType.BOOLEAN;
        case "NullLiteral":
            return SquirrelType.NULL;
        case "ObjectExpression":
            return SquirrelType.TABLE;
        case "ArrayExpression":
            return SquirrelType.ARRAY;
        case "Identifier": {
            if (getNodeIsParameter(branch)) return SquirrelType.PARAMETER;
            if (getBranchId(branch.slice(0, -1)) === node) return nodeToSquirrelType(branch.slice(0, -1));
            return; // undefined
        }
        case "AssignmentPattern": {
            return SquirrelType.PARAMETER;
        }
        case "ClassDeclaration":
        case "ClassExpression":
        case "ThisExpression":
        case "Base":
            return SquirrelType.CLASS;
        case "FunctionDeclaration":
        case "FunctionExpression":
        case "LambdaExpression":
            return SquirrelType.FUNCTION;
        case "EnumDeclaration":
            return SquirrelType.ENUM;
        case "EnumMember":
            return SquirrelType.ENUMMEMBER;
        case "MethodDefinition":
            return (<AST.MethodDefinition>node).kind === "method"
                ? SquirrelType.METHOD
                : SquirrelType.CONSTRUCTOR;
        case "Property":
        case "PropertyDefinition":
            return SquirrelType.PROPERTY;
        case "VariableDeclarator":
            return nodeToSquirrelType(branch.slice(0, -1));
        case "VariableDeclaration":
            return (<AST.VariableDeclaration>node).kind === "local"
                ? SquirrelType.VARIABLE
                : SquirrelType.CONSTANT;
        case "AssignmentExpression":
            if (isNewSlotAssignment(branch)) return SquirrelType.GLOBAL;
            return SquirrelType.ANY;

        case "Undefined":
        case "Program":
        case "ExpressionStatement":
        case "BlockStatement":
        case "EmptyStatement":
        case "ReturnStatement":
        case "BreakStatement":
        case "ContinueStatement":
        case "YieldExpression":
        case "IfStatement":
        case "SwitchStatement":
        case "SwitchCase":
        case "ThrowStatement":
        case "TryStatement":
        case "CatchClause":
        case "WhileStatement":
        case "DoWhileStatement":
        case "ForStatement":
        case "ForInStatement":
        case "Root":
        case "UnaryExpression":
        case "UpdateExpression":
        case "BinaryExpression":
        case "LogicalExpression":
        case "MemberExpression":
        case "ConditionalExpression":
        case "CallExpression":
        case "SequenceExpression":
        case "RestElement":
        case "ClassBody":
        case "CommentLine":
        case "CommentBlock":
            return SquirrelType.ANY;

        default:
            return node.type;
    }
};

const squirrelToNodeTypeMap = new Map<SquirrelType, NodeType>([
    [SquirrelType.INTEGER, "IntegerLiteral"],
    [SquirrelType.FLOAT, "FloatLiteral"],
    [SquirrelType.STRING, "StringLiteral"],
    [SquirrelType.BOOLEAN, "BooleanLiteral"],
    [SquirrelType.NULL, "NullLiteral"],
    [SquirrelType.TABLE, "ObjectExpression"],
    [SquirrelType.ARRAY, "ArrayExpression"],
    [SquirrelType.FUNCTION, "FunctionExpression"],
    [SquirrelType.CLASS, "ClassDeclaration"],
    [SquirrelType.ENUM, "EnumDeclaration"],
    [SquirrelType.ENUMMEMBER, "EnumMember"],
    [SquirrelType.METHOD, "MethodDefinition"],
    [SquirrelType.CONSTRUCTOR, "MethodDefinition"],
    [SquirrelType.PROPERTY, "PropertyDefinition"],
    [SquirrelType.VARIABLE, "VariableDeclaration"],
    [SquirrelType.CONSTANT, "VariableDeclaration"],
]);

export const squirrelToNodeType = (type: SquirrelType): NodeType | undefined =>
    squirrelToNodeTypeMap.get(type);

export const squirrelToNodeTypeMaybe = (type: string): NodeType | string | undefined =>
    squirrelToNodeTypeMap.get(<SquirrelType>type) ?? type;

export const isNodeType = (type: string): boolean =>
    NODE_TYPES.includes(<NodeType>type);
