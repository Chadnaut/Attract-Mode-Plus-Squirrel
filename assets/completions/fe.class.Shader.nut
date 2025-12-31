/**
 * Attract-Mode Frontend
 *
 * @package fe.Shader
 * @global
 */

/**
 * A GLSL Shader for transforming texture pixels and/or vertices.
 *
 * This class can only be instantiated using:
 * - `fe.add_shader()`
 *
 * @ignore
 * @class
 * @type {feShader}
 * @alias fe.Shader
 * @version AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#feshader
 * @since AM_1.2.0 https://github.com/mickelson/attract/blob/v1.2.0/Layouts.md?plain=1#L872
 */
class feShader {
    /**
     * @ignore
     *
     * @property {Shader} type The Shader type
     * @version AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#feshader
     * @since AM_1.2.0 https://github.com/mickelson/attract/blob/v1.2.0/Layouts.md?plain=1#L880
     */
    function _get() {}

    /**
     * Sets the Shader's uniform parameter to the given `float`.
     * @param {string} uniform The name of the uniform variable.
     * @param {float} f The value to set.
     * @version AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#feshader
     * @since AM_1.2.0 https://github.com/mickelson/attract/blob/v1.2.0/Layouts.md?plain=1#L888
     */
    function set_param(uniform, f) {}

    /**
     * Sets the Shader's uniform parameter to the given `vec2(x, y)`.
     * @ignore
     * @param {string} uniform The name of the uniform variable.
     * @param {float} x The x component to set.
     * @param {float} y The y component to set.
     * @version AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#feshader
     * @since AM_1.2.0 https://github.com/mickelson/attract/blob/v1.2.0/Layouts.md?plain=1#L890
     */
    function set_param(uniform, x, y) {}

    /**
     * Sets the Shader's uniform parameter to the given `vec3(x, y, z)`.
     * @ignore
     * @param {string} uniform The name of the uniform variable.
     * @param {float} x The x component to set.
     * @param {float} y The y component to set.
     * @param {float} z The z component to set.
     * @version AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#feshader
     * @since AM_1.2.0 https://github.com/mickelson/attract/blob/v1.2.0/Layouts.md?plain=1#L892
     */
    function set_param(uniform, x, y, z) {}

    /**
     * Sets the Shader's uniform parameter to the given `vec4(x, y, z, w)`.
     * @ignore
     * @param {string} uniform The name of the uniform variable.
     * @param {float} x The x component to set.
     * @param {float} y The y component to set.
     * @param {float} z The z component to set.
     * @param {float} w The w component to set.
     * @version AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#feshader
     * @since AM_1.2.0 https://github.com/mickelson/attract/blob/v1.2.0/Layouts.md?plain=1#L894
     */
    function set_param(uniform, x, y, z, w) {}

    /**
     * Sets the Shader's uniform parameter to the `sampler2D` texture of the current element.
     * @param {string} uniform The name of the uniform variable.
     * @version AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#feshader
     * @since AM_1.2.0 https://github.com/mickelson/attract/blob/v1.2.0/Layouts.md?plain=1#L896
     */
    function set_texture_param(uniform) {}

    /**
     * Sets the Shader's uniform parameter to the `sampler2D` texture of the given element.
     * @ignore
     * @param {string} uniform The name of the uniform variable.
     * @param {fe.Image} element The element containing the texture to set.
     * @version AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#feshader
     * @since AM_1.2.0 https://github.com/mickelson/attract/blob/v1.2.0/Layouts.md?plain=1#L890
     */
    function set_texture_param(uniform, element) {}
}
