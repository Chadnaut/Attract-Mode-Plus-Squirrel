import { describe, expect, it } from "@jest/globals";
import { SQTree as qt } from "../../src/ast";
import { addBranchId, getNodeName, hasNodeId } from "../../src/utils/identifier";
import { parseExtra as parse, pos } from "../utils";
import { getBranchEndingAtType, getBranchNodeByType, getBranchAtPos } from "../../src/utils/find";

describe("Identifier", () => {

    it("getNodeName, None", () => {
        const program = parse(`{}`);
        const b = getBranchAtPos(program, pos(1));
        expect(getNodeName([])).toBe("");
        expect(getNodeName(b)).toBe("");
    });

    // -------------------------------------------------------------------------

    it("Identifier", () => {
        const program = parse(`id`)
        const b = getBranchAtPos(program, pos(1));
        const id = getBranchEndingAtType(b, "Identifier");
        expect(addBranchId(id).at(-1)).toBe(id.at(-1));
    });

    it("VariableDeclarator", () => {
        const program = parse(`local id = "123"`);
        const b = getBranchAtPos(program, pos(7));
        const n = getBranchEndingAtType(b, "VariableDeclarator");
        const id = getBranchNodeByType(b, "Identifier");
        expect(addBranchId(n).at(-1)).toBe(id);
    });

    it("FunctionDeclaration", () => {
        const program = parse(`function foo() {}`);
        const b = getBranchAtPos(program, pos(10));
        const n = getBranchEndingAtType(b, "FunctionDeclaration");
        const id = getBranchNodeByType(b, "Identifier");
        expect(addBranchId(n).at(-1)).toBe(id);
    });

    it("FunctionDeclaration, invalid", () => {
        const program = parse(`function foo() {}`);
        const b = getBranchAtPos(program, pos(10));
        const n = getBranchEndingAtType(b, "FunctionDeclaration");
        delete program.body[0]["id"]; // sabotage
        expect(addBranchId(n).at(-1)).toBe(undefined);
    });

    it("FunctionExpression", () => {
        const program = parse("local foo = function() {}");
        const b = getBranchAtPos(program, pos(8));
        const id = getBranchNodeByType(b, "Identifier");
        const b2 = getBranchAtPos(program, pos(16));
        const n = getBranchEndingAtType(b2, "FunctionExpression");
        expect(addBranchId(n).at(-1)).toBe(id);
    });

    it("FunctionExpression, PropertyDefinition", () => {
        const program = parse("class foo { bar = function() {} }");
        const b = getBranchAtPos(program, pos(13));
        const id = getBranchNodeByType(b, "Identifier");
        const b2 = getBranchAtPos(program, pos(22));
        const n = getBranchEndingAtType(b2, "FunctionExpression");
        expect(addBranchId(n).at(-1)).toBe(id);
    });

    it("Property", () => {
        const program = parse(`local x = { prop = "123" }`);
        const b = getBranchAtPos(program, pos(14));
        const n = getBranchEndingAtType(b, "Property");
        const id = getBranchNodeByType(b, "Identifier");
        expect(addBranchId(n).at(-1)).toBe(id);
    });

    it("EnumDeclaration", () => {
        const program = parse(`enum myen {}`);
        const b = getBranchAtPos(program, pos(7));
        const n = getBranchEndingAtType(b, "EnumDeclaration");
        const id = getBranchNodeByType(b, "Identifier");
        expect(addBranchId(n).at(-1)).toBe(id);
    });

    it("EnumMember", () => {
        const program = parse(`enum myen { name }`);
        const b = getBranchAtPos(program, pos(14));
        const n = getBranchEndingAtType(b, "EnumMember");
        const id = getBranchNodeByType(b, "Identifier");
        expect(addBranchId(n).at(-1)).toBe(id);
    });

    it("ClassDeclaration", () => {
        const program = parse(`class foo {}`);
        const b = getBranchAtPos(program, pos(14));
        const n = getBranchEndingAtType(b, "ClassDeclaration");
        const id = getBranchNodeByType(b, "Identifier");
        expect(addBranchId(n).at(-1)).toBe(id);
    });

    it("ClassExpression", () => {
        const program = parse(`local foo = class {}`);
        const b = getBranchAtPos(program, pos(7));
        const id = getBranchNodeByType(b, "Identifier");
        const b2 = getBranchAtPos(program, pos(15));
        const n = getBranchEndingAtType(b2, "ClassExpression");
        expect(addBranchId(n).at(-1)).toBe(id);
    });

    it("ClassExpression, orphan", () => {
        const program = parse(`return class {}`);
        const b = getBranchAtPos(program, pos(9));
        const n = getBranchEndingAtType(b, "ClassExpression");
        expect(addBranchId(n).at(-1)).toBeUndefined();
    });

    it("PropertyDefinition", () => {
        const program = parse(`class foo { prop = 123; }`);
        const b = getBranchAtPos(program, pos(14));
        const n = getBranchEndingAtType(b, "PropertyDefinition");
        const id = getBranchNodeByType(b, "Identifier");
        expect(addBranchId(n).at(-1)).toBe(id);
    });

    it("MethodDefinition", () => {
        const program = parse(`class foo { function bar() {}; }`);
        const b = getBranchAtPos(program, pos(22));
        const n = getBranchEndingAtType(b, "MethodDefinition");
        const id = getBranchNodeByType(b, "Identifier");
        expect(addBranchId(n).at(-1)).toBe(id);
    });

    it("AssignmentExpression", () => {
        const program = parse(`foo <- 123`);
        const b = getBranchAtPos(program, pos(2));
        const n = getBranchEndingAtType(b, "AssignmentExpression");
        const id = getBranchNodeByType(b, "Identifier");
        expect(addBranchId(n).at(-1)).toBe(id);
    });

    // fit("AssignmentExpression, ignores newmember on memberexpression", () => {
    //     const program = parse(`::foo <- null`);
    //     const b = getBranchAtPos(program, pos(4));
    //     const n = getBranchNodeByType(b, "AssignmentExpression");
    //     const id = getBranchNodeByType(b, "Identifier");
    //     // expect(addBranchId(n).at(-1)).toBe(id);
    //     expect(addBranchId(n).at(-1)).toBeUndefined();
    //     // const n = qt.AssignmentExpression(
    //     //     "<-",
    //         // qt.MemberExpression(qt.Root(), id),
    //     //     qt.NullLiteral()
    //     // );
    //     // expect(addBranchId(n).at(-1)).toBeUndefined(); // (id);
    // });

    // it("AssignmentExpression, invalid", () => {
    //     const n = qt.AssignmentExpression("=", id, val);
    //     expect(addBranchId(n).at(-1)).not.toBe(id);
    // });

    it("None", () => {
        const program = parse("");
        expect(addBranchId([program])).toHaveLength(0);
    });

    it("AssignmentPattern", () => {
        const program = parse("function foo(param = 123) { }");
        const b = getBranchAtPos(program, pos(15));
        const n = getBranchEndingAtType(b, "AssignmentPattern");
        const id = getBranchNodeByType(b, "Identifier");
        expect(addBranchId(n).at(-1)).toBe(id);
    });

    it("hasNodeId", () => {
        expect(hasNodeId(qt.Identifier(null))).toBe(true);
        expect(hasNodeId(qt.VariableDeclarator(null))).toBe(true);
        expect(hasNodeId(qt.FunctionDeclaration(null, null, null))).toBe(true);
        expect(hasNodeId(qt.Property(null, null, null))).toBe(true);
        expect(hasNodeId(qt.EnumDeclaration(null))).toBe(true);
        expect(hasNodeId(qt.EnumMember(null, null))).toBe(true);
        expect(hasNodeId(qt.ClassDeclaration(null, null))).toBe(true);
        expect(hasNodeId(qt.PropertyDefinition(null))).toBe(true);
        expect(hasNodeId(qt.MethodDefinition(null, null,null))).toBe(true);

        const program = parse("x <- 123");
        const n = program.body[0]["expression"];
        expect(hasNodeId(n)).toBe(true);

        expect(hasNodeId(undefined)).toBe(false);
        expect(hasNodeId(qt.BlockStatement(null))).toBe(false);
    });
});
