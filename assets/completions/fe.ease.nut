/**
 * Attract-Mode Frontend
 *
 * @package Ease
 * @global
 */

/**
 * @ignore
 * @param {float} t Current time `0...d`.
 * @param {float} b Beginning value, when `t == 0` then `b` is returned.
 * @param {float} c Change in value, when `t == d` then `b + c` is returned.
 * @param {float} d Duration, the maximum value of `t`.
 * @returns {float}
 * @version 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#easing-
 * @since 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#easing-
 */
function ease1(t, b, c, d) {}

/**
 * @ignore
 * @param {float} t Current time `0...d`.
 * @param {float} b Beginning value, when `t == 0` then `b` is returned.
 * @param {float} c Change in value, when `t == d` then `b + c` is returned.
 * @param {float} d Duration, the maximum value of `t`.
 * @param {float} p Period of the bounce, default `0.5`.
 * @returns {float}
 * @version 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#easing-
 * @since 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#easing-
 */
function ease1_bounce2(t, b, c, d, p = 0) {}

/**
 * @ignore
 * @param {float} t Current time `0...d`.
 * @param {float} b Beginning value, when `t == 0` then `b` is returned.
 * @param {float} c Change in value, when `t == d` then `b + c` is returned.
 * @param {float} d Duration, the maximum value of `t`.
 * @param {float} p Strength of the overshoot, default `1.70158`.
 * @returns {float}
 * @version 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#easing-
 * @since 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#easing-
 */
function ease1_back(t, b, c, d, s = 0) {}

/**
 * @ignore
 * @param {float} t Current time `0...d`.
 * @param {float} b Beginning value, when `t == 0` then `b` is returned.
 * @param {float} c Change in value, when `t == d` then `b + c` is returned.
 * @param {float} d Duration, the maximum value of `t`.
 * @param {float} a Amplitude of the wave, default `0.0`.
 * @param {float} p Period of the wave, default `d * 0.3`.
 * @returns {float}
 * @version 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#easing-
 * @since 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#easing-
 */
function ease1_elastic(t, b, c, d, a = 0, p = 0) {}

/**
 * @ignore
 * @param {float} t Current time `0...d`.
 * @param {float} b Beginning value, when `t == 0` then `b` is returned.
 * @param {float} c Change in value, when `t == d` then `b + c` is returned.
 * @param {float} d Duration, the maximum value of `t`.
 * @param {float} p Period of the wave, default `0.3`.
 * @returns {float}
 * @version 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#easing-
 * @since 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#easing-
 */
function ease1_elastic2(t, b, c, d, p = 0) {}

/**
 * Easing functions
 * @class
 * @type {ease}
 * @version 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#functions
 * @since 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/3.2.0/Layouts.md?plain=1#2274
 */
ease <- {
    /** @inheritdoc */
    in_quad = ease1,
    /** @inheritdoc */
    out_quad = ease1,
    /** @inheritdoc */
    in_out_quad = ease1,
    /** @inheritdoc */
    out_in_quad = ease1,

    /** @inheritdoc */
    in_cubic = ease1,
    /** @inheritdoc */
    out_cubic = ease1,
    /** @inheritdoc */
    in_out_cubic = ease1,
    /** @inheritdoc */
    out_in_cubic = ease1,

    /** @inheritdoc */
    in_quart = ease1,
    /** @inheritdoc */
    out_quart = ease1,
    /** @inheritdoc */
    in_out_quart = ease1,
    /** @inheritdoc */
    out_in_quart = ease1,

    /** @inheritdoc */
    in_quint = ease1,
    /** @inheritdoc */
    out_quint = ease1,
    /** @inheritdoc */
    in_out_quint = ease1,
    /** @inheritdoc */
    out_in_quint = ease1,

    /** @inheritdoc */
    in_sine = ease1,
    /** @inheritdoc */
    out_sine = ease1,
    /** @inheritdoc */
    in_out_sine = ease1,
    /** @inheritdoc */
    out_in_sine = ease1,

    /** @inheritdoc */
    in_expo = ease1,
    /** @inheritdoc */
    out_expo = ease1,
    /** @inheritdoc */
    in_out_expo = ease1,
    /** @inheritdoc */
    out_in_expo = ease1,

    /** @inheritdoc */
    in_expo2 = ease1,
    /** @inheritdoc */
    out_expo2 = ease1,
    /** @inheritdoc */
    in_out_expo2 = ease1,
    /** @inheritdoc */
    out_in_expo2 = ease1,

    /** @inheritdoc */
    in_circ = ease1,
    /** @inheritdoc */
    out_circ = ease1,
    /** @inheritdoc */
    in_out_circ = ease1,
    /** @inheritdoc */
    out_in_circ = ease1,

    /** @inheritdoc */
    in_bounce = ease1,
    /** @inheritdoc */
    out_bounce = ease1,
    /** @inheritdoc */
    in_out_bounce = ease1,
    /** @inheritdoc */
    out_in_bounce = ease1,

    /** @inheritdoc */
    in_bounce2 = ease1_bounce2,
    /** @inheritdoc */
    out_bounce2 = ease1_bounce2,
    /** @inheritdoc */
    in_out_bounce2 = ease1_bounce2,
    /** @inheritdoc */
    out_in_bounce2 = ease1_bounce2,

    /** @inheritdoc */
    in_back = ease1_back,
    /** @inheritdoc */
    out_back = ease1_back,
    /** @inheritdoc */
    in_out_back = ease1_back,
    /** @inheritdoc */
    out_in_back = ease1_back,

    /** @inheritdoc */
    in_back2 = ease1,
    /** @inheritdoc */
    out_back2 = ease1,
    /** @inheritdoc */
    in_out_back2 = ease1,
    /** @inheritdoc */
    out_in_back2 = ease1,

    /** @inheritdoc */
    in_elastic = ease1_elastic,
    /** @inheritdoc */
    out_elastic = ease1_elastic,
    /** @inheritdoc */
    in_out_elastic = ease1_elastic,
    /** @inheritdoc */
    out_in_elastic = ease1_elastic,

    /** @inheritdoc */
    in_elastic2 = ease1_elastic2,
    /** @inheritdoc */
    out_elastic2 = ease1_elastic2,
    /** @inheritdoc */
    in_out_elastic2 = ease1_elastic2,
    /** @inheritdoc */
    out_in_elastic2 = ease1_elastic2,

    /** @inheritdoc */
    linear = ease1,

    /**
     * @param {float} t Current time `0...d`.
     * @param {float} b Beginning value, when `t == 0` then `b` is returned.
     * @param {float} c Change in value, when `t == d` then `b + c` is returned.
     * @param {float} d Duration, the maximum value of `t`.
     * @param {float} x1 The x value of the first control point.
     * @param {float} y1 The y value of the first control point.
     * @param {float} x2 The x value of the second control point.
     * @param {float} y2 The y value of the second control point.
     * @returns {float}
     * @version 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#easing-
     * @since 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#easing-
     */
    bezier = function (t, b, c, d, x1, y1, x2, y2) {},

    /**
     * @param {float} t Current time `0...d`.
     * @param {float} b Beginning value, when `t == 0` then `b` is returned.
     * @param {float} c Change in value, when `t == d` then `b + c` is returned.
     * @param {float} d Duration, the maximum value of `t`.
     * @param {integer} s The number of steps.
     * @param {Jump} j The stepping mode, default `Jump.End`.
     * @returns {float}
     * @version 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#easing-
     * @since 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#easing-
     */
    steps = function (t, b, c, d, s, j) {},

}
