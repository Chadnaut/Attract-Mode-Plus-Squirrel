/**
 * Attract-Mode Frontend
 *
 * @package Extension
 * @global
 */

/**
 * Returns a `blob` containing the contents a file within an archive.
 *
 * Supports `.7z` `.rar` `.tar` `.tar.gz` `.tar.bz2` `.zip`.
 * @param {string} filename The filename of the archive.
 * @param {string} extract The file to extract from the archive.
 * @returns {blob}
 * @version AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#language-extensions
 * @since AM_1.6.0 https://github.com/mickelson/attract/blob/v1.6.0/Layouts.md?plain=1#L122
 */
function zip_extract_archive(filename, extract) {}

/**
 * Returns an array of paths found within the given archive (or directory).
 * @param {string} filename The filename of the archive.
 * @returns {array(string)}
 * @version AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#language-extensions
 * @since AM_1.6.0 https://github.com/mickelson/attract/blob/v1.6.0/Layouts.md?plain=1#L125
 */
function zip_get_dir(filename) {}

/**
 * Returns as string contain the given array values concatenated with the delimiter.
 * @param {array(string)} arr The values to join.
 * @param {string} delim The separator.
 * @returns {string}
 * @version 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#language-extensions
 * @since 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/3.2.0/Layouts.md?plain=1#L2200
 */
function join(arr, delim) {}

/**
 * Returns the contents of the OS clipboard.
 * @returns {string}
 * @version 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#language-extensions
 * @since 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/3.2.0/Layouts.md?plain=1#L2201
 */
function get_clipboard() {}

/**
 * Sets the contents of the OS clipboard.
 * @param {string} value The value to place on the clipboard.
 * @returns {array(string)}
 * @version 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#language-extensions
 * @since 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/3.2.0/Layouts.md?plain=1#L2202
 */
function set_clipboard(value) {}
