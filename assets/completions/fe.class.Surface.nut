/**
 * Attract-Mode Frontend
 *
 * @package fe.Surface
 * @global
 */

/**
 * An element for containing other elements.
 *
 * This class can only be instantiated using:
 * - `fe.add_surface()`
 *
 * @ignore
 * @class
 * @type {feSurface}
 * @alias fe.Surface
 * @version AM_1.3.0-beta1 https://github.com/mickelson/attract/blob/v1.3.0-beta1/Layouts.md?plain=1#L173
 */
class feSurface extends feImage {

    // ---------------------------------------------------------------------------------
    // #region PRESENTABLE

    /**
     * The x position of the element.
     * @relative To the top-left corner of the parent Surface.
     * @default `0`
     * @version AM_1.3.0-beta1 https://github.com/mickelson/attract/blob/v1.3.0-beta1/Layouts.md?plain=1#L730
     */
    x = 0.0;

    /**
     * The y position of the element.
     * @relative To the top-left corner of the parent Surface.
     * @default `0`
     * @version AM_1.3.0-beta1 https://github.com/mickelson/attract/blob/v1.3.0-beta1/Layouts.md?plain=1#L731
     */
    y = 0.0;

    /**
     * The width of the element.
     *
     * Use `0.0` to auto-size to the texture width.
     * @default `0.0`
     * @version AM_1.3.0-beta1 https://github.com/mickelson/attract/blob/v1.3.0-beta1/Layouts.md?plain=1#L732
     */
    width = 0.0;

    /**
     * The height of the element.
     *
     * Use `0.0` to auto-size to the texture height.
     * @default `0.0`
     * @version AM_1.3.0-beta1 https://github.com/mickelson/attract/blob/v1.3.0-beta1/Layouts.md?plain=1#L734
     */
    height = 0.0;

    /**
     * The visibility of the element.
     *
     * When not visible the element won't be drawn to the parent Surface.
     * @default `true`
     * @version AM_1.3.0-beta1 https://github.com/mickelson/attract/blob/v1.3.0-beta1/Layouts.md?plain=1#L736
     */
    visible = true;

    /**
     * Rotation of the element in clockwise degrees.
     * @relative To the `origin` or `rotation_origin`.
     * @default `0.0`
     * @version AM_1.3.0-beta1 https://github.com/mickelson/attract/blob/v1.3.0-beta1/Layouts.md?plain=1#L738
     */
    rotation = 0.0;

    /**
     * The red channel level `0...255`.
     *
     * Sent to the shader as `gl_Color.r` `0.0...1.0`.
     * @default `255`
     * @version AM_1.3.0-beta1 https://github.com/mickelson/attract/blob/v1.3.0-beta1/Layouts.md?plain=1#L740
     */
    red = 0;

    /**
     * The green channel level `0...255`.
     *
     * Sent to the shader as `gl_Color.g` `0.0...1.0`.
     * @default `255`
     * @version AM_1.3.0-beta1 https://github.com/mickelson/attract/blob/v1.3.0-beta1/Layouts.md?plain=1#L742
     */
    green = 0;

    /**
     * The blue channel level `0...255`.
     *
     * Sent to the shader as `gl_Color.b` `0.0...1.0`.
     * @default `255`
     * @version AM_1.3.0-beta1 https://github.com/mickelson/attract/blob/v1.3.0-beta1/Layouts.md?plain=1#L744
     */
    blue = 0;

    /**
     * The alpha channel level `0...255`.
     *
     * Sent to the shader as `gl_Color.a` `0.0...1.0`.
     * @default `255`
     * @version AM_1.3.0-beta1 https://github.com/mickelson/attract/blob/v1.3.0-beta1/Layouts.md?plain=1#L746
     */
    alpha = 0;

    /**
     * The Shader applied to the element's texture.
     * @version AM_1.3.0-beta1 https://github.com/mickelson/attract/blob/v1.3.0-beta1/Layouts.md?plain=1#L790
     */
    shader = feShader();

    /**
     * The drawing order of the element.
     * - Higher ordered elements are drawn on top.
     * - Identically ordered elements are drawn in order of creation.
     * @default `0`
     * @version AM_2.0.0-rc1 https://github.com/mickelson/attract/blob/v2.0.0-rc1/Layouts.md?plain=1#L1414
     */
    zorder = 0;

    // #endregion

    // ---------------------------------------------------------------------------------
    // #region PROPS

    /**
     * The x position of the origin.
     *
     * The origin is the centre point for positioning, scaling and rotation.
     * @relative To the top-left corner of the element.
     * @default `0.0`
     * @version AM_2.2.0 https://github.com/mickelson/attract/blob/v2.2.0/Layouts.md?plain=1#L1403
     */
    origin_x = 0.0;

