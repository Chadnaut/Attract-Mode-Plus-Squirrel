import {
    TreeDataProvider,
    ThemeColor,
    TreeItem,
    TreeItemCollapsibleState,
    window,
    commands,
    Uri,
    EventEmitter,
    Event,
    CancellationToken,
    TreeDragAndDropController,
    DataTransfer,
    DataTransferItem,
    ThemeIcon,
    Disposable,
    Command,
} from "vscode";
import { getModuleInfo, getModulePaths, trimModuleName } from "../utils/module";

export interface AttractModuleNode {
    label: string;
    resource: Uri;
}

export class AttractModuleTreeDataProvider
    implements
        TreeDataProvider<AttractModuleNode>,
        TreeDragAndDropController<AttractModuleNode>
{
    dropMimeTypes = [];
    dragMimeTypes = ["text/uri-list"];
    iconPath = new ThemeIcon(
        "symbol-function",
        new ThemeColor("symbolIcon.methodForeground"),
    );

    /** Triggers getChildren to reloads tree */
    private _onDidChangeTreeData: EventEmitter<any> = new EventEmitter<any>();
    readonly onDidChangeTreeData: Event<any> = this._onDidChangeTreeData.event;
    public refresh() {
        this._onDidChangeTreeData.fire(undefined);
    }

    /** Allow module to drop onto document as a file */
    public handleDrag(
        source: readonly AttractModuleNode[],
        dataTransfer: DataTransfer,
        token: CancellationToken,
    ): Thenable<void> | void {
        dataTransfer.set(
            "text/uri-list",
            new DataTransferItem(
                source.map((s) => s.resource.toString()).join("\r\n"),
            ),
        );
    }

    /** Return individual tree item from node */
    public getTreeItem(element: AttractModuleNode): Thenable<TreeItem> {
        return new Promise((resolve, reject) => {
            const info = getModuleInfo(element.resource.fsPath);
            const label = info.name;
            const description = info.description
                ? info.version
                    ? `${info.version} - ${info.description}`
                    : info.description
                : "";

            resolve({
                label,
                description,
                iconPath: this.iconPath,
                tooltip: info.description,
                resourceUri: element.resource,
                collapsibleState: TreeItemCollapsibleState.None,
                command: <Command>{
                    command: "vscode.open",
                    arguments: [element.resource],
                    title: "Open",
                },
            });
        });
    }

    public getChildren(
        element?: AttractModuleNode,
    ): Thenable<AttractModuleNode[]> {
        return new Promise((resolve, reject) => {
            resolve(getModulePaths().map((name) => {
                const resource = Uri.file(name);
                return {
                    label: trimModuleName(name),
                    resource,
                };
            }));
        });
    }
}

export class SquirrelModuleExplorer extends Disposable {
    private disposables: Disposable[] = [];

    constructor() {
        super(undefined);

        const treeDataProvider = new AttractModuleTreeDataProvider();
        this.disposables = [
            window.createTreeView("attractModuleExplorer", {
                treeDataProvider,
                canSelectMany: true,
                dragAndDropController: treeDataProvider,
            }),
            commands.registerCommand("attractModuleExplorer.refresh", () =>
                treeDataProvider.refresh(),
            ),
        ];
    }

    public dispose() {
        this.disposables.forEach((item) => item?.dispose());
    }
}
