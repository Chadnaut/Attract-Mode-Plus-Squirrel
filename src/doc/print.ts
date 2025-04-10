import { DocAttr } from "./kind"

/** Format array of attributes for printing in code */
export const printDocAttrs = (attrs: DocAttr[]): string =>
    attrs.map(printDocAttr).join("");


/**
 * Format attribute to print in code
 * - Includes newline at end
*/
export const printDocAttr = (attr: DocAttr): string => {
    let output = "";

    switch (attr.kind) {
        case "description":
            return ` * ${attr.documentation.split(/\r?\n/).join("\n * ")}\n`;
        default:
            output = ` * @${attr.kind}`;
            if (attr.type) output += ` {${attr.type}}`;
            if (attr.name) output += ` ${attr.name}`;
            if (attr.link) {
                if (attr.kind === "author") {
                    if (!attr.name) output += " ";
                    output += `<${attr.link}>`
                } else {
                    output += ` ${attr.link}`;
                }
            }
            if (attr.documentation) output += ` ${attr.documentation.split(/\r?\n/).join("\n * ")}`;
            output += "\n";
            return output;
    }
}

export const printDocNewline = (): string =>
    " *\n";
