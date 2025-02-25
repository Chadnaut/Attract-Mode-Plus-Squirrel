import { indent, line, hardline } from "../../document/builders.js";

/**
 * @typedef {import("../../common/ast-path.js").default} AstPath
 * @typedef {import("../../document/builders.js").Doc} Doc
 */

function printBindExpressionCallee(path, options, print) {
  return ["::", print("callee")];
}

function adjustClause(node, options, clause, forceSpace) {
  if (node.type === "EmptyStatement") {
    return ";";
  }

  if (node.type === "BlockStatement" || forceSpace) {
      return [((options.braceStyle === "allman") && !forceSpace) ? hardline : " ", clause];
  }

  return indent([line, clause]);
}

function printRestSpread(path, print) {
  return ["...", print("argument")];
}

function printTypeScriptAccessibilityToken(node) {
  return node.accessibility ? node.accessibility + " " : "";
}

export {
  adjustClause,
  printBindExpressionCallee,
  printRestSpread,
  printTypeScriptAccessibilityToken,
};
