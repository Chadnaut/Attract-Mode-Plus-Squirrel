/**
 * @typedef {import("../types/estree.js").Node} Node
 */

function printYield(path, options, print) {
  const { node } = path;
  const semi = options.semi ? ";" : "";
  const parts = [];
  parts.push("yield");
  if (node.argument) {
    parts.push(" ", print("argument"));
  }
  parts.push(semi);
  return parts;
}

export {
  printYield,
};
