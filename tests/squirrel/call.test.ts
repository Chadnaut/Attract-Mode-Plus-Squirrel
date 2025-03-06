import { describe, expect, it } from "@jest/globals";
import { parse, lineLoc, dump } from "../utils";
import { SQTree as qt } from "../../src/ast";

describe("Call", () => {
    it("Call", () => {
        const response = parse("a()");
        // dump(response);
        expect(response).toEqual(
            qt.Program(
                [
                    qt.ExpressionStatement(
                        qt.CallExpression(
                            qt.Identifier("a", lineLoc(0, 1)),
                            [],
                            lineLoc(0, 3)
                        ),
                    ),
                ],
                [],
                lineLoc(0, 3),
            ),
        );
    });

    it("Call Chain", () => {
        const response = parse("a().b()");
        // dump(response);
        expect(response).toEqual(
            qt.Program(
                [
                    qt.ExpressionStatement(
                        qt.CallExpression(
                            qt.MemberExpression(
                                qt.CallExpression(
                                    qt.Identifier("a", lineLoc(0, 1)),
                                    [],
                                    lineLoc(0, 3)
                                ),
                                qt.Identifier("b", lineLoc(4, 5)),
                            ),
                            [],
                            lineLoc(0, 7)
                        ),
                    ),
                ],
                [],
                lineLoc(0, 7),
            ),
        );
    });

    it("Call Chain More", () => {
        const response = parse("a().b().c()");
        // dump(response);
        expect(response).toEqual(
            qt.Program(
                [
                    qt.ExpressionStatement(
                        qt.CallExpression(
                            qt.MemberExpression(
                                qt.CallExpression(
                                    qt.MemberExpression(
                                        qt.CallExpression(
                                            qt.Identifier("a", lineLoc(0, 1)),
                                            [],
                                            lineLoc(0, 3)
                                        ),
                                        qt.Identifier("b", lineLoc(4, 5)),
                                    ),
                                    [],
                                    lineLoc(0, 7)
                                ),
                                qt.Identifier("c", lineLoc(8, 9)),
                            ),
                            [],
                            lineLoc(0, 11)
                        ),
                    ),
                ],
                [],
                lineLoc(0, 11),
            ),
        );
    });
});
