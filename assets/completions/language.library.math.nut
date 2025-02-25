/**
 * Squirrel Language
 *
 * @package Squirrel
 * @global
 * @version 3.0.7
 */

/**
 * Returns the absolute value of a number, as an integer.
 * @param {integer} x A numeric expression.
 * @returns {integer}
 */
function abs(x) {}

/**
 * Returns the arccosine (or inverse cosine) of a number.
 * @param {float} x A numeric expression.
 * @returns {float}
 */
function acos(x) {}

/**
 * Returns the arcsine of a number.
 * @param {float} x A numeric expression.
 * @returns {float}
 */
function asin(x) {}

/**
 * Returns the arctangent of a number.
 * @param {float} x A numeric expression.
 * @returns {float}
 */
function atan(x) {}

/**
 * Returns the angle in radians from the x-axis to a point.
 * @param {float} y A numeric expression representing the cartesian y-coordinate.
 * @param {float} x A numeric expression representing the cartesian x-coordinate.
 * @returns {float}
 */
function atan2(y, x) {}

/**
 * Returns a float representing the smallest integer greater than or equal to x.
 * @param {float} x A numeric expression.
 * @returns {float}
 */
function ceil(x) {}

/**
 * Returns the cosine of a number.
 * @param {float} x A numeric expression.
 * @returns {float}
 */
function cos(x) {}

/**
 * Returns e (the base of natural logarithms) raised to a power.
 * @param {float} x A numeric expression representing the power of e.
 * @returns {float}
 */
function exp(x) {}

/**
 * Returns the absolute value of a number.
 * @param {float} x A numeric expression.
 * @returns {float}
 */
function fabs(x) {}

/**
 * Returns a float representing the largest integer less than or equal to x.
 * @param {float} x A numeric expression.
 * @returns {float}
 */
function floor(x) {}

/**
 * Returns the natural logarithm (base e) of a number.
 * @param {float} x A numeric expression.
 * @returns {float}
 */
function log(x) {}

/**
 * Returns the base 10 logarithm of a number.
 * @param {float} x A numeric expression.
 * @returns {float}
 */
function log10(x) {}

/**
 * Returns the value of a base expression taken to a specified power.
 * @param {float} x The base value of the expression.
 * @param {float} y The exponent value of the expression.
 * @returns {float}
 */
function pow(x, y) {}

/**
 * Returns a pseudorandom integer between `0` and `RAND_MAX`.
 * @returns {integer}
 */
function rand() {}

/**
 * Returns the sine of a number.
 * @param {float} x A numeric expression.
 * @returns {float}
 */
function sin(x) {}

/**
 * Returns the square root of a number.
 * @param {float} x A numeric expression.
 * @returns {float}
 */
function sqrt(x) {}

/**
 * Sets the starting point for generating a series of pseudorandom integers.
 * @param {integer} x
 */
function srand(seed) {}

/**
 * Returns the tangent of a number.
 * @param {float} x A numeric expression.
 * @returns {float}
 */
function tan(x) {}

/** The maximum value that can be returned by the `rand()` function */
RAND_MAX <- 0;

/** The numeric constant Pi `3.141592`
 *
 * The ratio of the circumference of a circle to its diameter.
*/
PI <- 3.141592;
