import UnexpectedNodeError from "../../utils/unexpected-node-error.js";
import { isLiteral, isMethod } from "../utils/index.js";
import { printArray } from "./array.js";
import { printLambdaFunction } from "./lambda.js";
import { printAssignmentExpression, printAssignmentPattern, printUpdateExpression, printVariableDeclarator } from "./assignment.js";
import { printBinaryishExpression } from "./binaryish.js";
import { printBlock } from "./block.js";
import { printCallExpression } from "./call-expression.js";
import { printClass, printClassBody, printClassMethod, printClassProperty } from "./class.js";
import { printExpressionStatement } from "./expression-statement.js";
import { printFunction, printMethod, printReturnStatement, printThrowStatement } from "./function.js";
import { printLiteral, printIdentifier, printThisExpression, printBase, printRoot, printDirective } from "./literal.js";
import { printMemberExpression } from "./member.js";
import { printRestSpread } from "./misc.js";
import { printObject } from "./object.js";
import { printProperty } from "./property.js";
import { printTernary } from "./ternary.js";
import { printYield } from "./yield.js";
import { printSequence } from "./sequence.js";
import { printUnary } from "./unary.js";
import { printIfStatement } from "./choice.js";
import { printForStatement, printForInStatement, printWhileStatement, printDoWhileStatement } from "./loop.js";
import { printBreakContinue, printSwitchStatement, printSwitchCase } from "./switch.js";
import { printTryStatement, printCatchClause } from "./try.js";
import { printEnumDeclaration, printEnumMember } from "./enum.js";
import { printVariableDeclaration } from "./variable-declaration.js";

/**
 * @typedef {import("../../common/ast-path.js").default} AstPath
 * @typedef {import("../../document/builders.js").Doc} Doc
 */

/**
 * @param {AstPath} path
 * @param {*} options
 * @param {*} print
 * @param {*} [args]
 * @returns {Doc}
 */
function printSquirrel(path, options, print, args) {
  const { node } = path;

  if (isLiteral(node)) {
    return printLiteral(path, options);
  }

  switch (node.type) {
    case "EmptyStatement":
      return "";
    case "ExpressionStatement":
      return printExpressionStatement(path, options, print);
    case "ChainExpression":
      return print("expression");
    case "AssignmentExpression":
      return printAssignmentExpression(path, options, print);
    case "VariableDeclarator":
      return printVariableDeclarator(path, options, print);
    case "VariableDeclaration":
      return printVariableDeclaration(path, options, print);
    case "BinaryExpression":
    case "LogicalExpression":
      return printBinaryishExpression(path, options, print);
    case "AssignmentPattern":
      return printAssignmentPattern(path, options, print);
    case "MemberExpression":
      return printMemberExpression(path, options, print);
    case "Identifier":
      return printIdentifier(path, options, print);
    case "RestElement":
      return printRestSpread(path, print);
    case "FunctionDeclaration":
    case "FunctionExpression":
      return printFunction(path, print, options, args);
    case "LambdaExpression":
      return printLambdaFunction(path, options, print, args);
    case "YieldExpression":
      return printYield(path, options, print, args);
    case "Program":
    case "BlockStatement":
      return printBlock(path, options, print);
    case "ClassBody":
      return printClassBody(path, options, print);
    case "ThrowStatement":
      return printThrowStatement(path, options, print);
    case "ReturnStatement":
      return printReturnStatement(path, options, print);
    case "CallExpression":
      return printCallExpression(path, options, print);
    case "ObjectExpression":
      return printObject(path, options, print);
    case "Property":
      return isMethod(node) ? printMethod(path, options, print) : printProperty(path, options, print);
    case "ArrayExpression":
      return printArray(path, options, print);
    case "SequenceExpression":
      return printSequence(path, options, print);
    case "ThisExpression":
      return printThisExpression(path, options, print);
    case "Base":
      return printBase(path, options, print);
    case "Root":
      return printRoot(path, options, print);
    case "Directive":
      return printDirective(path, options, print);
    case "UnaryExpression":
      return printUnary(path, options, print);
    case "UpdateExpression":
      return printUpdateExpression(path, options, print);
    case "ConditionalExpression":
      return printTernary(path, options, print, args);
    case "IfStatement":
      return printIfStatement(path, options, print);
    case "ForStatement":
      return printForStatement(path, options, print);
    case "WhileStatement":
      return printWhileStatement(path, options, print);
    case "ForInStatement":
      return printForInStatement(path, options, print);
    case "DoWhileStatement":
      return printDoWhileStatement(path, options, print);
    case "BreakStatement":
    case "ContinueStatement":
      return printBreakContinue(path, options, print);
    case "TryStatement":
      return printTryStatement(path, options, print);
    case "CatchClause":
      return printCatchClause(path, options, print);
    case "SwitchStatement":
      return printSwitchStatement(path, options, print);
    case "SwitchCase":
      return printSwitchCase(path, options, print);
    case "ClassDeclaration":
    case "ClassExpression":
      return printClass(path, options, print);
    case "MethodDefinition":
      return printClassMethod(path, options, print);
    case "PropertyDefinition":
      return printClassProperty(path, options, print);
    case "EnumDeclaration":
        return printEnumDeclaration(path, options, print);
    case "EnumMember":
        return printEnumMember(path, options, print);
    default:
      throw new UnexpectedNodeError(node, "Squirel");
  }
}

export { printSquirrel };
