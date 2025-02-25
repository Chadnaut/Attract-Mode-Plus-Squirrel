// https://github.com/estree/estree/blob/master/es5.md

import { CompletionItem, Diagnostic, DocumentLink, InlayHint, ParameterInformation, SemanticTokens } from "vscode";
import { DocumentSymbolExtra } from "../utils/symbol";
import { DocBlock } from "../doc/kind";
import { TokenType } from "../utils/token";
import { ParameterInformationExtra } from "../utils/params";
import { CompilerError } from "../squirrel/squirrel/sqcompiler.h";
import { SquirrelMetaType } from "../utils/kind";

// export type Branch = Node[];

export const NODE_TYPES = [
    "Undefined", // Special case when the lexer fails
    "Identifier",
    "Literal",
    "IntegerLiteral",
    "FloatLiteral",
    "StringLiteral",
    "BooleanLiteral",
    "NullLiteral",
    "Program",
    "ExpressionStatement",
    "BlockStatement",
    "EmptyStatement",
    "ReturnStatement",
    "BreakStatement",
    "ContinueStatement",
    "YieldExpression",
    "IfStatement",
    "SwitchStatement",
    "SwitchCase",
    "ThrowStatement",
    "TryStatement",
    "CatchClause",
    "WhileStatement",
    "DoWhileStatement",
    "ForStatement",
    "ForInStatement",
    "FunctionDeclaration",
    "VariableDeclaration",
    "VariableDeclarator",
    "EnumDeclaration",
    "EnumMember",
    "ThisExpression",
    "Base",
    "Root",
    "ArrayExpression",
    "ObjectExpression",
    "Property",
    "FunctionExpression",
    "LambdaExpression",
    "UnaryExpression",
    "UpdateExpression",
    "BinaryExpression",
    "AssignmentExpression",
    "LogicalExpression",
    "MemberExpression",
    "ConditionalExpression",
    "CallExpression",
    "SequenceExpression",
    "RestElement",
    "AssignmentPattern",
    "ClassBody",
    "PropertyDefinition",
    "MethodDefinition",
    "ClassDeclaration",
    "ClassExpression",
    "CommentLine",
    "CommentBlock",
] as const;

export type NodeType = typeof NODE_TYPES[number];


export interface NodeExtra {
    // ---------------------------------------------------------------------
    // Compile-time extras

    /**
     * Body written with brackets "()" around it
     * - Unused in prettier, which decides its own brackets...
     */
    parenthesized?: boolean;

    /**
     * Members joined with '::' instead of '.'
     * - Required for namespace::method members
     */
    root?: boolean;

    // ---------------------------------------------------------------------
    // Hierarchy helpers for searching and traversing
    // - Filled in second round

    /**
     * Parent node (undefined for top-level node)
     * - May change when namespaced methods moved into its class
     */
    // parent?: Node | undefined;

    /**
     * Array of ALL node visitorKey children
     * - Includes id, params, body
     * - Used when the entire branch needs to be traversed
     * - find by pos, tokenize
     */
    // children?: Node[];

    /**
     * Array of body children (params, body)
     * - Does NOT include keys, ids, attributes
     * - Used when searching for
     *   - symbols, definitions, constructor, meta, overloads
     * - May include
     *   - "promoted" nodes such as declarators, expressions
     *   - "relocated" namespace::functions
     */
    // body?: Node[];

    /**
     * Shortcut to the top-level Program node
     * - Handy when definition belongs to other imported programs
     */
    // program?: Program;

    /** If this node is an Identifier, this is its Definition */
    // definition?: Node;

    /** If this node is an Definition, this is its Identifier */
    // id?: Identifier;

    /** The resolved definition for this node */
    // def?: Node;

    /** The resolved value for this node */
    // val?: Node;

    /** If computed holds the raw value */
    // raw?: any;

    /** Flagged if meta property */
    // meta?: SquirrelMetaType;

    /**
     * If the node type was changed during updateExtra, this holds the old type
     * - Computed keys, restElements
     */
    // originalType?: NodeType;

    /** Used to alias identifier named "..." to "vargv" */
    // alias?: string;

    /** Custom type for node, prevents "Instance" type members being applied */
    // typedef?: string;

