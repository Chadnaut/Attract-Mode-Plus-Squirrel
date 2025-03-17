import { Disposable, window, OutputChannel } from "vscode";
import constants from "../constants";
import { fileExists } from "./file";
import * as path from "path";

const Tail = require("tail").Tail;

export class SquirrelOutputChannel extends Disposable {
    private _enabled: boolean = true;
    private disposables: Disposable[] = [];
    private channel: OutputChannel;
    private filename: string;
    private listener: typeof Tail;
    private timeout: NodeJS.Timeout;
    public _path: string = "";
    public _watch: boolean = false;

    constructor() {
        super(undefined);
    }

    /** Extension stopped */
    public dispose() {
        this.stopWatcher();
        this.disposables.forEach((item) => item.dispose());
    }

    public set path(value: string) {
        this._path = value;
        this.refresh();
    }
    public get path(): string {
        return this._path;
    }

    public set watch(value: boolean) {
        this._watch = value;
        this.clear();
        this.refresh();
    }
    public get watch(): boolean {
        return this._watch;
    }

    public set enabled(value: boolean) {
        const prev = this._enabled;
        this._enabled = value;
        this.refresh();
        if (this._enabled && !prev) this.channel.show();
    }
    public get enabled(): boolean {
        return this._enabled;
    }

    // -------------------------------------------------------------------------

    /** Restart the file watcher if watching */
    public refresh() {
        if (this.enabled) this.createChannel();
        if (this.enabled && this.watch) this.restartWatcher();
        if (!this.enabled || !this.watch) this.stopWatcher();
        if (!this.enabled) this.removeChannel();
    }

    /** Create channel if none exists */
    public createChannel() {
        if (this.channel) return;
        this.channel = window.createOutputChannel(
            constants.LOG_OUTPUT_NAME,
            constants.LOG_LANGUAGE_ID,
        );
        this.disposables.push(this.channel);
    }

    public removeChannel() {
        if (!this.channel) return;
        const i = this.disposables.findIndex((d) => d === this.channel);
        this.disposables.splice(i, 1);
        this.channel.dispose();
        delete this.channel;
    }

    // -------------------------------------------------------------------------

    /** Restart the stream, called when config path changed */
    public restartWatcher() {
        clearTimeout(this.timeout);
        if (!this.channel) return;
        this.stopWatcher();
        this.timeout = setTimeout(() => {
            this.startWatcher();
        }, constants.LOG_INTERVAL);
    }

    /** Start watching logfile */
    public startWatcher = () => {
        clearTimeout(this.timeout);
        if (this.listener) return;

        this.filename = path.join(this.path ?? "", constants.LOG_FILENAME);
        if (!fileExists(this.filename)) return;

        const interval = constants.LOG_INTERVAL;
        this.listener = new Tail(this.filename, {
            useWatchFile: true,
            fsWatchOptions: { interval },
            nLines: 1000,
        });
        this.listener.on("line", this.appendLine.bind(this));
    };

    /** Stop watching logfile */
    public stopWatcher = () => {
        clearTimeout(this.timeout);
        if (!this.listener) return;
        this.listener.unwatch();
        delete this.listener;
    };

    // -------------------------------------------------------------------------

    /** Clear the output panel */
    public clear = () => {
        clearTimeout(this.timeout);
        if (!this.channel) return;
        this.channel.clear();
    };

    /**
     * Update output channel with content
     * - If content is undefined clear the channel
     */
    public append = (content?: string) => {
        if (!this.channel) return;
        if (content === undefined) return this.clear();
        this.channel.append(content);
    };

    /**
     * Update output channel with content plus carriage return
     * - If content is undefined clear the channel
     */
    public appendLine = (content?: string) => {
        if (!this.channel) return;
        if (content === undefined) return this.clear();
        this.channel.appendLine(content);
    };
}
