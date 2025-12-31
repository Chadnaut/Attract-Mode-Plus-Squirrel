/**
 * Squirrel Language
 *
 * @package Blob
 * @global
 * @version 3.0.7
 */

/**
 * Casts a float to a integer.
 * @param {float} n A numeric expression.
 * @returns {integer}
 */
function castf2i(n) {}

/**
 * Casts an integer to a float.
 * @param {integer} n A numeric expression.
 * @returns {float}
 */
function casti2f(n) {}

/**
 * Swaps the byte order of a 16-bit integer.
 * @param {integer} n A numeric expression.
 * @returns {integer}
 */
function swap2(n) {}

/**
 * Swaps the byte order of a 32-bit integer.
 * @param {integer} n A numeric expression.
 * @returns {integer}
 */
function swap4(n) {}

/**
 * Swaps the byte order of a float.
 * @param {float} n A numeric expression.
 * @returns {float}
 */
function swapfloat(n) {}

/**
 * The blob class is a stream of arbitrary binary data.
 *
 * Individual bytes can be accessed using the `[]` operator.
 * @class
 */
class blob {
    /**
     * Opens a blob stream.
     * @param {integer} size The initial size of the blob, in bytes.
     */
    constructor(size) {}

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
     * Swaps the byte order of the blob content, as an array of 16-bit integers.
     */
    function swap2() {}

    /**
     * Swaps the byte order of the blob content, as an array of 32-bit integers.
     */
    function swap4() {}

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
