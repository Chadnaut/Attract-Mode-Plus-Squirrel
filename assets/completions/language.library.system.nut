/**
 * Squirrel Language
 *
 * @package Squirrel
 * @global
 * @version 3.0.7
 */

/**
 * Returns the seconds elapsed since the start of the process.
 * @returns {float}
 */
function clock() {}

/**
 * Returns date information for the given timestamp.
 * - `sec` - Seconds `0...59`.
 * - `min` - Minutes `0...59`.
 * - `hour` - Hour `0...23`.
 * - `day` - Day `1...31`.
 * - `month` - Month `0..11`, 0 = January.
 * - `year` - Year.
 * - `wday` - Day of the week `0...6`, 0 = Sunday.
 * - `yday` - Day of the year `0...365`, 0 = January 1.
 *
 * @param {integer} timestamp The timestamp to use. Defaults to `time()`.
 * @param {string} format Use `'l'` for local or `'u'` for UTC. Defaults to `'l'`.
 * @returns {table}
 */
function date(timestamp = null, format = 'l') {}

/**
 * Returns the value of a system environment variable.
 * @param {string} name The environment variable name.
 * @returns {string}
 */
function getenv(name) {}

/**
 * Deletes the given file.
 * @param {string} filename The file to delete.
 * @throws An error if the file does not exist.
 */
function remove(filename) {}

/**
 * Renames the source file or directory.
 *
 * The paths must be absolute, or relative to the application.
 * @param {string} source The path to rename.
 * @param {string} destination The new name for the path.
 * @throws An error if the destination path exists.
 */
function rename(source, destination) {}

/**
 * Executes the given command using the OS interpreter, and returns its output.
 * @returns {string}
 */
function system(command) {}

/**
 * Returns the current UTC timestamp.
 * @returns {integer}
 */
function time() {}
