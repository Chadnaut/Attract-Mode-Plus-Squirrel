import { getNodeTypeCallable, isNodeLiteral, nodeToSquirrelType, squirrelToNodeType, SquirrelType, symbolToSquirrelType } from './../../src/utils/kind';
import { describe, expect, it } from "@jest/globals";
import { AST, SQTree as qt } from "../../src/ast";
import { CompletionItemKind, SymbolKind } from 'vscode';
import { symbolToCompletionKind } from '../../src/utils/kind';
import { createNodeMaps } from '../../src/utils/map';
import { parseExtra as parse, pos } from '../utils';
import { getBranchAtPos } from '../../src/utils/find';
import { setNodeToken } from '../../src/utils/token';

describe("Kind", () => {

    it("isNodeLiteral ", () => {
        expect(isNodeLiteral(undefined)).toBe(false);
        expect(isNodeLiteral(qt.Identifier("name"))).toBe(false);
        expect(isNodeLiteral(qt.IntegerLiteral(1))).toBe(true);
        expect(isNodeLiteral(qt.FloatLiteral(1.1))).toBe(true);
        expect(isNodeLiteral(qt.StringLiteral(""))).toBe(true);
        expect(isNodeLiteral(qt.BooleanLiteral(true))).toBe(true);
        expect(isNodeLiteral(qt.NullLiteral())).toBe(true);
    });

    it("getNodeTypeCallable ", () => {
        expect(getNodeTypeCallable([])).toBeUndefined();
        expect(getNodeTypeCallable([qt.Identifier("name")])).toBeUndefined();

        let n, v;
        n = qt.FunctionDeclaration(null, [], null);
        expect(getNodeTypeCallable([n])).toBe(n);
        n = qt.FunctionExpression([], null);
        expect(getNodeTypeCallable([n])).toBe(n);
        n = qt.MethodDefinition("method", null, null);
        expect(getNodeTypeCallable([n])).toBe(n);
        n = qt.LambdaExpression(null, null);
        expect(getNodeTypeCallable([n])).toBe(n);
        n = qt.ClassDeclaration(null, null);
        expect(getNodeTypeCallable([n])).toBe(n);
        n = qt.ClassExpression(null);
        expect(getNodeTypeCallable([n])).toBe(n);

        v = qt.VariableDeclarator(null, null);
        expect(getNodeTypeCallable([v])).toBeUndefined();

        n = qt.FunctionExpression([], null);
        v = qt.VariableDeclarator(null, n);
        expect(getNodeTypeCallable([v])).toBe(n);

        n = qt.LambdaExpression([], null);
        v = qt.VariableDeclarator(null, n);
        expect(getNodeTypeCallable([v])).toBe(n);
    });

    it("symbolToCompletionKind", () => {
        expect(symbolToCompletionKind(SymbolKind.File)).toBe(CompletionItemKind.File);
        expect(symbolToCompletionKind(SymbolKind.Module)).toBe(CompletionItemKind.Module);
        expect(symbolToCompletionKind(SymbolKind.Class)).toBe(CompletionItemKind.Class);
        expect(symbolToCompletionKind(SymbolKind.Method)).toBe(CompletionItemKind.Method);
        expect(symbolToCompletionKind(SymbolKind.Property)).toBe(CompletionItemKind.Property);
        expect(symbolToCompletionKind(SymbolKind.Field)).toBe(CompletionItemKind.Field);
        expect(symbolToCompletionKind(SymbolKind.Constructor)).toBe(CompletionItemKind.Constructor);
        expect(symbolToCompletionKind(SymbolKind.Enum)).toBe(CompletionItemKind.Enum);
        expect(symbolToCompletionKind(SymbolKind.Interface)).toBe(CompletionItemKind.Interface);
        expect(symbolToCompletionKind(SymbolKind.Function)).toBe(CompletionItemKind.Function);
        expect(symbolToCompletionKind(SymbolKind.Variable)).toBe(CompletionItemKind.Variable);
        expect(symbolToCompletionKind(SymbolKind.Constant)).toBe(CompletionItemKind.Constant);
        expect(symbolToCompletionKind(SymbolKind.EnumMember)).toBe(CompletionItemKind.EnumMember);
        expect(symbolToCompletionKind(SymbolKind.Struct)).toBe(CompletionItemKind.Struct);
        expect(symbolToCompletionKind(SymbolKind.Event)).toBe(CompletionItemKind.Event);
        expect(symbolToCompletionKind(SymbolKind.Operator)).toBe(CompletionItemKind.Operator);
        expect(symbolToCompletionKind(SymbolKind.TypeParameter)).toBe(CompletionItemKind.TypeParameter);
        expect(symbolToCompletionKind(SymbolKind.Package)).toBeUndefined();
    });

    it("symbolToSquirrelType", () => {
        expect(symbolToSquirrelType(SymbolKind.Class)).toBe(SquirrelType.CLASS);
        expect(symbolToSquirrelType(SymbolKind.Constructor)).toBe(SquirrelType.CONSTRUCTOR);
        expect(symbolToSquirrelType(SymbolKind.Method)).toBe(SquirrelType.METHOD);
        expect(symbolToSquirrelType(SymbolKind.Property)).toBe(SquirrelType.PROPERTY);
        expect(symbolToSquirrelType(SymbolKind.Constant)).toBe(SquirrelType.CONSTANT);
        expect(symbolToSquirrelType(SymbolKind.Field)).toBe(SquirrelType.GLOBAL);
        expect(symbolToSquirrelType(SymbolKind.Variable)).toBe(SquirrelType.VARIABLE);
        expect(symbolToSquirrelType(SymbolKind.Enum)).toBe(SquirrelType.ENUM);
        expect(symbolToSquirrelType(SymbolKind.EnumMember)).toBe(SquirrelType.ENUMMEMBER);
        expect(symbolToSquirrelType(SymbolKind.Function)).toBe(SquirrelType.FUNCTION);
        expect(symbolToSquirrelType(SymbolKind.Interface)).toBeUndefined();
    });

    it("nodeToSquirrelType, simple", () => {
        expect(nodeToSquirrelType([])).toBe(SquirrelType.NULL);

        expect(nodeToSquirrelType([<AST.Node>{ type: "IntegerLiteral" }])).toBe(SquirrelType.INTEGER);
        expect(nodeToSquirrelType([<AST.Node>{ type: "FloatLiteral" }])).toBe(SquirrelType.FLOAT);
        expect(nodeToSquirrelType([<AST.Node>{ type: "StringLiteral" }])).toBe(SquirrelType.STRING);
        expect(nodeToSquirrelType([<AST.Node>{ type: "BooleanLiteral" }])).toBe(SquirrelType.BOOLEAN);
        expect(nodeToSquirrelType([<AST.Node>{ type: "NullLiteral" }])).toBe(SquirrelType.NULL);
        expect(nodeToSquirrelType([<AST.Node>{ type: "ObjectExpression" }])).toBe(SquirrelType.TABLE);
        expect(nodeToSquirrelType([<AST.Node>{ type: "ArrayExpression" }])).toBe(SquirrelType.ARRAY);

        expect(nodeToSquirrelType([<AST.Node>{ type: "ClassDeclaration" }])).toBe(SquirrelType.CLASS);
        expect(nodeToSquirrelType([<AST.Node>{ type: "ClassExpression" }])).toBe(SquirrelType.CLASS);
        expect(nodeToSquirrelType([<AST.Node>{ type: "ThisExpression" }])).toBe(SquirrelType.CLASS);
        expect(nodeToSquirrelType([<AST.Node>{ type: "Base" }])).toBe(SquirrelType.CLASS);

        expect(nodeToSquirrelType([<AST.Node>{ type: "FunctionDeclaration" }])).toBe(SquirrelType.FUNCTION);
        expect(nodeToSquirrelType([<AST.Node>{ type: "FunctionExpression" }])).toBe(SquirrelType.FUNCTION);
        expect(nodeToSquirrelType([<AST.Node>{ type: "LambdaExpression" }])).toBe(SquirrelType.FUNCTION);

        expect(nodeToSquirrelType([<AST.Node>{ type: "EnumDeclaration" }])).toBe(SquirrelType.ENUM);
        expect(nodeToSquirrelType([<AST.Node>{ type: "EnumMember" }])).toBe(SquirrelType.ENUMMEMBER);

        expect(nodeToSquirrelType([<AST.Node>{ type: "Property" }])).toBe(SquirrelType.PROPERTY);
        expect(nodeToSquirrelType([<AST.Node>{ type: "PropertyDefinition" }])).toBe(SquirrelType.PROPERTY);

        expect(nodeToSquirrelType([<AST.Node>{ type: "Undefined" }])).toBe(SquirrelType.ANY);
        expect(nodeToSquirrelType([<AST.Node>{ type: "Program" }])).toBe(SquirrelType.ANY);
        expect(nodeToSquirrelType([<AST.Node>{ type: "ExpressionStatement" }])).toBe(SquirrelType.ANY);
        expect(nodeToSquirrelType([<AST.Node>{ type: "BlockStatement" }])).toBe(SquirrelType.ANY);
        expect(nodeToSquirrelType([<AST.Node>{ type: "EmptyStatement" }])).toBe(SquirrelType.ANY);
        expect(nodeToSquirrelType([<AST.Node>{ type: "ReturnStatement" }])).toBe(SquirrelType.ANY);
        expect(nodeToSquirrelType([<AST.Node>{ type: "BreakStatement" }])).toBe(SquirrelType.ANY);
        expect(nodeToSquirrelType([<AST.Node>{ type: "ContinueStatement" }])).toBe(SquirrelType.ANY);
        expect(nodeToSquirrelType([<AST.Node>{ type: "YieldExpression" }])).toBe(SquirrelType.ANY);
        expect(nodeToSquirrelType([<AST.Node>{ type: "IfStatement" }])).toBe(SquirrelType.ANY);
        expect(nodeToSquirrelType([<AST.Node>{ type: "SwitchStatement" }])).toBe(SquirrelType.ANY);
        expect(nodeToSquirrelType([<AST.Node>{ type: "SwitchCase" }])).toBe(SquirrelType.ANY);
        expect(nodeToSquirrelType([<AST.Node>{ type: "ThrowStatement" }])).toBe(SquirrelType.ANY);
        expect(nodeToSquirrelType([<AST.Node>{ type: "TryStatement" }])).toBe(SquirrelType.ANY);
        expect(nodeToSquirrelType([<AST.Node>{ type: "CatchClause" }])).toBe(SquirrelType.ANY);
        expect(nodeToSquirrelType([<AST.Node>{ type: "WhileStatement" }])).toBe(SquirrelType.ANY);
        expect(nodeToSquirrelType([<AST.Node>{ type: "DoWhileStatement" }])).toBe(SquirrelType.ANY);
        expect(nodeToSquirrelType([<AST.Node>{ type: "ForStatement" }])).toBe(SquirrelType.ANY);
        expect(nodeToSquirrelType([<AST.Node>{ type: "ForInStatement" }])).toBe(SquirrelType.ANY);
        expect(nodeToSquirrelType([<AST.Node>{ type: "Root" }])).toBe(SquirrelType.ANY);
        expect(nodeToSquirrelType([<AST.Node>{ type: "UnaryExpression" }])).toBe(SquirrelType.ANY);
        expect(nodeToSquirrelType([<AST.Node>{ type: "UpdateExpression" }])).toBe(SquirrelType.ANY);
        expect(nodeToSquirrelType([<AST.Node>{ type: "BinaryExpression" }])).toBe(SquirrelType.ANY);
        expect(nodeToSquirrelType([<AST.Node>{ type: "LogicalExpression" }])).toBe(SquirrelType.ANY);
        expect(nodeToSquirrelType([<AST.Node>{ type: "MemberExpression" }])).toBe(SquirrelType.ANY);
        expect(nodeToSquirrelType([<AST.Node>{ type: "ConditionalExpression" }])).toBe(SquirrelType.ANY);
        expect(nodeToSquirrelType([<AST.Node>{ type: "CallExpression" }])).toBe(SquirrelType.ANY);
        expect(nodeToSquirrelType([<AST.Node>{ type: "SequenceExpression" }])).toBe(SquirrelType.ANY);
        expect(nodeToSquirrelType([<AST.Node>{ type: "RestElement" }])).toBe(SquirrelType.ANY);
        expect(nodeToSquirrelType([<AST.Node>{ type: "AssignmentPattern" }])).toBe(SquirrelType.PARAMETER);
        expect(nodeToSquirrelType([<AST.Node>{ type: "ClassBody" }])).toBe(SquirrelType.ANY);
        expect(nodeToSquirrelType([<AST.Node>{ type: "CommentLine" }])).toBe(SquirrelType.ANY);
        expect(nodeToSquirrelType([<AST.Node>{ type: "CommentBlock" }])).toBe(SquirrelType.ANY);

        expect(nodeToSquirrelType([{ type: "Custom" } as unknown as AST.Node])).toBe("Custom");
    });

    it("nodeToSquirrelType, complex", () => {

        const program = parse("class foo {}");
        const n = getBranchAtPos(program, pos(8));
        expect(nodeToSquirrelType(n)).toBe(SquirrelType.CLASS);

        const param = qt.Identifier("id");
        setNodeToken(param, "parameter");
        expect(nodeToSquirrelType([param])).toBe(SquirrelType.PARAMETER);
        // expect(nodeToSquirrelType(createNodeMaps(param))).toBe(SquirrelType.PARAMETER);

        expect(nodeToSquirrelType([createNodeMaps(qt.MethodDefinition("method", qt.Identifier("id"), qt.FunctionExpression([], qt.BlockStatement())))])).toBe(SquirrelType.METHOD);
        expect(nodeToSquirrelType([createNodeMaps(qt.MethodDefinition("constructor", null, qt.FunctionExpression([], qt.BlockStatement())))])).toBe(SquirrelType.CONSTRUCTOR);

        expect(nodeToSquirrelType([createNodeMaps(qt.VariableDeclaration("local", [qt.VariableDeclarator(qt.Identifier("id"))]))])).toBe(SquirrelType.VARIABLE);
        expect(nodeToSquirrelType([createNodeMaps(qt.VariableDeclaration("const", [qt.VariableDeclarator(qt.Identifier("id"))]))])).toBe(SquirrelType.CONSTANT);

        expect(nodeToSquirrelType([createNodeMaps(qt.AssignmentExpression(null, null, null))])).toBe(SquirrelType.ANY);
        expect(nodeToSquirrelType([createNodeMaps(qt.AssignmentExpression("<-", qt.MemberExpression(qt.Root(), qt.Identifier("name")), null))])).toBe(SquirrelType.ANY); // left side must be id to be global
        expect(nodeToSquirrelType([createNodeMaps(qt.AssignmentExpression("<-", qt.Identifier("name"), null))])).toBe(SquirrelType.GLOBAL);
    });

    it("squirrelToNodeType", () => {
        expect(squirrelToNodeType(undefined)).toBeUndefined();
        expect(squirrelToNodeType(SquirrelType.INTEGER)).toBe("IntegerLiteral");
        expect(squirrelToNodeType(SquirrelType.FLOAT)).toBe("FloatLiteral");
        expect(squirrelToNodeType(SquirrelType.STRING)).toBe("StringLiteral");
        expect(squirrelToNodeType(SquirrelType.BOOLEAN)).toBe("BooleanLiteral");
        expect(squirrelToNodeType(SquirrelType.NULL)).toBe("NullLiteral");
        expect(squirrelToNodeType(SquirrelType.TABLE)).toBe("ObjectExpression");
        expect(squirrelToNodeType(SquirrelType.ARRAY)).toBe("ArrayExpression");
        expect(squirrelToNodeType(SquirrelType.FUNCTION)).toBe("FunctionExpression");
        expect(squirrelToNodeType(SquirrelType.CLASS)).toBe("ClassDeclaration");
        expect(squirrelToNodeType(SquirrelType.ENUM)).toBe("EnumDeclaration");
        expect(squirrelToNodeType(SquirrelType.ENUMMEMBER)).toBe("EnumMember");
        expect(squirrelToNodeType(SquirrelType.METHOD)).toBe("MethodDefinition");
        expect(squirrelToNodeType(SquirrelType.CONSTRUCTOR)).toBe("MethodDefinition");
        expect(squirrelToNodeType(SquirrelType.PROPERTY)).toBe("PropertyDefinition");
        expect(squirrelToNodeType(SquirrelType.VARIABLE)).toBe("VariableDeclaration");
        expect(squirrelToNodeType(SquirrelType.CONSTANT)).toBe("VariableDeclaration");
    });


});
