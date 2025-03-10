import { describe, expect, it } from "@jest/globals";
import { parseExtra as parse, pos } from "../utils";
import { getNodeAugmentSymbols } from "../../src/utils/symbol";
import { getBranchAtPos } from "../../src/utils/find";
import { getHoverInfo } from "../../src/utils/hover";
import { getNodeVal } from "../../src/utils/definition";

describe("Augments", () => {

    it("ReturnArgument, augments", () => {
        const program = parse(`class foo { /** MyBar */ function bar() { return 1; } } class moo { /** @augments a */ constructor(a) {} } moo(foo()).bar()`);
        const branch = getBranchAtPos(program, pos(123));
        const response = getNodeVal(branch).at(-1);
        expect(response.type).toBe("IntegerLiteral");
    });

    it("getHoverInfo, augments", () => {
        const program = parse(`class foo { /** MyBar */ function bar() {} } class moo { /** @augments a */ constructor(a) {} } moo(foo()).bar()`);
        const branch = getBranchAtPos(program, pos(109));
        expect(getHoverInfo(branch).contents["value"]).toContain("(method) foo.bar(): null");
    });

    it("getNodeAugmentSymbols", () => {
        const program = parse(`class foo { function bar() {} } class moo { /** @augments a */ constructor(a) {} } moo(foo())`);
        const branch = getBranchAtPos(program, pos(85)).slice(0, -1);
        expect(getNodeAugmentSymbols(branch)).toHaveLength(1);
    });

    it("getNodeAugmentSymbols, no param", () => {
        const program = parse(`class foo { function bar() {} } class moo { /** @augments a */ constructor() {} } moo(foo())`);
        const branch = getBranchAtPos(program, pos(84)).slice(0, -1);
        expect(getNodeAugmentSymbols(branch)).toHaveLength(0);
    });

    it("getNodeAugmentSymbols, no arg", () => {
        const program = parse(`class foo { function bar() {} } class moo { /** @augments a */ constructor(a) {} } moo()`);
        const branch = getBranchAtPos(program, pos(85)).slice(0, -1);
        expect(getNodeAugmentSymbols(branch)).toHaveLength(0);
    });

    it("getNodeAugmentSymbols, no augments", () => {
        const program = parse(`class foo { function bar() {} } class moo { constructor(a) {} } moo(foo())`);
        const branch = getBranchAtPos(program, pos(66)).slice(0, -1);
        expect(getNodeAugmentSymbols(branch)).toHaveLength(0);
    });

    it("getNodeAugmentSymbols, no constructor", () => {
        const program = parse(`class foo { function bar() {} } class moo {} moo(foo())`);
        const branch = getBranchAtPos(program, pos(47)).slice(0, -1);
        expect(getNodeAugmentSymbols(branch)).toHaveLength(0);
    });

    it("getNodeAugmentSymbols, no call", () => {
        const program = parse(`class foo {} foo`);
        const branch = getBranchAtPos(program, pos(15));
        expect(getNodeAugmentSymbols(branch)).toHaveLength(0);
    });

    it("getNodeAugmentSymbols, not class", () => {
        const program = parse(`moo()`);
        const branch = getBranchAtPos(program, pos(2));
        expect(getNodeAugmentSymbols(branch)).toHaveLength(0);
    });
});
