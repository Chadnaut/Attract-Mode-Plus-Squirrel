/**
 * Squirrel Language
 *
 * @package Squirrel
 * @global
 * @version 3.0.7
 */

// -------------------------------------------------------------------------------------
// Keywords

/**
 * @keyword base
 * @keyword break
 * @keyword case
 * @keyword catch
 * @keyword class
 * @keyword clone
 * @keyword const
 * @keyword constructor
 * @keyword continue
 * @keyword default
 * @keyword delete
 * @keyword else
 * @keyword enum
 * @keyword extends
 * @keyword false
 * @keyword for
 * @keyword foreach
 * @keyword function
 * @keyword if
 * @keyword in
 * @keyword instanceof
 * @keyword local
 * @keyword null
 * @keyword resume
 * @keyword return
 * @keyword static
 * @keyword switch
 * @keyword this
 * @keyword throw
 * @keyword true
 * @keyword try
 * @keyword typeof
 * @keyword while
 * @keyword yield
 */

// -------------------------------------------------------------------------------------
// Global symbols

/**
 * Creates a new array of a given size.
 * @param {integer} size The size of the array.
 * @param {*} fill The value to fill new elements. Defaults to `null`.
 * @returns {array}
 * @version Squirrel_3.0.7 http://www.squirrel-lang.org/doc/squirrel3.html#d0e2365
 */
function array(size, fill = null) {}

/**
 * Sets the runtime error handler, which is called when an exception is thrown.
 * @param {function} callback A function that handles the error.
 * @version Squirrel_3.0.7 http://www.squirrel-lang.org/doc/squirrel3.html#d0e2365
 * @example
 * ```
 * seterrorhandler(function (error) {
 *     print(error);
 * });
 * ```
 */
function seterrorhandler(callback) {}

/**
 * Returns the currently running function.
 * @returns {function}
 * @version Squirrel_3.0.7 http://www.squirrel-lang.org/doc/squirrel3.html#d0e2365
 */
function callee() {}

/**
 * Sets the debug hook function, which is called as the script gets executed.
 * @param {function} callback The hook function. Use `null` to remove.
 * @version Squirrel_3.0.7 http://www.squirrel-lang.org/doc/squirrel3.html#d0e2365
 * @example
 * ```
 * setdebughook(function (event, source, line, funcname) {
 *     if (event == 'l') {} // A new line has been executed.
 *     if (event == 'c') {} // A function has been called.
 *     if (event == 'r') {} // A function has returned.
 * });
 * ```
 */
function setdebughook(callback) {}

/**
 * Enable debug line information generation at compile time.
 * @param {boolean} enable Non-null to enable, `null` to disable.
 * @version Squirrel_3.0.7 http://www.squirrel-lang.org/doc/squirrel3.html#d0e2365
 */
function enabledebuginfo(enable) {}

/**
 * Returns the *root table*, which contains global classes, functions, and variables.
 * @returns {table}
 * @version Squirrel_3.0.7 http://www.squirrel-lang.org/doc/squirrel3.html#d0e2365
 */
function getroottable() {}

/**
 * Sets the *root table*, and returns the previous *root table*.
 * @param {table} table The new table to set.
 * @returns {table}
 * @version Squirrel_3.0.7 http://www.squirrel-lang.org/doc/squirrel3.html#d0e2365
 */
function setroottable(table) {}

/**
 * Returns the *constants table*, which contains global constants and enum-like tables.
 * @returns {table}
 * @version Squirrel_3.0.7 http://www.squirrel-lang.org/doc/squirrel3.html#d0e2365
 */
function getconsttable() {}

/**
 * Sets the *constants table*, and returns the previous *constants table*.
 * @param {table} table The new table to set.
 * @returns {table}
 * @version Squirrel_3.0.7 http://www.squirrel-lang.org/doc/squirrel3.html#d0e2365
 */
function setconsttable(table) {}

/**
 * Throws an exception if the given assertion is falsy.
 *
 * An exception will halt script execution and trigger the `errorhandler`.
 * @param {*} assertion The value to assert.
 * @version Squirrel_3.0.7 http://www.squirrel-lang.org/doc/squirrel3.html#d0e2365
 */
function assert(assertion) {}

/**
 * Prints the given value to the standard output.
 * @param {*} value The value to print.
 * @version Squirrel_3.0.7 http://www.squirrel-lang.org/doc/squirrel3.html#d0e2365
 */
function print(value) {}

/**
 * Prints the given value to the standard output.
 * @param {*} value The value to print.
 * @version Squirrel_3.0.7 http://www.squirrel-lang.org/doc/squirrel3.html#d0e2365
 */
function error(value) {}

/**
 * Compiles the given string into a function and returns it.
 * @param {string} script The string containing a squirrel script.
 * @param {string} name The name for the compiled script source.
 * @returns {function}
 * @version Squirrel_3.0.7 http://www.squirrel-lang.org/doc/squirrel3.html#d0e2365
 */
