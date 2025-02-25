import { printObject } from "./object.js";
import { hardline } from "../../document/builders.js";

function printEnumMembers(path, options, print) {
  const members = printObject(path, options, print);
  if ((options.braceStyle === "allman") && Array.isArray(members)) return ["{", hardline, "}"];
  return members;
}

/*
- `EnumBooleanMember`(flow)
- `EnumNumberMember`(flow)
- `EnumBigIntMember`(flow)
- `EnumStringMember`(flow)
- `EnumDefaultedMember`(flow)
- `TSEnumMember`(TypeScript)
*/
function printEnumMember(path, options, print) {
  const { node } = path;

  let idDoc = print("id");

  if (node.computed) {
    idDoc = ["[", idDoc, "]"];
  }

  let initializerDoc = "";

  // `TSEnumMember`
  if (node.initializer) {
    initializerDoc = print("initializer");
  }

  // Flow
  if (node.init) {
    initializerDoc = print("init");
  }

  if (!initializerDoc) {
    return idDoc;
  }

  return [idDoc, " = ", initializerDoc];
}

/*
- `DeclareEnum`(flow)
- `EnumDeclaration`(flow)
- `EnumDeclaration`(TypeScript)
*/
function printEnumDeclaration(path, options, print) {
  const { node } = path;
  return [
    node.const ? "const " : "",
    "enum ",
    print("id"),
    (options.braceStyle === "allman") ? hardline : " ",
    node.type === "EnumDeclaration"
      ? printEnumMembers(path, options, print)
      : print("body"),
  ];
}

export { printEnumDeclaration, printEnumMember };
