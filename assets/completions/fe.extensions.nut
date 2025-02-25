/**
 * Attract-Mode Frontend
 *
 * @package AttractMode
 * @global
 */

/**
 * Returns a `blob` containing the contents a file within an archive.
 *
 * Supports `.7z` `.rar` `.tar` `.tar.gz` `.tar.bz2` `.zip`.
 * @param {string} filename The filename of the archive.
 * @param {string} extract The file to extract from the archive.
 * @returns {blob}
 * @version AM_1.6.0 https://github.com/mickelson/attract/blob/v1.6.0/Layouts.md?plain=1#L122
 */
function zip_extract_archive(filename, extract) {}

/**
 * Returns an array of paths found within the given archive (or directory).
 * @param {string} filename The filename of the archive.
 * @returns {array(string)}
 * @version AM_1.6.0 https://github.com/mickelson/attract/blob/v1.6.0/Layouts.md?plain=1#L125
 */
function zip_get_dir(filename) {}