function compilestring(script, name = "") {}

/**
 * Runs the garbage collector and returns the number of reference cycles that were deleted.
 * @returns {integer}
 * @version Squirrel_3.0.7 http://www.squirrel-lang.org/doc/squirrel3.html#d0e2365
 */
function collectgarbage() {}

/**
 * Runs the garbage collector and returns an array containing all unreachable objects, or `null` if no objects were found.
 * @returns {array}
 * @version Squirrel_3.0.7 http://www.squirrel-lang.org/doc/squirrel3.html#d0e2365
 */
function resurrectunreachable() {}

/**
 * Returns the type of the given object.
 * @param {*} object The object to find the type of.
 * @raw Does not invoke metamethods.
 * @returns {string}
 * @version Squirrel_3.0.7 http://www.squirrel-lang.org/doc/squirrel3.html#d0e2365
 */
function type(object) {}

/**
 * Returns stack information for the given level.
 * - `0` - The current function.
 * - `1` - The caller.
 * - `#` - So on, up until main.
 *
 * Levels greater than the main function will return `null`.
 * @param {integer} level The stack level to return.
 * @version Squirrel_3.0.7 http://www.squirrel-lang.org/doc/squirrel3.html#d0e2365
 */
function getstackinfos(level) {
    return {
        func = "",
        line = 0,
        locals = {},
        src = ""
    };
}

/**
 * Creates a new Thread object.
 *
 * Threads can be suspended mid-execution to return a value to the caller, then resumed later from the point they were suspended.
 * Threads have their own execution stack, global table, and error handler.
 * @param {function} coroutine A function that can be suspended.
 * @returns {Thread}
 * @version Squirrel_3.0.7 http://www.squirrel-lang.org/doc/squirrel3.html#d0e2365
 * @example
 * ```
 * newthread(function (call_args) {
 *     local wakeup1 = ::suspend("return1");
 *     local wakeup2 = ::suspend("return2");
 *     return "return3";
 * });
 * ```
 */
function newthread(coroutine) {}

/**
 * Suspends a Thread coroutine mid-execution.
 *
 * Returns the value provided by the subsequent Thread `wakeup` call that resumes the coroutine.
 * @param {*} value The value to return to the Thread's `call` or `wakeup` method. Defaults to `null`.
 * @returns {*}
 * @version Squirrel_3.0.7 http://www.squirrel-lang.org/doc/squirrel3.html#d0e2365
 */
function suspend(value = null) {}

// -------------------------------------------------------------------------------------

/**
 * The Squirrel version represented as an integer.
 * @version Squirrel_3.0.7 http://www.squirrel-lang.org/doc/squirrel3.html#d0e2365
 */
const _versionnumber_ = 0;

/**
 * The Squirrel version.
 * @version Squirrel_3.0.7 http://www.squirrel-lang.org/doc/squirrel3.html#d0e2365
 */
const _version_ = "";

/**
 * Size in bytes of the internal representation for characters.
 * - `1` - ASCII builds.
 * - `2` - UNICODE builds.
 * @version Squirrel_3.0.7 http://www.squirrel-lang.org/doc/squirrel3.html#d0e2365
 */
const _charsize_ = 0;

/**
 * Size in bytes of the internal VM representation for integers.
 * - `4` - 32bit builds.
 * - `8` - 64bit builds.
 * @version Squirrel_3.0.7 http://www.squirrel-lang.org/doc/squirrel3.html#d0e2365
 */
const _intsize_ = 0;

/**
 * Size in bytes of the internal VM representation for floats.
 * - `4` - Single precision builds.
 * - `8` - Double precision builds.
 * @version Squirrel_3.0.7 http://www.squirrel-lang.org/doc/squirrel3.html#d0e2365
 */
const _floatsize_ = 0;

// -------------------------------------------------------------------------------------

/**
 * @alias Integer
 * @lends
 * @ignore
 * @version Squirrel_3.0.7 http://www.squirrel-lang.org/doc/squirrel3.html#d0e2621
 */
class IntegerLiteral {
    /**
     * Returns a float representation of the integer.
     * @returns {float}
     * @version Squirrel_3.0.7 http://www.squirrel-lang.org/doc/squirrel3.html#d0e2621
     */
    function tofloat() {}

    /**
     * Returns a string representation of the integer.
     * @returns {string}
     * @version Squirrel_3.0.7 http://www.squirrel-lang.org/doc/squirrel3.html#d0e2621
     */
    function tostring() {}

    /**
     * Returns an integer representation of the integer.
     * @returns {integer}
     * @version Squirrel_3.0.7 http://www.squirrel-lang.org/doc/squirrel3.html#d0e2621
     */
    function tointeger() {}

    /**
     * Returns the character represented by the integer.
     * @returns {string}
     * @version Squirrel_3.0.7 http://www.squirrel-lang.org/doc/squirrel3.html#d0e2621
     */
    function tochar() {}

