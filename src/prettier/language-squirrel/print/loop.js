import {
  group,
  indent,
  softline,
  hardline,
  line,
} from "../../document/builders.js";
import { adjustClause } from "./misc.js";
import { printDanglingComments } from "../../main/comments/print.js";

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
  const space = options.spaceInParens ? " " : "";

  if (!node.init && !node.test && !node.update) {
    return [printedComments, group(["for ("+space+";;"+space+")", body])];
  }

  return [
    printedComments,
    group([
      "for (",
      space,
      group([
        indent([
          softline,
          print("init"),
          ";",
          line,
          print("test"),
          ";",
          line,
          print("update"),
        ]),
        space,
        softline,
      ]),
      ")",
      body,
    ]),
  ];
}

function printForInStatement(path, options, print) {
  const { node } = path;
  const space = options.spaceInParens ? " " : "";
  return group([
    "foreach (",
    space,
    node.index ? [print("index"), ", "] : "",
    print("left"),
    " in ",
    print("right"),
    space,
    ")",
    adjustClause(node.body, options, print("body")),
  ]);
}

function printWhileStatement(path, options, print) {
  const { node } = path;
  const space = options.spaceInParens ? " " : "";
  return group([
    "while (",
    space,
    group([indent([softline, print("test")]), space, softline]),
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
  const space = options.spaceInParens ? " " : "";

  if (node.body.type === "BlockStatement") {
    parts.push(" ");
  } else {
    parts.push(hardline);
  }
  parts.push(
    (options.braceStyle === "allman") ? hardline : '',
    "while (",
    space,
    group([indent([softline, print("test")]), space, softline]),
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
