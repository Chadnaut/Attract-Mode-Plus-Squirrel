import { indent, line } from "../../document/builders.js";
import { inheritLabel } from "../../document/utils.js";
import printIgnored from "../../main/print-ignored.js";
import pathNeedsParens from "../needs-parens.js";
import { createTypeCheckFunction } from "../utils/index.js";
import isIgnored from "../utils/is-ignored.js";
import { shouldPrintLeadingSemicolon } from "./semicolon.js";
import { printSquirrel } from "./squirrel.js";
import { startSpace, endSpace } from "../utils/get-space.js";

/**
 * @typedef {import("../../common/ast-path.js").default} AstPath
 * @typedef {import("../../document/builders.js").Doc} Doc
 */

function printWithoutParentheses(path, options, print, args) {
  if (isIgnored(path)) {
    return printIgnored(path, options);
  }

  return printSquirrel(path, options, print, args);
}

// Their decorators are handled themselves, and they don't need parentheses or leading semicolons
const shouldPrintDirectly = createTypeCheckFunction([
  "ClassMethod",
  "ClassPrivateMethod",
  "ClassProperty",
  "ClassAccessorProperty",
  "AccessorProperty",
  "TSAbstractAccessorProperty",
  "PropertyDefinition",
  "TSAbstractPropertyDefinition",
  "ClassPrivateProperty",
  "MethodDefinition",
  "TSAbstractMethodDefinition",
  "TSDeclareMethod",
]);

/**
 * @param {AstPath} path
 * @param {*} options
 * @param {*} print
 * @param {*} [args]
 * @returns {Doc}
 */
function print(path, options, print, args) {
  if (path.isRoot) {
    options.__onHtmlBindingRoot?.(path.node, options);
  }

  const doc = printWithoutParentheses(path, options, print, args);
  if (!doc) {
    return "";
  }

  const { node } = path;
  if (shouldPrintDirectly(node)) {
    return doc;
  }

  const isClassExpression = node.type === "ClassExpression";

  const needsParens = pathNeedsParens(path, options);
  const needsSemi = shouldPrintLeadingSemicolon(path, options);

  if (!needsParens && !needsSemi) {
    return doc;
  }

  return inheritLabel(doc, (doc) => [
    needsSemi ? ";" : "",
    needsParens ? ["(", startSpace(doc, options)] : "",
    needsParens && isClassExpression
      ? [indent([line, doc]), line]
      : [doc],
    needsParens ? [endSpace(doc, options), ")"] : "",
  ]);
}

export default print;