    /**
     * Returns the integer itself.
     * @returns {integer}
     * @version Squirrel_3.0.7 http://www.squirrel-lang.org/doc/squirrel3.html#d0e2621
     */
    function weakref() {}
}

// -------------------------------------------------------------------------------------

/**
 * @alias Float
 * @lends
 * @ignore
 * @version Squirrel_3.0.7 http://www.squirrel-lang.org/doc/squirrel3.html#d0e2685
 */
class FloatLiteral {
    /**
     * Returns a float representation of the float.
     * @returns {float}
     * @version Squirrel_3.0.7 http://www.squirrel-lang.org/doc/squirrel3.html#d0e2685
     */
    function tofloat() {}

    /**
     * Returns an integer representation of the float.
     * @returns {integer}
     * @version Squirrel_3.0.7 http://www.squirrel-lang.org/doc/squirrel3.html#d0e2685
     */
    function tointeger() {}

    /**
     * Returns a string representation of the float.
     * @returns {string}
     * @version Squirrel_3.0.7 http://www.squirrel-lang.org/doc/squirrel3.html#d0e2685
     */
    function tostring() {}

    /**
     * Returns the character represented by the float's integral.
     * @returns {string}
     * @version Squirrel_3.0.7 http://www.squirrel-lang.org/doc/squirrel3.html#d0e2685
     */
    function tochar() {}

    /**
     * Returns the float itself.
     * @returns {float}
     * @version Squirrel_3.0.7 http://www.squirrel-lang.org/doc/squirrel3.html#d0e2685
     */
    function weakref() {}
}

// -------------------------------------------------------------------------------------

/**
 * @alias Boolean
 * @lends
 * @ignore
 * @version Squirrel_3.0.7 http://www.squirrel-lang.org/doc/squirrel3.html#d0e2749
 */
class BooleanLiteral {
    /**
     * Returns a float representation of the boolean.
     * - `1.0` for true
     * - `0.0` for false
     * @returns {float}
     * @version Squirrel_3.0.7 http://www.squirrel-lang.org/doc/squirrel3.html#d0e2749
     */
    function tofloat() {}

    /**
     * Returns an integer representation of the boolean.
     * - `1` for true
     * - `0` for false
     * @returns {integer}
     * @version Squirrel_3.0.7 http://www.squirrel-lang.org/doc/squirrel3.html#d0e2749
     */
    function tointeger() {}

    /**
     * Returns a string representation of the boolean
     * - `"true"` for true
     * - `"false"` for false
     * @returns {string}
     * @version Squirrel_3.0.7 http://www.squirrel-lang.org/doc/squirrel3.html#d0e2749
     */
    function tostring() {}

    /**
     * Returns the boolean itself.
     * @returns {boolean}
     * @version Squirrel_3.0.7 http://www.squirrel-lang.org/doc/squirrel3.html#d0e2749
     */
    function weakref() {}
}

// -------------------------------------------------------------------------------------

/**
 * @alias String
 * @lends
 * @ignore
 * @version Squirrel_3.0.7 http://www.squirrel-lang.org/doc/squirrel3.html#d0e2819
 */
class StringLiteral {
    /**
     * Returns the length of the string.
     * @returns {integer}
     * @version Squirrel_3.0.7 http://www.squirrel-lang.org/doc/squirrel3.html#d0e2819
     */
    function len() {}

    /**
     * Returns an integer representation of the string.
     * @returns {integer}
     * @version Squirrel_3.0.7 http://www.squirrel-lang.org/doc/squirrel3.html#d0e2819
     */
    function tointeger() {}

    /**
     * Returns a float representation of the string.
     * @returns {float}
     * @version Squirrel_3.0.7 http://www.squirrel-lang.org/doc/squirrel3.html#d0e2819
     */
    function tofloat() {}

    /**
     * Returns a string representation of the string.
     * @returns {string}
     * @version Squirrel_3.0.7 http://www.squirrel-lang.org/doc/squirrel3.html#d0e2819
     */
    function tostring() {}

    /**
     * Returns a section of the string.
     *
     * Negative indexes are calculated from the end of the string.
     * @param {integer} start The index to start from.
     * @param {integer} end The index to end at (non-inclusive). Defaults to the string length.
     * @throws Error if index out of range.
     * @returns {string}
     * @version Squirrel_3.0.7 http://www.squirrel-lang.org/doc/squirrel3.html#d0e2819
     */
    function slice(start = 0, end = 0) {}

    /**
     * Returns the index of the first occurrence of a substring, or `null` if it is not present.
     * @param {string} substring The substring to search for.
     * @param {integer} start The index to start from. Defaults to `0`.
     * @returns {integer}
     * @version Squirrel_3.0.7 http://www.squirrel-lang.org/doc/squirrel3.html#d0e2819
     */
    function find(substring, start = 0) {}

    /**
     * Returns a lowercase representation of the string.
     * @returns {string}
     * @version Squirrel_3.0.7 http://www.squirrel-lang.org/doc/squirrel3.html#d0e2819
     */
    function tolower() {}

