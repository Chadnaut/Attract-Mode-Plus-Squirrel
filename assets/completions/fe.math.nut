/**
 * Attract-Mode Frontend
 *
 * @package Math
 * @global
 */

/**
 * Ceils `x` to the nearest even integer.
 * @returns {integer}
 * @param {float} x The value to ceil.
 * @version 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#language-extensions
 * @since 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/3.2.0/Layouts.md?plain=1#L2210
 */
function ceil2( x ) {}

/**
 * Clamps `x` between `min` and `max`.
 * @returns {float}
 * @param {float} x The value to clamp.
 * @param {float} min The minimum value, inclusive.
 * @param {float} max The maximum value, inclusive.
 * @version 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#language-extensions
 * @since 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/3.2.0/Layouts.md?plain=1#L2211
 */
function clamp( x, min, max ) {}

/**
 * Converts `r` from radians to degrees.
 * @returns {float}
 * @param {float} r The radian value to convert.
 * @version 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#language-extensions
 * @since 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/3.2.0/Layouts.md?plain=1#L2212
 */
function degrees( r ) {}

/**
 * Return `2` raised to the power of `x`.
 *
 * More performant than `pow(2, x)`.
 * @returns {float}
 * @param {float} x The exponent value.
 * @version 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#language-extensions
 * @since 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/3.2.0/Layouts.md?plain=1#L2213
 */
function exp2( x ) {}

/**
 * Floors `x` to the nearest even integer.
 * @returns {integer}
 * @param {float} x The value to floor.
 * @version 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#language-extensions
 * @since 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/3.2.0/Layouts.md?plain=1#L2214
 */
function floor2( x ) {}

/**
 * Returns a fractional part of `x`.
 * @returns {float}
 * @param {float} x The value to return the fraction of.
 * @version 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#language-extensions
 * @since 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/3.2.0/Layouts.md?plain=1#L2215
 */
function fract( x ) {}

/**
 * Returns the hypotenuse of `x, y`.
 * @returns {float}
 * @param {float} x The first axis.
 * @param {float} y The second axis.
 * @version 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#language-extensions
 * @since 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/3.2.0/Layouts.md?plain=1#L2216
 */
function hypot( x, y ) {}

/**
 * Returns the base `2` logarithm of a number.
 * @returns {float}
 * @param {float} x The value.
 * @version 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#language-extensions
 * @since 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/3.2.0/Layouts.md?plain=1#L217
 */
function log2( x ) {}

/**
 * Returns the largest `a` or `b`.
 * @returns {float}
 * @param {float} a The first value to compare.
 * @param {float} b The second value to compare.
 * @version 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#language-extensions
 * @since 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/3.2.0/Layouts.md?plain=1#L2218
 */
function max( a, b ) {}

/**
 * Returns the smallest `a` or `b`.
 * @returns {float}
 * @param {float} a The first value to compare.
 * @param {float} b The second value to compare.
 * @version 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#language-extensions
 * @since 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/3.2.0/Layouts.md?plain=1#L2219
 */
function min( a, b ) {}

/**
 * Returns a blend between `a` and `b`, using a mixing ratio `x`.
 * @returns {float}
 * @param {float} a The start value.
 * @param {float} b The end value.
 * @param {float} x The mix ratio, where `0.0` is start and `1.0` is end.
 * @version 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#language-extensions
 * @since 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/3.2.0/Layouts.md?plain=1#L2220
 */
function mix( a, b, x ) {}

/**
 * Returns a blend of the shortest _wrapped_ distance between `a` and `b`, using a mixing ratio `x` and wrapping modulo `m`.
 * @returns {float}
 * @param {float} a The start value.
 * @param {float} b The end value.
 * @param {float} m The module to wrap the values.
 * @param {float} x The mix ratio, where `0.0` is start and `1.0` is end.
 * @version 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#language-extensions
 * @since 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/3.2.0/Layouts.md?plain=1#L2221
 */
function mix_short( a, b, m, x ) {}

/**
 * Modulo of `v` with correct handling of negative numbers
 * @returns {float}
 * @param {float} v The value.
 * @param {float} m The modulo.
 * @version 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#language-extensions
 * @since 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/3.2.0/Layouts.md?plain=1#L2222
 */
function modulo( v, m ) {}

/**
 * Converts `d` from degrees to radians.
 * @returns {float}
 * @param {float} d The degrees value to convert.
 * @version 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#language-extensions
 * @since 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/3.2.0/Layouts.md?plain=1#L2223
 */
function radians( d ) {}

/**
 * Returns a random integer in a range defined by `min` and `max`.
 * @returns {integer}
 * @param {integer} min The minimum value, inclusive.
 * @param {integer} max The maximum value, inclusive.
 * @version 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#language-extensions
 * @since 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/3.2.0/Layouts.md?plain=1#L2224
 */
function random( min, max ) {}

/**
 * Returns a random float in a range defined by `min` and `max`.
 * @returns {float}
 * @param {float} min The minimum value, inclusive.
 * @param {float} max The maximum value, inclusive.
 * @version 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#language-extensions
 * @since 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/3.2.0/Layouts.md?plain=1#L2225
 */
function randomf( min, max ) {}

/**
 * Rounds `x` to the nearest integer.
 * @returns {integer}
 * @param {float} x The value to round.
 * @version 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#language-extensions
 * @since 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/3.2.0/Layouts.md?plain=1#L2226
 */
function round( x ) {}

/**
 * Rounds `x` to the nearest even integer.
 * @returns {integer}
 * @param {float} x The value to round.
 * @version 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#language-extensions
 * @since 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/3.2.0/Layouts.md?plain=1#L2227
 */
function round2( x ) {}

/**
 * Returns the shortest _wrapped_ distance between `a` and `b`, using wrapping modulo `m`.
 * @returns {float}
 * @param {float} a The start value.
 * @param {float} b The end value.
 * @param {float} m The modulo.
 * @version 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#language-extensions
 * @since 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/3.2.0/Layouts.md?plain=1#L2228
 */
function short( a, b, m ) {}

/**
 * Rounds `x` to the nearest even integer.
 * @returns {integer}
 * @param {float} x The value to round.
 * @version 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#language-extensions
 * @since 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/3.2.0/Layouts.md?plain=1#L2229
 */
function round2( x ) {}

/**
 * Returns `1` when `x > 0`, returns `-1` when `x < 0`, returns `0` when `x == 0`.
 * @returns {integer}
 * @param {float} x The value to find the sign of.
 * @version 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#language-extensions
 * @since 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/3.2.0/Layouts.md?plain=1#L2230
 */
function sign( x ) {}
