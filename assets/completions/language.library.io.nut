/**
 * Squirrel Language
 *
 * @package IO
 * @global
 * @version 3.0.7
 */


/**
 * Executes a script and return its response.
 * @param {string($file)} filename The Squirrel script to execute, also accepts serialized closure files.
 * @param {boolean} err Invokes the compiler error handler on syntax errors. Defaults to `false`.
 * @returns {*}
 */
function dofile(filename, err = false) {}

/**
 * Compiles a script and returns it as a function.
 * @param {string($file)} filename The Squirrel script to load, also accepts serialized closure files.
 * @param {boolean} err Invokes the compiler error handler on syntax errors. Defaults to `false`.
 * @returns {function}
 */
function loadfile(filename, err = false) {}

/**
 * Serializes a closure and saves it to the given file.
 * @param {string} filename The file to save the closure to.
 * @param {*} closure The object to serialize.
 */
function writeclosuretofile(filename, closure) {}

/**
 * The file instance bound to the OS standard error stream.
 */
stderr <- file();

/**
 * The file instance bound to the OS standard input stream.
 */
stdin <- file();

/**
 * The file instance bound to the OS standard output stream.
 */
stdout <- file();

/**
 * The file object implements a stream on a operating system file.
 */
class file {
    /**
     * Opens a file stream, where mode can be a combination of:
     * - `r` `w` `a` - Read, Write, or Append.
     * - `b` - Binary content.
     * - `+` - Additional functionality depending on the mode.
     * @param {string} filename The file to open.
     * @param {string} mode The mode to open the file in.
     */
    constructor(filename, mode) {}

    /**
     * Closes the file.
     */
    function close() {}

    /**
     * Returns a non-null value if the read/write pointer is at the end of the stream.
     * @returns {*}
     */
    function eos() {}

    /**
     * Flushes the stream, and returns a non-null value on success.
     * @returns {*}
     */
    function flush() {}

    /**
     * Returns the length of the stream.
     * @returns {integer}
     */
    function len() {}

    /**
     * Reads a number of bytes from the stream and returns them as a blob.
     * @param {integer} size The number of bytes to read.
     * @returns {blob}
     */
    function readblob(size) {}

    /**
     * Reads a number from the stream and returns it.
     *
     * The return depends on the given type, which can be:
     * - `'l'` - processor dependent 32/64-bit - `integer`
     * - `'i'` - 32-bit number - `integer`
     * - `'s'` - 16-bit signed integer - `integer`
     * - `'w'` - 16-bit unsigned integer - `integer`
     * - `'c'` - 8-bit signed integer - `integer`
     * - `'b'` - 8-bit unsigned integer - `integer`
     * - `'f'` - 32-bit float - `float`
     * - `'d'` - 64-bit float - `float`
     * @param {integer} type The type of number to read and return.
     * @returns {*}
     */
    function readn(type) {}

    /**
     * Resizes the stream to the given size.
     * @param {integer} size The new stream size in bytes.
     */
    function resize(size) {}

    /**
     * Moves the read/write pointer to the given location.
     *
     * Origin can be:
     * - `'b'` - The beginning of the stream (default).
     * - `'c'` - The current location.
     * - `'e'` - The end of the stream.
     * @param {integer} offset The number of bytes to move from the origin.
     * @param {integer} origin The origin of the seek.
     */
    function seek(offset, origin = 'c') {}

    /**
     * Returns the read/write pointer's absolute position.
     * @return {integer}
     */
    function tell() {}

    /**
     * Writes a blob to the stream.
     * @param {blob} src The source blob to be written.
     */
    function writeblob(src) {}

    /**
     * Writes a number to the stream.
     *
     * The format written depends on the given type, which can be:
     * - `'i'` - 32-bit number
     * - `'s'` - 16-bit signed integer
     * - `'w'` - 16-bit unsigned integer
     * - `'c'` - 8-bit signed integer
     * - `'b'` - 8-bit unsigned integer
     * - `'f'` - 32-bit float
     * - `'d'` - 64-bit float
     * @param {*} n A numeric expression.
     * @param {integer} type The type of number to write.
     */
    function writen(n, type) {}
}