    /**
     * Returns an uppercase representation of the string.
     * @returns {string}
     * @version Squirrel_3.0.7 http://www.squirrel-lang.org/doc/squirrel3.html#d0e2819
     */
    function toupper() {}

    /**
     * Returns the string itself.
     * @returns {string}
     * @version Squirrel_3.0.7 http://www.squirrel-lang.org/doc/squirrel3.html#d0e2819
     */
    function weakref() {}
}

// -------------------------------------------------------------------------------------

/**
 * @alias Table
 * @lends
 * @ignore
 * @version Squirrel_3.0.7 http://www.squirrel-lang.org/doc/squirrel3.html#d0e2931
 */
class ObjectExpression {
    /**
     * Returns the number of slots in the table.
     * @returns {integer}
     * @version Squirrel_3.0.7 http://www.squirrel-lang.org/doc/squirrel3.html#d0e2931
     */
    function len() {}

    /**
     * Returns the value of the given key in the table.
     * @param {*} key The name of the slot.
     * @raw Does not employ delegation.
     * @returns {*}
     * @version Squirrel_3.0.7 http://www.squirrel-lang.org/doc/squirrel3.html#d0e2931
     */
    function rawget(key) {}

    /**
     * Sets the value of the given key in the table.
     *
     * Creates a new slot if one does not exist.
     * @param {*} key The name of the slot.
     * @param {*} value The value to set.
     * @raw Does not employ delegation.
     * @version Squirrel_3.0.7 http://www.squirrel-lang.org/doc/squirrel3.html#d0e2931
     */
    function rawset(key, value) {}

    /**
     * Deletes a slot and returns it, or `null` if it did not exist.
     * @param {*} key The name of the slot.
     * @raw Does not employ delegation.
     * @returns {*}
     * @version Squirrel_3.0.7 http://www.squirrel-lang.org/doc/squirrel3.html#d0e2931
     */
    function rawdelete(key) {}

    /**
     * Returns `true` if the slot exists.
     * @param {*} key The name of the slot.
     * @raw Does not employ delegation.
     * @returns {boolean}
     * @version Squirrel_3.0.7 http://www.squirrel-lang.org/doc/squirrel3.html#d0e2931
     */
    function rawin(key) {}

    /**
     * Returns a weak reference to the table.
     *
     * Weak references allow objects to be used without influencing their lifetime.
     *
     * When the object is destroyed the weak reference is set to `null`.
     * @returns {Weakref}
     * @version Squirrel_3.0.7 http://www.squirrel-lang.org/doc/squirrel3.html#d0e2931
     */
    function weakref() {}

    /**
     * Returns a string representation of the table.
     * @returns {string}
     * @version Squirrel_3.0.7 http://www.squirrel-lang.org/doc/squirrel3.html#d0e2931
     */
    function tostring() {}

    /**
     * Removes all slots from the table.
     * @version Squirrel_3.0.7 http://www.squirrel-lang.org/doc/squirrel3.html#d0e2931
     */
    function clear() {}

    /**
     * Sets the delegate of the table, and returns the original table.
     * @param {table} delegate The delegate for the table. Use `null` to remove.
     * @returns {table}
     * @version Squirrel_3.0.7 http://www.squirrel-lang.org/doc/squirrel3.html#d0e2931
     */
    function setdelegate(delegate) {}

    /**
     * Returns the delegate of the table, or `null` if none is set.
     * @returns {table}
     * @version Squirrel_3.0.7 http://www.squirrel-lang.org/doc/squirrel3.html#d0e2931
     */
    function getdelegate() {}
}

// -------------------------------------------------------------------------------------

/**
 * @alias Array
 * @lends
 * @ignore
 * @version Squirrel_3.0.7 http://www.squirrel-lang.org/doc/squirrel3.html#d0e3053
 */
class ArrayExpression {
    /**
     * Returns the length of the array.
     * @returns {integer}
     * @version Squirrel_3.0.7 http://www.squirrel-lang.org/doc/squirrel3.html#d0e3053
     */
    function len() {}

    /**
     * Adds an element to the end of the array.
     * @param {*} item The element to add.
     * @version Squirrel_3.0.7 http://www.squirrel-lang.org/doc/squirrel3.html#d0e3053
     */
    function append(item) {}

    /**
     * Adds an element to the end of the array.
     * @param {*} item The element to add.
     * @version Squirrel_3.0.7 http://www.squirrel-lang.org/doc/squirrel3.html#d0e3053
     */
    function push(item) {}

    /**
     * Extends the array in place by appending all elements from the given array.
     * @param {array} items The array of elements to add.
     * @version Squirrel_3.0.7 http://www.squirrel-lang.org/doc/squirrel3.html#d0e3053
     */
    function extend(items) {}

    /**
     * Removes the element at the end of the array and returns it.
     * @throws Error if array empty.
     * @returns {*}
     * @version Squirrel_3.0.7 http://www.squirrel-lang.org/doc/squirrel3.html#d0e3053
     */
    function pop() {}

