import { describe, expect, it } from "@jest/globals";
import { parseExtra as parse, dump, lineLoc, pos } from "../utils";
import { SymbolKind } from "vscode";
import { getNodeSymbols, getAncestorSymbols, getNodeExtendedSymbols, getNodeSymbol } from "../../src/utils/symbol";
import { AST, SQTree as qt } from "../../src/ast";
import { getBranchAtPos } from "../../src/utils/find";
import { createNodeMaps } from "../../src/utils/map";
import { addBranchId } from "../../src/utils/identifier";

describe("Symbol", () => {
    it("getNodeSymbols, enum member", () => {
        const node = parse(`enum myEnum { b };`);
        const symbols = getNodeSymbols([node]);
        expect(symbols).toHaveLength(1);
        expect(symbols[0].kind).toBe(SymbolKind.Enum);
        expect(symbols[0].children[0].kind).toBe(SymbolKind.EnumMember);
    });

    it("getNodeSymbols, var func", () => {
        const node = parse(`local c = function(){};`);
        const symbols = getNodeSymbols([node]);
        expect(symbols).toHaveLength(1);
        expect(symbols[0].kind).toBe(SymbolKind.Variable);
    });

    it("getNodeSymbols, func", () => {
        const node = parse(`function d(){};`);
        const symbols = getNodeSymbols([node]);
        expect(symbols).toHaveLength(1);
        expect(symbols[0].kind).toBe(SymbolKind.Function);
    });

    it("getNodeSymbols, var", () => {
        const node = parse(`local e = 1;`);
        const symbols = getNodeSymbols([node]);
        expect(symbols).toHaveLength(1);
        expect(symbols[0].kind).toBe(SymbolKind.Variable);
    });

    it("getNodeSymbols, const", () => {
        const node = parse(`const f = 2;`);
        const symbols = getNodeSymbols([node]);
        expect(symbols).toHaveLength(1);
        expect(symbols[0].kind).toBe(SymbolKind.Constant);
    });

    it("getNodeSymbols, class", () => {
        const node = parse(`
            class myClass {
                h = 1;
                constructor() {};
                function i() {}
            }
        `);

        const symbols = getNodeSymbols([node]);
        expect(symbols).toHaveLength(1);
        expect(symbols[0].kind).toBe(SymbolKind.Class);
        expect(symbols[0].children[0].kind).toBe(SymbolKind.Property);
        expect(symbols[0].children[1].kind).toBe(SymbolKind.Constructor);
        expect(symbols[0].children[2].kind).toBe(SymbolKind.Method);
    });

    it("getNodeSymbols, class namespace", () => {
        const node = parse(`
            class foo {}
            function foo::bar() {}
        `);

        const symbols = getNodeSymbols([node]);
        expect(symbols).toHaveLength(1);
        expect(symbols[0].kind).toBe(SymbolKind.Class);

        // NOTE: foo::bar still a function since added late
        expect(symbols[0].children[0].kind).toBe(SymbolKind.Function);
    });

    it("getNodeSymbols, invalid", () => {
        expect(getNodeSymbols([])).toHaveLength(0);
        const n = <AST.Node>{};
        expect(getNodeSymbols([n])).toHaveLength(0);
    });

    it("getNodeSymbols, root", () => {
        const node = parse("::root <- 123; bare <- 456;");
        const symbols = getNodeSymbols([node]);
        expect(symbols).toHaveLength(2);
        expect(symbols[0].name).toBe("::root");
        expect(symbols[1].name).toBe("bare");
    });

    it("getNodeSymbols, flattens", () => {
        const node = parse(`
            function myFunc() {
                local a = 1;
                {
                    local b = 2;
                    {
                        local c = 3;
                    }
                }
            }
        `);

        const symbols = getNodeSymbols([node]);
        expect(symbols.length).toEqual(1);
        expect(symbols[0].kind).toEqual(SymbolKind.Function);
        expect(symbols[0].children[0].kind).toBe(SymbolKind.Variable);
        expect(symbols[0].children[1].kind).toBe(SymbolKind.Variable);
        expect(symbols[0].children[2].kind).toBe(SymbolKind.Variable);
    });

    it("getNodeSymbols, class", () => {
        const node = parse(
            `class myClass { h = 1; constructor() {}; function i() {} }`,
        );
        const symbols = getNodeSymbols([node.body[0]]);
        expect(symbols.length).toEqual(3);
        expect(symbols[0].kind).toEqual(SymbolKind.Property);
        expect(symbols[1].kind).toEqual(SymbolKind.Constructor);
        expect(symbols[2].kind).toEqual(SymbolKind.Method);
    });

    // -------------------------------------------------------------------------

    it("getNodeExtendedSymbols, undefined", () => {
        expect(getNodeExtendedSymbols([])).toEqual([]);

        const program = parse("local a = b; local b = a;");
        const n = getBranchAtPos(program, pos(20));
        expect(getNodeExtendedSymbols(n)).toEqual([]);
    });

    it("getNodeExtendedSymbols, enum", () => {
        const program = parse("enum myen { x = 123 } /** @returns {myen} */ function foo() {}; foo()");
        const m = getBranchAtPos(program, pos(65)).slice(0, -1);
        expect(getNodeExtendedSymbols(m)).toEqual([]);
    });

    // -------------------------------------------------------------------------

    it("getAncestorSymbols", () => {
        const program = parse("local aaa = 1; local bbb = 2; local ccc = 3;");
        const n = getBranchAtPos(program, pos(7));
        const symbols = getAncestorSymbols(n);
        // dump(symbols);
        expect(symbols).toHaveLength(2);
        expect(symbols[0].name).toBe("bbb");
        expect(symbols[1].name).toBe("ccc");
    });

    it("getAncestorSymbols, broken", () => {
        const program = parse("{}; local bbb = 2;");
        const n = getBranchAtPos(program, pos(1));
        n.at(-1).type = "Property"; // bad node
        const symbols = getAncestorSymbols(n);

        // dump(symbols);
        expect(symbols).toHaveLength(1);
        expect(symbols[0].name).toBe("bbb");
    });


    it("getAncestorSymbols, nested", () => {
        const program = parse("local aaa = { bbb = function() { local ccc = 1 } };");
        const n = getBranchAtPos(program, pos(40));
        const symbols = getAncestorSymbols(n);
        // dump(symbols);
        expect(symbols).toHaveLength(2);
        expect(symbols[0].name).toBe("bbb");
        expect(symbols[1].name).toBe("aaa");
    });

    it("updateNodeSymbol", () => {
        const updateSymbolClass = (n: AST.Node): SymbolKind | undefined => {
            createNodeMaps(n);
            return getNodeSymbol(addBranchId([n]))?.kind;
        }

        const idLoc = lineLoc(1, 2);
        const loc = lineLoc(0, 3);
        const id = qt.Identifier("name", idLoc);

        expect(updateSymbolClass(undefined)).toBeUndefined();

        expect(updateSymbolClass(qt.ClassDeclaration(null, null))).toBeUndefined();
        expect(updateSymbolClass(qt.ClassDeclaration(id, null, null, null, loc))).toBe(SymbolKind.Class);
        expect(updateSymbolClass(qt.MethodDefinition("method", id, null, null, null, loc))).toBe(SymbolKind.Method);
        expect(updateSymbolClass(qt.MethodDefinition("constructor", id, null, null, null, loc))).toBe(SymbolKind.Constructor);
        expect(updateSymbolClass(qt.PropertyDefinition(id, null, null, null, null, loc))).toBe(SymbolKind.Property);
        expect(updateSymbolClass(qt.Property("init", id, null, null, null, loc))).toBe(SymbolKind.Property);
        expect(updateSymbolClass(qt.VariableDeclarator(id, null, loc))).toBe(SymbolKind.Variable);

        expect(updateSymbolClass(qt.EnumDeclaration(id, null, loc))).toBe(SymbolKind.Enum);
        expect(updateSymbolClass(qt.EnumMember(id, null, loc))).toBe(SymbolKind.EnumMember);
        expect(updateSymbolClass(qt.FunctionDeclaration(id, null, null, null, loc))).toBe(SymbolKind.Function);

        expect(updateSymbolClass(qt.AssignmentExpression("=", id, null, loc))).toBeUndefined();
        expect(updateSymbolClass(qt.AssignmentExpression("<-", id, null, loc))).toBe(SymbolKind.Field); // yes, id only
        expect(updateSymbolClass(qt.AssignmentExpression("<-", qt.MemberExpression(qt.Root(), id), null, loc))).toBeUndefined(); // (SymbolKind.Field); // no, not MEXP
    });

    it("updateNodeSymbol, Local", () => {
        const idLoc = lineLoc(1, 2);
        const loc = lineLoc(0, 3);
        const id = qt.Identifier("name", idLoc);
        const dr = qt.VariableDeclarator(id, null, loc);
        const dc = qt.VariableDeclaration("local", [dr]);
        createNodeMaps(dc);
        expect(getNodeSymbol([id])?.kind).toBe(SymbolKind.Variable);
    });

    it("updateNodeSymbol, Constant", () => {
        const idLoc = lineLoc(1, 2);
        const loc = lineLoc(0, 3);
        const id = qt.Identifier("name", idLoc);
        const dr = qt.VariableDeclarator(id, null, loc);
        const dc = qt.VariableDeclaration("const", [dr]);
        createNodeMaps(dc);
        expect(getNodeSymbol([id])?.kind).toBe(SymbolKind.Constant);
    });

});
