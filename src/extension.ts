/** AM+ Squirrel Extension */

import { ExtensionContext, languages } from "vscode";
import constants from "./constants";
import * as path from "path";

import { SquirrelCompletionItemAttributeProvider } from "./providers/squirrelCompletionItemAttributeProvider";
import { SquirrelCompletionItemDocRuleProvider } from "./providers/squirrelCompletionItemDocRuleProvider";
import { SquirrelCompletionItemDocMemberProvider } from "./providers/squirrelCompletionItemDocMemberProvider";
import { SquirrelCompletionItemDocProvider } from "./providers/squirrelCompletionItemDocProvider";
import { SquirrelCompletionItemMagicProvider } from "./providers/squirrelCompletionItemMagicProvider";
import { SquirrelCompletionItemMemberProvider } from "./providers/squirrelCompletionItemMemberProvider";
import { SquirrelCompletionItemParamProvider } from "./providers/squirrelCompletionItemParamProvider";
import { SquirrelCompletionItemProvider } from "./providers/squirrelCompletionItemProvider";
import { SquirrelCompletionItemSnippetProvider } from "./providers/squirrelCompletionItemSnippetProvider";
import { SquirrelDefinitionProvider } from "./providers/squirrelDefinitionProvider";
import { SquirrelDocumentColorProvider } from "./providers/squirrelDocumentColorProvider";
import { SquirrelDocumentDropEditProvider } from "./providers/squirrelDocumentDropEditProvider";
import { SquirrelDocumentFormattingEditProvider } from "./providers/squirrelDocumentFormattingEditProvider";
import { SquirrelDocumentLinkProvider } from "./providers/squirrelDocumentLinkProvider";
import { SquirrelDocumentLogLinkProvider } from "./providers/squirrelDocumentLogLinkProvider";
import { SquirrelDocumentLogSemanticTokensProvider } from "./providers/squirrelDocumentLogSemanticTokensProvider";
import { SquirrelDocumentSemanticTokensProvider } from "./providers/squirrelDocumentSemanticTokensProvider";
import { SquirrelDocumentSymbolProvider } from "./providers/squirrelDocumentSymbolProvider";
import { SquirrelHoverDefinitionProvider } from "./providers/squirrelHoverDefinitionProvider";
import { SquirrelHoverDefinitionConfigProvider } from "./providers/squirrelHoverDefinitionConfigProvider";
import { SquirrelHoverImageProvider } from "./providers/squirrelHoverImageProvider";
import { SquirrelInlayHintsProvider } from "./providers/squirrelInlayHintsProvider";
import { SquirrelModuleExplorer } from "./providers/squirrelModuleExplorer";
import { SquirrelReferenceProvider } from "./providers/squirrelReferenceProvider";
import { SquirrelSignatureHelpProvider } from "./providers/squirrelSignatureHelpProvider";
// import { SquirrelOnTypeFormattingEditProvider } from "./providers/squirrelOnTypeFormattingEditProvider";

import { addProgramFile, removeProgram, ProgramProvider } from "./utils/program";
import { SquirrelDiagnostics } from "./utils/diagnostics";
import { SquirrelLiveReload } from "./utils/reload";
import { SquirrelOutputChannel } from "./utils/output";
import { refreshArtworkLabels } from "./utils/media";
import { SquirrelConflictCheck } from "./utils/conflict";
import { onConfigChange } from "./utils/config";
import { tokenLegend } from "./utils/token";
import { SquirrelLauncher } from "./utils/launcher";

