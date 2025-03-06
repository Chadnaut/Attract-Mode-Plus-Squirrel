import {
  group,
  indent,
  softline,
  hardline,
  join,
} from "../../document/builders.js";
import { printDanglingComments } from "../../main/comments/print.js";
import { printStatementSequence } from "./statement.js";
import {
    CommentCheckFlags,
    hasComment,
    isNextLineEmpty,
  } from "../utils/index.js";
import { startSpace, endSpace } from "../utils/get-space.js";

/**
 * @typedef {import("../types/estree.js").Node} Node
 */

function printBreakContinue(path, options, print) {
  const { node } = path;
  const semi = options.semi ? ";" : "";
  const parts = [];
  parts.push(node.type === "BreakStatement" ? "break" : "continue");

  if (node.label) {
    parts.push(" ", print("label"));
  }

  parts.push(semi);

  return parts;
}

function printSwitchStatement(path, options, print) {
  const { node } = path;
  const bodyDoc = print("discriminant");
  return [
    group([
      "switch (",
      startSpace(bodyDoc, options),
      indent([softline, bodyDoc]),
      endSpace(bodyDoc, options),
      softline,
      ")",
    ]),
    (options.braceStyle === "allman") ? hardline : " ",
    "{",
    node.cases.length > 0
      ? indent([
          hardline,
          join(
            hardline,
            path.map(
              ({ node, isLast }) => [
                print(),
                !isLast && isNextLineEmpty(node, options) ? hardline : "",
              ],
              "cases",
            ),
          ),
        ])
      : "",
    hardline,
    "}",
  ];
}

function printSwitchCase(path, options, print) {
  const { node } = path;
  const parts = [];

  if (node.test) {
    parts.push("case ", print("test"), ":");
  } else {
    parts.push("default:");
  }

  if (hasComment(node, CommentCheckFlags.Dangling)) {
    parts.push(" ", printDanglingComments(path, options));
  }

  const consequent = node.consequent.filter(
    (node) => node.type !== "EmptyStatement",
  );

  if (consequent.length > 0) {
    const cons = printStatementSequence(path, options, print, "consequent");

    parts.push(
      consequent.length === 1 && consequent[0].type === "BlockStatement"
        ? [" ", cons]
        : indent([hardline, cons]),
    );
  }

  return parts;
}

export {
  printBreakContinue,
  printSwitchStatement,
  printSwitchCase,
};