    // ---------------------------------------------------------------------
    // Tokens and Symbols used for styling
    // - Filled in second round unless noted

    /**
     * True when this node has been tokenized
     * - Prevents out-of-order node being re-processed
     */
    // tokenized?: boolean;

    /** TokenType of this node for syntax highlighting */
    // tokenType?: TokenType; // class, function, param

    /** Symbol for node, displayed in symbol-browser */
    // symbol?: DocumentSymbolExtra;

    /** Node signature contains code example - filled on request */
    // signature?: string;

    /** Parameter info, if this node is callable - filled on request */
    // callParamInfo?: ParameterInformationExtra[];

    /** Parameter info, if this node is a function parameter definition */
    // paramInfo?: ParameterInformationExtra;

    /** Parameter inlays hints - filled on request */
    // hints?: InlayHint[];

    // ---------------------------------------------
    // DocBlock
    // - Filled in third round (requires traversal)

    /** Parsed Docblock data */
    // docBlock?: DocBlock;

    /** True if this node is deprecated by docBlock */
    // deprecated?: boolean;

    // ---------------------------------------------
    // Top level only

    /** Holds pre-built semantic tokens object */
    // semanticTokens?: SemanticTokens;

    /** Array of imported nut files */
    // imports?: string[];

    /** Array of document links */
    // links?: DocumentLink[];

    /** Array of program strings to be checked for links */
    // strings?: StringLiteral[];

    /** Compiler errors */
    // errors?: CompilerError[];

    /** Cached diagnostics */
    // diagnostics?: Diagnostic[];

    /** Keyword completions */
    // completions?: CompletionItem[];
}

// ---------------------------------------------
// Node objects

export interface Node {
    type: NodeType; // string;
    loc: SourceLocation | null;
    range: Range | null;
    extra?: NodeExtra
}

export interface SourceLocation {
    readonly start: Position;
    readonly end: Position;
}

/** AST Position line 1-based, column 0-based, index 0-based */
export interface Position {
    readonly line: number; // 1-based
    readonly column: number; // 0-based
    readonly index: number; // 0-based
}

export type Range = [number, number];

// ---------------------------------------------
// Undefined

export interface Undefined extends Node {
    type: "Undefined";
}

// ---------------------------------------------
// Identifier

export interface Identifier extends Expression, Pattern {
    type: "Identifier";
    name: string;
}

// ---------------------------------------------
// Literal

export interface Literal extends Expression {
    // type: "Literal";
    value: string | boolean | null | number /*| RegExp*/;
    raw: string;
}

export interface IntegerLiteral extends Literal {
    type: "IntegerLiteral";
    value: number;
}

export interface FloatLiteral extends Literal {
    type: "FloatLiteral";
    value: number;
}

export interface StringLiteral extends Literal {
    type: "StringLiteral";
    value: string;
}

export interface BooleanLiteral extends Literal {
    type: "BooleanLiteral";
    value: boolean;
}

export interface NullLiteral extends Literal {
    type: "NullLiteral";
    value: null;
}

// ---------------------------------------------
// Programs

export interface Program extends Node {
    type: "Program";
    sourceType: "script" | "module";
    sourceName?: string;
    body: (Directive | Statement)[];
    comments: (CommentLine | CommentBlock)[];
}

// ---------------------------------------------
// Functions

export interface Function extends Node {
    id: Pattern | null;
    params: Pattern[];
    body: FunctionBody;
}

// ---------------------------------------------
// Statements

export interface Statement extends Node {}

export interface ExpressionStatement extends Statement {
    type: "ExpressionStatement";
    expression: Expression;
}

export interface Directive extends ExpressionStatement {
    expression: Literal;
    directive: string;
}

export interface BlockStatement extends Statement {
    type: "BlockStatement";
    body: Statement[];
}

export interface EmptyStatement extends Statement {
    type: "EmptyStatement";
}

export interface FunctionBody extends BlockStatement {
    body: (Directive | Statement)[];
}

// ---------------------------------------------
// Control flow

export interface ReturnStatement extends Statement {
    type: "ReturnStatement";
    argument: Expression | null;
}

export interface BreakStatement extends Statement {
    type: "BreakStatement";
    // label: Identifier | null;
}

export interface ContinueStatement extends Statement {
    type: "ContinueStatement";
    // label: Identifier | null;
}

