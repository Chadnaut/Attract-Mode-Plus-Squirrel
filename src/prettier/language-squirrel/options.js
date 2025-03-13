import commonOptions from "../common/common-options.evaluate.js";

const CATEGORY_SQUIRREL = "Squirrel";

// format based on https://github.com/prettier/prettier/blob/main/src/main/core-options.evaluate.js
const options = {
  arrowParens: {
    category: CATEGORY_SQUIRREL,
    type: "choice",
    default: "always",
    description: "Include parentheses around a sole arrow function parameter.",
    choices: [
      {
        value: "always",
        description: "Always include parens. Example: `(x) => x`",
      },
    //   {
    //     value: "avoid",
    //     description: "Omit parens when possible. Example: `x => x`",
    //   },
    ],
  },
  bracketSameLine: commonOptions.bracketSameLine,
  bracketSpacing: commonOptions.bracketSpacing,
  objectCurlySpacing: {
    category: CATEGORY_SQUIRREL,
    type: "boolean",
    default: true,
    description: "Spaces between curly braces.",
    oppositeDescription: "No spaces between curly braces.",
  },
  braceStyle: {
    category: CATEGORY_SQUIRREL,
    type: "choice",
    default: "1tbs",
    description: "Controls the placement of braces relative to their statements.",
    choices: [
      {
        value: "1tbs",
        description: "Opening brace on the same line as its statement.",
      },
      {
        value: "stroustrup",
        description: "Place `else` statements on a new line.",
      },
      {
        value: "allman",
        description: "All braces on new lines.",
      },
    ],
  },

  condenseParens: {
    category: CATEGORY_SQUIRREL,
    type: "boolean",
    default: false,
    description: "Condense spaces between parentheses.",
    oppositeDescription: "Do not condense spaces between parentheses.",
  },
  reduceParens: {
    category: CATEGORY_SQUIRREL,
    type: "boolean",
    default: true,
    description: "Remove unnecessary parentheses.",
    oppositeDescription: "Do not remove unnecessary parentheses.",
  },
  attrSingleLine: {
    category: CATEGORY_SQUIRREL,
    type: "boolean",
    default: false,
    description: "Attributes never wrap.",
    oppositeDescription: "Attributes wrap.",
  },
  attrSameLine: {
    category: CATEGORY_SQUIRREL,
    type: "boolean",
    default: false,
    description: "Attributes on same line as property.",
    oppositeDescription: "Attributes on separate line to property.",
  },
  spaceInParens: {
    category: CATEGORY_SQUIRREL,
    type: "boolean",
    default: false,
    description: "Print spaces between parentheses.",
    oppositeDescription: "Do not print spaces between parentheses.",
  },
  arrayBracketSpacing: {
    category: CATEGORY_SQUIRREL,
    type: "boolean",
    default: false,
    description: "Spaces between array brackets.",
    oppositeDescription: "No spaces between array brackets.",
  },
  computedPropertySpacing: {
    category: CATEGORY_SQUIRREL,
    type: "boolean",
    default: false,
    description: "Spaces between computed property brackets.",
    oppositeDescription: "No spaces between computed property brackets.",
  },
  attrSpacing: {
    category: CATEGORY_SQUIRREL,
    type: "boolean",
    default: false,
    description: "Print spaces around attribute operators.",
    oppositeDescription: "Do not print spaces around attribute operators.",
  },
//   jsxBracketSameLine: {
//     category: CATEGORY_SQUIRREL,
//     type: "boolean",
//     description: "Put > on the last line instead of at a new line.",
//     deprecated: "2.4.0",
//   },
  semi: {
    category: CATEGORY_SQUIRREL,
    type: "boolean",
    default: true,
    description: "Print semicolons.",
    oppositeDescription:
      "Do not print semicolons, except at the beginning of lines which may need them.",
  },
  experimentalTernaries: {
    category: CATEGORY_SQUIRREL,
    type: "boolean",
    default: false,
    description:
      "Use curious ternaries, with the question mark after the condition.",
    oppositeDescription:
      "Default behavior of ternaries; keep question marks on the same line as the consequent.",
  },
  singleQuote: commonOptions.singleQuote,
//   jsxSingleQuote: {
//     category: CATEGORY_SQUIRREL,
//     type: "boolean",
//     default: false,
//     description: "Use single quotes in JSX.",
//   },
  quoteProps: {
    category: CATEGORY_SQUIRREL,
    type: "choice",
    default: "as-needed",
    description: "Change when properties in objects are quoted.",
    choices: [
      {
        value: "as-needed",
        description: "Only add quotes around object properties where required.",
      },
      {
        value: "consistent",
        description:
          "If at least one property in an object requires quotes, quote all properties.",
      },
      {
        value: "preserve",
        description: "Respect the input use of quotes in object properties.",
      },
    ],
  },
  trailingComma: {
    category: CATEGORY_SQUIRREL,
    type: "choice",
    default: "none", // "all",
    description: "Print trailing commas wherever possible when multi-line.",
    choices: [
    //   {
    //     value: "all",
    //     description:
    //       "Trailing commas wherever possible (including function arguments).",
    //   },
      {
        value: "es5",
        description:
          "Trailing commas where valid in ES5 (objects, arrays, etc.)",
      },
      { value: "none", description: "No trailing commas." },
    ],
  },
  singleAttributePerLine: commonOptions.singleAttributePerLine,
};

export default options;
