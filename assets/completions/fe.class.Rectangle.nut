/**
 * Attract-Mode Frontend
 *
 * @package fe.Rectangle
 * @global
 */

/**
 * An element for displaying rectangles.
 *
 * This class can only be instantiated using:
 * - `fe.add_rectangle()`
 *
 * @ignore
 * @class
 * @type {feRectangle}
 * @alias fe.Rectangle
 * @version 🔶AM+_3.0.0 https://github.com/oomek/attractplus/blob/3.0.0/Layouts.md?plain=1#L2032
 */
class feRectangle {

    // ---------------------------------------------------------------------------------
    // #region PRESENTABLE

    /**
     * The x position of the element.
     * @relative To the top-left corner of the parent Surface.
     * @default `0`
     * @version 🔶AM+_3.0.0 https://github.com/oomek/attractplus/blob/3.0.0/Layouts.md?plain=1#L2041
     */
    x = 0.0;

    /**
     * The y position of the element.
     * @relative To the top-left corner of the parent Surface.
     * @default `0`
     * @version 🔶AM+_3.0.0 https://github.com/oomek/attractplus/blob/3.0.0/Layouts.md?plain=1#L2042
     */
    y = 0.0;

    /**
     * The width of the element.
     * @default `0`
     * @version 🔶AM+_3.0.0 https://github.com/oomek/attractplus/blob/3.0.0/Layouts.md?plain=1#L2043
     */
    width = 0.0;

    /**
     * The height of the element.
     * @default `0`
     * @version 🔶AM+_3.0.0 https://github.com/oomek/attractplus/blob/3.0.0/Layouts.md?plain=1#L2045
     */
    height = 0.0;

    /**
     * The visibility of the element.
     *
     * When not visible the element won't be drawn to the parent Surface.
     * @default `true`
     * @version 🔶AM+_3.0.0 https://github.com/oomek/attractplus/blob/3.0.0/Layouts.md?plain=1#L2047
     */
    visible = true;

    /**
     * Rotation of the element in clockwise degrees.
     * @relative To the `origin` or `rotation_origin`.
     * @default `0.0`
     * @version 🔶AM+_3.0.0 https://github.com/oomek/attractplus/blob/3.0.0/Layouts.md?plain=1#L2049
     */
    rotation = 0.0;

    /**
     * The red channel level for the background `0...255`.
     * @default `255`
     * @version 🔶AM+_3.0.0 https://github.com/oomek/attractplus/blob/3.0.0/Layouts.md?plain=1#L2051
     */
    red = 0;

    /**
     * The green channel level for the background `0...255`.
     * @default `255`
     * @version 🔶AM+_3.0.0 https://github.com/oomek/attractplus/blob/3.0.0/Layouts.md?plain=1#L2053
     */
    green = 0;

    /**
     * The blue channel level for the background `0...255`.
     * @default `255`
     * @version 🔶AM+_3.0.0 https://github.com/oomek/attractplus/blob/3.0.0/Layouts.md?plain=1#L2055
     */
    blue = 0;

    /**
     * The alpha channel level for the background `0...255`.
     * @default `255`
     * @version 🔶AM+_3.0.0 https://github.com/oomek/attractplus/blob/3.0.0/Layouts.md?plain=1#L2057
     */
    alpha = 0;

    /**
     * The Shader applied to the element's texture.
     * @version 🔶AM+_3.0.0 https://github.com/oomek/attractplus/blob/3.0.0/Layouts.md?plain=1#L2097
     */
    shader = feShader();

    /**
     * The drawing order of the element.
     * - Higher ordered elements are drawn on top.
     * - Identically ordered elements are drawn in order of creation.
     * @default `0`
     * @version 🔶AM+_3.0.0 https://github.com/oomek/attractplus/blob/3.0.0/Layouts.md?plain=1#L2099
     */
    zorder = 0;

    // #endregion

    // ---------------------------------------------------------------------------------
    // #region PROPS

    /**
     * The rectangle outline thickness.
     * @default `0.0`
     * @version 🔶AM+_3.0.0 https://github.com/oomek/attractplus/blob/3.0.0/Layouts.md?plain=1#L2059
     */
    outline = 0.0;

    /**
     * The red channel level for the outline `0...255`.
     * @default `255`
     * @version 🔶AM+_3.0.0 https://github.com/oomek/attractplus/blob/3.0.0/Layouts.md?plain=1#L2061
     */
    outline_red = 0;

