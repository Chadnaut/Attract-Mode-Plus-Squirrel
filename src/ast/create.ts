import { AST } from ".";

// ---------------------------------------------

const fullLocMap = new WeakMap<AST.Node, AST.SourceLocation>();

export const SetFullLoc = (node: AST.Node, loc: AST.SourceLocation) => {
    fullLocMap.set(node, loc);
}

export const GetFullLoc = (node: AST.Node): AST.SourceLocation | undefined => {
    return fullLocMap.has(node) ? fullLocMap.get(node) : node?.loc;
}

const attrOrNull = (value: AST.ObjectExpression): AST.ObjectExpression | undefined =>
    (typeof value === "object") ? value : null;

// ---------------------------------------------

export class SQTree {
    // ---------------------------------------------
    // Helpers

    /** Location to range, used by all Tree generators */
    static LocRange = (loc?: AST.SourceLocation): AST.Range | undefined =>
        loc
            ? [
                  (loc.start ?? loc.end)?.index ?? 0,
                  (loc.end ?? loc.start)?.index ?? 0,
              ]
            : undefined;

    /** Update target node location and range */
    static LocUpdate = (node: AST.Node, loc: AST.SourceLocation) => {
        if (!node) return;
        node.loc = loc;
        node.range = this.LocRange(loc);
    };

    /** Location starts at `from` and ends at `to`, where available */
    static LocSpan = (
        from: AST.SourceLocation,
        to?: AST.SourceLocation,
    ): AST.SourceLocation | undefined =>
        from || to
            ? this.SourceLocation(from?.start ?? to.start, to?.end ?? from.end)
            : undefined;

    static LocDefault = (
        loc: AST.SourceLocation,
        from: AST.Node,
        to?: AST.Node,
    ): AST.SourceLocation | undefined => {
        return loc ? loc : this.LocSpan(GetFullLoc(from), GetFullLoc(to));
    };

    // ---------------------------------------------

    static SourceLocation = (
        start: AST.Position,
        end: AST.Position,
    ): AST.SourceLocation => ({ start, end });

    /**
     * AST Position
     *
     * @param {number} line A one-based line value
     * @param {number} column A zero-based column value
     * @param {number} index A zero-based index value
     * @returns {AST.Position}
     */
    static Position = (
        line: number,
        column: number,
        index: number,
    ): AST.Position => ({
        line,
        column,
        index,
    });

    /** SPECIAL: Used during error when expected node not found */
    static Undefined = (loc?: AST.SourceLocation): AST.Node => ({
        type: "Undefined",
        loc,
        range: this.LocRange(loc),
    });

    // ----------------------------------------------
    // Identifier

    static Identifier = (
        name: string,
        loc?: AST.SourceLocation,
    ): AST.Identifier => ({
        type: "Identifier",
        name,
        loc,
        range: this.LocRange(loc),
    });

    // static Identifier = (
    //     name: string,
    //     loc?: AST.SourceLocation,
    // ): AST.Identifier => new AST2.Identifier().updateValues({ name, loc });

    // ----------------------------------------------
    // Literal

    static IntegerLiteral = (
        value: number,
        raw?: string,
        loc?: AST.SourceLocation,
    ): AST.IntegerLiteral => ({
        type: "IntegerLiteral",
        value,
        raw: raw ?? String(value),
        loc,
        range: this.LocRange(loc),
    });

    static FloatLiteral = (
        value: number,
        raw?: string,
        loc?: AST.SourceLocation,
    ): AST.FloatLiteral => ({
        type: "FloatLiteral",
        value,
        raw: raw ?? String(value),
        loc,
        range: this.LocRange(loc),
    });

    static StringLiteral = (
        value: string,
        raw?: string,
        loc?: AST.SourceLocation,
    ): AST.StringLiteral => ({
        type: "StringLiteral",
        value,
        raw: raw ?? value,
        loc,
        range: this.LocRange(loc),
    });

    static BooleanLiteral = (
        value: boolean,
        loc?: AST.SourceLocation,
    ): AST.BooleanLiteral => ({
        type: "BooleanLiteral",
        value,
        raw: value ? "true" : "false",
        loc,
        range: this.LocRange(loc),
    });

