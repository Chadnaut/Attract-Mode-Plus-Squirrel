import { TextDocument, DocumentLink, Uri, Range } from "vscode";

const logRegex = new RegExp(/(?<=[^\w\\/])(?<path>(?:[a-z]:)?[\\/][^ \\/*](?:.*?\.[^.\s\t\r\n\];*'"`]+|[^.]*?)(?=\.?(?:[\s\t\r\n\];*'"`]|$)))(?: \((?<layout>[^)]+)\))?(?: line[ =]*[\[(](?<line>\d+)[\])])?(?: column[ =]*[\[(](?<column>\d+)[\])])?/gmi);

/** Find links in last_run.log files */
export const getLogLinks = (document: TextDocument): DocumentLink[] => {
    const text = document.getText();
    const links: DocumentLink[] = [];

    logRegex.lastIndex = 0;

    let match: RegExpExecArray;
    while ((match = logRegex.exec(text))) {
        const groups = match.groups;

        const path = groups.path;
        const layout = groups.layout || "";
        const line = groups.line || "";
        const column = groups.column || "0";

        links.push(<DocumentLink>{
            target: Uri.from({
                scheme: "file",
                path: path + layout,
                fragment: line ? `L${line},${column}` : undefined
            }),
            range: new Range(
                document.positionAt(match.index),
                document.positionAt(match.index + path.length)
            )
        });
    }
    return links;
}