    /**
     * The y position of the origin.
     *
     * The origin is the centre point for positioning, scaling and rotation.
     * @relative To the top-left corner of the element.
     * @default `0.0`
     * @version AM_2.2.0 https://github.com/mickelson/attract/blob/v2.2.0/Layouts.md?plain=1#L1406
     */
    origin_y = 0.0;

    /**
     * The horizontal offset of the texture's bottom edge.
     * @default `0.0`
     * @version AM_1.3.0-beta1 https://github.com/mickelson/attract/blob/v1.3.0-beta1/Layouts.md?plain=1#L752
     */
    skew_x = 0.0;

    /**
     * The vertical offset of the texture's right edge.
     * @default `0.0`
     * @version AM_1.3.0-beta1 https://github.com/mickelson/attract/blob/v1.3.0-beta1/Layouts.md?plain=1#L755
     */
    skew_y = 0.0;

    /**
     * The horizontal inset of the texture's bottom corners.
     * @default `0.0`
     * @version AM_1.3.0-beta1 https://github.com/mickelson/attract/blob/v1.3.0-beta1/Layouts.md?plain=1#L758
     */
    pinch_x = 0.0;

    /**
     * The vertical inset of the texture's right corners.
     * @default `0.0`
     * @version AM_1.3.0-beta1 https://github.com/mickelson/attract/blob/v1.3.0-beta1/Layouts.md?plain=1#L761
     */
    pinch_y = 0.0;

    /**
     * The x position of the texture's sub-image.
     *
     * The sub-image is the slice of the texture used for display.
     * @default `0.0`
     * @version AM_1.3.0-beta1 https://github.com/mickelson/attract/blob/v1.3.0-beta1/Layouts.md?plain=1#L766
     */
    subimg_x = 0.0;

    /**
     * The y position of the texture's sub-image.
     *
     * The sub-image is the slice of the texture used for display.
     * @default `0.0`
     * @version AM_1.3.0-beta1 https://github.com/mickelson/attract/blob/v1.3.0-beta1/Layouts.md?plain=1#L768
     */
    subimg_y = 0.0;

    /**
     * The width of the texture's sub-image.
     *
     * Negative values flip the texture horizontally.
     *
     * The sub-image is the slice of the texture used for display.
     * @default `texture_width`
     * @version AM_1.3.0-beta1 https://github.com/mickelson/attract/blob/v1.3.0-beta1/Layouts.md?plain=1#L770
     */
    subimg_width = 0.0;

    /**
     * The height of the texture's sub-image.
     *
     * Negative values flip the texture vertically.
     *
     * The sub-image is the slice of the texture used for display.
     * @default `texture_height`
     * @version AM_1.3.0-beta1 https://github.com/mickelson/attract/blob/v1.3.0-beta1/Layouts.md?plain=1#L772
     */
    subimg_height = 0.0;

    /**
     * Set the anchor preset.
     *
     * The anchor is the centre point for positioning and scaling.
     * @default `Anchor.TopLeft`
     * @version 🔶AM+_3.0.0 https://github.com/oomek/attractplus/blob/3.0.0/Layouts.md?plain=1#L1640
     */
    anchor = Anchor;

    /**
     * The x position of the anchor `0.0...1.0`.
     *
     * The anchor is the centre point for positioning and scaling.
     * @relative To the top-left corner of the element.
     * @default `0.0`
     * @version 🔶AM+_3.0.5 https://github.com/oomek/attractplus/blob/3.0.5/Layouts.md?plain=1#L1662
     */
    anchor_x = 0.0;

    /**
     * The y position of the anchor `0.0...1.0`.
     *
     * The anchor is the centre point for positioning and scaling.
     * @relative To the top-left corner of the element.
     * @default `0.0`
     * @version 🔶AM+_3.0.5 https://github.com/oomek/attractplus/blob/3.0.5/Layouts.md?plain=1#L1664
     */
    anchor_y = 0.0;

    /**
     * Set the rotation_origin preset.
     *
     * The rotation_origin is the centre for rotation.
     * @default `Origin.TopLeft`
     * @version 🔶AM+_3.0.5 https://github.com/oomek/attractplus/blob/3.0.5/Layouts.md?plain=1#L1651
     */
    rotation_origin = Origin;

    /**
     * The x position of the rotation_origin `0.0...1.0`.
     *
     * The rotation_origin is the centre for rotation.
     * @relative To the top-left corner of the element.
     * @default `0.0`
     * @version 🔶AM+_3.0.5 https://github.com/oomek/attractplus/blob/3.0.5/Layouts.md?plain=1#L1666
     */
    rotation_origin_x = 0.0;