    static NullLiteral = (loc?: AST.SourceLocation): AST.NullLiteral => ({
        type: "NullLiteral",
        value: null,
        raw: "null",
        loc,
        range: this.LocRange(loc),
    });

    // ----------------------------------------------
    // Programs

    static Program = (
        body: (AST.Directive | AST.Statement)[] = [],
        comments: (AST.CommentLine | AST.CommentBlock)[] = [],
        loc?: AST.SourceLocation,
    ): AST.Program => ({
        type: "Program",
        body,
        sourceType: "script",
        sourceName: "",
        comments,
        loc,
        range: this.LocRange(loc),
    });

    // ---------------------------------------------
    // Statements

    static ExpressionStatement = (
        expression: AST.Expression,
        loc?: AST.SourceLocation,
    ): AST.ExpressionStatement => {
        loc = this.LocDefault(loc, expression);
        return {
            type: "ExpressionStatement",
            expression,
            loc: loc,
            range: this.LocRange(loc),
        };
    };

    static Directive = (
        expression: AST.StringLiteral,
        loc?: AST.SourceLocation,
    ): AST.Directive => {
        loc = this.LocDefault(loc, expression);
        return {
            type: "ExpressionStatement",
            expression,
            directive: expression?.value,
            loc: loc,
            range: this.LocRange(loc),
        };
    };

    static BlockStatement = (
        body: AST.Statement[] = [],
        loc?: AST.SourceLocation,
    ): AST.BlockStatement => ({
        type: "BlockStatement",
        body,
        loc,
        range: this.LocRange(loc),
    });

    static EmptyStatement = (loc?: AST.SourceLocation): AST.EmptyStatement => ({
        type: "EmptyStatement",
        loc,
        range: this.LocRange(loc),
    });

    // ---------------------------------------------
    // Control flow

    static ReturnStatement = (
        argument?: AST.Expression,
        loc?: AST.SourceLocation,
    ): AST.ReturnStatement => ({
        type: "ReturnStatement",
        argument,
        loc,
        range: this.LocRange(loc),
    });

    static BreakStatement = (loc?: AST.SourceLocation): AST.BreakStatement => ({
        type: "BreakStatement",
        loc,
        range: this.LocRange(loc),
    });

    static ContinueStatement = (
        loc?: AST.SourceLocation,
    ): AST.ContinueStatement => ({
        type: "ContinueStatement",
        loc,
        range: this.LocRange(loc),
    });

    static YieldExpression = (
        argument?: AST.Expression,
        loc?: AST.SourceLocation,
    ): AST.YieldExpression => ({
        type: "YieldExpression",
        argument,
        loc,
        range: this.LocRange(loc),
    });

    // ---------------------------------------------
    // Choice

    static IfStatement = (
        test: AST.Expression,
        consequent: AST.Statement,
        alternate?: AST.Statement,
        loc?: AST.SourceLocation,
    ): AST.IfStatement => ({
        type: "IfStatement",
        test,
        consequent,
        alternate,
        loc,
        range: this.LocRange(loc),
    });

    static SwitchStatement = (
        discriminant: AST.Expression,
        cases: AST.SwitchCase[] = [],
        loc?: AST.SourceLocation,
    ): AST.SwitchStatement => ({
        type: "SwitchStatement",
        discriminant,
        cases,
        loc,
        range: this.LocRange(loc),
    });

    static SwitchCase = (
        test?: AST.Expression,
        consequent: AST.Statement[] = [],
        loc?: AST.SourceLocation,
    ): AST.SwitchCase => ({
        type: "SwitchCase",
        test,
        consequent,
        loc,
        range: this.LocRange(loc),
    });

    // ---------------------------------------------
    // Exceptions

    static ThrowStatement = (
        argument: AST.Expression,
        loc?: AST.SourceLocation,
    ): AST.ThrowStatement => ({
        type: "ThrowStatement",
        argument,
        loc,
        range: this.LocRange(loc),
    });

