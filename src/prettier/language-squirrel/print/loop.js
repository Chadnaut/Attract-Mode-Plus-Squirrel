import {
  group,
  indent,
  softline,
  hardline,
  line,
} from "../../document/builders.js";
import { adjustClause } from "./misc.js";
import { printDanglingComments } from "../../main/comments/print.js";
import { startSpace, endSpace } from "../utils/get-space.js";

/**
 * @typedef {import("../types/estree.js").Node} Node
 */

function printForStatement(path, options, print) {
  const { node } = path;
  const body = adjustClause(node.body, options, print("body"));

  // We want to keep dangling comments above the loop to stay consistent.
  // Any comment positioned between the for statement and the parentheses
  // is going to be printed before the statement.
  const dangling = printDanglingComments(path, options);
  const printedComments = dangling ? [dangling, softline] : "";

  if (!node.init && !node.test && !node.update) {
    return [printedComments, group(["for (;;)", body])];
  }

  const bodyDoc = [
    print("init"),
    ";",
    line,
    print("test"),
    ";",
    line,
    print("update")
  ];
  return [
    printedComments,
    group([
      "for (",
      startSpace(bodyDoc, options),
      group([
        indent([
          softline,
          bodyDoc,
        ]),
        endSpace(bodyDoc, options),
        softline,
      ]),
      ")",
      body,
    ]),
  ];
}

function printForInStatement(path, options, print) {
  const { node } = path;
  const bodyDoc = [
    node.index ? [print("index"), ", "] : "",
    print("left"),
    " in ",
    print("right"),
  ];
  return group([
    "foreach (",
    startSpace(bodyDoc, options),
    bodyDoc,
    endSpace(bodyDoc, options),
    ")",
    adjustClause(node.body, options, print("body")),
  ]);
}

function printWhileStatement(path, options, print) {
  const { node } = path;
  const bodyDoc = print("test")
  return group([
    "while (",
    startSpace(bodyDoc, options),
    group([indent([softline, bodyDoc]), endSpace(bodyDoc, options), softline]),
    ")",
    adjustClause(node.body, options, print("body")),
  ]);
}

function printDoWhileStatement(path, options, print) {
  const { node } = path;
  const semi = options.semi ? ";" : "";
  const clause = adjustClause(node.body, options, print("body"));
  const doBody = group(["do", clause]);
  const parts = [doBody];

  if (node.body.type === "BlockStatement") {
    parts.push(" ");
  } else {
    parts.push(hardline);
  }
  const bodyDoc = print("test");
  parts.push(
    (options.braceStyle === "allman") ? hardline : '',
    "while (",
    startSpace(bodyDoc, options),
    group([indent([softline, bodyDoc]), endSpace(bodyDoc, options), softline]),
    ")",
    semi,
  );

  return parts;
}

export {
  printForStatement,
  printForInStatement,
  printWhileStatement,
  printDoWhileStatement,
};
