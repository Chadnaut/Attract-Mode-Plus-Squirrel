import {
  group,
  indent,
  softline,
  hardline,
} from "../../document/builders.js";
import { adjustClause } from "./misc.js";
import { printDanglingComments } from "../../main/comments/print.js";
import {
  CommentCheckFlags,
  hasComment,
  needsHardlineAfterDanglingComment,
} from "../utils/index.js";
/**
 * @typedef {import("../types/estree.js").Node} Node
 */

function printIfStatement(path, options, print) {
  const { node } = path;
  const parts = [];
  const consequent = adjustClause(node.consequent, options, print("consequent"));
  const space = options.spaceInParens ? " " : "";
  const opening = group([
    "if (",
    space,
    group([indent([softline, print("test")]), space, softline]),
    ")",
    consequent,
  ]);

  parts.push(opening);

  if (node.alternate) {
    const commentOnOwnLine =
      hasComment(
        node.consequent,
        CommentCheckFlags.Trailing | CommentCheckFlags.Line,
      ) || needsHardlineAfterDanglingComment(node);
    const elseOnSameLine =
      node.consequent.type === "BlockStatement" && !commentOnOwnLine;
    parts.push(elseOnSameLine ? " " : hardline);

    if (hasComment(node, CommentCheckFlags.Dangling)) {
      parts.push(
        printDanglingComments(path, options),
        commentOnOwnLine ? hardline : " ",
      );
    }

    parts.push(
      ((options.braceStyle !== "1tbs") && elseOnSameLine) ? hardline : "",
      "else",
      group(
        adjustClause(
          node.alternate,
          options,
          print("alternate"),
          node.alternate.type === "IfStatement",
        ),
      ),
    );
  }

  return parts;
}

export {
    printIfStatement,
};
