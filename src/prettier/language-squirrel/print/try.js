import {
  indent,
  softline,
  hardline,
} from "../../document/builders.js";
import isBlockComment from "../utils/is-block-comment.js";
import hasNewline from "../../utils/has-newline.js";
import { locEnd, locStart } from "../loc.js";
import { hasComment } from "../utils/index.js";

/**
 * @typedef {import("../types/estree.js").Node} Node
 */

function printTryStatement(path, options, print) {
  const { node } = path;
  const semi = options.semi ? ";" : "";
  const blockEmpty = node.block.type === "EmptyStatement";
  return [
    "try",
    blockEmpty ? [semi, hardline] : ((options.braceStyle === "allman") ? hardline : " "),
    print("block"),
    node.handler ? [(options.braceStyle !== "1tbs") || blockEmpty ? "" : " ", print("handler")] : "",
  ];
}

function printCatchClause(path, options, print) {
  const { node } = path;
  const semi = options.semi ? ";" : "";
  if (node.param) {
    const parameterHasComments = hasComment(
      node.param,
      (comment) =>
        !isBlockComment(comment) ||
        (comment.leading &&
          hasNewline(options.originalText, locEnd(comment))) ||
        (comment.trailing &&
          hasNewline(options.originalText, locStart(comment), {
            backwards: true,
          })),
    );
    const param = print("param");
    const space = options.spaceInParens ? " " : "";

    return [
      (options.braceStyle !== "1tbs") ? hardline : "",
      "catch ",
      parameterHasComments
        ? ["(", space, indent([softline, param]), space, softline, ")"]
        : ["(", space, param, space, ")"],
      (options.braceStyle === "allman") ? hardline : (node.body.type === "EmptyStatement" ? semi : " "),
      print("body"),
    ];
  }

  return ["catch ", print("body")];
}

export {
  printTryStatement,
  printCatchClause,
};
