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
import { AST } from "../../src/ast";

const testBin = (op: AST.BinaryOperator) => {
    const bin = ` 1 ${(op + "   ").slice(0, 3)} 2 `;
    expect(parse(bin)).toEqual(qt.Program(
        [qt.ExpressionStatement(qt.BinaryExpression(
            op,
            qt.IntegerLiteral(1, "1", lineLoc(1, 2)),
            qt.IntegerLiteral(2, "2", lineLoc(7, 8)),
        ))],
        [],
        lineLoc(0, 9)
    ));
}

describe("Math", () => {
    it("Mul", () => { testBin('*'); });
    it("Div", () => { testBin('/'); });
    it("Mod", () => { testBin('%'); });
    it("Add", () => { testBin('+'); });
    it("Sub", () => { testBin('-'); });
    it("ShiftL", () => { testBin('<<'); });
    it("ShiftR", () => { testBin('>>'); });
    it("UShiftR", () => { testBin('>>>'); });
    it("GT", () => { testBin('>'); });
    it("LT", () => { testBin('<'); });
    it("GTE", () => { testBin('>='); });
    it("LTE", () => { testBin('<='); });
    it("EQ", () => { testBin('=='); });
    it("NE", () => { testBin('!='); });
    it("3WC", () => { testBin('<=>'); });
    it("BWA", () => { testBin('&'); });
    it("BWX", () => { testBin('^'); });
    it("BWO", () => { testBin('|'); });
    it("IN", () => { testBin('in'); });

    it("InstanceOf", () => {
        const response = parse(" 1 instanceof 2 ");
        expect(response).toEqual(qt.Program(
            [qt.ExpressionStatement(qt.BinaryExpression(
                'instanceof',
                qt.IntegerLiteral(1, "1", lineLoc(1, 2)),
                qt.IntegerLiteral(2, "2", lineLoc(14, 15)),
            ))],
            [],
            lineLoc(0, 16)
        ));
    });

    it("Logical And", () => {
        const response = parse(" 1 && 2 ");
        expect(response).toEqual(qt.Program(
            [qt.ExpressionStatement(qt.LogicalExpression(
                '&&',
                qt.IntegerLiteral(1, "1", lineLoc(1, 2)),
                qt.IntegerLiteral(2, "2", lineLoc(6, 7)),
            ))],
            [],
            lineLoc(0, 8)
        ));
    });

    it("Logical And And", () => {
        const response = parse(" 1 && 2 && 3");
        expect(response).toEqual(qt.Program(
            [qt.ExpressionStatement(qt.LogicalExpression(
                '&&',
                qt.LogicalExpression(
                    '&&',
                    qt.IntegerLiteral(1, "1", lineLoc(1, 2)),
                    qt.IntegerLiteral(2, "2", lineLoc(6, 7)),
                ),
                qt.IntegerLiteral(3, "3", lineLoc(11, 12)),
            ))],
            [],
            lineLoc(0, 12)
        ));
    });

    it("Logical And And And", () => {
        const response = parse(" 1 && 2 && 3 && 4");
        expect(response).toEqual(qt.Program(
            [qt.ExpressionStatement(qt.LogicalExpression(
                '&&',
                qt.LogicalExpression(
                    '&&',
                    qt.LogicalExpression(
                        '&&',
                        qt.IntegerLiteral(1, "1", lineLoc(1, 2)),
                        qt.IntegerLiteral(2, "2", lineLoc(6, 7)),
                    ),
                    qt.IntegerLiteral(3, "3", lineLoc(11, 12)),
                ),
                qt.IntegerLiteral(4, "4", lineLoc(16, 17)),
            ))],
            [],
            lineLoc(0, 17)
        ));
    });

    // // NOTE: this is the wrong way (one & many)
    // it("Logical And And", () => {
    //     const response = parse(" 1 && 2 && 3");
    //     expect(response).toEqual(qt.Program(
    //         [qt.ExpressionStatement(qt.LogicalExpression(
    //             '&&',
    //             qt.IntegerLiteral(1, "1", lineLoc(1, 2)),
    //             qt.LogicalExpression(
    //                 '&&',
    //                 qt.IntegerLiteral(2, "2", lineLoc(6, 7)),
    //                 qt.IntegerLiteral(3, "3", lineLoc(11, 12)),
    //             ),
    //         ))],
    //         [],
    //         lineLoc(0, 12)
    //     ));
    // });

    it("Logical Or And", () => {
        const response = parse(" 1 || 2 && 3");
        expect(response).toEqual(qt.Program(
            [qt.ExpressionStatement(qt.LogicalExpression(
                '||',
                qt.IntegerLiteral(1, "1", lineLoc(1, 2)),
                qt.LogicalExpression(
                    '&&',
                    qt.IntegerLiteral(2, "2", lineLoc(6, 7)),
                    qt.IntegerLiteral(3, "3", lineLoc(11, 12)),
                ),
            ))],
            [],
            lineLoc(0, 12)
        ));
    });

    it("Logical And Or", () => {
        const response = parse(" 1 && 2 || 3");
        expect(response).toEqual(qt.Program(
            [qt.ExpressionStatement(qt.LogicalExpression(
                '||',
                qt.LogicalExpression(
                    '&&',
                    qt.IntegerLiteral(1, "1", lineLoc(1, 2)),
                    qt.IntegerLiteral(2, "2", lineLoc(6, 7)),
                ),
                qt.IntegerLiteral(3, "3", lineLoc(11, 12)),
            ))],
            [],
            lineLoc(0, 12)
        ));
    });

    it("Logical Or", () => {
        const response = parse(" 1 || 2 ");
        expect(response).toEqual(qt.Program(
            [qt.ExpressionStatement(qt.LogicalExpression(
                '||',
                qt.IntegerLiteral(1, "1", lineLoc(1, 2)),
                qt.IntegerLiteral(2, "2", lineLoc(6, 7)),
            ))],
            [],
            lineLoc(0, 8)
        ));
    });

    it("Logical Or Or", () => {
        const response = parse(" 1 || 2 || 3");
        expect(response).toEqual(qt.Program(
            [qt.ExpressionStatement(qt.LogicalExpression(
                '||',
                qt.LogicalExpression(
                    '||',
                    qt.IntegerLiteral(1, "1", lineLoc(1, 2)),
                    qt.IntegerLiteral(2, "2", lineLoc(6, 7)),
                ),
                qt.IntegerLiteral(3, "3", lineLoc(11, 12)),
            ))],
            [],
            lineLoc(0, 12)
        ));
    });
});
