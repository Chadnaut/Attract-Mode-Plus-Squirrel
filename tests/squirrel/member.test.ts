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

describe("Member", () => {

    it("SequenceExpression", () => {
        const response = parse('a,b,c');
        expect(response).toEqual(qt.Program(
            [qt.ExpressionStatement(
                qt.SequenceExpression(
                    [
                        qt.Identifier('a', lineLoc(0, 1)),
                        qt.Identifier('b', lineLoc(2, 3)),
                        qt.Identifier('c', lineLoc(4, 5)),
                    ],
                    lineLoc(0, 5),
                )
            )],
            [],
            lineLoc(0, 5)
        ));
    });

    it("SequenceExpression, Parens", () => {
        const response = parse('(a,b,c)');
        expect(response).toEqual(qt.Program(
            [qt.ExpressionStatement(
                {...qt.SequenceExpression(
                    [
                        qt.Identifier('a', lineLoc(1, 2)),
                        qt.Identifier('b', lineLoc(3, 4)),
                        qt.Identifier('c', lineLoc(5, 6)),
                    ],
                    lineLoc(1, 6),
                ), extra: { parenthesized: true }},
                lineLoc(0, 7)
            )],
            [],
            lineLoc(0, 7)
        ));
    });

    it("Root", () => {
        const response = parse("::root");
        expect(response).toEqual(qt.Program(
            [qt.ExpressionStatement(
                { ...qt.Identifier('root', lineLoc(0, 6)), extra: { root: true } },
                // qt.MemberExpression(
                //     qt.Root(lineLoc(0, 2)),
                //     qt.Identifier('root', lineLoc(2, 6)),
                //     false,
                //     true,
                //     lineLoc(0, 6)
                // )
            )],
            [],
            lineLoc(0, 6)
        ));
    });


    it("MemberExpression, Calculated", () => {
        const response = parse("y[1]");
        expect(response).toEqual(qt.Program(
            [qt.ExpressionStatement(qt.MemberExpression(
                qt.Identifier('y', lineLoc(0, 1)),
                qt.IntegerLiteral(1, "1", lineLoc(2, 3)),
                true,
                false,
                lineLoc(0, 4)
            ))],
            [],
            lineLoc(0, 4)
        ));
    });

    it("MemberExpression, Dot", () => {
        const response = parse("x.y.z");
        // dump(response);
        expect(response).toEqual(qt.Program(
            [qt.ExpressionStatement(
                qt.MemberExpression(
                    qt.MemberExpression(
                        qt.Identifier('x', lineLoc(0, 1)),
                        qt.Identifier('y', lineLoc(2, 3)),
                        false,
                        false,
                        lineLoc(0, 3)
                    ),
                    qt.Identifier('z', lineLoc(4, 5)),
                    false,
                    false,
                    lineLoc(0, 5)
                )
            )],
            [],
            lineLoc(0, 5)
        ));
    });
});