    /**
     * The y position of the rotation_origin `0.0...1.0`.
     *
     * The rotation_origin is the centre for rotation.
     * @relative To the top-left corner of the element.
     * @default `0.0`
     * @version 🔶AM+_3.0.5 https://github.com/oomek/attractplus/blob/3.0.5/Layouts.md?plain=1#L1668
     */
    rotation_origin_y = 0.0;

    /**
     * Letterbox the texture within the element to maintain its aspect ratio.
     * @default `false`
     * @version AM_1.3.0-beta1 https://github.com/mickelson/attract/blob/v1.3.0-beta1/Layouts.md?plain=1#L785
     */
    preserve_aspect_ratio = false;

    /**
     * Enable interpolation to give the texture a softer appearance when scaled up.
     * @default `true`
     * @version AM_1.5.2 https://github.com/mickelson/attract/blob/v1.5.2/Layouts.md?plain=1#L1204
     */
    smooth = true;

    /**
     * Enable mipmapping to improve the texture quality when scaled down.
     *
     * Required for Shaders to use texture2D `bias` arguments.
     * @default `false`
     * @version AM_2.4.0 https://github.com/mickelson/attract/blob/v2.4.0/Layouts.md?plain=1#L1481
     */
    mipmap = false;

    /**
     * Blend the texture with the elements drawn beneath it.
     * @default `BlendMode.Alpha`
     * @version AM_2.4.0 https://github.com/mickelson/attract/blob/v2.4.0/Layouts.md?plain=1#L1472
     */
    blend_mode = BlendMode;

    /**
     * Tile the texture sub-image when offset by `subimg` properties.
     *
     * Prevents the clamped edges *stretching* to fill the offset space.
     * @default `false`
     * @version 🔶AM+_3.0.0 https://github.com/oomek/attractplus/blob/3.0.0/Layouts.md?plain=1#L1706
     */
    repeat = false;

    /**
     * @ignore
     *
     * @property {integer} texture_width
     * The width of the texture.
     * @dynamic Updated on `FromOldSelection` and `ToNewList` Transitions.
     * @version AM_1.3.0-beta1 https://github.com/mickelson/attract/blob/v1.3.0-beta1/Layouts.md?plain=1#L764
     *
     * @property {integer} texture_height
     * The height of the texture.
     * @dynamic Updated on `FromOldSelection` and `ToNewList` Transitions.
     * @version AM_1.3.0-beta1 https://github.com/mickelson/attract/blob/v1.3.0-beta1/Layouts.md?plain=1#L765
     *
     * @property {float} sample_aspect_ratio
     * The pixel aspect ratio of the texture.
     *
     * Non-square ratios require the artwork to be stretched for display.
     * ```
     * // how ratio affects the display size
     * 224x768 @ 2.57143  = 576x768
     * 512x224 @ 0.583333 = 512x384
     * ```
     * @dynamic Updated on `FromOldSelection` and `ToNewList` Transitions.
     * @version AM_2.6.1 https://github.com/mickelson/attract/blob/v2.6.1/Layouts.md?plain=1#L1530
     */
    function _get() {}

    /**
     * Blend the texture with the elements drawn beneath it.
     * @default `BlendMode.Premultiplied`
     * @version AM_2.4.0 https://github.com/mickelson/attract/blob/v2.4.0/Layouts.md?plain=1#L1472
     */
    blend_mode = BlendMode;

    /**
     * Clear the texture before drawing new content to it.
     * @default `true`
     * @version 🔶AM+_3.0.0 https://github.com/oomek/attractplus/blob/3.0.0/Layouts.md?plain=1#L1708
     */
    clear = true;

    /**
     * Allow new content to be drawn to the texture.
     * @default `true`
     * @version 🔶AM+_3.0.0 https://github.com/oomek/attractplus/blob/3.0.0/Layouts.md?plain=1#L1710
     */
    redraw = true;

    // #endregion

    // ---------------------------------------------------------------------------------
    // #region FUNC

    /**
     * Sets the position of the element.
     * @param {float} x The x position of the element.
     * @param {float} y The y position of the element.
     * @version AM_1.3.0-beta1 https://github.com/mickelson/attract/blob/v1.3.0-beta1/Layouts.md?plain=1#L797
     */
    function set_pos(x, y) {}

    /**
     * Sets the position and size of the element.
     * @ignore
     * @param {float} x The x position of the element.
     * @param {float} y The y position of the element.
     * @param {float} width The width of the element.
     * @param {float} height The height of the element.
     * @version AM_1.3.0-beta1 https://github.com/mickelson/attract/blob/v1.3.0-beta1/Layouts.md?plain=1#L798
     */
    function set_pos(x, y, width, height) {}