    static TryStatement = (
        block: AST.BlockStatement,
        handler: AST.CatchClause,
        loc?: AST.SourceLocation,
    ): AST.TryStatement => ({
        type: "TryStatement",
        block,
        handler,
        loc,
        range: this.LocRange(loc),
    });

    static CatchClause = (
        param: AST.Pattern,
        body: AST.BlockStatement,
        loc?: AST.SourceLocation,
    ): AST.CatchClause => ({
        type: "CatchClause",
        param,
        body,
        loc,
        range: this.LocRange(loc),
    });

    // ---------------------------------------------
    // Loops

    static WhileStatement = (
        test: AST.Expression,
        body: AST.Statement,
        loc?: AST.SourceLocation,
    ): AST.WhileStatement => ({
        type: "WhileStatement",
        test,
        body,
        loc,
        range: this.LocRange(loc),
    });

    static DoWhileStatement = (
        body: AST.Statement,
        test: AST.Expression,
        loc?: AST.SourceLocation,
    ): AST.DoWhileStatement => ({
        type: "DoWhileStatement",
        body,
        test,
        loc,
        range: this.LocRange(loc),
    });

    static ForStatement = (
        init: AST.VariableDeclaration | AST.Expression | null,
        test: AST.Expression | null,
        update: AST.Expression | null,
        body: AST.Statement,
        loc?: AST.SourceLocation,
    ): AST.ForStatement => ({
        type: "ForStatement",
        init,
        test,
        update,
        body,
        loc,
        range: this.LocRange(loc),
    });

    static ForInStatement = (
        index: AST.Pattern | null,
        left: AST.Pattern,
        right: AST.Expression,
        body: AST.Statement,
        loc?: AST.SourceLocation,
    ): AST.ForInStatement => ({
        type: "ForInStatement",
        index,
        left,
        right,
        body,
        loc,
        range: this.LocRange(loc),
    });

    // ---------------------------------------------
    // Declarations

    static FunctionDeclaration = (
        id: AST.Pattern,
        params: AST.Pattern[],
        body: AST.FunctionBody,
        local: boolean = false,
        loc?: AST.SourceLocation,
    ): AST.FunctionDeclaration => ({
        type: "FunctionDeclaration",
        id,
        params,
        body,
        local,
        loc,
        range: this.LocRange(loc),
    });

    static VariableDeclaration = (
        kind: "local" | "const" = "local",
        declarations: AST.VariableDeclarator[] = [],
        loc?: AST.SourceLocation,
    ): AST.VariableDeclaration => ({
        type: "VariableDeclaration",
        kind,
        declarations,
        loc,
        range: this.LocRange(loc),
    });

    static VariableDeclarator = (
        id: AST.Identifier,
        init: AST.Node = null,
        loc?: AST.SourceLocation,
    ): AST.VariableDeclarator => {
        loc = this.LocDefault(loc, id, init);
        return {
            type: "VariableDeclarator",
            id,
            init,
            loc,
            range: this.LocRange(loc),
        };
    };

    static EnumDeclaration = (
        id: AST.Identifier,
        members: AST.EnumMember[] = [],
        loc?: AST.SourceLocation,
    ): AST.EnumDeclaration => ({
        type: "EnumDeclaration",
        id,
        members,
        loc,
        range: this.LocRange(loc),
    });

    static EnumMember = (
        id: AST.Identifier,
        init: AST.EnumLiteral,
        loc?: AST.SourceLocation,
    ): AST.EnumMember => {
        loc = this.LocDefault(loc, id, init);
        return {
            type: "EnumMember",
            id,
            init,
            loc,
            range: this.LocRange(loc),
        };
    };

    // ----------------------------------------------
    // Expressions

    static ThisExpression = (loc?: AST.SourceLocation): AST.ThisExpression => ({
        type: "ThisExpression",
        loc,
        range: this.LocRange(loc),
    });

    static Base = (loc?: AST.SourceLocation): AST.Base => ({
        type: "Base",
        loc,
        range: this.LocRange(loc),
    });

    static Root = (loc?: AST.SourceLocation): AST.Root => ({
        type: "Root",
        loc,
        range: this.LocRange(loc),
    });

