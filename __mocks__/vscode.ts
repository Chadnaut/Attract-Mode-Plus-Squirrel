/*
    `vscode` methods are not support in jest
    `jest-mock-vscode` does its best to polyfill these methods, but some are missing
    https://github.com/streetsidesoftware/jest-mock-vscode/blob/main/src/vscode-mock.ts#L163C8-L163C29

    Here we mock the missing ones so (limited) tests can be performed
*/

import { Uri } from "vscode";

const InlayHintKind = {
    Type: 1,
    Parameter: 2,
}

class InlayHint {
    position;
    label;
    kind;
    constructor(position, label, kind?) {
        this.position = position;
        this.label = label;
        this.kind = kind;
    };
}

class ParameterInformation {
    label;
    documentation;
    constructor(label, documentation) {
        this.label = label;
        this.documentation = documentation;
    }
}

class SignatureInformation {
    parameters = [];
    label;
    documentation;
    constructor(label, documentation) {
        this.label = label;
        this.documentation = documentation;
    }
}

class SignatureHelp {
    signatures = [];
}

class Hover {
    contents;
    range;
    constructor(contents, range) {
        this.contents = contents;
        this.range = range;
    }
}

class SemanticTokensBuilder {
    legend;
    tokens: any[] = [];
    constructor(legend) {
        this.legend = legend;
    }
    push = (range, tokenType, tokenModifiers?) => { this.tokens.push({ range, tokenType })}
    build = () => this.tokens
}

class TabInputText {
    uri: Uri;
    constructor(uri: Uri) {this.uri = uri}
}

module.exports = {
    InlayHintKind,
    InlayHint,
    ParameterInformation,
    SignatureInformation,
    SignatureHelp,
    Hover,
    SemanticTokensBuilder,
    TabInputText,
    ...require('jest-mock-vscode').createVSCodeMock(jest),
}
