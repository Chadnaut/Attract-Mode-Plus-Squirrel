import { TextDocument, DocumentLink, Uri, Range } from "vscode";

// 1.70.2 fix - duplicate capture group name
const logRegex = new RegExp(/^(?:(?<prefix1>Script Error in )(?<link1>.*?\.nut) - |(?<prefix2>\*[A-Z]+ \[[^\]]*\] )(?<link2>.*?) line \[(?<line1>\d+)\]|(?<link3>.*?) line = \((?<line2>\d+)\) column = \((?<column>\d+)\)|(?<prefix3> - Loaded layout: )(?<link4>.*?)(?<gap> \()(?<name>.*?)\)|(?<prefix4>Config: )(?<link5>[^\r\n]*)|(?<prefix5>.*?file: )(?<link6>.*?)\. +Valid)/gm);

/** Find links in last_run.log files */
export const getLogLinks = (document: TextDocument): DocumentLink[] => {
    const text = document.getText();
    const links: DocumentLink[] = [];

    // Regex matches multiple types of link, using group name for a common output
    logRegex.lastIndex = 0;

    let match: RegExpExecArray;
    while ((match = logRegex.exec(text))) {
        const groups = match.groups;

        const prefix = groups.prefix1 || groups.prefix2 || groups.prefix3 || groups.prefix4 || groups.prefix5 || '';
        const link = groups.link1 || groups.link2 || groups.link3 || groups.link4 || groups.link5 || groups.link6;
        const line = groups.line1 || groups.line2 || '';
        const gap = groups.gap || '';
        const name = groups.name || '';
        const column = groups.column || '';

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