    /**
     * Returns the element at the end of the array.
     * @throws Error if array empty.
     * @returns {*}
     * @version Squirrel_3.0.7 http://www.squirrel-lang.org/doc/squirrel3.html#d0e3053
     */
    function top() {}

    /**
     * Inserts an element at the given index in the array.
     * @param {integer} index The index to insert the element.
     * @param {*} item The element to insert.
     * @throws Error if index out of range.
     * @version Squirrel_3.0.7 http://www.squirrel-lang.org/doc/squirrel3.html#d0e3053
     */
    function insert(index, item) {}

    /**
     * Removes an element at the given index in the array, and returns it.
     * @param {integer} index The index of the element to remove.
     * @throws Error if index out of range.
     * @returns {*}
     * @version Squirrel_3.0.7 http://www.squirrel-lang.org/doc/squirrel3.html#d0e3053
     */
    function remove(index) {}

    /**
     * Resizes the array in place.
     * @param {integer} size The new length of the array.
     * @param {*} fill The value to fill new elements. Defaults to `null`.
     * @version Squirrel_3.0.7 http://www.squirrel-lang.org/doc/squirrel3.html#d0e3053
     */
    function resize(size, fill = null) {}

    /**
     * Sorts the array elements in place.
     * @param {function} compare A function that determines the element order. Defaults to sorting in ascending order.
     * @throws Error if array empty.
     * @version Squirrel_3.0.7 http://www.squirrel-lang.org/doc/squirrel3.html#d0e3053
     * @example
     * ```
     * local arr = [2, 4, 3, 1];
     * arr.sort(function (a, b) {
     *     if (a < b) return -1;
     *     if (a > b) return 1;
     *     return 0;
     * });
     * // arr = [1, 2, 3, 4]
     * ```
     */
    function sort(compare = null) {}

    /**
     * Reverses the array elements in place.
     * @version Squirrel_3.0.7 http://www.squirrel-lang.org/doc/squirrel3.html#d0e3053
     */
    function reverse() {}

    /**
     * Returns a section of the array.
     *
     * Negative indexes are calculated from the end of the array.
     * @param {integer} start The index to start from.
     * @param {integer} end The index to end at (non-inclusive). Defaults to the array length.
     * @throws Error if index out of range.
     * @returns {array}
     * @version Squirrel_3.0.7 http://www.squirrel-lang.org/doc/squirrel3.html#d0e3053
     */
    function slice(start = 0, end = 0) {}

    /**
     * Returns a weak reference to the array.
     *
     * Weak references allow objects to be used without influencing their lifetime.
     *
     * When the object is destroyed the weak reference is set to `null`.
     * @returns {Weakref}
     * @version Squirrel_3.0.7 http://www.squirrel-lang.org/doc/squirrel3.html#d0e3053
     */
    function weakref() {}

    /**
     * Returns a string representation of the array.
     * @returns {string}
     * @version Squirrel_3.0.7 http://www.squirrel-lang.org/doc/squirrel3.html#d0e3053
     */
    function tostring() {}

    /**
     * Removes all elements from the array.
     * @version Squirrel_3.0.7 http://www.squirrel-lang.org/doc/squirrel3.html#d0e3053
     */
    function clear() {}

    /**
     * Calls a function on each element of the array, and returns a new array that contains the results.
     * @param {function} callback A function that maps each element.
     * @returns {array}
     * @example
     * ```
     * local arr = [1, 2, 3, 4];
     * local mapped_arr = arr.map(function (item) {
     *     return item + 1;
     * });
     * // mapped_arr = [2, 3, 4, 5]
     * ```
     */
    function map(callback) {}

    /**
     * Calls a function on each element of the array, updating it in place.
     * @param {function} callback A function that updates each element.
     * @version Squirrel_3.0.7 http://www.squirrel-lang.org/doc/squirrel3.html#d0e3053
     * @example
     * ```
     * local arr = [1, 2, 3, 4];
     * arr.apply(function (item) {
     *     return item + 1;
     * });
     * // arr = [2, 3, 4, 5]
     * ```
     */
    function apply(callback) {}

    /**
     * Calls a function on each element of the array, and returns the accumulated result.
     *
     * The result of each call is provided as an argument to the next call.
     * The function is *not* called on the first array element, as it is used for the initial result.
     * @param {function} callback A function that accumulates the result.
     * @returns {*}
     * @version Squirrel_3.0.7 http://www.squirrel-lang.org/doc/squirrel3.html#d0e3053
     * @example
     * ```
     * local arr = [1, 2, 3, 4];
     * local reduced = arr.reduce(function (result, item) {
     *     return result + item;
     * });
     * // reduced = 10
     * ```
     */
    function reduce(callback) {}

