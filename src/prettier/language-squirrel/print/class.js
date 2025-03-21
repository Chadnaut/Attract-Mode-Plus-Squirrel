import {
  group,
  hardline,
  ifBreak,
  indent,
  join,
  line,
  softline,
} from "../../document/builders.js";
import {
  printComments,
  printDanglingComments,
} from "../../main/comments/print.js";
import createGroupIdMapper from "../../utils/create-group-id-mapper.js";
import isNonEmptyArray from "../../utils/is-non-empty-array.js";
import {
  CommentCheckFlags,
  createTypeCheckFunction,
  hasComment,
  isNextLineEmpty,
} from "../utils/index.js";
import { printAssignment } from "./assignment.js";
import { printMethod } from "./function.js";
import {
  printTypeScriptAccessibilityToken,
} from "./misc.js";
import { printPropertyKey } from "./property.js";

/**
 * @typedef {import("../../document/builders.js").Doc} Doc
 */

const isClassProperty = createTypeCheckFunction([
  "ClassProperty",
  "PropertyDefinition",
  "ClassPrivateProperty",
  "ClassAccessorProperty",
  "AccessorProperty",
  "TSAbstractPropertyDefinition",
  "TSAbstractAccessorProperty",
]);

/*
- `ClassDeclaration`
- `ClassExpression`
- `DeclareClass`(flow)
*/
function printClass(path, options, print) {
  const { node } = path;
  /** @type {Doc[]} */
  const parts = ["class"];

  // Keep old behaviour of extends in same line
  // If there is only on extends and there are not comments
  const groupMode =
    hasComment(node.id, CommentCheckFlags.Trailing) ||
    hasComment(node.typeParameters, CommentCheckFlags.Trailing) ||
    hasComment(node.superClass) ||
    isNonEmptyArray(node.extends) || // DeclareClass
    isNonEmptyArray(node.mixins) ||
    isNonEmptyArray(node.implements);

  const partsGroup = [];
  const extendsParts = [];

  if (node.id) {
    partsGroup.push(" ", print("id"));
  }

  partsGroup.push(print("typeParameters"));

  if (node.superClass) {
    const printed = [
      printSuperClass(path, options, print),
      print(
        // TODO: Use `superTypeArguments` only when babel align with TS.
        node.superTypeArguments ? "superTypeArguments" : "superTypeParameters",
      ),
    ];
    const printedWithComments = path.call(
      (superClass) => ["extends ", printComments(superClass, printed, options)],
      "superClass",
    );
    if (groupMode) {
      extendsParts.push(line, group(printedWithComments));
    } else {
      extendsParts.push(" ", printedWithComments);
    }
  } else {
    extendsParts.push(printHeritageClauses(path, options, print, "extends"));
  }

  const attrId = Symbol("attr");
  if (node.attributes) {
    // extendsParts.push(" ", print("attributes"));
    extendsParts.push(group([line, print("attributes"), softline], { id: attrId }));
    // groupMode = false;
  } else {
    extendsParts.push(group([], { id: attrId }));
  }

  if (groupMode) {
    let printedPartsGroup;
    if (shouldIndentOnlyHeritageClauses(node)) {
      printedPartsGroup = [...partsGroup, indent(extendsParts)];
    } else {
      printedPartsGroup = indent([...partsGroup, extendsParts]);
    }
    parts.push(group(printedPartsGroup, { id: getHeritageGroupId(node) }));
  } else {
    parts.push(...partsGroup, ...extendsParts);
  }

  parts.push(ifBreak("", (options.braceStyle === "allman") ? hardline : " ", { groupId: attrId }), print("body"));

  return parts;
}

const getHeritageGroupId = createGroupIdMapper("heritageGroup");

function printHardlineAfterHeritage(node) {
  return ifBreak(hardline, "", { groupId: getHeritageGroupId(node) });
}

function hasMultipleHeritage(node) {
  return (
    ["extends"].reduce(
      (count, key) => count + (Array.isArray(node[key]) ? node[key].length : 0),
      node.superClass ? 1 : 0,
    ) > 1
  );
}

function shouldIndentOnlyHeritageClauses(node) {
  return (
    node.typeParameters &&
    !hasComment(
      node.typeParameters,
      CommentCheckFlags.Trailing | CommentCheckFlags.Line,
    ) &&
    !hasMultipleHeritage(node)
  );
}

function printHeritageClauses(path, options, print, listName) {
  const { node } = path;
  if (!isNonEmptyArray(node[listName])) {
    return "";
  }

  const printedLeadingComments = printDanglingComments(path, options, {
    marker: listName,
  });
  return [
    shouldIndentOnlyHeritageClauses(node)
      ? ifBreak(" ", line, {
          groupId: Symbol("")
        })
      : line,
    printedLeadingComments,
    printedLeadingComments && hardline,
    listName,
    group(indent([line, join([",", line], path.map(print, listName))])),
  ];
}

