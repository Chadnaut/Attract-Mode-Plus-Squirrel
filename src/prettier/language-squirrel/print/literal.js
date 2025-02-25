import { printComments } from "../../main/comments/print.js";
import { printDanglingComments } from "../../main/comments/print.js";

/**
 * @typedef {import("../types/estree.js").Node} Node
 */

function printLiteral(path, options /*, print*/) {
  const { node } = path;
  return node.raw;
}

function printThisExpression(path, options, print) {
  return "this";
}

function printBase(path, options, print) {
  return "base";
}

function printRoot(path, options, print) {
  return "";
}

function printIdentifier(path, options, print) {
  const { node } = path;
  const comments = printDanglingComments(path, options);
  if (node.extra?.root) return ["::", comments, node.name];
  return [comments, node.name];
}

function printDirective(path, options, print) {
  return [print("value"), semi];
}

export {
  printLiteral,
  printIdentifier,
  printThisExpression,
  printBase,
  printRoot,
  printDirective,
};
