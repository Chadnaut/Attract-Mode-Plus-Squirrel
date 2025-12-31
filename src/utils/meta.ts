import { SymbolKind } from "vscode";
import { AST, SQTree as qt } from "../ast";
import { DocAttr, DocBlock } from "../doc/kind";
import { getBranchClassDef, getBranchId, isNodeClass } from "./find";
import { getNodeName } from "./identifier";
import { SquirrelType, SquirrelMetaType } from "./kind";
import { getNodeSignature, updateNodeSignature } from "./signature";
import { updateNodeSymbol } from "./symbol";
import { isClassDef } from "./super";
import { getNodeDef, getNodeVal, setNodeDec } from "./definition";
import { getNodeChildren, setNodeNamespace } from "./map";
import { stringToNode } from "./create";
import { createDocMarkdown } from "../doc/markdown";
import { setNodeDeprecated } from "./deprecated";
import { setNodeDocBlock } from "../doc/find";

export const META_KINDS = ["property", "getter", "setter"];

// -----------------------------------------------------------------------------

const nodeMetaMap = new WeakMap<AST.Node, SquirrelMetaType>();

export const setNodeMeta = (node: AST.Node, meta: SquirrelMetaType) =>
    nodeMetaMap.set(node, meta);

export const hasNodeMeta = (node: AST.Node): boolean =>
    nodeMetaMap.has(node);

export const getNodeMeta = (node: AST.Node): SquirrelMetaType =>
    nodeMetaMap.has(node) ? nodeMetaMap.get(node) : undefined;

// -----------------------------------------------------------------------------

const nodeComputedMap = new WeakMap<AST.Node, string>();

export const setNodeComputed = (node: AST.Node, raw: string) =>
    nodeComputedMap.set(node, raw);

export const hasNodeComputed = (node: AST.Node): boolean =>
    nodeComputedMap.has(node);

export const getNodeComputed = (node: AST.Node): string =>
    nodeComputedMap.has(node) ? nodeComputedMap.get(node) : undefined;

/**
 * "Compute" simple node values
 * - strings become identifiers, making for simple definition finding
 * - member["string"] --> member.string
 */
export const computeNode = (node: AST.Node, parent: AST.Node) => {
    if ("computed" in parent && node?.type === "StringLiteral") {
        const { value, raw } = <AST.StringLiteral>node;
        node.type = "Identifier";
        node["name"] = value;
        parent["computed"] = false;
        setNodeComputed(node, raw);
    }
};

// -----------------------------------------------------------------------------

/** Return meta type name for node */
const getMetaType = (attributes: DocAttr[], branch: AST.Node[]): SquirrelMetaType | undefined => {
    // meta node may be property of class
    if (isClassDef(branch)) {
        for (const attr of attributes) {
            if (attr.kind === "getter") return SquirrelType.READONLY;
            if (attr.kind === "setter") return SquirrelType.WRITEONLY;
        }
        return SquirrelType.PROPERTY;
    }
    // otherwise may be property of meta-method
    const name = getBranchId(branch).name;
    if (name === "_get") return SquirrelType.READONLY;
    if (name === "_set") return SquirrelType.WRITEONLY;
    // all other placements are ignored
    return;
};

/** Find meta node in class */
export const getMetaNode = (
    branch: AST.Node[],
    name: string,
): AST.Node[] | undefined =>
    getNodeChildren(branch).find((child) => {
        const id = getBranchId(child);
        return hasNodeMeta(id) && id.name === name;
    });

/** Attach (or update) meta nodes for the passed attributes */
export const attachMeta = (branch: AST.Node[], metaAttributes: DocAttr[][]) => {
    let classNode = getNodeVal(getBranchClassDef(branch));
    if (!classNode.length) return;

    const nodeDef = getNodeDef(branch);

    metaAttributes?.forEach((attributes, index) => {
        const propAttribute = attributes[0];
        const { name } = propAttribute;
        const type = getMetaType(attributes, nodeDef);
        if (!type) return;

        // If meta exists it likely means both a setter and getter have been separately documented
        // - In this case, change the metaNode type to a `property`, which does both
        // - Note that meta documentation does not get overwritten by new doc
        const metaProp = getMetaNode(classNode, name);
        if (metaProp) {
            if (getNodeMeta(getBranchId(metaProp)) !== type) {
                setNodeMeta(getBranchId(metaProp), SquirrelType.PROPERTY);
                updateNodeSignature(metaProp); // rebuild signature for property
            }
            return;
        }

        createMetaNode(attributes, type, classNode);
    });
};

/**
 * Create and attach a "meta" node for getter/setter completions
 */
export const createMetaNode = (
    attributes: DocAttr[],
    metaType: SquirrelMetaType,
    branch: AST.Node[]
): AST.PropertyDefinition | undefined => {
    const propAttribute = attributes?.[0] ?? {};
    const { kind, type, name, documentation } = propAttribute;
    if (!META_KINDS.includes(kind)) return;
    if (!type) return;
    if (!name) return;

    const loc = attributes[0].loc;
    const key = qt.Identifier(name, loc);
    const value = stringToNode(type, loc);
    const prop = qt.PropertyDefinition(key, value, false, false, null, loc);

    const doc = <DocBlock>{
        attributes: [],
        markdown: createDocMarkdown([
            { kind: "description", documentation },
            ...attributes.slice(1)
        ]),
    };

    const classNode = <AST.Class>branch.at(-1);
    const classBody = classNode.body;
    const propBranch = [...branch, classBody, prop];
    const keyBranch = [...branch, classBody, prop, key];

    setNodeNamespace(propBranch, classNode);
    setNodeDec(key, propBranch);

    setNodeMeta(key, metaType);
    setNodeDocBlock(key, doc);

    updateNodeSymbol(keyBranch, SymbolKind.Property);
    getNodeSignature(propBranch);

    for (const attr of attributes) {
        switch (attr.kind) {
            case "deprecated":
                setNodeDeprecated(keyBranch);
                break;
        }
    }

    return prop;
};

// -----------------------------------------------------------------------------

/** Return class branch with meta "_call" node, or empty if none */
export const getBranchMetaCall = (branch: AST.Node[]): AST.Node[] => {
    // Prevent substituting the class itself
    const nodeDef = getNodeDef(branch);
    if (isNodeClass(nodeDef.at(-1))) return [];

    const nodeVal = getNodeVal(nodeDef);
    const node = nodeVal.at(-1);
    if (isNodeClass(node)) {
        const body = (<AST.Class>node).body.body;
        const call = body.find(
            (node) =>
                node.type === "MethodDefinition" &&
                getNodeName([...body, node]) === "_call",
        );
        if (call) return [...nodeVal, call];
    }
    return [];
};