    static ArrayExpression = (
        elements: (AST.Expression | null)[] = [],
        loc?: AST.SourceLocation,
    ): AST.ArrayExpression => ({
        type: "ArrayExpression",
        elements,
        loc,
        range: this.LocRange(loc),
    });

    static ObjectExpression = (
        properties: AST.Property[] = [],
        attributes: boolean = false,
        loc?: AST.SourceLocation,
    ): AST.ObjectExpression => ({
        type: "ObjectExpression",
        properties,
        attributes,
        loc,
        range: this.LocRange(loc),
    });

    static Property = (
        kind: "init" | "get" | "set",
        key: AST.Expression, // AST.Literal | AST.Identifier,
        value: AST.Expression,
        computed: boolean = false,
        json: boolean = false,
        loc?: AST.SourceLocation,
    ): AST.Property => ({
        type: "Property",
        kind,
        key,
        value,
        computed,
        json,
        loc,
        range: this.LocRange(loc),
    });

    static FunctionExpression = (
        params: AST.Pattern[],
        body: AST.FunctionBody,
        loc?: AST.SourceLocation,
    ): AST.FunctionExpression => ({
        type: "FunctionExpression",
        id: null,
        params,
        body,
        loc,
        range: this.LocRange(loc),
    });

    static LambdaExpression = (
        params: AST.Pattern[],
        body: AST.Expression,
        loc?: AST.SourceLocation,
    ): AST.LambdaExpression => ({
        type: "LambdaExpression",
        params,
        body,
        loc,
        range: this.LocRange(loc),
    });

    static UnaryExpression = (
        operator: AST.UnaryOperator,
        argument: AST.Expression,
        prefix: boolean = false,
        loc?: AST.SourceLocation,
    ): AST.UnaryExpression => ({
        type: "UnaryExpression",
        operator,
        argument,
        prefix,
        loc,
        range: this.LocRange(loc),
    });

    static UpdateExpression = (
        operator: AST.UpdateOperator,
        argument: AST.Expression,
        prefix: boolean = false,
        loc?: AST.SourceLocation,
    ): AST.UpdateExpression => ({
        type: "UpdateExpression",
        operator,
        argument,
        prefix,
        loc,
        range: this.LocRange(loc),
    });

    // ---------------------------------------------
    // Binary operations

    static BinaryExpression = (
        operator: AST.BinaryOperator,
        left: AST.Expression,
        right: AST.Expression,
        loc?: AST.SourceLocation,
    ): AST.BinaryExpression => {
        loc = this.LocDefault(loc, left, right);
        return {
            type: "BinaryExpression",
            left,
            operator,
            right,
            loc,
            range: this.LocRange(loc),
        };
    };

    static AssignmentExpression = (
        operator: AST.AssignmentOperator,
        left: AST.Node,
        right: AST.Node,
        loc?: AST.SourceLocation,
    ): AST.AssignmentExpression => {
        loc = this.LocDefault(loc, left, right);
        return {
            type: "AssignmentExpression",
            left,
            operator,
            right,
            loc,
            range: this.LocRange(loc),
        };
    };

    static LogicalExpression = (
        operator: AST.LogicalOperator,
        left: AST.Expression,
        right: AST.Expression,
        loc?: AST.SourceLocation,
    ): AST.LogicalExpression => {
        loc = this.LocDefault(loc, left, right);
        return {
            type: "LogicalExpression",
            left,
            operator,
            right,
            loc,
            range: this.LocRange(loc),
        };
    };

    static MemberExpression = (
        object: AST.Expression | AST.Base,
        property: AST.Expression,
        computed: boolean = false,
        root: boolean = false, // SPECIAL: root usually appears in memberExpressions [::, name]
        loc?: AST.SourceLocation,
    ): AST.MemberExpression => {
        loc = this.LocDefault(loc, object, property);
        return {
            type: "MemberExpression",
            object,
            property,
            computed,
            loc,
            range: this.LocRange(loc),
            extra: { root },
        };
    };

