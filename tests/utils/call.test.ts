import { describe, expect, it } from "@jest/globals";
import { dump, parseExtra as parse, pos } from "../utils";
import { getNodeAtPos as _getNodeAtPos } from "../../src/utils/find";
import { getCallExpressionName, getNodeCallData } from "../../src/utils/call";

describe("Call", () => {

    it("getCallExpressionName, invalid", () => {
        expect(getCallExpressionName([])).toBeUndefined();
    });

    it("getNodeCallData, FunctionDeclaration", () => {
        const text = "function foo(a,b,c) {}; foo(10,20,30);";
        const program = parse(text);
        const data = getNodeCallData(text, program, pos(35));
        expect(data.branch.at(-1)?.type).toBe("FunctionDeclaration");
        expect(data.paramIndex).toBe(2);
    });

    it("getNodeCallData, RestElement", () => {
        const text = "/** @param ...here */ function foo(a,b,...) {}; foo(10,20,30);";
        const program = parse(text);
        const data = getNodeCallData(text, program, pos(59));
        expect(data.branch.at(-1)?.type).toBe("FunctionDeclaration");
        expect(data.paramIndex).toBe(2);
    });

    it("getNodeCallData, between after", () => {
        const text = "function foo(a,b,c) {}; foo(10,20,   30);";
        const program = parse(text);
        const data = getNodeCallData(text, program, pos(35));
        expect(data.branch.at(-1)?.type).toBe("FunctionDeclaration");
        expect(data.paramIndex).toBe(2);
    });

    it("getNodeCallData, between before", () => {
        const text = "function foo(a,b,c) {}; foo(10,20   ,30);";
        const program = parse(text);
        const data = getNodeCallData(text, program, pos(35));
        expect(data.branch.at(-1)?.type).toBe("FunctionDeclaration");
        expect(data.paramIndex).toBe(1);
    });

    it("getNodeCallData, after last", () => {
        const text = "function foo(a,b,c) {}; foo(10,20,30  );";
        const program = parse(text);
        const data = getNodeCallData(text, program, pos(37));
        expect(data.branch.at(-1)?.type).toBe("FunctionDeclaration");
        expect(data.paramIndex).toBe(2);
    });

    it("getNodeCallData, after end", () => {
        const text = "function foo(a,b,c) {}; foo(10,20,30  );";
        const program = parse(text);
        const data = getNodeCallData(text, program, pos(39));
        expect(data).toBeUndefined();
    });

    it("getNodeCallData, callee", () => {
        const text = "function foo(a,b,c) {}; foo(10,20,30  );";
        const program = parse(text);
        const data = getNodeCallData(text, program, pos(26));
        expect(data).toBeUndefined();
    });

    it("getNodeCallData, no params", () => {
        const text = "function foo() {}; foo();";
        const program = parse(text);
        const data = getNodeCallData(text, program, pos(23));
        expect(data).toBeUndefined();
    });

    it("getNodeCallData, no args", () => {
        const text = "function foo(a,b,c) {}; foo();";
        const program = parse(text);
        const data = getNodeCallData(text, program, pos(28));
        expect(data.branch.at(-1)?.type).toBe("FunctionDeclaration");
        expect(data.paramIndex).toBe(0);
    });

    it("getNodeCallData, FunctionExpression", () => {
        const text = "local foo = function(a,b,c) {}; foo(10,20,30);";
        const program = parse(text);
        const data = getNodeCallData(text, program, pos(43));
        expect(data.branch.at(-1)?.type).toBe("VariableDeclarator");
        expect(data.paramIndex).toBe(2);
    });

    it("getNodeCallData, ClassDeclaration defers to constructor", () => {
        const text = "class foo { constructor(a,b,c) {} }; foo(10,20,30);";
        const program = parse(text);
        const data = getNodeCallData(text, program, pos(48));
        expect(data.branch.at(-1)?.type).toBe("MethodDefinition");
        expect(data.branch.at(-1)?.["kind"]).toBe("constructor");
        expect(data.paramIndex).toBe(2);
    });

    it("getNodeCallData, ClassExpression defers to constructor", () => {
        const text = "local foo = class { constructor(a,b,c) {} }; foo(10,20,30);";
        const program = parse(text);
        const data = getNodeCallData(text, program, pos(56));
        expect(data.branch.at(-1)?.type).toBe("MethodDefinition");
        expect(data.branch.at(-1)?.["kind"]).toBe("constructor");
        expect(data.paramIndex).toBe(2);
    });

    it("getNodeCallData, ClassDeclaration, MethodDefinition", () => {
        const text = "class foo { function bar(a,b,c) {} }; foo().bar(10,20,30);";
        const program = parse(text);
        const data = getNodeCallData(text, program, pos(55));
        expect(data.branch.at(-1)?.type).toBe("MethodDefinition");
        expect(data.paramIndex).toBe(2);
    });

    it("getNodeCallData, ClassExpression, MethodDefinition", () => {
        const text = "local foo = class { function bar(a,b,c) {} }; foo().bar(10,20,30);";
        const program = parse(text);
        const data = getNodeCallData(text, program, pos(63));
        expect(data.branch.at(-1)?.type).toBe("MethodDefinition");
        expect(data.paramIndex).toBe(2);
    });

    it("getNodeCallData, none", () => {
        const text = "foo().bar(10,20,30);";
        const program = parse(text);
        const data = getNodeCallData(text, program, pos(17));
        expect(data).toBeUndefined();
        expect(getNodeCallData(null, null, null)).toBeUndefined();
    });

});
