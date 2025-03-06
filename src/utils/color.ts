import { Color, ColorInformation, Range, TextDocument } from "vscode";
import { AST } from "../ast";
import { getCallExpressionName } from "./call";
import { branchSpanLoc, locToDocRange } from "./location";
import { getBranchProgram } from "./find";

const programColorMap = new WeakMap<AST.Program, AST.Node[][]>();

export const addColorCalls = (branches: AST.Node[][]) => {
    branches.forEach((branch) => {
        addProgramColorCall(getBranchProgram(branch), branch);
    });
};

export const addProgramColorCall = (
    program: AST.Program,
    branch: AST.Node[],
) => {
    if (!programColorMap.has(program)) programColorMap.set(program, []);
    programColorMap.get(program).push(branch);
};

export const getProgramColorInformation = (
    document: TextDocument,
    program: AST.Program,
): ColorInformation[] =>
    programColorMap.has(program)
        ? programColorMap
              .get(program)
              .map((branch) => getNodeColorInformation(document, branch))
              .filter((c) => c)
        : [];

// -----------------------------------------------------------------------------

const COLOUR_FORMAT = "0, 0, 0";
const colRegex = new RegExp(/^[\d\.]+([,\s\t\r\n]+)[\d\.]+([,\s\t\r\n]+)[\d\.]+/);

export const colorToRGB = (
    color: Color,
    format?: string,
): string => {
    // end bracket hack for getNodeColorInformation below
    const addEndBracket = format?.at(-1) === ")";
    if (!colRegex.test(format)) format = COLOUR_FORMAT + (addEndBracket ? ")" : "");

    const r = channelToRGB(color.red);
    const g = channelToRGB(color.green);
    const b = channelToRGB(color.blue);

    return format.replace(
        /^[\d\.]+([,\s\t\r\n]+)[\d\.]+([,\s\t\r\n]+)[\d\.]+/,
        `${r}$1${g}$2${b}`,
    );
};

export const channelToRGB = (channel: number): number =>
    Math.round(channel * 255);

// -----------------------------------------------------------------------------

/** Return branch if it's a valid color call */
export const getNodeColorInformation = (
    document: TextDocument,
    branch: AST.Node[],
): ColorInformation | undefined => {
    const method = getCallExpressionName(branch)?.split(".").at(-1);
    if (!method?.endsWith("_rgb")) return;

    const node = <AST.CallExpression>branch.at(-1);
    const args = (<AST.CallExpression>node).arguments.map(
        (a) => <AST.IntegerLiteral>a,
    );

    for (const arg of args) {
        if (arg.type !== "IntegerLiteral" && arg.type !== "FloatLiteral")
            return;
    }

    let range: Range;
    if (args.length) {
        range = locToDocRange(branchSpanLoc(args));
    } else {
        const ns = node.loc.start.index;
        const ne = node.loc.end.index;
        const span = document.getText().slice(ns, ne);
        const rs = ns + span.lastIndexOf("(") + 1;
        let re = ns + span.lastIndexOf(")");

        // NOTE: This captures the end bracket
        // - colour swatches require a valid range to display
        // - allows empty args to still display swatch using the closing bracket
        if (rs === re) re++;

        range = new Range(document.positionAt(rs), document.positionAt(re));
    }

    return <ColorInformation>{
        range,
        color: new Color(
            (args[0]?.value ?? 0) / 255,
            (args[1]?.value ?? 0) / 255,
            (args[2]?.value ?? 0) / 255,
            1.0,
        ),
    };
};