    /**
     * Returns a new array containing elements that meet the condition in the callback.
     * @param {function} callback A function that returns true when its condition it met.
     * @returns {array}
     * @version Squirrel_3.0.7 http://www.squirrel-lang.org/doc/squirrel3.html#d0e3053
     * @example
     * ```
     * local arr = [1, 2, 3, 4];
     * local filtered_arr = arr.filter(function (index, item) {
     *     return item > 2;
     * });
     * // filtered_arr = [3, 4]
     * ```
     */
    function filter(callback) {}

    /**
     * Returns the index of the first occurrence of an element in an array, or `null` if it is not present.
     * @param {*} item The element to search for.
     * @returns {integer}
     * @version Squirrel_3.0.7 http://www.squirrel-lang.org/doc/squirrel3.html#d0e3053
     */
    function find(item) {}
}

// -------------------------------------------------------------------------------------

/**
 * @alias Function
 * @lends
 * @ignore
 * @version Squirrel_3.0.7 http://www.squirrel-lang.org/doc/squirrel3.html#d0e3310
 */
class FunctionDeclaration {
    /**
     * Calls the function, substituting another object for the current environment.
     * @param {*} env The object to be used as the current environment.
     * @param {*} ...args The parameters for the function.
     * @returns {*}
     * @version Squirrel_3.0.7 http://www.squirrel-lang.org/doc/squirrel3.html#d0e3310
     */
    function call(env, ...) {}

    /**
     * Calls the function, substituting another object for the current environment.
     * @param {*} env The object to be used as the current environment.
     * @param {*} ...args The parameters for the function.
     * @protectedCall Does not invoke the error callback on failure.
     * @returns {*}
     * @version Squirrel_3.0.7 http://www.squirrel-lang.org/doc/squirrel3.html#d0e3310
     */
    function pcall(env, ...) {}

    /**
     * Calls the function, substituting another object for the current environment.
     * @param {array} args An array where the first element is used as the current environment, and the remainder as parameters for the function.
     * @returns {*}
     * @version Squirrel_3.0.7 http://www.squirrel-lang.org/doc/squirrel3.html#d0e3310
     */
    function acall(args) {}

    /**
     * Calls the function, substituting another object for the current environment.
     * @param {array} args An array where the first element is used as the current environment, and the remainder as parameters for the function.
     * @protectedCall Does not invoke the error callback on failure.
     * @returns {*}
     * @version Squirrel_3.0.7 http://www.squirrel-lang.org/doc/squirrel3.html#d0e3310
     */
    function pacall(args) {}

    /**
     * Returns a weak reference to the function.
     *
     * Weak references allow objects to be used without influencing their lifetime.
     *
     * When the object is destroyed the weak reference is set to `null`.
     * @returns {Weakref}
     * @version Squirrel_3.0.7 http://www.squirrel-lang.org/doc/squirrel3.html#d0e3310
     */
    function weakref() {}

    /**
     * Returns a string representation of the function.
     * @returns {string}
     * @version Squirrel_3.0.7 http://www.squirrel-lang.org/doc/squirrel3.html#d0e3310
     */
    function tostring() {}

    /**
     * Creates a closure, substituting another object for the current environment.
     * @param {*} env The object to be used as the current environment (Weakref).
     * @returns {function}
     * @version Squirrel_3.0.7 http://www.squirrel-lang.org/doc/squirrel3.html#d0e3310
     */
    function bindenv(env) {}

    /**
     * Returns information about the function, such as name, parameters and source.
     * @version Squirrel_3.0.7 http://www.squirrel-lang.org/doc/squirrel3.html#d0e3310
     */
    function getinfos() {
        return {
            defparams = [],
            name = "",
            native = false,
            parameters = [""],
            src = "",
            varargs = 0
        };
    }
}

/**
 * @lends
 * @ignore
 * @version Squirrel_3.0.7 http://www.squirrel-lang.org/doc/squirrel3.html#d0e3310
 */
class FunctionExpression extends FunctionDeclaration {}

/**
 * @lends
 * @ignore
 * @version Squirrel_3.0.7 http://www.squirrel-lang.org/doc/squirrel3.html#d0e3310
 */
class MethodDefinition extends FunctionDeclaration {}

/**
 * @lends
 * @ignore
 * @version Squirrel_3.0.7 http://www.squirrel-lang.org/doc/squirrel3.html#d0e1514
 */
class LambdaExpression extends FunctionDeclaration {}

// -------------------------------------------------------------------------------------
/**
 * @alias Class
 * @lends
 * @ignore
 * @version Squirrel_3.0.7 http://www.squirrel-lang.org/doc/squirrel3.html#d0e3416
 */
class ClassDeclaration {
    /**
     * Returns a new instance of the class.
     * @raw Does not invoke the constructor.
     * @returns {*}
     * @version Squirrel_3.0.7 http://www.squirrel-lang.org/doc/squirrel3.html#d0e3416
     */
    function instance() {}

    /**
     * Returns the attributes for the given member.
     * @param {string} member The name of the member. Use `null` to get class attributes.
     * @returns {table}
     * @version Squirrel_3.0.7 http://www.squirrel-lang.org/doc/squirrel3.html#d0e3416
     */
    function getattributes(member) {}

