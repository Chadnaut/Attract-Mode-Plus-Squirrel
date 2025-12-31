import * as path from "path";

const assetsPath = path.normalize(path.join(__dirname, "../assets"));

export default {

    TITLE: "AM+ Squirrel",

    YES: "Yes",
    NO: "No",

    UPDATE_ORDER: "Update order",

    CONFIG_FILENAME: ".attractrc.json",

    // language
    LANGUAGE_ID: "squirrel",
    LANGUAGE_EXTENSION: ".nut",

    // expected parameter flags
    EXP_MODULE: "$module",
    EXP_FILE: "$file",
    EXP_NUT: "$nut",
    EXP_ARTWORK: "$artwork",
    EXP_IMAGE: "$image",
    EXP_VIDEO: "$video",
    EXP_AUDIO: "$audio",
    EXP_SHADER: "$shader",

    // key paths for AM
    FE_EMULATORS_PATH: "emulators",
    FE_LAYOUTS_PATH: "layouts",
    FE_PLUGINS_PATH: "plugins",
    FE_MODULES_PATH: "modules",

    FE_LAYOUT_FILENAME: "layout.nut",
    FE_PLUGIN_FILENAME: "plugin.nut",
    FE_MODULE_FILENAME: "module.nut",

    // list of builtin modules
    FE_MODULES_BUILTIN: [
        "animate",
        "core",
        "extended",
        "file-layout",
        "shuffle",
        "animlist",
        "conveyor",
        "fade",
        "file-format",
        "file",
        "pan-and-scan",
        "preserve-art",
        "spritesheet",
        "submenu"
    ],

    // special case url provisions
    FE_URL_SPECIAL: {
        "by Oomek": "https://github.com/oomek/attract-extra"
    },

    // extension asset paths
    ASSETS_PATH: assetsPath,
    COMPLETIONS_PATH: path.join(assetsPath, "completions"),

    // extension conflict checker
    CHECK_CONFLICTS_ENABLED: `AM-Squirrel.checkConflicts`,
    CHECK_CONFLICTS_TITLE: "Conflicting extensions found:",
    CHECK_CONFLICTS_DISABLE: "Disable Check",

    // code formatting options
    CODE_FORMATTING_BRACE_STYLE: `AM-Squirrel.codeFormatting.braces`,
    CODE_FORMATTING_OBJECT_CURLY_SPACING: `AM-Squirrel.codeFormatting.style.objectCurlySpacing`,
    CODE_FORMATTING_ARRAY_BRACKET_SPACING: `AM-Squirrel.codeFormatting.style.arrayBracketSpacing`,
    CODE_FORMATTING_COMPUTED_PROPERTY_SPACING: `AM-Squirrel.codeFormatting.style.computedPropertySpacing`,
    CODE_FORMATTING_SPACE_IN_PARENS: `AM-Squirrel.codeFormatting.style.spaceInParens`,
    CODE_FORMATTING_CONDENSE_PARENS: `AM-Squirrel.codeFormatting.style.condenseParens`,
    CODE_FORMATTING_REDUCE_PARENS: `AM-Squirrel.codeFormatting.style.reduceParens`,
    CODE_FORMATTING_ATTR_SINGLE_LINE: `AM-Squirrel.codeFormatting.style.attrSingleLine`,
    CODE_FORMATTING_ATTR_SAME_LINE: `AM-Squirrel.codeFormatting.style.attrSameLine`,
    CODE_FORMATTING_ATTR_SPACING: `AM-Squirrel.codeFormatting.style.attrSpacing`,
    CODE_FORMATTING_SEMI: `AM-Squirrel.codeFormatting.style.semi`,
    CODE_FORMATTING_USE_TABS: `AM-Squirrel.codeFormatting.style.useTabs`,
    CODE_FORMATTING_PRINT_WIDTH: `AM-Squirrel.codeFormatting.printWidth`,
    CODE_FORMATTING_RULE_MODE: `AM-Squirrel.codeFormatting.ruleWidth`,
    CODE_FORMATTING_TAB_WIDTH: `AM-Squirrel.codeFormatting.tabWidth`,

    FORMATTING_ERROR_TITLE: 'Unable to format document.',
    FORMATTING_ERROR_MESSAGE: 'Please resolve problems and try again.',

    // on-type formatting (disabled)
    // ONTYPE_TRIGGER: ["}", ";", "\n"],

    // docblock completion settings
    DOCBLOCK_COMPLETIONS_ENABLED: `AM-Squirrel.completions.showDocBlock`,
    DOCBLOCK_PREFIX: "/**",
    DOCBLOCK_TRIGGER: ["/", "*"],
    DOCBLOCK_ATTR_PREFIX: "@",
    DOCBLOCK_ATTR_TRIGGER: ["@"],
    DOCBLOCK_HR_TRIGGER: ["-", "=", "/", "*", "_"], // ["#", "_"] don't work...
    DOCBLOCK_HR_COUNT: 3,

    ATTRIBUTE_TRIGGER: ["<", "/"],
    ATTRIBUTE_PREFIX: "</",

    // code completion settings
    COMPLETIONS_ENABLED: `AM-Squirrel.completions.showCompletions`,
    COMPLETIONS_TRIGGER: [":"], // for ::root objects, alpha is auto
    COMPLETIONS_MEMBER_PREFIX: ".",
    COMPLETIONS_MEMBER_TRIGGER: [".", '"'], // members, and computed members
    COMPLETIONS_PARAM_TRIGGER: ['"'],
    COMPLETIONS_MAGIC_TRIGGER: ['['],
    COMPLETIONS_SHOW_SQUIRREL: `AM-Squirrel.completions.showSquirrel`,
    COMPLETIONS_SHOW_AM: `AM-Squirrel.completions.showAttractMode`,
    COMPLETIONS_SIGNATURE_TRIGGER: ["(", ","],

    // hovers
    HOVER_DEFINITIONS_ENABLED: `AM-Squirrel.languageSupport.showHoverDefinitions`,
    HOVER_VIDEO_AUTOPLAY: `AM-Squirrel.languageSupport.hoverVideoAutoplay`,
    HOVER_IMAGES_SHOW: `AM-Squirrel.languageSupport.showHoverImages`,
    HOVER_IMAGES_WIDTH: 292, // 256, // 256 // 136
    HOVER_IMAGES_HEIGHT: 292, // 256, // 256 // 136
    HOVER_IMAGE_SIZE_LG: 292,
    HOVER_IMAGE_SIZE_SM: 136,
    HOVER_IMAGES_PADDING: 10,

    // live reload settings and messages
    LIVE_RELOAD_ENABLED: `AM-Squirrel.attract-Mode.integration.liveReload`,
    LIVE_RELOAD_PLUGIN: "Live Reload",
    LIVE_RELOAD_FILE: "plugin.nut",
    LIVE_RELOAD_LOG: "plugin.log",
    LIVE_RELOAD_INSTALL_MESSAGE: 'Install the "Live Reload" plugin to AM+?',
    LIVE_RELOAD_INSTALL_SUCCESS_MESSAGE: 'Installed "Live Reload" plugin, please enable in AM+.',
    LIVE_RELOAD_INSTALL_FAIL_MESSAGE: 'Could not install the "Live Reload" plugin to AM+.',
    LIVE_RELOAD_UPDATE_SUCCESS_MESSAGE: 'Updated the "Live Reload" plugin in AM+.',
    LIVE_RELOAD_UPDATE_FAIL_MESSAGE: 'Could not update the "Live Reload" plugin in AM+.',
    LIVE_RELOAD_INCOMPATIBLE_MESSAGE: 'Incompatible "Live Reload" plugin found in AM+.',
    LIVE_RELOAD_INVALID_AM_MESSAGE: 'Squirrel AM+ Live Reload requires a valid Path.',
    LIVE_RELOAD_DISABLE: "Disable Live Reload",
    LIVE_RELOAD_EXTENSIONS: `AM-Squirrel.attract-Mode.liveReloadExtensions`,

    // launch

    // log output
    LOG_OUTPUT: `AM-Squirrel.attract-Mode.logOutput`,
    LOG_LANGUAGE_ID: "am-log",
    LOG_OUTPUT_NAME: "Attract-Mode",
    LOG_FILENAME: "last_run.log",
    LOG_INTERVAL: 500,

    // package settings
    PACKAGE_TEMPLATE: `AM-Squirrel.package.template`,

    // AM settings
    ATTRACT_MODE_PATH: `AM-Squirrel.attract-Mode.path`,
    ATTRACT_MODE_EXECUTABLE: `AM-Squirrel.attract-Mode.executable`,
    ATTRACT_MODE_CONFIG: `AM-Squirrel.attract-Mode.config`,
    ATTRACT_MODE_LAUNCH_ENABLED: `AM-Squirrel.attract-Mode.integration.launchEnabled`,
    ATTRACT_MODE_ARTWORK: `AM-Squirrel.attract-Mode.artwork`,
    ATTRACT_MODE_START_PATTERN: "$(play) $1",
    ATTRACT_MODE_START_TOOLTIP: "Launch Attract-Mode",
    ATTRACT_MODE_STOP_PATTERN: "$(debug-stop) $1",
    ATTRACT_MODE_STOP_TOOLTIP: "Stop Attract-Mode",

    // messages
    FILE_MISSING_MESSAGE: "The file does not exist.",
    MODULE_MISSING_MESSAGE: "The module does not exist.",

    // other features
    SNIPPETS_ENABLED: `AM-Squirrel.languageSupport.showSnippets`,
    DOCUMENT_LINKS_ENABLED: `AM-Squirrel.languageSupport.showDocumentLinks`,
    DIAGNOSTICS_ENABLED: `AM-Squirrel.languageSupport.showProblems`,
    COLOR_PICKER_ENABLED: `AM-Squirrel.languageSupport.showColor`,
    INLAY_HINTS_ENABLED: `AM-Squirrel.languageSupport.showInlayHints`,
    DROP_EDIT_ENABLED: `AM-Squirrel.languageSupport.dropEditEnabled`,
    SCAN_ARTWORK_ENABLED: `AM-Squirrel.attract-Mode.integration.scanArtwork`,
    SHOW_MISSING_ENABLED: `AM-Squirrel.attract-Mode.integration.showMissing`,

}