    /**
     * Sets the colour channel levels.
     * @param {integer} r The red channel level `0...255`.
     * @param {integer} g The green channel level `0...255`.
     * @param {integer} b The blue channel level `0...255`.
     * @version AM_1.3.0-beta1 https://github.com/mickelson/attract/blob/v1.3.0-beta1/Layouts.md?plain=1#L795
     */
    function set_rgb(r, g, b) {}

    /**
     * Sets the position of the anchor.
     *
     * The anchor is a point relative to the element used as the centre for positioning and scaling.
     * @param {float} x The x position of the anchor `0.0...1.0`.
     * @param {float} y The y position of the anchor `0.0...1.0`.
     * @version 🔶AM+_3.0.0 https://github.com/oomek/attractplus/blob/3.0.0/Layouts.md?plain=1#L1721
     */
    function set_anchor(x, y) {}

    /**
     * Set the position of the rotation_origin.
     *
     * The rotation_origin is a point relative to the element used as the centre for rotation.
     * @param {float} x The x position of the rotation_origin `0.0...1.0`.
     * @param {float} y The y position of the rotation_origin `0.0...1.0`.
     * @version 🔶AM+_3.0.5 https://github.com/oomek/attractplus/blob/3.0.5/Layouts.md?plain=1#L1731
     */
    function set_rotation_origin(x, y) {}

    /**
     * Swaps this element's texture with given element's texture.
     * - Includes video properties, allowing uninterrupted playback.
     * - Cloned elements update to reflect their source element.
     * @param {fe.Image} element The element to swap textures with.
     * @version AM_1.4.1 https://github.com/mickelson/attract/blob/v1.4.1/Layouts.md?plain=1#L1064
     */
    function swap(element) {}

    /**
     * Makes all texture colours matching the top-left pixel transparent.
     * @version AM_1.5.0 https://github.com/mickelson/attract/blob/v1.5.0/Layouts.md?plain=1#L1123
     */
    function fix_masked_image() {}

    /**
     * @inheritdoc
     * @version AM_1.3.0-beta1 https://github.com/mickelson/attract/blob/v1.3.0-beta1/Layouts.md?plain=1#L800
     */
    add_image = add_image1;
    /**
     * @inheritdoc
     * @version AM_1.3.0-beta1 https://github.com/mickelson/attract/blob/v1.3.0-beta1/Layouts.md?plain=1#L800
     */
    add_image = add_image2;
    /**
     * @inheritdoc
     * @version AM_1.3.0-beta1 https://github.com/mickelson/attract/blob/v1.3.0-beta1/Layouts.md?plain=1#L800
     */
    add_image = add_image3;
    /**
     * @inheritdoc
     * @version AM_1.3.0-beta1 https://github.com/mickelson/attract/blob/v1.3.0-beta1/Layouts.md?plain=1#L803
     */
    add_artwork = add_artwork1;
    /**
     * @inheritdoc
     * @version AM_1.3.0-beta1 https://github.com/mickelson/attract/blob/v1.3.0-beta1/Layouts.md?plain=1#L803
     */
    add_artwork = add_artwork2;
    /**
     * @inheritdoc
     * @version AM_1.3.0-beta1 https://github.com/mickelson/attract/blob/v1.3.0-beta1/Layouts.md?plain=1#L803
     */
    add_artwork = add_artwork3;
    /**
     * @inheritdoc
     * @version AM_1.3.0-beta1 https://github.com/mickelson/attract/blob/v1.3.0-beta1/Layouts.md?plain=1#L806
     */
    add_clone = add_clone1;
    /**
     * @inheritdoc
     * @version AM_1.3.0-beta1 https://github.com/mickelson/attract/blob/v1.3.0-beta1/Layouts.md?plain=1#L809
     */
    add_text = add_text1;
    /**
     * @inheritdoc
     * @version AM_1.3.0-beta1 https://github.com/mickelson/attract/blob/v1.3.0-beta1/Layouts.md?plain=1#L811
     */
    add_listbox = add_listbox1;
    /**
     * @inheritdoc
     * @version AM_1.3.0-beta1 https://github.com/mickelson/attract/blob/v1.3.0-beta1/Layouts.md?plain=1#L814
     */
    add_surface = add_surface1;
    /**
     * @inheritdoc
     * @version 🔶AM+_3.1.0 https://github.com/oomek/attractplus/blob/3.1.0/Layouts.md?plain=1
     */
    add_surface = add_surface2;
    /**
     * @inheritdoc
     * @version 🔶AM+_3.0.0 https://github.com/oomek/attractplus/blob/3.0.0/Layouts.md?plain=1#L451
     */
    add_rectangle = add_rectangle1;

    // #endregion
}
