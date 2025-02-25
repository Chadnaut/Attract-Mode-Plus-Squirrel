import {
    beforeEach,
    describe,
    fdescribe,
    expect,
    it,
    fit,
} from "@jest/globals";
import { parse, lineLoc, dump } from "../utils";
import { SQTree as qt } from "../../src/ast";

describe("Try", () => {

    it("TryStatement", () => {
        const response = parse(" try { a } catch(e) { b } ");
        expect(response).toEqual(qt.Program(
            [qt.TryStatement(
                qt.BlockStatement([
                    qt.ExpressionStatement(
                        qt.Identifier('a', lineLoc(7, 8)),
                    )
                ], lineLoc(5, 10)),
                qt.CatchClause(
                    qt.Identifier('e', lineLoc(17, 18)),
                    qt.BlockStatement([
                        qt.ExpressionStatement(
                            qt.Identifier('b', lineLoc(22, 23))
                        )
                    ], lineLoc(20, 25)),
                    lineLoc(11, 25)
                ),
                lineLoc(1, 25)
            )],
            [],
            lineLoc(0, 26)
        ));
    });

    it("ThrowStatement", () => {
        const response = parse(" throw x ");
        expect(response).toEqual(qt.Program(
            [qt.ThrowStatement(
                qt.Identifier('x', lineLoc(7, 8)),
                lineLoc(1, 8)
            )],
            [],
            lineLoc(0, 9)
        ));
    });

    it("PopTrap, Return within a TryStatement", () => {
        expect(() => parse("function foo() { try { return 1; } catch (err) {} }")).not.toThrow();
        expect(() => parse("function foo() { try { return } catch (err) {} }")).not.toThrow();
    });

    it("BreakTargets, Break within a TryStatement", () => {
        expect(() => parse("function foo() { while (true) { try { break; } catch (err) {} } }")).not.toThrow();
    });

    it("ContinueTargets, Continue within a TryStatement", () => {
        expect(() => parse("function foo() { while (true) { try { continue; } catch (err) {} } }")).not.toThrow();
    });

});
