import { describe, expect, it } from "@jest/globals";
import { parse, lineLoc, dump } from "../utils";
import { SQTree as qt } from "../../src/ast";

describe("While", () => {
    it("WhileStatement", () => {
        const response = parse(" while (1) { a } ");
        // dump(response);
        expect(response).toEqual(
            qt.Program(
                [
                    qt.WhileStatement(
                        qt.IntegerLiteral(1, "1", lineLoc(8, 9)),
                        qt.BlockStatement(
                            [
                                qt.ExpressionStatement(
                                    qt.Identifier("a", lineLoc(13, 14)),
                                ),
                            ],
                            lineLoc(11, 16),
                        ),
                        lineLoc(1, 16),
                    ),
                ],
                [],
                lineLoc(0, 17),
            ),
        );
    });

    it("DoWhileStatement", () => {
        const response = parse(" do { a } while (1) ");
        expect(response).toEqual(
            qt.Program(
                [
                    qt.DoWhileStatement(
                        qt.BlockStatement(
                            [
                                qt.ExpressionStatement(
                                    qt.Identifier("a", lineLoc(6, 7)),
                                ),
                            ],
                            lineLoc(4, 9),
                        ),
                        qt.IntegerLiteral(1, "1", lineLoc(17, 18)),
                        lineLoc(1, 19),
                    ),
                ],
                [],
                lineLoc(0, 20),
            ),
        );
    });
});