    /**
     * Sets the attributes of the given member, and returns the previous attributes.
     * @param {string} member The name of the member. Use `null` to set class attributes.
     * @param {table} attributes The attributes to set.
     * @returns {table}
     * @version Squirrel_3.0.7 http://www.squirrel-lang.org/doc/squirrel3.html#d0e3416
     */
    function setattributes(member, attributes) {}

    /**
     * Returns `true` if the slot exists.
     * @param {*} key The name of the slot.
     * @raw Does not employ delegation.
     * @returns {boolean}
     * @version Squirrel_3.0.7 http://www.squirrel-lang.org/doc/squirrel3.html#d0e3416
     */
    function rawin(key) {}

    /**
     * Returns a weak reference to the class.
     *
     * Weak references allow objects to be used without influencing their lifetime.
     *
     * When the object is destroyed the weak reference is set to `null`.
     * @returns {Weakref}
     * @version Squirrel_3.0.7 http://www.squirrel-lang.org/doc/squirrel3.html#d0e3416
     */
    function weakref() {}

    /**
     * Returns a string representation of the class.
     * @returns {string}
     * @version Squirrel_3.0.7 http://www.squirrel-lang.org/doc/squirrel3.html#d0e3416
     */
    function tostring() {}

    /**
     * Returns the value of the given key in the class.
     * @param {*} key The name of the slot.
     * @raw Does not employ delegation.
     * @returns {*}
     * @version Squirrel_3.0.7 http://www.squirrel-lang.org/doc/squirrel3.html#d0e3416
     */
    function rawget(key) {}

    /**
     * Sets the value of the given key in the class.
     *
     * Creates a new slot if one does not exist.
     * @param {*} key The name of the slot.
     * @param {*} value The value to set.
     * @raw Does not employ delegation.
     * @version Squirrel_3.0.7 http://www.squirrel-lang.org/doc/squirrel3.html#d0e3416
     */
    function rawset(key, value) {}

    /**
     * Sets the value of the given key in the class.
     *
     * Creates a new slot if one does not exist.
     * @param {*} key The name of the slot.
     * @param {*} value The value to set.
     * @param {table} attributes The attributes to set.
     * @param {boolean} isStatic If true creates a `static` slot.
     * @version Squirrel_3.0.7 http://www.squirrel-lang.org/doc/squirrel3.html#d0e3416
     */
    function newmember(key, value, attributes = null, isStatic = false) {}

    /**
     * Sets the value of the given key in the class.
     *
     * Creates a new slot if one does not exist.
     * @param {*} key The name of the slot.
     * @param {*} value The value to set.
     * @param {table} attributes The attributes to set.
     * @param {boolean} isStatic If true creates a `static` slot.
     * @raw Does not invoke metamethods.
     * @version Squirrel_3.0.7 http://www.squirrel-lang.org/doc/squirrel3.html#d0e3416
     */
    function rawnewmember(key, value, attributes = null, isStatic = false) {}
}

/**
 * @alias Class
 * @lends
 * @ignore
 * @version Squirrel_3.0.7 http://www.squirrel-lang.org/doc/squirrel3.html#d0e3416
 */
class ClassExpression extends ClassDeclaration {}

// -------------------------------------------------------------------------------------

/**
 * @lends
 * @ignore
 * @version Squirrel_3.0.7 http://www.squirrel-lang.org/doc/squirrel3.html#d0e3540
 */
class Instance {
    /**
     * Returns the class that created the instance.
     * @returns {class}
     * @version Squirrel_3.0.7 http://www.squirrel-lang.org/doc/squirrel3.html#d0e3540
     */
    function getclass() {}

    /**
     * Returns `true` if the slot exists.
     * @param {*} key The name of the slot.
     * @raw Does not employ delegation.
     * @returns {boolean}
     * @version Squirrel_3.0.7 http://www.squirrel-lang.org/doc/squirrel3.html#d0e3540
     */
    function rawin(key) {}

    /**
     * Returns a weak reference to the instance.
     *
     * Weak references allow objects to be used without influencing their lifetime.
     *
     * When the object is destroyed the weak reference is set to `null`.
     * @returns {Weakref}
     * @version Squirrel_3.0.7 http://www.squirrel-lang.org/doc/squirrel3.html#d0e3540
     */
    function weakref() {}

    /**
     * Returns a string representation of the instance.
     * @returns {string}
     * @version Squirrel_3.0.7 http://www.squirrel-lang.org/doc/squirrel3.html#d0e3540
     */
    function tostring() {}

    /**
     * Returns the value of the given key in the instance.
     * @param {*} key The name of the slot.
     * @raw Does not employ delegation.
     * @returns {*}
     * @version Squirrel_3.0.7 http://www.squirrel-lang.org/doc/squirrel3.html#d0e3540
     */
    function rawget(key) {}

