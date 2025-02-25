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

describe("Enum", () => {
    it("Declaration", () => {
        const response = parse('enum e { x = 1, y = 2.0, z = "3", w = true }');
        // dump(response);
        expect(response).toEqual(qt.Program(
            [qt.EnumDeclaration(
                qt.Identifier('e', lineLoc(5, 6)),
                [
                    qt.EnumMember(
                        qt.Identifier('x', lineLoc(9, 10)),
                        qt.IntegerLiteral(1, "1", lineLoc(13, 14))
                    ),
                    qt.EnumMember(
                        qt.Identifier('y', lineLoc(16, 17)),
                        qt.FloatLiteral(2, "2.0", lineLoc(20, 23))
                    ),
                    qt.EnumMember(
                        qt.Identifier('z', lineLoc(25, 26)),
                        qt.StringLiteral("3", '"3"', lineLoc(29, 32))
                    ),
                    qt.EnumMember(
                        qt.Identifier('w', lineLoc(34, 35)),
                        qt.BooleanLiteral(true, lineLoc(38, 42))
                    ),
                ],
                lineLoc(0, 44)
            )],
            [],
            lineLoc(0, 44)
        ));
    });

    it("AssignmentExpression", () => {
        const response = parse("enum e { x = 1 }  x = e.x;");
        expect(response).toEqual(qt.Program(
            [
                qt.EnumDeclaration(
                    qt.Identifier('e', lineLoc(5, 6)),
                    [
                        qt.EnumMember(
                            qt.Identifier('x', lineLoc(9, 10)),
                            qt.IntegerLiteral(1, "1", lineLoc(13, 14))
                        ),
                    ],
                    lineLoc(0, 16)
                ),
                qt.ExpressionStatement(
                    qt.AssignmentExpression(
                        '=',
                        qt.Identifier('x', lineLoc(18, 19)),
                        qt.MemberExpression(
                            qt.Identifier('e', lineLoc(22, 23)),
                            qt.Identifier('x', lineLoc(24, 25)),
                        ),
                    )
                )
            ],
            [],
            lineLoc(0, 26)
        ));
    });
});
