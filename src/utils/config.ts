import { workspace, Disposable, ConfigurationTarget } from "vscode";
import constants from "../constants";
import { Options } from "prettier";
import * as plugin from "../prettier/plugin";

const plugins = [plugin];

// -----------------------------------------------------------------------------

/** Split the last key from a config.sub.key and return ["config.sub", "key"] */
export const getConfigParts = (configSection: string): string[] => {
    const parts = configSection.split(".");
    const property = parts.pop();
    return [parts.join("."), property];
};

/** Return a config value */
export const getConfigValue = <T = any>(
    configSection: string,
    defaultValue: any = undefined,
): T => {
    const [config, section] = getConfigParts(configSection);
    return workspace.getConfiguration(config).get<T>(section, defaultValue);
};

/** Set a config value */
export const setConfigValue = (configSection: string, value: any) => {
    const [config, section] = getConfigParts(configSection);
    if (config.indexOf(".") === -1) {
        workspace
            .getConfiguration()
            .update(configSection, value, ConfigurationTarget.Global);
    } else {
        workspace
            .getConfiguration()
            .update(config, { [section]: value }, ConfigurationTarget.Global);
    }
};

// Holds last changed config
export const configStore: { [key: string]: unknown } = {};

/**
 * Watch for config change and fire callback
 * - Also fires callback on init
 * - Returns disposable to allow watcher to be destroyed
 */
export const onConfigChange = <T = any>(
    configSection: string,
    callback: (value: T) => void,
): Disposable => {
    // Watch root object to catch config object.property changes
    const disposable = workspace.onDidChangeConfiguration((event) => {
        const [config] = getConfigParts(configSection);
        if (event.affectsConfiguration(config)) {
            const value = getConfigValue<T>(configSection);
            if (value !== configStore[configSection]) callback(value);
            configStore[configSection] = value;
        }
    });
    // always call once to set the initial value
    const value = getConfigValue<T>(configSection);
    configStore[configSection] = value;
    callback(value);
    return disposable;
};

// -----------------------------------------------------------------------------

/** Returns prettier config options */
export const getPrettierOptions = (): Options => {
    const objectCurlySpacing = getConfigValue(
        constants.CODE_FORMATTING_OBJECT_CURLY_SPACING,
        true,
    );
    const arrayBracketSpacing = getConfigValue(
        constants.CODE_FORMATTING_ARRAY_BRACKET_SPACING,
        false,
    );
    const computedPropertySpacing = getConfigValue(
        constants.CODE_FORMATTING_COMPUTED_PROPERTY_SPACING,
        false,
    );
    const spaceInParens = getConfigValue(
        constants.CODE_FORMATTING_SPACE_IN_PARENS,
        false,
    );
    const condenseParens = getConfigValue(
        constants.CODE_FORMATTING_CONDENSE_PARENS,
        false,
    );
    const reduceParens = getConfigValue(
        constants.CODE_FORMATTING_REDUCE_PARENS,
        false,
    );
    const attrSingleLine = getConfigValue(
        constants.CODE_FORMATTING_ATTR_SINGLE_LINE,
        false,
    );
    const attrSpacing = getConfigValue(
        constants.CODE_FORMATTING_ATTR_SPACING,
        false,
    );
    const printWidth = getConfigValue(
        constants.CODE_FORMATTING_PRINT_WIDTH,
        80,
    );
    const tabWidth = getConfigValue(constants.CODE_FORMATTING_TAB_WIDTH, 4);
    const useTabs = getConfigValue(constants.CODE_FORMATTING_USE_TABS, false);
    const semi = getConfigValue(constants.CODE_FORMATTING_SEMI, true);
    const braceStyle = getConfigValue(
        constants.CODE_FORMATTING_BRACE_STYLE,
        "1tbs",
    );

    return {
        parser: "squirrel",
        trailingComma: "none",
        braceStyle,
        objectCurlySpacing,
        arrayBracketSpacing,
        computedPropertySpacing,
        condenseParens,
        reduceParens,
        attrSingleLine,
        spaceInParens,
        attrSpacing,
        printWidth,
        tabWidth,
        useTabs,
        semi,
        plugins,
    };
};
