import { TextDocument, DocumentLink, Uri, Range } from "vscode";

const logRegex = new RegExp(/^(?:(?<prefix>Script Error in )(?<link>.*?\.nut) - |(?<prefix>\*[A-Z]+ \[[^\]]*\] )(?<link>.*?) line \[(?<line>\d+)\]|(?<link>.*?) line = \((?<line>\d+)\) column = \((?<column>\d+)\)|(?<prefix> - Loaded layout: )(?<link>.*?)(?<gap> \()(?<name>.*?)\)|(?<prefix>Config: )(?<link>[^\r\n]*)|(?<prefix>.*?file: )(?<link>.*?)\. +Valid)/gm);

/** Find links in last_run.log files */
export const getLogLinks = (document: TextDocument): DocumentLink[] => {
    const text = document.getText();
    const links: DocumentLink[] = [];

    // Regex matches multiple types of link, using group name for a common output
    logRegex.lastIndex = 0;

    let match: RegExpExecArray;
    while ((match = logRegex.exec(text))) {
        const groups = match.groups;
        const prefix = groups.prefix ?? '';
        const link = groups.link ?? '';
        const gap = groups.gap ?? '';
        const name = groups.name ?? '';
        const line = groups.line ?? '';
        const column = groups.column ?? '';

        const index = match.index;
        const linkStart = index + prefix.length;
        const linkEnd = linkStart + link.length;

        const fragment = line ? `L${line},${column}` : undefined;
        const target = Uri.from({ scheme: "file", path: link + name, fragment });

        links.push(<DocumentLink>{
            target,
            range: new Range(document.positionAt(linkStart), document.positionAt(linkEnd))
        });

        if (name) {
            const nameStart = linkEnd + gap.length;
            const nameEnd = nameStart + name.length;
            links.push(<DocumentLink>{
                target,
                range: new Range(document.positionAt(nameStart), document.positionAt(nameEnd))
            });
        }
    }
    return links;
}
