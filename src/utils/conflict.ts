import { window, extensions } from "vscode";
import constants from "../constants";
import { setConfigValue } from "./config";

export class SquirrelConflictCheck {
    private _enabled: boolean = true;
    public id: string;

    public set enabled(v: boolean) {
        this._enabled = v;
        if (this._enabled) {
            this.checkExtensions();
        }
    }

    private checkExtensions() {
        const exts = extensions.all.filter((ext) => {
            if (ext.id === this.id) return false;
            const contributes = ext.packageJSON.contributes;
            if (!contributes) return;
            if (contributes.grammars?.find((n) => n.language === "squirrel")) return true;
            if (contributes.languages?.find((n) => n.id === "squirrel" || n.extensions?.includes("nut"))) return true;
        });

        if (exts.length) {
            window.showErrorMessage(
                `${constants.CHECK_CONFLICTS_TITLE} ${exts.map((ext) => ext.packageJSON.displayName).join(", ")}`,
                "Close", constants.CHECK_CONFLICTS_DISABLE
            ).then((value) => {
                if (value === constants.CHECK_CONFLICTS_DISABLE) {
                    setConfigValue(constants.CHECK_CONFLICTS_ENABLED, false);
                }
            });
        }
    }
}