    static ConditionalExpression = (
        test: AST.Expression,
        consequent: AST.Expression,
        alternate: AST.Expression,
        loc?: AST.SourceLocation,
    ): AST.ConditionalExpression => {
        loc = this.LocDefault(loc, test, alternate);
        return {
            type: "ConditionalExpression",
            test,
            consequent,
            alternate,
            loc,
            range: this.LocRange(loc),
        };
    };

    static CallExpression = (
        callee: AST.Expression | AST.Base,
        args: AST.Expression[] = [],
        loc?: AST.SourceLocation,
    ): AST.CallExpression => ({
        type: "CallExpression",
        callee,
        arguments: args,
        loc,
        range: this.LocRange(loc),
    });

    static SequenceExpression = (
        expressions: AST.Expression[] = [],
        loc?: AST.SourceLocation,
    ): AST.SequenceExpression => ({
        type: "SequenceExpression",
        expressions,
        loc,
        range: this.LocRange(loc),
    });

    // ---------------------------------------------
    // Patterns

    static RestElement = (loc?: AST.SourceLocation): AST.RestElement => ({
        type: "RestElement",
        loc,
        range: this.LocRange(loc),
    });

    static AssignmentPattern = (
        left: AST.Pattern,
        right: AST.Expression,
        loc?: AST.SourceLocation,
    ): AST.AssignmentPattern => {
        loc = this.LocDefault(loc, left, right);
        return {
            type: "AssignmentPattern",
            left,
            right,
            loc,
            range: this.LocRange(loc),
        };
    };

    // ---------------------------------------------
    // Classes

    static ClassBody = (
        body: (AST.MethodDefinition | AST.PropertyDefinition)[] = [],
        loc?: AST.SourceLocation,
    ): AST.ClassBody => ({
        type: "ClassBody",
        body,
        loc,
        range: this.LocRange(loc),
    });

    static PropertyDefinition = (
        key: AST.Expression,
        value?: AST.Expression,
        computed: boolean = false,
        isstatic: boolean = false,
        attributes?: AST.ObjectExpression,
        loc?: AST.SourceLocation,
    ): AST.PropertyDefinition => ({
        type: "PropertyDefinition",
        key,
        value,
        computed,
        static: isstatic,
        attributes: attrOrNull(attributes),
        loc,
        range: this.LocRange(loc),
    });

    static MethodDefinition = (
        kind: "constructor" | "method",
        key: AST.Expression,
        value: AST.FunctionExpression,
        isstatic: boolean = false,
        attributes?: AST.ObjectExpression,
        loc?: AST.SourceLocation,
    ): AST.MethodDefinition => ({
        type: "MethodDefinition",
        kind,
        key,
        value,
        static: isstatic,
        attributes: attrOrNull(attributes),
        loc,
        range: this.LocRange(loc),
    });

    static ClassDeclaration = (
        id: AST.Pattern,
        body: AST.ClassBody,
        superClass?: AST.Expression,
        attributes?: AST.ObjectExpression,
        loc?: AST.SourceLocation,
    ): AST.ClassDeclaration => ({
        type: "ClassDeclaration",
        id,
        body,
        superClass,
        attributes: attrOrNull(attributes),
        loc,
        range: this.LocRange(loc),
    });

    static ClassExpression = (
        body: AST.ClassBody,
        superClass?: AST.Expression,
        attributes?: AST.ObjectExpression,
        loc?: AST.SourceLocation,
    ): AST.ClassExpression => ({
        type: "ClassExpression",
        id: null,
        body,
        superClass,
        attributes: attrOrNull(attributes),
        loc,
        range: this.LocRange(loc),
    });

    // ---------------------------------------------
    // Comments

    static CommentLine = (
        value: string = "",
        hash: boolean = false,
        loc?: AST.SourceLocation,
    ): AST.CommentLine => ({
        type: "CommentLine",
        value,
        hash,
        loc,
        range: this.LocRange(loc),
    });

    static CommentBlock = (
        value: string = "",
        docBlock: boolean = false,
        loc?: AST.SourceLocation,
    ): AST.CommentBlock => ({
        type: "CommentBlock",
        value,
        docBlock,
        loc,
        range: this.LocRange(loc),
    });
}
