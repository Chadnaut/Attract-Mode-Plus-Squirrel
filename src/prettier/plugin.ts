import { Parser, ParserOptions, Printer, SupportLanguage } from "prettier";
import { SquirrelParser } from "../squirrel/parser";
import { AST } from "../ast";

import {
    print,
    massageAstNode,
    printComment,
    isBlockComment,
    handleComments,
    canAttachComment,
    getCommentChildNodes,
    willPrintOwnComments,
    getVisitorKeys,
} from "./language-squirrel/printer.js";
import options from "./language-squirrel/options.js";
import { locStart, locEnd } from "./language-squirrel/loc.js";

const languages: SupportLanguage[] = [
    {
        name: "squirrel",
        extensions: [".nut"],
        parsers: ["squirrel"],
        vscodeLanguageIds: ["squirrel"],
    },
];

const parsers = {
    squirrel: {
        parse: (text: string, options: ParserOptions) => {
            return new Promise((resolve, reject) => {
                try {
                    const parser = new SquirrelParser();
                    const ast = parser.parse(text);
                    resolve(ast);
                } catch (err) {
                    reject(err);
                }
            });
        },
        astFormat: "squirrel-ast",
        locStart,
        locEnd,
    } as Parser,
};

const getContext = (comment, text, options, ast, isLastComment) => {
    const { precedingNode, enclosingNode, followingNode } = comment;
    return {
        comment,
        precedingNode,
        enclosingNode,
        followingNode,
        text,
        options,
        ast,
        isLastComment,
    };
};

const printers = {
    "squirrel-ast": {
        print,
        massageAstNode,
        printComment,
        isBlockComment,
        handleComments: {
            endOfLine: (comment, text, options, ast, isLastComment) =>
                handleComments.endOfLine(
                    getContext(comment, text, options, ast, isLastComment),
                ),
            ownLine: (comment, text, options, ast, isLastComment) =>
                handleComments.ownLine(
                    getContext(comment, text, options, ast, isLastComment),
                ),
            remaining: (comment, text, options, ast, isLastComment) =>
                handleComments.remaining(
                    getContext(comment, text, options, ast, isLastComment),
                ),
        },
        canAttachComment,
        getCommentChildNodes,
        willPrintOwnComments,
        getVisitorKeys,
    } as Printer<AST.Node>,
};

module.exports = {
    languages,
    parsers,
    printers,
    options,
};
