/**
 * Attract-Mode Frontend
 *
 * @package Vec2
 * @global
 */

/**
 * A two-axis Vector class
 * @version 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#language-extensions
 * @since 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/3.2.0/Layouts.md?plain=1#L2234
 */
class Vec2 {
    /**
     * Creates an instance of Vec2.
     * @param {float} x The x value.
     * @param {float} y The y value.
     */
    constructor(x = 0.0, y = 0.0) {}

    /**
     * The Vectors x coordinate, or length for polar Vector.
     * @version 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#language-extensions
     * @since 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/3.2.0/Layouts.md?plain=1#L2254
     */
    x = 0.0

    /**
     * The Vectors y coordinate, or angle in radians for polar Vector.
     * @version 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#language-extensions
     * @since 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/3.2.0/Layouts.md?plain=1#L2255
     */
    y = 0.0

    /**
     * The length of the Vector.
     * @version 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#language-extensions
     * @since 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/3.2.0/Layouts.md?plain=1#L2256
     */
    len = 0.0

    /**
     * The angle of the Vector in radians.
     * @version 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#language-extensions
     * @since 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/3.2.0/Layouts.md?plain=1#L2257
     */
    angle = 0.0

    /**
     * Return the Vector by multiplied by the components of the given vector.
     * @param {Vec2} vector The vector to multiple with.
     * @returns {Vec2}
     * @version 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#language-extensions
     * @since 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/3.2.0/Layouts.md?plain=1#L2258
     */
    componentMul = function (vector) {}

    /**
     * Return the Vector by divided by the components of the given vector.
     * @param {Vec2} vector The vector to divide with.
     * @returns {Vec2}
     * @version 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#language-extensions
     * @since 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/3.2.0/Layouts.md?plain=1#L2259
     */
    componentDiv = function (vector) {}

    /**
     * Return the Vector represented in polar coordinates `(length, angle)`.
     * @returns {Vec2}
     * @version 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#language-extensions
     * @since 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/3.2.0/Layouts.md?plain=1#L2260
     */
    polar = function () {}

    /**
     * Return a polar Vector represented in cartesian coordinates `(x, y)`.
     * @returns {Vec2}
     * @version 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#language-extensions
     * @since 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/3.2.0/Layouts.md?plain=1#L2261
     */
    cartesian = function () {}

    /**
     * Return the normalized Vector.
     * @returns {Vec2}
     * @version 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#language-extensions
     * @since 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/3.2.0/Layouts.md?plain=1#L2262
     */
    normalize = function () {}

    /**
     * Return a perpendicular Vector.
     * @returns {Vec2}
     * @version 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#language-extensions
     * @since 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/3.2.0/Layouts.md?plain=1#L2263
     */
    perpendicular = function () {}

    /**
     * Return the Vector projected onto the given Vector.
     * @param {Vec2} vector The vector to project onto.
     * @returns {Vec2}
     * @version 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#language-extensions
     * @since 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/3.2.0/Layouts.md?plain=1#L2264
     */
    projectedOnto = function (vector) {}

    /**
     * Return a mix of the Vector with the given Vector.
     * @param {Vec2} vector The vector to mix with.
     * @param {float} x The mixing ratio, `0.0` = current, `1.0` = mixing vector.
     * @returns {Vec2}
     * @version 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#language-extensions
     * @since 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/3.2.0/Layouts.md?plain=1#L2265
     */
    mix = function (vector, x) {}

    /**
     * Return the Vector length squared, more performant than `len` (used for comparisons).
     * @returns {float}
     * @version 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#language-extensions
     * @since 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/3.2.0/Layouts.md?plain=1#L2266
     */
    lengthSquared = function () {}

    /**
     * Return the angle between the given Vector in radians.
     * @param {Vec2} vector The vector to find the angle between.
     * @returns {float}
     * @version 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#language-extensions
     * @since 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/3.2.0/Layouts.md?plain=1#L2267
     */
    angleTo = function (vector) {}

    /**
     * Return the distance to the given Vector.
     * @param {Vec2} vector The vector to find the distance to.
     * @returns {Vec2}
     * @version 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#language-extensions
     * @since 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/3.2.0/Layouts.md?plain=1#L2268
     */
    distance = function (vector) {}

    /**
     * Return the dot product with the given Vector.
     * @param {Vec2} vector The vector to find the dot product of.
     * @returns {Vec2}
     * @version 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#language-extensions
     * @since 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/3.2.0/Layouts.md?plain=1#L2269
     */
    dot = function (vector) {}

    /**
     * Return the cross product with the given Vector.
     * @param {Vec2} vector The vector to find the cross product of.
     * @returns {Vec2}
     * @version 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#language-extensions
     * @since 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/3.2.0/Layouts.md?plain=1#L2270
     */
    cross = function (vector) {}
}