export interface YieldExpression extends Expression {
    type: "YieldExpression";
    argument: Expression | null;
    // delegate: boolean;
}

// ---------------------------------------------
// Choice

export interface IfStatement extends Statement {
    type: "IfStatement";
    test: Expression;
    consequent: Statement;
    alternate: Statement | null;
}

export interface SwitchStatement extends Statement {
    type: "SwitchStatement";
    discriminant: Expression;
    cases: SwitchCase[];
}

export interface SwitchCase extends Node {
    type: "SwitchCase";
    test: Expression | null;
    consequent: Statement[];
}

// ---------------------------------------------
// Exceptions

export interface ThrowStatement extends Statement {
    type: "ThrowStatement";
    argument: Expression;
}

export interface TryStatement extends Statement {
    type: "TryStatement";
    block: BlockStatement;
    handler: CatchClause;
}

export interface CatchClause extends Node {
    type: "CatchClause";
    param: Pattern;
    body: BlockStatement;
}

// ---------------------------------------------
// Loops

export interface WhileStatement extends Statement {
    type: "WhileStatement";
    test: Expression;
    body: Statement;
}

export interface DoWhileStatement extends Statement {
    type: "DoWhileStatement";
    body: Statement;
    test: Expression;
}

export interface ForStatement extends Statement {
    type: "ForStatement";
    init: VariableDeclaration | Expression | null;
    test: Expression | null;
    update: Expression | null;
    body: Statement;
}

export interface ForInStatement extends Statement {
    type: "ForInStatement";
    index: Pattern | null;
    left: Pattern;
    right: Expression;
    body: Statement;
}

// ---------------------------------------------
// Declarations

export interface Declaration extends Statement {}

export interface FunctionDeclaration extends Function, Declaration {
    type: "FunctionDeclaration";
    id: Pattern;
    local: boolean;
}

export interface VariableDeclaration extends Declaration {
    type: "VariableDeclaration";
    declarations: VariableDeclarator[];
    kind: "local" | "const";
}

export interface VariableDeclarator extends Node {
    type: "VariableDeclarator";
    id: Pattern;
    init: Expression | null;
}

export interface EnumDeclaration extends Node {
    type: "EnumDeclaration";
    id: Pattern;
    members: EnumMember[];
}

export type EnumLiteral = IntegerLiteral | FloatLiteral | StringLiteral | BooleanLiteral | null;

export interface EnumMember extends Node {
    type: "EnumMember";
    id: Pattern;
    init: EnumLiteral;
}

// ---------------------------------------------
// Expressions

export interface Expression extends Node {}

export interface ThisExpression extends Expression {
    type: "ThisExpression"; // this
}

export interface Base extends Node {
    type: "Base"; // base
}

/**
 * Root variables ::root are member expressions
 * The left side has no written value, just this placeholder
 */
export interface Root extends Node {
    type: "Root";
}

export interface ArrayExpression extends Expression {
    type: "ArrayExpression";
    elements: (Expression | null)[];
}

export interface ObjectExpression extends Expression {
    type: "ObjectExpression";
    attributes: boolean;
    properties: Property[];
}

export interface Property extends Node {
    type: "Property";
    key: Expression; // Literal | Identifier;
    value: Expression;
    computed: boolean;
    json: boolean;
    kind: "init" | "get" | "set";
}

export interface FunctionExpression extends Function, Expression {
    type: "FunctionExpression";
}

export interface LambdaExpression extends Node {
    type: "LambdaExpression";
    params: Pattern[];
    body: Expression;
}

export interface UnaryExpression extends Expression {
    type: "UnaryExpression";
    operator: UnaryOperator;
    prefix: boolean;
    argument: Expression;
}

export type UnaryOperator =
    | "-"
    | "+"
    | "!"
    | "~"
    | "typeof"
    | "delete"
    | "clone"
    | "resume";

export interface UpdateExpression extends Expression {
    type: "UpdateExpression";
    operator: UpdateOperator;
    argument: Expression;
    prefix: boolean;
}

export type UpdateOperator = "++" | "--";

// ---------------------------------------------
// Binary operations

export interface BinaryExpression extends Expression {
    type: "BinaryExpression";
    operator: BinaryOperator;
    left: Expression;
    right: Expression;
}

