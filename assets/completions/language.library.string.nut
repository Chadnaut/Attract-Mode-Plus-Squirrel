/**
 * Squirrel Language
 *
 * @package String
 * @global
 * @version 3.0.7
 */

/**
 * Returns a string formatted using *printf* rules.
 * @param {string} value The format string.
 * @param {...} args Arguments to format.
 * @returns {string}
 * @example
 * ```
 * format("%5s,%c,%.1f,%d", "abc", 'd', 12.34, 56);
 * // "  abc,d,12.3,56"
 * ```
 */
function format(value, ...) {}


/**
 * Returns the given value with leading whitespace characters removed.
 * @param {string} value The string to strip whitespace from.
 * @returns {string}
 */
function lstrip(value) {}

/**
 * Returns the given value with trailing whitespace characters removed.
 * @param {string} value The string to strip whitespace from.
 * @returns {string}
 */
function rstrip(value) {}

/**
 * Splits a string into substrings using the given separators, and returns them as an array.
 *
 * Empty substrings are omitted from the result, as such an empty array may be returned.
 * @param {string} value The string to split.
 * @param {string} separators The characters used to split the string.
 * @returns {array(string)}
 * @example
 * ```
 * split("a,b;,c", ",;");
 * // ["a","b","c"]
 * ```
 */
function split(value, separators) {}

/**
 * Returns the given value with leading and trailing whitespace characters removed.
 * @param {string} value The string to strip whitespace from.
 * @returns {string}
 */
function strip(value) {}

// -------------------------------------------------------------------------------------

/**
 * The Regular Expression class
 */
class regexp {
    /**
     * Creates an instance of regexp.
     * @param {string} pattern The regular expression.
     */
    constructor(pattern) {}

    /**
     * Returns the search result's `begin` and `end` indexes for each capture group, or `null` when no match is found.
     * @param {string} value The string to capture.
     * @param {integer} start The index to start searching from. Defaults to `0`.
     * @example
     * ```
     * regexp("(a) *(b) *(c)").capture("a b c");
     * // [
     * //     { begin = 0, end = 5 }, // the entire match range
     * //     { begin = 0, end = 1 }, // a
     * //     { begin = 2, end = 3 }, // b
     * //     { begin = 4, end = 5 }  // c
     * // ]
     * ```
     */
    function capture(value, start = 0) {
        return [{ begin = 0, end = 0 }];
    }

    /**
     * Returns true if the regular expression matches the entire given string.
     * @param {string} value The string to match.
     * @returns {boolean}
     */
    function match(value) {}

    /**
     * Returns the search result's `begin` and `end` indexes, or `null` when no match is found.
     * @param {string} value The string to search.
     * @param {integer} start The index to start searching from. Defaults to `0`.
     * @example
     * ```
     * regexp("b").search("a b c");
     * // { begin: 2, end: 3 }
     * ```
     */
    function search(value, start = 0) {
        return { begin = 0, end = 0 };
    }
}
