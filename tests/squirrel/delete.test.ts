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

describe("Delete", () => {

    it("Delete", () => {
        const response = parse("local x = { y = 1 }  delete x.y;");
        // dump(response);
        expect(response).toEqual(qt.Program(
            [
                qt.VariableDeclaration(
                    'local',
                    [qt.VariableDeclarator(
                        qt.Identifier('x', lineLoc(6, 7)),
                        qt.ObjectExpression([
                            qt.Property(
                                'init',
                                qt.Identifier('y', lineLoc(12, 13)),
                                qt.IntegerLiteral(1, "1", lineLoc(16, 17)),
                                false,
                                false,
                                lineLoc(12, 17)
                            )
                        ],
                        false,
                        lineLoc(10, 19)),
                    )],
                    lineLoc(0, 19)
                ),
                qt.ExpressionStatement(
                    qt.UnaryExpression(
                        'delete',
                        qt.MemberExpression(
                            qt.Identifier('x', lineLoc(28, 29)),
                            qt.Identifier('y', lineLoc(30, 31)),
                        ),
                        true,
                        lineLoc(21, 31)
                    )
                )
            ],
            [],
            lineLoc(0, 32)
        ));
    });

    it("Delete, assign", () => {
        const response = parse("local x = delete x.y;");
        // dump(response);
        expect(response).toEqual(qt.Program(
            [
                qt.VariableDeclaration(
                    'local',
                    [qt.VariableDeclarator(
                        qt.Identifier('x', lineLoc(6, 7)),
                        qt.UnaryExpression(
                            'delete',
                            qt.MemberExpression(
                                qt.Identifier('x', lineLoc(17, 18)),
                                qt.Identifier('y', lineLoc(19, 20)),
                            ),
                            true,
                            lineLoc(10, 20)
                        ),
                    )],
                    lineLoc(0, 20)
                )
            ],
            [],
            lineLoc(0, 21)
        ));
    });

    it("Delete, root", () => {
        const response = parse("delete ::root");
        expect(response).toEqual(qt.Program(
            [qt.ExpressionStatement(qt.UnaryExpression(
                'delete',
                { ...qt.Identifier('root', lineLoc(7, 13)), extra: { root: true } },
                // qt.MemberExpression(
                //     qt.Root(lineLoc(7, 9)),
                //     qt.Identifier('root', lineLoc(9, 13)),
                //     false,
                //     true
                // ),
                true,
                lineLoc(0, 13)
            ))],
            [],
            lineLoc(0, 13)
        ));
    });
});
