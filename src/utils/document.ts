import { Position, Range, TabInputText, TextDocument, window } from "vscode";
import { positionTranslate } from "./location";

// -----------------------------------------------------------------------------

/** Return array of all open tab filenames */
export const getOpenTabPaths = (): string[] =>
    window.tabGroups.all.reduce(
        (items, tabGroups) =>
            items.concat(
                tabGroups.tabs
                    .filter((tab) => tab.input instanceof TabInputText)
                    .map((tab) => (<TabInputText>tab.input).uri.fsPath),
            ),
        [],
    );

// -----------------------------------------------------------------------------

/** Return range that spans entire document */
export const fullRange = (document: TextDocument): Range =>
    new Range(
        new Position(0, 0),
        document.positionAt(document.getText().length),
    );

/**
 * Return text immediately preceding the current document word
 * - Returns empty string if there is no current word
 */
export const getWordPrefix = (
    document: TextDocument,
    position: Position,
    length: number = 1,
): string => {
    if (!position) return "";
    let wordRange = document.getWordRangeAtPosition(position);
    if (!wordRange) wordRange = new Range(position, position);
    // if (!wordRange) return "";
    const wordStart = wordRange.start;
    const prefixRange = new Range(positionTranslate(wordStart, -length), wordStart);
    return document.getText(prefixRange);
};
