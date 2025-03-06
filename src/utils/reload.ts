import { TextDocument, window, workspace, Disposable } from "vscode";
import constants from "../constants";
import {
    copyFile,
    dirExists,
    fileExists,
    filenameHasExtension,
    makeDir,
    parseExtensionList,
    readFile,
    writeFile,
} from "./file";
import * as path from "path";
import { getConfigValue, setConfigValue } from "./config";

export class SquirrelLiveReload extends Disposable {
    private _enabled: boolean = true;
    private disposables: Disposable[];
    private extensionList: string[] = [];

    constructor() {
        super(undefined);

        this.disposables = [
            workspace.onDidSaveTextDocument((document) => {
                this.save(document);
            }),
        ];
    }

    /** Extension stopped */
    public dispose() {
        this.disposables.forEach((item) => item.dispose());
    }

    public set enabled(v: boolean) {
        this._enabled = v;
        if (this._enabled) {
            this.checkPlugin();
        }
    }

    public get enabled(): boolean {
        return this._enabled;
    }

    public set extensions(value: string) {
        this.extensionList = parseExtensionList(value);
    }

    private showSuccess(message: string) {
        window.showInformationMessage(message);
    }

    private showError(message: string) {
        this._enabled = false;
        window
            .showWarningMessage(message, constants.LIVE_RELOAD_DISABLE)
            .then((value) => {
                if (value === constants.LIVE_RELOAD_DISABLE)
                    this.disableHotReloadSetting();
            });
    }

    private getDstPath = (): string =>
        path.join(
            getConfigValue(constants.ATTRACT_MODE_PATH, ""),
            constants.FE_PLUGINS_PATH,
            constants.LIVE_RELOAD_PLUGIN,
        );

    private getSrcPath = (): string =>
        path.join(
            constants.ASSETS_PATH,
            constants.FE_PLUGINS_PATH,
            constants.LIVE_RELOAD_PLUGIN,
        );

    private getDstFile = (): string =>
        path.join(this.getDstPath(), constants.LIVE_RELOAD_FILE);

    private getSrcFile = (): string =>
        path.join(this.getSrcPath(), constants.LIVE_RELOAD_FILE);

    private getLogFile = (): string =>
        path.join(this.getDstPath(), constants.LIVE_RELOAD_LOG);

    private disableHotReloadSetting() {
        setConfigValue(constants.LIVE_RELOAD_ENABLED, false);
    }

    private checkPlugin = () => {
        // check AM path
        const basePath = getConfigValue(constants.ATTRACT_MODE_PATH, "");
        if (!dirExists(basePath)) {
            this.showError(constants.LIVE_RELOAD_INVALID_AM_MESSAGE);
            return;
        }

        // check plugin file
        const pluginFile = this.getDstFile();
        if (!fileExists(pluginFile)) {
            window
                .showInformationMessage(
                    constants.LIVE_RELOAD_INSTALL_MESSAGE,
                    constants.YES,
                    constants.NO,
                    constants.LIVE_RELOAD_DISABLE,
                )
                .then(
                    (value) => {
                        switch (value) {
                            case constants.YES:
                                return this.installPlugin();
                            case constants.LIVE_RELOAD_DISABLE:
                                return this.disableHotReloadSetting();
                        }
                    },
                    () => {
                        this.disableHotReloadSetting();
                    },
                );
        } else {
            this.updatePlugin();
        }
    };

    private installPlugin = () => {
        const srcFile = this.getSrcFile();
        const dstPath = this.getDstPath();
        const dstFile = this.getDstFile();

        if (!dirExists(dstPath)) makeDir(dstPath);

        if (copyFile(srcFile, dstFile)) {
            this.showSuccess(constants.LIVE_RELOAD_INSTALL_SUCCESS_MESSAGE);
        } else {
            this.showError(constants.LIVE_RELOAD_INSTALL_FAIL_MESSAGE);
        }
    };

    private updatePlugin = () => {
        const srcFile = this.getSrcFile();
        const dstFile = this.getDstFile();
        const srcContents = readFile(srcFile);
        const dstContents = readFile(dstFile);

        if (srcContents !== dstContents) {
            // abort if package name mismatch
            const pac = /@package ([^\n]+)/;
            const srcPac = srcContents.match(pac)?.[1].trim();
            const dstPac = dstContents.match(pac)?.[1].trim();
            // abort if author mismatch
            const aut = /@author ([A-Za-z]+)/;
            const srcAut = srcContents.match(aut)?.[1].trim();
            const dstAut = dstContents.match(aut)?.[1].trim();

            if (srcPac !== dstPac || srcAut !== dstAut) {
                return this.showError(
                    constants.LIVE_RELOAD_INCOMPATIBLE_MESSAGE,
                );
            }

            // attempt update
            if (copyFile(srcFile, dstFile)) {
                // No need to bother the user with update messages
                // this.showSuccess(constants.LIVE_RELOAD_UPDATE_SUCCESS_MESSAGE);
            } else {
                this.showError(constants.LIVE_RELOAD_UPDATE_FAIL_MESSAGE);
            }
        }
    };

    /** A document has been saved */
    public save = async (document?: TextDocument) => {
        if (!this.enabled) return;
        if (!document) return;

        if (
            document.languageId !== constants.LANGUAGE_ID &&
            !filenameHasExtension(document.fileName, this.extensionList)
        )
            return;

        // Update the plugin logfile with new content
        // - The plugin polls this file and reloads on change
        const logFile = this.getLogFile();
        const contents = String(new Date().getTime());
        writeFile(logFile, contents);
    };
}