    /**
     * The green channel level for the outline `0...255`.
     * @default `255`
     * @version 🔶AM+_3.0.0 https://github.com/oomek/attractplus/blob/3.0.0/Layouts.md?plain=1#L2063
     */
    outline_green = 0;

    /**
     * The blue channel level for the outline `0...255`.
     * @default `255`
     * @version 🔶AM+_3.0.0 https://github.com/oomek/attractplus/blob/3.0.0/Layouts.md?plain=1#L2065
     */
    outline_blue = 0;

    /**
     * The alpha channel level for the outline `0...255`.
     * @default `255`
     * @version 🔶AM+_3.0.0 https://github.com/oomek/attractplus/blob/3.0.0/Layouts.md?plain=1#L2067
     */
    outline_alpha = 0;

    /**
     * The x position of the origin.
     *
     * The origin is the centre point for positioning, scaling and rotation.
     * @relative To the top-left corner of the element.
     * @default `0.0`
     * @version 🔶AM+_3.0.0 https://github.com/oomek/attractplus/blob/3.0.0/Layouts.md?plain=1#L2069
     */
    origin_x = 0.0;

    /**
     * The y position of the origin.
     *
     * The origin is the centre point for positioning, scaling and rotation.
     * @relative To the top-left corner of the element.
     * @default `0.0`
     * @version 🔶AM+_3.0.0 https://github.com/oomek/attractplus/blob/3.0.0/Layouts.md?plain=1#L2072
     */
    origin_y = 0.0;

    /**
     * Set the anchor preset.
     *
     * The anchor is the centre point for positioning and scaling.
     * @default `Anchor.TopLeft`
     * @version 🔶AM+_3.0.0 https://github.com/oomek/attractplus/blob/3.0.0/Layouts.md?plain=1#L2075
     */
    anchor = Anchor;

    /**
     * The x position of the anchor `0.0...1.0`.
     *
     * The anchor is the centre point for positioning and scaling.
     * @relative To the top-left corner of the element.
     * @default `0.0`
     * @version 🔶AM+_3.0.5 https://github.com/oomek/attractplus/blob/3.0.5/Layouts.md?plain=1#L2105
     */
    anchor_x = 0.0;

    /**
     * The y position of the anchor `0.0...1.0`.
     *
     * The anchor is the centre point for positioning and scaling.
     * @relative To the top-left corner of the element.
     * @default `0.0`
     * @version 🔶AM+_3.0.5 https://github.com/oomek/attractplus/blob/3.0.5/Layouts.md?plain=1#L2107
     */
    anchor_y = 0.0;

    /**
     * Set the rotation_origin preset.
     *
     * The rotation_origin is the centre for rotation.
     * @default `Origin.TopLeft`
     * @version 🔶AM+_3.0.5 https://github.com/oomek/attractplus/blob/3.0.5/Layouts.md?plain=1#L2094
     */
    rotation_origin = Origin;

    /**
     * The x position of the rotation_origin `0.0...1.0`.
     *
     * The rotation_origin is the centre for rotation.
     * @relative To the top-left corner of the element.
     * @default `0.0`
     * @version 🔶AM+_3.0.5 https://github.com/oomek/attractplus/blob/3.0.5/Layouts.md?plain=1#L2109
     */
    rotation_origin_x = 0.0;

    /**
     * The y position of the rotation_origin `0.0...1.0`.
     *
     * The rotation_origin is the centre for rotation.
     * @relative To the top-left corner of the element.
     * @default `0.0`
     * @version 🔶AM+_3.0.5 https://github.com/oomek/attractplus/blob/3.0.5/Layouts.md?plain=1#L2111
     */
    rotation_origin_y = 0.0;

    /**
     * The corner radius.
     *
     * This property will auto-adjust to preserve roundness.
     * @default `0.0`
     * @version 🔶AM+_3.1.0 https://github.com/oomek/attractplus/blob/3.1.0/Layouts.md?plain=1
     */

    /**
     * The corner x radius.
     * @default `0.0`
     * @version 🔶AM+_3.1.0 https://github.com/oomek/attractplus/blob/3.1.0/Layouts.md?plain=1
     */
    corner_radius_x = 0.0;

    /**
     * The corner y radius.
     * @default `0.0`
     * @version 🔶AM+_3.1.0 https://github.com/oomek/attractplus/blob/3.1.0/Layouts.md?plain=1
     */
    corner_radius_y = 0.0;

    /**
     * The corner radius, as a fraction of the smallest side `0.0...0.5`.
     *
     * This property will auto-adjust to preserve roundness.
     * @default `0.0`
     * @version 🔶AM+_3.1.0 https://github.com/oomek/attractplus/blob/3.1.0/Layouts.md?plain=1
     */

