import {
  group,
  indent,
  join,
  line,
} from "../../document/builders.js";

/**
 * @typedef {import("../types/estree.js").Node} Node
 */

function printSequence(path, options, print) {
  const { parent } = path;
  if (
    parent.type === "ExpressionStatement" ||
    parent.type === "ForStatement"
  ) {
    // For ExpressionStatements and for-loop heads, which are among
    // the few places a SequenceExpression appears unparenthesized, we want
    // to indent expressions after the first.
    const parts = [];
    path.each(({ isFirst }) => {
      if (isFirst) {
        parts.push(print());
      } else {
        parts.push(",", indent([line, print()]));
      }
    }, "expressions");
    return group(parts);
  }
  return group(join([",", line], path.map(print, "expressions")));
}

export {
  printSequence,
};