export type BinaryOperator =
    | "=="
    | "!="
    | "<"
    | "<="
    | ">"
    | ">="
    | "<<"
    | ">>"
    | ">>>"
    | "<=>"
    | "+"
    | "-"
    | "*"
    | "/"
    | "%"
    | "|"
    | "^"
    | "&"
    | "in"
    | "instanceof";

export interface AssignmentExpression extends Expression {
    type: "AssignmentExpression";
    operator: AssignmentOperator;
    left: Pattern | Expression;
    right: Expression;
}

export type AssignmentOperator = "=" | "+=" | "-=" | "*=" | "/=" | "%=" | "<-";

export interface LogicalExpression extends Expression {
    type: "LogicalExpression";
    operator: LogicalOperator;
    left: Expression;
    right: Expression;
}

export type LogicalOperator = "||" | "&&";

export interface MemberExpression extends Expression, Pattern {
    type: "MemberExpression";
    object: Expression | Base;
    property: Expression;
    computed: boolean;
}

export interface ConditionalExpression extends Expression {
    type: "ConditionalExpression";
    test: Expression;
    alternate: Expression;
    consequent: Expression;
}

export interface CallExpression extends Expression {
    type: "CallExpression";
    callee: Expression | Base;
    arguments: Expression[];
}

export interface SequenceExpression extends Expression {
    type: "SequenceExpression";
    expressions: Expression[];
}

// ---------------------------------------------
// Patterns

export interface Pattern extends Node {}

// Only ever used as a param
// https://github.com/estree/estree/blob/master/es2015.md#restelement
export interface RestElement extends Pattern {
    type: "RestElement";
    // argument: Pattern;
}

export interface AssignmentPattern extends Pattern {
    type: "AssignmentPattern";
    left: Pattern;
    right: Expression;
}

// ---------------------------------------------
// Classes

export interface Class extends Node {
    id: Pattern | null;
    superClass: Expression | null;
    attributes: ObjectExpression | null;
    body: ClassBody;
}

export interface ClassBody extends Node {
    type: "ClassBody";
    body: (MethodDefinition | PropertyDefinition)[];
}

// https://github.com/estree/estree/blob/master/es2022.md
export interface PropertyDefinition extends Node {
    type: "PropertyDefinition";
    key: Expression;
    value: Expression | null;
    computed: boolean;
    static: boolean;
    attributes: ObjectExpression | null;
}

export interface MethodDefinition extends Node {
    type: "MethodDefinition";
    kind: "constructor" | "method";
    key: Expression;
    value: FunctionExpression;
    // computed: boolean;
    static: boolean;
    attributes: ObjectExpression | null;
}

export interface ClassDeclaration extends Class, Declaration {
    type: "ClassDeclaration";
    id: Pattern;
}

export interface ClassExpression extends Class, Expression {
    type: "ClassExpression";
}

// ---------------------------------------------
// Comments

export interface CommentLine extends Expression {
    type: "CommentLine";
    value: string;
    hash?: boolean;
}

export interface CommentBlock extends Expression {
    type: "CommentBlock";
    value: string;
    docBlock: boolean;
}

// ---------------------------------------------