    /**
     * The corner x radius, as a fraction of the width `0.0...0.5`.
     * @default `0.0`
     * @version 🔶AM+_3.1.0 https://github.com/oomek/attractplus/blob/3.1.0/Layouts.md?plain=1
     */
    corner_ratio_x = 0.0;

    /**
     * The corner y radius, as a fraction of the height `0.0...0.5`.
     * @default `0.0`
     * @version 🔶AM+_3.1.0 https://github.com/oomek/attractplus/blob/3.1.0/Layouts.md?plain=1
     */
    corner_ratio_y = 0.0;

    /**
     * The number of points used to draw the corner radius.
     *
     * More points produce smooth curves, while fewer points result in flat bevels.
     * @default `12`
     * @version 🔶AM+_3.1.0 https://github.com/oomek/attractplus/blob/3.1.0/Layouts.md?plain=1
     */
    corner_points = 0;

    /**
     * Blend the texture with the elements drawn beneath it.
     * @default `BlendMode.Alpha`
     * @version 🔶AM+_3.0.0 https://github.com/oomek/attractplus/blob/3.0.0/Layouts.md?plain=1#L2102
     */
    blend_mode = BlendMode;

    // #endregion

    // ---------------------------------------------------------------------------------
    // #region FUNC

    /**
     * Sets the position of the element.
     * @param {float} x The x position of the element.
     * @param {float} y The y position of the element.
     * @version 🔶AM+_3.0.0 https://github.com/oomek/attractplus/blob/3.0.0/Layouts.md?plain=1#L2116
     */
    function set_pos(x, y) {}

    /**
     * Sets the position and size of the element.
     * @ignore
     * @param {float} x The x position of the element.
     * @param {float} y The y position of the element.
     * @param {float} width The width of the element.
     * @param {float} height The height of the element.
     * @version 🔶AM+_3.0.0 https://github.com/oomek/attractplus/blob/3.0.0/Layouts.md?plain=1#L2117
     */
    function set_pos(x, y, width, height) {}

    /**
     * Sets the colour channel levels for the background.
     * @param {integer} r The red channel level `0...255`.
     * @param {integer} g The green channel level `0...255`.
     * @param {integer} b The blue channel level `0...255`.
     * @version 🔶AM+_3.0.0 https://github.com/oomek/attractplus/blob/3.0.0/Layouts.md?plain=1#L2114
     */
    function set_rgb(r, g, b) {}

    /**
     * Sets the colour channel levels for the outline.
     * @param {integer} r The red channel level `0...255`.
     * @param {integer} g The green channel level `0...255`.
     * @param {integer} b The blue channel level `0...255`.
     * @version 🔶AM+_3.0.0 https://github.com/oomek/attractplus/blob/3.0.0/Layouts.md?plain=1#L2119
     */
    function set_outline_rgb(r, g, b) {}

    /**
     * Sets the position of the anchor.
     *
     * The anchor is a point relative to the element used as the centre for positioning and scaling.
     * @param {float} x The x position of the anchor `0.0...1.0`.
     * @param {float} y The y position of the anchor `0.0...1.0`.
     * @version 🔶AM+_3.0.0 https://github.com/oomek/attractplus/blob/3.0.0/Layouts.md?plain=1#L2121
     */
    function set_anchor(x, y) {}

    /**
     * Set the position of the rotation_origin.
     *
     * The rotation_origin is a point relative to the element used as the centre for rotation.
     * @param {float} x The x position of the rotation_origin `0.0...1.0`.
     * @param {float} y The y position of the rotation_origin `0.0...1.0`.
     * @version 🔶AM+_3.0.5 https://github.com/oomek/attractplus/blob/3.0.5/Layouts.md?plain=1#L2139
     */
    function set_rotation_origin(x, y) {}

    /**
     * Set the corner radius.
     * @param {float} x The corner x radius.
     * @param {float} y The corner y radius.
     * @version 🔶AM+_3.1.0 https://github.com/oomek/attractplus/blob/3.1.0/Layouts.md?plain=1
     */
    function set_corner_radius(x, y) {}

    /**
     * Set the corner ratio.
     * @param {float} x The corner x radius, as a fraction of the width `0.0...0.5`.
     * @param {float} y The corner y radius, as a fraction of the height `0.0...0.5`.
     * @version 🔶AM+_3.1.0 https://github.com/oomek/attractplus/blob/3.1.0/Layouts.md?plain=1
     */
    function set_corner_ratio(x, y) {}

    // #endregion
}
