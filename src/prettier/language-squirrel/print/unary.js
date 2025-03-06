import {
  group,
  indent,
  softline,
} from "../../document/builders.js";
import { hasComment } from "../utils/index.js";
import { startSpace, endSpace } from "../utils/get-space.js";

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
    const bodyDoc = print("argument");
    parts.push(
      group(["(", startSpace(bodyDoc, options), indent([softline, bodyDoc]), softline, endSpace(bodyDoc, options), ")"]),
    );
  } else {
    parts.push(print("argument"));
  }

  return parts;
}

export {
  printUnary,
};