    /**
     * Sets the value of the given key in the instance.
     *
     * Creates a new slot if one does not exist.
     * @param {*} key The name of the slot.
     * @param {*} value The value to set.
     * @raw Does not employ delegation.
     * @version Squirrel_3.0.7 http://www.squirrel-lang.org/doc/squirrel3.html#d0e3540
     */
    function rawset(key, value) {}
}

// -------------------------------------------------------------------------------------

/**
 * @ignore
 * @type {Generator}
 * @version Squirrel_3.0.7 http://www.squirrel-lang.org/doc/squirrel3.html#d0e3616
 */
class Generator {
    /**
     * Returns the status of the generator.
     * - `"running"` - The generator is currently running.
     * - `"suspended"` - The generator has yielded.
     * - `"dead"` - The generator has returned.
     * @returns {string}
     * @version Squirrel_3.0.7 http://www.squirrel-lang.org/doc/squirrel3.html#d0e3616
     */
    function getstatus() {}

    /**
     * Returns a weak reference to the generator.
     *
     * Weak references allow objects to be used without influencing their lifetime.
     *
     * When the object is destroyed the weak reference is set to `null`.
     * @returns {Weakref}
     * @version Squirrel_3.0.7 http://www.squirrel-lang.org/doc/squirrel3.html#d0e3616
     */
    function weakref() {}

    /**
     * Returns a string representation of the generator.
     * @returns {string}
     * @version Squirrel_3.0.7 http://www.squirrel-lang.org/doc/squirrel3.html#d0e3616
     */
    function tostring() {}
}

// -------------------------------------------------------------------------------------
/**
 * @ignore
 * @type {Thread}
 * @version Squirrel_3.0.7 http://www.squirrel-lang.org/doc/squirrel3.html#d0e3656
 */
class Thread {

    /**
     * Starts the Thread's coroutine.
     * @param {*} ...args The parameters for the coroutine.
     * @throws Error if Thread is suspended.
     * @returns {*}
     * @version Squirrel_3.0.7 http://www.squirrel-lang.org/doc/squirrel3.html#d0e3656
     */
    function call(...) {}

    /**
     * Resumes a suspended Thread.
     * @param {*} arg The value to return to the coroutine's `suspend` function.
     * @throws Error if Thread is idle.
     * @returns {*}
     * @version Squirrel_3.0.7 http://www.squirrel-lang.org/doc/squirrel3.html#d0e3656
     */
    function wakeup(arg = null) {}

    /**
     * Returns the status of the Thread.
     * - `"running"` - The coroutine is currently running.
     * - `"suspended"` - The coroutine has been suspended.
     * - `"idle"` - The coroutine has not started, or has completed.
     * @returns {string}
     * @version Squirrel_3.0.7 http://www.squirrel-lang.org/doc/squirrel3.html#d0e3656
     */
    function getstatus() {}

    // NOTE: Tests show thread weakref's return the thread itself
    // http://www.squirrel-lang.org/doc/squirrel3.html#d0e2615

    /**
     * Returns the Thread itself.
     * @returns {Thread}
     * @version Squirrel_3.0.7 http://www.squirrel-lang.org/doc/squirrel3.html#d0e3656
     */
    function weakref() {}

    /**
     * Returns a string representation of the Thread.
     * @returns {string}
     * @version Squirrel_3.0.7 http://www.squirrel-lang.org/doc/squirrel3.html#d0e3656
     */
    function tostring() {}

    /**
     * Returns stack information for the given level.
     * - `0` - The current function.
     * - `1` - The caller.
     * - `#` - So on, up until main.
     *
     * Levels greater than the main function will return `null`.
     * @param {integer} level The stack level to return.
     * @version Squirrel_3.0.7 http://www.squirrel-lang.org/doc/squirrel3.html#d0e3656
     */
    function getstackinfos(level) {
        return {
            func = "",
            line = 0,
            locals = {},
            src = ""
        };
    }
}

// -------------------------------------------------------------------------------------

/**
 * @ignore
 * @type {Weakref}
 * @version Squirrel_3.0.7 http://www.squirrel-lang.org/doc/squirrel3.html#d0e3732
 */
class Weakref {
    /**
     * Returns the object the weak reference is pointing at, or `null` if the object was destroyed.
     * @returns {*}
     * @version Squirrel_3.0.7 http://www.squirrel-lang.org/doc/squirrel3.html#d0e3732
     */
    function ref() {}

    /**
     * Returns a weak reference to the object.
     *
     * Weak references allow objects to be used without influencing their lifetime.
     *
     * When the object is destroyed the weak reference is set to `null`.
     * @returns {Weakref}
     * @version Squirrel_3.0.7 http://www.squirrel-lang.org/doc/squirrel3.html#d0e3732
     */
    function weakref() {}

    /**
     * Returns a string representation of the weakref.
     * @returns {string}
     * @version Squirrel_3.0.7 http://www.squirrel-lang.org/doc/squirrel3.html#d0e3732
     */
    function tostring() {}
}