function printSuperClass(path, options, print) {
  const printed = print("superClass");
  const { parent } = path;
  if (parent.type === "AssignmentExpression") {
    return group(
      ifBreak(["(", indent([softline, printed]), softline, ")"], printed),
    );
  }
  return printed;
}

function printClassMethod(path, options, print) {
  const { node } = path;
  const parts = [];

  parts.push(printTypeScriptAccessibilityToken(node));

  if (node.static) {
    parts.push("static ");
  }

  if (node.override) {
    parts.push("override ");
  }

  if (node.attributes) {
      parts.push(print("attributes"), hardline);
  }

  if (node.kind !== "constructor") {
      parts.push("function ");
  }

  parts.push(printMethod(path, options, print));

  return parts;
}

/*
- `ClassProperty`
- `PropertyDefinition`
- `ClassPrivateProperty`
- `ClassAccessorProperty`
- `AccessorProperty`
- `TSAbstractAccessorProperty` (TypeScript)
- `TSAbstractPropertyDefinition` (TypeScript)
*/
function printClassProperty(path, options, print) {
  const { node } = path;
  const parts = [];
  const semi = options.semi ? ";" : "";

  parts.push(printTypeScriptAccessibilityToken(node));

  if (node.static) {
    parts.push("static ");
  }

  if (node.override) {
    parts.push("override ");
  }
  if (node.readonly) {
    parts.push("readonly ");
  }
  if (node.variance) {
    parts.push(print("variance"));
  }
  if (
    node.type === "ClassAccessorProperty" ||
    node.type === "AccessorProperty" ||
    node.type === "TSAbstractAccessorProperty"
  ) {
    parts.push("accessor ");
  }

  if (node.attributes) {
      parts.push(print("attributes"), options.attrSameLine ? " " : hardline);
  }

  parts.push(
    printPropertyKey(path, options, print),
  );

  return (node.attributes && options.attrSameLine)
    ? [group([parts, " = ", print("value")]), semi]
    : [printAssignment(path, options, print, parts, " =", "value"), semi];
}

function printClassBody(path, options, print) {
  const { node } = path;
  const parts = [];

  path.each(({ node, next, isLast }) => {
    parts.push(print());

    if (
      !options.semi &&
      isClassProperty(node) &&
      shouldPrintSemicolonAfterClassProperty(node, next)
    ) {
      parts.push(";");
    }

    if (!isLast) {
      parts.push(hardline);

      if (isNextLineEmpty(node, options)) {
        parts.push(hardline);
      }
    }
  }, "body");

  if (hasComment(node, CommentCheckFlags.Dangling)) {
    parts.push(printDanglingComments(path, options));
  }

  return [
    isNonEmptyArray(node.body) ? printHardlineAfterHeritage(path.parent) : "",
    "{",
    parts.length > 0 ? [indent([hardline, parts]), hardline] : ((options.braceStyle === "allman") ? hardline : ""),
    "}",
  ];
}

/**
 * @returns {boolean}
 */
function shouldPrintSemicolonAfterClassProperty(node, nextNode) {
  const { type, name } = node.key;
  if (
    !node.computed &&
    type === "Identifier" &&
    (name === "static" || name === "get" || name === "set") &&
    !node.value &&
    !node.typeAnnotation
  ) {
    return true;
  }

  if (!nextNode) {
    return false;
  }

  if (
    nextNode.static ||
    nextNode.accessibility || // TypeScript
    nextNode.readonly // TypeScript
  ) {
    return false;
  }

  if (!nextNode.computed) {
    const name = nextNode.key?.name;
    if (name === "in" || name === "instanceof") {
      return true;
    }
  }

  // Flow variance sigil +/- requires semi if there's no
  // "declare" or "static" keyword before it.
  if (
    isClassProperty(nextNode) &&
    nextNode.variance &&
    !nextNode.static &&
    !nextNode.declare
  ) {
    return true;
  }

  switch (nextNode.type) {
    case "ClassProperty":
    case "PropertyDefinition":
    case "TSAbstractPropertyDefinition":
      return nextNode.computed;
    case "MethodDefinition":
    case "TSAbstractMethodDefinition":
    case "ClassMethod":
    case "ClassPrivateMethod": {
      // Babel
      const isAsync = nextNode.value ? nextNode.value.async : nextNode.async;
      if (isAsync || nextNode.kind === "get" || nextNode.kind === "set") {
        return false;
      }

      const isGenerator = nextNode.value
        ? nextNode.value.generator
        : nextNode.generator;
      if (nextNode.computed || isGenerator) {
        return true;
      }

      return false;
    }

    case "TSIndexSignature":
      return true;
  }

  /* c8 ignore next */
  return false;
}

export {
  printClass,
  printClassBody,
  printClassMethod,
  printClassProperty,
  printHardlineAfterHeritage,
};
