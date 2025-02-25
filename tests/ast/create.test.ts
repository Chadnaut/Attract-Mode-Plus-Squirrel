import { describe, expect, it } from "@jest/globals";
import { AST, SQTree as qt } from "../../src/ast";

const start = <AST.Position>{ line: 0, column: 0, index: 0 };
const end = <AST.Position>{ line: 1, column: 1, index: 1 };
const literal = qt.StringLiteral("x");

describe("SQTree", () => {
    it("LocRange creates", () => {
        expect(qt.LocRange({ start, end })).toHaveLength(2);
        expect(qt.LocRange({ start: null, end })).toHaveLength(2);
        expect(qt.LocRange({ start, end: null })).toHaveLength(2);
        expect(qt.LocRange({ start: null, end: null })).toHaveLength(2);
        expect(qt.LocRange()).toBeUndefined();
    });
    it("LocUpdate updates", () => {
        const n = <AST.Node>{ type: "Identifier", loc: null, range: null };
        qt.LocUpdate(n, qt.SourceLocation(start, end));
        expect(n.range[0]).toBe(start.index);
        expect(n.range[1]).toBe(end.index);
        expect(qt.LocUpdate(undefined, qt.SourceLocation(start, end))).toBeUndefined();
    });
    it("LocSpan creates", () => {
        const s1 = qt.Position(0,0,0);
        const e1 = qt.Position(0,1,1);
        const s2 = qt.Position(0,2,2);
        const e2 = qt.Position(0,3,3);
        const l1 = qt.SourceLocation(s1, e1);
        const l2 = qt.SourceLocation(s2, e2);
        expect(qt.LocSpan(l1, l2)).toEqual(qt.SourceLocation(s1, e2));
        expect(qt.LocSpan(l1, null)).toEqual(qt.SourceLocation(s1, e1));
        expect(qt.LocSpan(l1)).toEqual(qt.SourceLocation(s1, e1));
        expect(qt.LocSpan(null, l2)).toEqual(qt.SourceLocation(s2, e2));
        expect(qt.LocSpan(null, null)).toEqual(undefined);
        expect(qt.LocSpan(null)).toEqual(undefined);
    });
    it("LocDefault creates", () => {
        const s1 = qt.Position(0,0,0);
        const e1 = qt.Position(0,1,1);
        const s2 = qt.Position(0,2,2);
        const e2 = qt.Position(0,3,3);
        const l1 = qt.SourceLocation(s1, e1);
        const l2 = qt.SourceLocation(s2, e2);
        expect(qt.LocDefault(l1, l2)).toEqual(l1);
        expect(qt.LocDefault(null, l1)).toEqual(qt.SourceLocation(s1, e1));
        expect(qt.LocDefault(null, l1, l2)).toEqual(qt.SourceLocation(s1, e2));
    });
    it("SourceLocation creates", () => {
        const n = qt.SourceLocation(start, end);
        expect(n).toHaveProperty("start");
        expect(n).toHaveProperty("end");
    });
    it("Position creates", () => {
        const n = qt.Position(0, 0, 0);
        expect(n).toHaveProperty("line");
        expect(n).toHaveProperty("column");
        expect(n).toHaveProperty("index");
    });
    it("Undefined creates", () => {
        const n = qt.Undefined();
        expect(n.type).toBe("Undefined");
    });
    it("Identifier creates", () => {
        const n = qt.Identifier("x");
        expect(n.type).toBe("Identifier");
    });
    it("IntegerLiteral creates", () => {
        const n = qt.IntegerLiteral(0);
        expect(n.type).toBe("IntegerLiteral");
    });
    it("FloatLiteral creates", () => {
        const n = qt.FloatLiteral(0);
        expect(n.type).toBe("FloatLiteral");
    });
    it("StringLiteral creates", () => {
        const n = qt.StringLiteral("x");
        expect(n.type).toBe("StringLiteral");
    });
    it("BooleanLiteral creates", () => {
        const n = qt.BooleanLiteral(true);
        expect(n.type).toBe("BooleanLiteral");
    });
    it("NullLiteral creates", () => {
        const n = qt.NullLiteral();
        expect(n.type).toBe("NullLiteral");
    });
    it("Program creates", () => {
        const n = qt.Program();
        expect(n.type).toBe("Program");
    });
    it("ExpressionStatement creates", () => {
        const n = qt.ExpressionStatement(null);
        expect(n.type).toBe("ExpressionStatement");
    });
    it("Directive creates", () => {
        const n = qt.Directive(literal);
        expect(n.type).toBe("ExpressionStatement");
        expect(n["directive"]).toBe(literal.value);

        const n2 = qt.Directive(null);
        expect(n2.type).toBe("ExpressionStatement");
        expect(n2["directive"]).toBeUndefined();
    });
    it("BlockStatement creates", () => {
        const n = qt.BlockStatement();
        expect(n.type).toBe("BlockStatement");
    });
    it("EmptyStatement creates", () => {
        const n = qt.EmptyStatement();
        expect(n.type).toBe("EmptyStatement");
    });
    it("ReturnStatement creates", () => {
        const n = qt.ReturnStatement();
        expect(n.type).toBe("ReturnStatement");
    });
    it("BreakStatement creates", () => {
        const n = qt.BreakStatement();
        expect(n.type).toBe("BreakStatement");
    });
    it("ContinueStatement creates", () => {
        const n = qt.ContinueStatement();
        expect(n.type).toBe("ContinueStatement");
    });
    it("YieldExpression creates", () => {
        const n = qt.YieldExpression();
        expect(n.type).toBe("YieldExpression");
    });
    it("IfStatement creates", () => {
        const n = qt.IfStatement(null, null);
        expect(n.type).toBe("IfStatement");
    });
    it("SwitchStatement creates", () => {
        const n = qt.SwitchStatement(null);
        expect(n.type).toBe("SwitchStatement");
    });
    it("SwitchCase creates", () => {
        const n = qt.SwitchCase();
        expect(n.type).toBe("SwitchCase");
    });
    it("ThrowStatement creates", () => {
        const n = qt.ThrowStatement(null);
        expect(n.type).toBe("ThrowStatement");
    });
    it("TryStatement creates", () => {
        const n = qt.TryStatement(null, null);
        expect(n.type).toBe("TryStatement");
    });
    it("CatchClause creates", () => {
        const n = qt.CatchClause(null, null);
        expect(n.type).toBe("CatchClause");
    });
    it("WhileStatement creates", () => {
        const n = qt.WhileStatement(null, null);
        expect(n.type).toBe("WhileStatement");
    });
    it("DoWhileStatement creates", () => {
        const n = qt.DoWhileStatement(null, null);
        expect(n.type).toBe("DoWhileStatement");
    });
    it("ForStatement creates", () => {
        const n = qt.ForStatement(null, null, null, null);
        expect(n.type).toBe("ForStatement");
    });
    it("ForInStatement creates", () => {
        const n = qt.ForInStatement(null, null, null, null);
        expect(n.type).toBe("ForInStatement");
    });
    it("FunctionDeclaration creates", () => {
        const n = qt.FunctionDeclaration(null, null, null);
        expect(n.type).toBe("FunctionDeclaration");
    });
    it("VariableDeclaration creates", () => {
        const n = qt.VariableDeclaration();
        expect(n.type).toBe("VariableDeclaration");
    });
    it("VariableDeclarator creates", () => {
        const n = qt.VariableDeclarator(null);
        expect(n.type).toBe("VariableDeclarator");
        expect(qt.VariableDeclarator(undefined).type).toBe("VariableDeclarator");
    });
    it("EnumDeclaration creates", () => {
        const n = qt.EnumDeclaration(null);
        expect(n.type).toBe("EnumDeclaration");
    });
    it("EnumMember creates", () => {
        const n = qt.EnumMember(null, null);
        expect(n.type).toBe("EnumMember");
        expect(qt.EnumMember(undefined, undefined).type).toBe("EnumMember");
    });
    it("ThisExpression creates", () => {
        const n = qt.ThisExpression();
        expect(n.type).toBe("ThisExpression");
    });
    it("Base creates", () => {
        const n = qt.Base();
        expect(n.type).toBe("Base");
    });
    it("Root creates", () => {
        const n = qt.Root();
        expect(n.type).toBe("Root");
    });
    it("ArrayExpression creates", () => {
        const n = qt.ArrayExpression();
        expect(n.type).toBe("ArrayExpression");
    });
    it("ObjectExpression creates", () => {
        const n = qt.ObjectExpression();
        expect(n.type).toBe("ObjectExpression");
    });
    it("Property creates", () => {
        const n = qt.Property("init", null, null);
        expect(n.type).toBe("Property");
    });
    it("FunctionExpression creates", () => {
        const n = qt.FunctionExpression(null, null);
        expect(n.type).toBe("FunctionExpression");
    });
    it("LambdaExpression creates", () => {
        const n = qt.LambdaExpression(null, null);
        expect(n.type).toBe("LambdaExpression");
    });
    it("UnaryExpression creates", () => {
        const n = qt.UnaryExpression("+", null);
        expect(n.type).toBe("UnaryExpression");
    });
    it("UpdateExpression creates", () => {
        const n = qt.UpdateExpression("++", null);
        expect(n.type).toBe("UpdateExpression");
    });
    it("BinaryExpression creates", () => {
        const n = qt.BinaryExpression("==", null, null);
        expect(n.type).toBe("BinaryExpression");
        expect(qt.BinaryExpression("==", null, null).type).toBe("BinaryExpression");
    });
    it("AssignmentExpression creates", () => {
        const n = qt.AssignmentExpression("=", null, null);
        expect(n.type).toBe("AssignmentExpression");
    });
    it("LogicalExpression creates", () => {
        const n = qt.LogicalExpression("&&", null, null);
        expect(n.type).toBe("LogicalExpression");
    });
    it("MemberExpression creates", () => {
        const n = qt.MemberExpression(null, null);
        expect(n.type).toBe("MemberExpression");
    });
    it("ConditionalExpression creates", () => {
        const n = qt.ConditionalExpression(null, null, null);
        expect(n.type).toBe("ConditionalExpression");
    });
    it("CallExpression creates", () => {
        const n = qt.CallExpression(null);
        expect(n.type).toBe("CallExpression");
    });
    it("SequenceExpression creates", () => {
        const n = qt.SequenceExpression();
        expect(n.type).toBe("SequenceExpression");
    });
    it("RestElement creates", () => {
        const n = qt.RestElement();
        expect(n.type).toBe("RestElement");
    });
    it("AssignmentPattern creates", () => {
        const n = qt.AssignmentPattern(null, null);
        expect(n.type).toBe("AssignmentPattern");
    });
    it("ClassBody creates", () => {
        const n = qt.ClassBody();
        expect(n.type).toBe("ClassBody");
    });
    it("PropertyDefinition creates", () => {
        const n = qt.PropertyDefinition(null);
        expect(n.type).toBe("PropertyDefinition");
    });
    it("MethodDefinition creates", () => {
        const n = qt.MethodDefinition("method", null, null);
        expect(n.type).toBe("MethodDefinition");
    });
    it("ClassDeclaration creates", () => {
        const n = qt.ClassDeclaration(null, null);
        expect(n.type).toBe("ClassDeclaration");
    });
    it("ClassExpression creates", () => {
        const n = qt.ClassExpression(null);
        expect(n.type).toBe("ClassExpression");
    });
    it("CommentLine creates", () => {
        const n = qt.CommentLine();
        expect(n.type).toBe("CommentLine");
    });
    it("CommentBlock creates", () => {
        const n = qt.CommentBlock();
        expect(n.type).toBe("CommentBlock");
    });
});
