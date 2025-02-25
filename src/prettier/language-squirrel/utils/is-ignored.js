import { hasNodeIgnoreComment } from "./index.js";

function isIgnored(path) {
  return hasNodeIgnoreComment(path.node);
}

export default isIgnored;
