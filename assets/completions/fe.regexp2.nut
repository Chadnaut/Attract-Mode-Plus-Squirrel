/**
 * Attract-Mode Frontend
 *
 * @package Regexp2
 * @global
 */

/**
 * The improved Regular Expression class, recommended over the `regexp` class.
 *
 * Uses the *C++* regular expression engine.
 * @version 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#language-extensions
 * @since 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/3.2.0/Layouts.md?plain=1#L2199
 */
class regexp2 {
    /**
     * Creates an instance of regexp.
     * @param {string} pattern The regular expression.
     * @param {string} flags Accepts `"i"` for case-insensitive matching.
     */
    constructor(pattern, flags = "") {}

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
