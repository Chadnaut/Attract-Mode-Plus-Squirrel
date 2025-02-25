import {
  group,
  indent,
  softline,
} from "../../document/builders.js";
import { hasComment } from "../utils/index.js";

/**
 * @typedef {import("../types/estree.js").Node} Node
 */

function printUnary(path, options, print) {
  const { node } = path;
  const parts = [];
  parts.push(node.operator);

  if (/[a-z]$/u.test(node.operator)) {
    parts.push(" ");
  }

  if (hasComment(node.argument)) {
    parts.push(
      group(["(", indent([softline, print("argument")]), softline, ")"]),
    );
  } else {
    parts.push(print("argument"));
  }

  return parts;
}

export {
  printUnary,
};
