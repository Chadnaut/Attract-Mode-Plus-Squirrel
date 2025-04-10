import { commands, StatusBarAlignment, StatusBarItem, window } from "vscode";
import { Disposable } from "vscode";
import { ChildProcessWithoutNullStreams, spawn } from "child_process";
import constants from "../constants";
import * as path from "path";
import * as fs from "fs";
import { SquirrelOutputChannel } from "./output";
import format from "date-format";

export const escapeArg = (arg: string): string => arg.replace('"', '""');

export class SquirrelLauncher extends Disposable {
    private disposables: Disposable[];
    private _path: string;
    private _enabled: boolean = true;
    private _filename: string;
    private _config: string;
    private process: ChildProcessWithoutNullStreams;
    private label: string = "";

    public button: StatusBarItem;
    public logOutput: string = "";

    set path(value: string) {
        this._path = value;
        this.refreshButton();
    }
    get path(): string {
        return this._path;
    }

    set filename(value: string) {
        this._filename = value;
        this.refreshButton();
    }
    get filename(): string {
        return this._filename;
    }

    set enabled(value: boolean) {
        this._enabled = value;
        this.refreshButton();
    }
    get enabled(): boolean {
        return this._enabled;
    }

    set config(value: string) {
        this._config = value;
    }
    get config(): string {
        return this._config;
    }

    constructor(private outputChannelProvider: SquirrelOutputChannel) {
        super(undefined);

        this.button = window.createStatusBarItem(StatusBarAlignment.Left);
        this.button.command = "attractPlusSquirrel.launchApp";
        this.refreshLabel();

        const command = commands.registerCommand(
            "attractPlusSquirrel.launchApp",
            this.launchAM.bind(this),
        );

        this.disposables = [this.button, command];
    }

    public dispose() {
        this.disposables.forEach((item) => item?.dispose());
    }

    /** Show button if enabled and path valid */
    public refreshButton() {
        if (
            this.enabled &&
            this.path &&
            this.filename &&
            fs.existsSync(path.join(this.path, this.filename))
        ) {
            this.refreshVersion();
            this.button.show();
        } else {
            this.button.hide();
        }
    }

    /** Get version from exe and set as button label */
    public refreshVersion() {
        this.label = "Attract-Mode";

        const options = { cwd: this.path };
        const args = ["--version"];
        const process = spawn(this.filename, args, options);

        process.stdout.on("data", (data) => {
            const match = data
                .toString()
                .match("(Attract-Mode (?:Plus )?v[^ ]+)");
            if (match) {
                this.label = match[1];
                this.refreshLabel();
            }
        });
    }

    /** Update the button label to match version and running state */
    public refreshLabel() {
        const label = this.process
            ? constants.ATTRACT_MODE_STOP_PATTERN
            : constants.ATTRACT_MODE_START_PATTERN;
        const tooltip = this.process
            ? constants.ATTRACT_MODE_STOP_TOOLTIP
            : constants.ATTRACT_MODE_START_TOOLTIP;

        this.button.text = label.replace("$1", this.label);
        this.button.tooltip = tooltip;
    }

    /** Return ISO local time string */
    private getTimestamp(): string {
        return format("yyyy-MM-dd hh:mm:ss.SSS")
    }

    /** Launch AM, or kill it if already running */
    public launchAM() {
        if (this.process) {
            this.outputChannelProvider.appendLine(
                `${this.getTimestamp()} [info] Stopped`,
            );
            this.process.kill();
            return;
        }

        if (!this.enabled) return;
        if (!this.filename) return;

        const args = [];
        if (this.config) args.push("--config", `"${escapeArg(this.config)}"`);

        const logfile = this.logOutput.startsWith("logfile-");
        if (logfile) {
            args.push("--logfile", escapeArg("./last_run.log"));
            this.outputChannelProvider.restartWatcher();
        }

        const loglevel =
            this.logOutput.match("-(info|debug)$")?.[1] || "silent";
        args.push("--loglevel", loglevel);

        this.outputChannelProvider.appendLine(
            `${this.getTimestamp()} [info] Started ${args.join(" ")}`,
        );

        const options = { cwd: this.path };
        this.process = spawn(this.filename, args, options);

        this.process.stderr.on("data", (data) => {
            this.outputChannelProvider.appendLine(
                `${this.getTimestamp()} [error] ${data.toString()}`,
            );
        });

        this.process.stdout.on("data", (data) => {
            this.outputChannelProvider.append(data.toString());
        });

        this.process.on("error", (code, signal) => {
            this.outputChannelProvider.appendLine(
                `${this.getTimestamp()} [warning] (${code}) ${signal ?? ""}`,
            );
            this.process = null;
            this.refreshLabel();
        });

        this.process.on("close", (code, signal) => {
            this.outputChannelProvider.appendLine(
                `${this.getTimestamp()} [info] Closed (${code}) ${signal ?? ""}`,
            );
            this.process = null;
            this.refreshLabel();
        });

        this.refreshLabel();
    }
}