export const activate = (context: ExtensionContext) => {
    console.info(`Activate ${constants.TITLE}`);

    // apply extension to saved and unsaved squirrel files
    const selector = [
        { language: constants.LANGUAGE_ID, scheme: "file" },
        { language: constants.LANGUAGE_ID, scheme: "untitled" },
    ];

    // log selector has no scheme, it applies to everything - including output panel
    const logSelector = constants.LOG_LANGUAGE_ID;

    // docblock completions
    const docblockNuts = [
        path.join(constants.COMPLETIONS_PATH, "docblock.attributes.nut"),
    ];

    // squirrel completions
    const languageNuts = [
        path.join(constants.COMPLETIONS_PATH, "language.nut"),
        path.join(constants.COMPLETIONS_PATH, "language.metamethod.nut"),
        path.join(constants.COMPLETIONS_PATH, "language.library.blob.nut"),
        path.join(constants.COMPLETIONS_PATH, "language.library.io.nut"),
        path.join(constants.COMPLETIONS_PATH, "language.library.math.nut"),
        path.join(constants.COMPLETIONS_PATH, "language.library.string.nut"),
        path.join(constants.COMPLETIONS_PATH, "language.library.system.nut"),
    ];

    // AM+ completions
    const frontendNuts = [
        path.join(constants.COMPLETIONS_PATH, "fe.extensions.nut"),
        path.join(constants.COMPLETIONS_PATH, "fe.magictoken.nut"),
        path.join(constants.COMPLETIONS_PATH, "fe.input.keyboard.nut"),
        path.join(constants.COMPLETIONS_PATH, "fe.input.joystick.nut"),
        path.join(constants.COMPLETIONS_PATH, "fe.input.mouse.nut"),
        path.join(constants.COMPLETIONS_PATH, "fe.input.touch.nut"),
        path.join(constants.COMPLETIONS_PATH, "fe.input.signal.nut"),
        path.join(constants.COMPLETIONS_PATH, "fe.class.Shader.nut"),
        path.join(constants.COMPLETIONS_PATH, "fe.const.nut"),
        path.join(constants.COMPLETIONS_PATH, "fe.helpers.nut"),
        path.join(constants.COMPLETIONS_PATH, "fe.class.CurrentList.nut"),
        path.join(constants.COMPLETIONS_PATH, "fe.class.Display.nut"),
        path.join(constants.COMPLETIONS_PATH, "fe.class.Filter.nut"),
        path.join(constants.COMPLETIONS_PATH, "fe.class.Image.nut"),
        path.join(constants.COMPLETIONS_PATH, "fe.class.ImageCache.nut"),
        path.join(constants.COMPLETIONS_PATH, "fe.class.LayoutGlobals.nut"),
        path.join(constants.COMPLETIONS_PATH, "fe.class.ListBox.nut"),
        path.join(constants.COMPLETIONS_PATH, "fe.class.Monitor.nut"),
        path.join(constants.COMPLETIONS_PATH, "fe.class.Music.nut"),
        path.join(constants.COMPLETIONS_PATH, "fe.class.Overlay.nut"),
        path.join(constants.COMPLETIONS_PATH, "fe.class.Rectangle.nut"),
        path.join(constants.COMPLETIONS_PATH, "fe.class.Sound.nut"),
        path.join(constants.COMPLETIONS_PATH, "fe.class.Surface.nut"),
        path.join(constants.COMPLETIONS_PATH, "fe.class.Text.nut"),
        path.join(constants.COMPLETIONS_PATH, "fe.snippet.nut"),
        path.join(constants.COMPLETIONS_PATH, "fe.nut"),
    ];

    // All the providers
    // - each will be individually enabled/disabled as required
    const documentSymbolProvider = new SquirrelDocumentSymbolProvider();
    const documentFormattingEditProvider = new SquirrelDocumentFormattingEditProvider();
    const definitionProvider = new SquirrelDefinitionProvider();
    const documentLinkProvider = new SquirrelDocumentLinkProvider();
    const documentLogLinkProvider = new SquirrelDocumentLogLinkProvider();
    const referenceProvider = new SquirrelReferenceProvider();
    const completionItemProvider = new SquirrelCompletionItemProvider();
    const completionItemMemberProvider = new SquirrelCompletionItemMemberProvider();
    const completionItemParamProvider = new SquirrelCompletionItemParamProvider();
    const completionItemMagicProvider = new SquirrelCompletionItemMagicProvider();
    const completionItemDocProvider = new SquirrelCompletionItemDocProvider();
    const completionItemDocRuleProvider = new SquirrelCompletionItemDocRuleProvider();
    const completionItemAttributeProvider = new SquirrelCompletionItemAttributeProvider();
    const completionItemDocMemberProvider = new SquirrelCompletionItemDocMemberProvider();
    const documentLogSemanticTokensProvider = new SquirrelDocumentLogSemanticTokensProvider();
    const documentSemanticTokensProvider = new SquirrelDocumentSemanticTokensProvider();
    const inlayHintsProvider = new SquirrelInlayHintsProvider();
    const signatureHelpProvider = new SquirrelSignatureHelpProvider();
    const hoverDefinitionProvider = new SquirrelHoverDefinitionProvider();
    const hoverConfigDefinitionProvider = new SquirrelHoverDefinitionConfigProvider();
    const documentDropEditProvider = new SquirrelDocumentDropEditProvider();
    const hoverImageProvider = new SquirrelHoverImageProvider();
    const completionItemSnippetProvider = new SquirrelCompletionItemSnippetProvider();
    const diagnosticsProvider = new SquirrelDiagnostics();
    const liveReloadProvider = new SquirrelLiveReload();
    const outputChannelProvider = new SquirrelOutputChannel();
    const conflictProvider = new SquirrelConflictCheck();
    const colorProvider = new SquirrelDocumentColorProvider();
    const moduleExplorer = new SquirrelModuleExplorer();
    const programProvider = new ProgramProvider();
    const launchProvider = new SquirrelLauncher(outputChannelProvider);

    // Add subscriptions for providers
    // - On unload each subscribed item will be disposed
    context.subscriptions.push(

        // ---------------------------------------------------------------------
        // Settings changes are used to trigger provider enable/disable

        onConfigChange(constants.DOCBLOCK_COMPLETIONS_ENABLED, (enabled) => {
            completionItemDocMemberProvider.enabled = enabled;
            completionItemDocProvider.enabled = enabled;
            docblockNuts.forEach((file) =>
                enabled
                    ? addProgramFile(file)
                    : removeProgram(file),
            );
        }),
        onConfigChange(constants.COMPLETIONS_ENABLED, (enabled) => {
            completionItemProvider.enabled = enabled;
            completionItemMemberProvider.enabled = enabled;
            completionItemParamProvider.enabled = enabled;
            completionItemMagicProvider.enabled = enabled;
        }),
        onConfigChange(constants.INLAY_HINTS_ENABLED, (enabled) => {
            inlayHintsProvider.enabled = enabled;
        }),
        onConfigChange(constants.DROP_EDIT_ENABLED, (enabled) => {
            documentDropEditProvider.enabled = enabled;
        }),
        onConfigChange(constants.HOVER_DEFINITIONS_ENABLED, (enabled) => {
            hoverDefinitionProvider.enabled = enabled;
            hoverConfigDefinitionProvider.enabled = enabled;
        }),
        onConfigChange(constants.HOVER_IMAGES_SHOW, (enabled) => {
            hoverImageProvider.enabled = enabled;
        }),
        onConfigChange(constants.DOCUMENT_LINKS_ENABLED, (enabled) => {
            documentLinkProvider.enabled = enabled;
        }),
        onConfigChange(constants.SNIPPETS_ENABLED, (enabled) => {
            completionItemSnippetProvider.enabled = enabled;
        }),
        onConfigChange(constants.DIAGNOSTICS_ENABLED, (enabled) => {
            diagnosticsProvider.enabled = enabled;
        }),
        onConfigChange(constants.SHOW_MISSING_ENABLED, (_enabled) => {
            diagnosticsProvider.refreshAll();
        }),
        onConfigChange(constants.LIVE_RELOAD_ENABLED, (enabled) => {
            liveReloadProvider.enabled = enabled;
        }),
        onConfigChange(constants.LIVE_RELOAD_EXTENSIONS, (extensions) => {
            liveReloadProvider.extensions = extensions;
        }),
        onConfigChange(constants.ATTRACT_MODE_LAUNCH_ENABLED, (enabled) => {
            launchProvider.enabled = enabled;
        }),
        onConfigChange(constants.ATTRACT_MODE_PATH, (path) => {
            refreshArtworkLabels();
            launchProvider.path = path;
            outputChannelProvider.path = path;
        }),
        onConfigChange(constants.LOG_OUTPUT, (output) => {
            outputChannelProvider.watch = output?.startsWith("logfile-");
            outputChannelProvider.enabled = (output && output !== "none");
            launchProvider.logOutput = output;
        }),
        onConfigChange(constants.ATTRACT_MODE_EXECUTABLE, (filename) => {
            launchProvider.filename = filename;
        }),
        onConfigChange(constants.ATTRACT_MODE_CONFIG, (config) => {
            launchProvider.config = config;
        }),
        onConfigChange(constants.ATTRACT_MODE_ARTWORK, (_labels) => {
            refreshArtworkLabels();
        }),
        onConfigChange(constants.SCAN_ARTWORK_ENABLED, (_enabled) => {
            refreshArtworkLabels();
        }),
        onConfigChange(constants.COMPLETIONS_SHOW_SQUIRREL, (enabled) => {
            languageNuts.forEach((file) =>
                enabled
                    ? addProgramFile(file)
                    : removeProgram(file),
            );
        }),
        onConfigChange(constants.COMPLETIONS_SHOW_AM, (enabled) => {
            frontendNuts.forEach((file) =>
                enabled
                    ? addProgramFile(file)
                    : removeProgram(file),
            );
        }),
        onConfigChange(constants.CHECK_CONFLICTS_ENABLED, (enabled) => {
            conflictProvider.id = context.extension.packageJSON.id;
            conflictProvider.enabled = enabled;
        }),
        onConfigChange(constants.COLOR_PICKER_ENABLED, (enabled) => {
            colorProvider.enabled = enabled;
        }),
        onConfigChange(constants.CODE_FORMATTING_RULE_MODE, (mode) => {
            completionItemDocRuleProvider.mode = mode;
        }),

        // ---------------------------------------------------------------------

        // Program provider holds AST cache
        programProvider,

        // ---------------------------------------------------------------------

        // OnTypeFormatting permanently disabled since it behaves erratically
        // languages.registerOnTypeFormattingEditProvider(
        //     selector,
        //     new SquirrelOnTypeFormattingEditProvider(),
        //     "\n"
        // ),

        // Symbol menu items (Ctrl + Shift + O, then ":" to sort)
        languages.registerDocumentSymbolProvider(
            selector,
            documentSymbolProvider,
        ),

        // Format document using Prettier (Right-click > Format Document)
        languages.registerDocumentFormattingEditProvider(
            selector,
            documentFormattingEditProvider,
        ),

        // Go to variable definition (Ctrl + Click) - requires DocumentSymbolProvider
        languages.registerDefinitionProvider(selector, definitionProvider),

        // Links to other documents from nut files (Ctrl + Click)
        languages.registerDocumentLinkProvider(selector, documentLinkProvider),

        // Tokens used to style in-body parameters (cannot be done with syntax highlighting)
        languages.registerDocumentSemanticTokensProvider(
            logSelector,
            documentLogSemanticTokensProvider,
            tokenLegend,
        ),

        // Links to other documents from log files (Ctrl + Click) links in output logs
        languages.registerDocumentLinkProvider(
            logSelector,
            documentLogLinkProvider,
        ),

        // *Supposed* to return all instances of an item
        // Used here to prevent "No references" message when DefinitionProvider returns itself
        languages.registerReferenceProvider(selector, referenceProvider),

        // Completions for root items
        languages.registerCompletionItemProvider(
            selector,
            completionItemProvider,
            ...constants.COMPLETIONS_TRIGGER,
        ),

        // Completions for member items
        languages.registerCompletionItemProvider(
            selector,
            completionItemMemberProvider,
            ...constants.COMPLETIONS_MEMBER_TRIGGER,
        ),

        // Completions for parameter suggestions
        languages.registerCompletionItemProvider(
            selector,
            completionItemParamProvider,
            ...constants.COMPLETIONS_PARAM_TRIGGER,
        ),

        // Completions for magic tokens
        languages.registerCompletionItemProvider(
            selector,
            completionItemMagicProvider,
            ...constants.COMPLETIONS_MAGIC_TRIGGER,
        ),

        // Completions for docBlocks
        languages.registerCompletionItemProvider(
            selector,
            completionItemDocProvider,
            ...constants.DOCBLOCK_TRIGGER,
        ),

        // Completions for docBlock attributes
        languages.registerCompletionItemProvider(
            selector,
            completionItemDocMemberProvider,
            ...constants.DOCBLOCK_ATTR_TRIGGER,
        ),

        // Completions for docBlock rule
        languages.registerCompletionItemProvider(
            selector,
            completionItemDocRuleProvider,
            ...constants.DOCBLOCK_HR_TRIGGER,
        ),

        // Completions for attributes
        languages.registerCompletionItemProvider(
            selector,
            completionItemAttributeProvider,
            ...constants.ATTRIBUTE_TRIGGER,
        ),

        // Completions for snippets
        languages.registerCompletionItemProvider(
            selector,
            completionItemSnippetProvider,
        ),

        // Tokens used to style in-body parameters (cannot be done with syntax highlighting)
        languages.registerDocumentSemanticTokensProvider(
            selector,
            documentSemanticTokensProvider,
            tokenLegend,
        ),

        // Inlay hints shows call-expression parameter names
        languages.registerInlayHintsProvider(selector, inlayHintsProvider),

        // Signature help shows parameter descriptions while typing
        languages.registerSignatureHelpProvider(
            selector,
            signatureHelpProvider,
            ...constants.COMPLETIONS_SIGNATURE_TRIGGER,
        ),

        // Formats SHIFT + Dropped files to create import statements
        languages.registerDocumentDropEditProvider(
            selector,
            documentDropEditProvider,
        ),

        // Hover for UserConfig attributes
        languages.registerHoverProvider(selector, hoverConfigDefinitionProvider),

        // Hover for signature + docblock information
        languages.registerHoverProvider(selector, hoverDefinitionProvider),

        // Hover for image and video previews
        languages.registerHoverProvider(selector, hoverImageProvider),

        // Colour picker for specific methods
        languages.registerColorProvider(selector, colorProvider),

        // Diagnostics shows red-dotted-underline and messages in the problems tab
        diagnosticsProvider,

        // Launcher allows AM+ to be run from a statusbar button
        launchProvider,

        // Live-Reload integration with AM on document save
        liveReloadProvider,

        // Display last_run.log in the output panel
        outputChannelProvider,

        // Show a sidebar containing AM modules
        moduleExplorer,

        // Provides attribute order command
        hoverConfigDefinitionProvider,
    );
};
