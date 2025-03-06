import { Disposable, window, OutputChannel } from "vscode";
import constants from "../constants";
import { fileExists } from "./file";
import * as path from "path";
import { getConfigValue } from "./config";

const Tail = require("tail").Tail;

export class SquirrelOutputChannel extends Disposable {
    private _enabled: boolean;
    private disposables: Disposable[] = [];
    private channel: OutputChannel;
    private filename: string;
    private listener: typeof Tail;
    private timeout: NodeJS.Timeout;

    constructor() {
        super(undefined);
    }

    /** Extension stopped */
    public dispose() {
        this.stop();
        this.disposables.forEach((item) => item.dispose());
    }

    public set enabled(value: boolean) {
        this._enabled = value;
        if (this._enabled) {
            if (!this.channel) {
                this.channel = window.createOutputChannel(
                    constants.LOG_OUTPUT_NAME,
                    constants.LOG_LANGUAGE_ID,
                );
                this.disposables.push(this.channel);
            }
            this.restart();
        } else {
            this.stop();
            if (this.channel) {
                const i = this.disposables.findIndex((d) => d === this.channel);
                this.disposables.splice(i, 1);
                this.channel.dispose();
                delete this.channel;
            }
        }
    }

    public get enabled(): boolean {
        return this._enabled;
    }

    /** Restart the stream, called when config path changed */
    public restart() {
        clearTimeout(this.timeout);
        if (this.channel) {
            this.timeout = setTimeout(() => {
                this.stop();
                this.clear();
                this.start();
            }, constants.LOG_INTERVAL);
        }
    }

    /** Start watching logfile */
    start = () => {
        clearTimeout(this.timeout);
        if (!this.listener) {
            this.filename = path.join(
                getConfigValue(constants.ATTRACT_MODE_PATH),
                constants.LOG_FILENAME,
            );
            if (fileExists(this.filename)) {
                const interval = constants.LOG_INTERVAL;

                this.listener = new Tail(this.filename, {
                    useWatchFile: true,
                    fsWatchOptions: { interval },
                    nLines: 1000,
                });
                this.listener.on("line", this.append.bind(this));
            }
        }
    };

    /** Stop watching logfile */
    stop = () => {
        clearTimeout(this.timeout);
        if (this.listener) {
            this.listener.unwatch();
            delete this.listener;
        }
    };

    clear = () => {
        clearTimeout(this.timeout);
        if (this.channel) {
            this.channel.clear();
        }
    };

    /**
     * Update output channel with content
     * - If content is undefined clear the channel
     */
    append = (content?: string) => {
        if (this.channel) {
            if (content === undefined) return this.channel.clear();
            this.channel.appendLine(content);
        }
    };
}