/** Keys of AST nodes that should be iterated to find child nodes */
export const visitorKeys: { [key: string]: string[] } = {
    // Node: [],
    // SourceLocation: [],
    // Position: [],
    Identifier: [],
    Literal: [],
    IntegerLiteral: [],
    FloatLiteral: [],
    StringLiteral: [],
    BooleanLiteral: [],
    NullLiteral: [],
    Program: ["body"],
    Function: ["id", "params", "body"],
    Statement: [],
    ExpressionStatement: ["expression"],
    Directive: ["expression"],
    BlockStatement: ["body"],
    EmptyStatement: [],
    FunctionBody: ["body"],
    ReturnStatement: ["argument"],
    BreakStatement: [],
    ContinueStatement: [],
    YieldExpression: ["argument"],
    IfStatement: ["test", "consequent", "alternate"],
    SwitchStatement: ["discriminant", "cases"],
    SwitchCase: ["test", "consequent"],
    ThrowStatement: ["argument"],
    TryStatement: ["block", "handler"],
    CatchClause: ["param", "body"],
    WhileStatement: ["test", "body"],
    DoWhileStatement: ["body", "test"],
    ForStatement: ["init", "test", "update", "body"],
    ForInStatement: ["index", "left", "right", "body"],
    Declaration: [],
    FunctionDeclaration: ["id", "params", "body"],
    VariableDeclaration: ["declarations"],
    VariableDeclarator: ["id", "init"],
    EnumDeclaration: ["id", "members"],
    EnumMember: ["id", "init"],
    Expression: [],
    ThisExpression: [],
    Base: [],
    Root: [],
    ArrayExpression: ["elements"],
    ObjectExpression: ["properties"],
    Property: ["key", "value"],
    FunctionExpression: ["id", "params", "body"],
    LambdaExpression: ["params", "body"],
    UnaryExpression: ["argument"],
    UpdateExpression: ["argument"],
    BinaryExpression: ["left", "right"],
    AssignmentExpression: ["left", "right"],
    LogicalExpression: ["left", "right"],
    MemberExpression: ["object", "property"],
    ConditionalExpression: ["test", "alternate", "consequent"],
    CallExpression: ["callee", "arguments"],
    SequenceExpression: ["expressions"],
    Pattern: [],
    RestElement: [],
    AssignmentPattern: ["left", "right"],
    Class: ["id", "superClass", "attributes", "body"],
    ClassBody: ["body"],
    PropertyDefinition: ["key", "value", "attributes"],
    MethodDefinition: ["key", "value", "attributes"],
    ClassDeclaration: ["id", "superClass", "attributes", "body"],
    ClassExpression: ["id", "superClass", "attributes", "body"],
    CommentLine: [],
    CommentBlock: [],
};

/**
 * Much like visitor keys, but without left-side identifiers
 * - Used when searching for child values
 */
export const valueKeys: { [key: string]: string[] } = {
    // Node: [],
    // SourceLocation: [],
    // Position: [],
    Identifier: [],
    Literal: [],
    IntegerLiteral: [],
    FloatLiteral: [],
    StringLiteral: [],
    BooleanLiteral: [],
    NullLiteral: [],
    Program: ["body"],
    Function: ["params", "body"],
    Statement: [],
    ExpressionStatement: ["expression"],
    Directive: ["expression"],
    BlockStatement: ["body"],
    EmptyStatement: [],
    FunctionBody: ["body"],
    ReturnStatement: ["argument"],
    BreakStatement: [],
    ContinueStatement: [],
    YieldExpression: ["argument"],
    IfStatement: ["test", "consequent", "alternate"],
    SwitchStatement: ["discriminant", "cases"],
    SwitchCase: ["test", "consequent"],
    ThrowStatement: ["argument"],
    TryStatement: ["block", "handler"],
    CatchClause: ["param", "body"],
    WhileStatement: ["test", "body"],
    DoWhileStatement: ["body", "test"],
    ForStatement: ["init", "test", "update", "body"],
    ForInStatement: ["index", "right", "body"],
    Declaration: [],
    FunctionDeclaration: ["params", "body"],
    VariableDeclaration: ["declarations"],
    VariableDeclarator: ["init"],
    EnumDeclaration: ["members"],
    EnumMember: ["init"],
    Expression: [],
    ThisExpression: [],
    Base: [],
    Root: [],
    ArrayExpression: ["elements"],
    ObjectExpression: ["properties"],
    Property: ["value"],
    FunctionExpression: ["params", "body"],
    LambdaExpression: ["params", "body"],
    UnaryExpression: ["argument"],
    UpdateExpression: ["argument"],
    BinaryExpression: ["right"],
    AssignmentExpression: ["right"],
    LogicalExpression: ["right"],
    MemberExpression: ["property"],
    ConditionalExpression: ["test", "alternate", "consequent"],
    CallExpression: ["callee", "arguments"],
    SequenceExpression: ["expressions"],
    Pattern: [],
    RestElement: [],
    AssignmentPattern: ["right"],
    Class: ["body"],
    ClassBody: ["body"],
    PropertyDefinition: ["value"],
    MethodDefinition: ["value"],
    ClassDeclaration: ["body"],
    ClassExpression: ["body"],
    CommentLine: [],
    CommentBlock: [],
};
