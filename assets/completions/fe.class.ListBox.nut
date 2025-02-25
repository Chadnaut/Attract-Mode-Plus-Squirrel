/**
 * Attract-Mode Frontend
 *
 * @package fe.ListBox
 * @global
 */

/**
 * An element for displaying menu options.
 *
 * This class can only be instantiated using:
 * - `fe.add_listbox()`
 *
 * @ignore
 * @class
 * @type {feListBox}
 * @alias fe.ListBox
 * @version AM_1.0.2 https://github.com/mickelson/attract/blob/v1.0.2/Layouts.md?plain=1#L584
 */
class feListBox {

    // ---------------------------------------------------------------------------------
    // #region PRESENTABLE

    /**
     * The x position of the element.
     * @relative To the top-left corner of the parent Surface.
     * @default `0`
     * @version AM_1.0.2 https://github.com/mickelson/attract/blob/v1.0.2/Layouts.md?plain=1#L593
     */
    x = 0.0;

    /**
     * The y position of the element.
     * @relative To the top-left corner of the parent Surface.
     * @default `0`
     * @version AM_1.0.2 https://github.com/mickelson/attract/blob/v1.0.2/Layouts.md?plain=1#L594
     */
    y = 0.0;

    /**
     * The width of the element.
     * @default `0`
     * @version AM_1.0.2 https://github.com/mickelson/attract/blob/v1.0.2/Layouts.md?plain=1#L595
     */
    width = 0.0;

    /**
     * The height of the element.
     * @default `0`
     * @version AM_1.0.2 https://github.com/mickelson/attract/blob/v1.0.2/Layouts.md?plain=1#L596
     */
    height = 0.0;

    /**
     * The visibility of the element.
     *
     * When not visible the element won't be drawn to the parent Surface.
     * @default `true`
     * @version AM_1.0.2 https://github.com/mickelson/attract/blob/v1.0.2/Layouts.md?plain=1#L597
     */
    visible = true;

    /**
     * Rotation of the element in clockwise degrees.
     * @relative To the `origin` or `rotation_origin`.
     * @default `0.0`
     * @version AM_1.0.2 https://github.com/mickelson/attract/blob/v1.0.2/Layouts.md?plain=1#L598
     */
    rotation = 0.0;

    /**
     * The red channel level for the text `0...255`.
     * @default `255`
     * @version AM_1.0.2 https://github.com/mickelson/attract/blob/v1.0.2/Layouts.md?plain=1#L601
     */
    red = 0;

    /**
     * The green channel level for the text `0...255`.
     * @default `255`
     * @version AM_1.0.2 https://github.com/mickelson/attract/blob/v1.0.2/Layouts.md?plain=1#L603
     */
    green = 0;

    /**
     * The blue channel level for the text `0...255`.
     * @default `255`
     * @version AM_1.0.2 https://github.com/mickelson/attract/blob/v1.0.2/Layouts.md?plain=1#L605
     */
    blue = 0;

    /**
     * The alpha channel level for the text `0...255`.
     * @default `255`
     * @version AM_1.0.2 https://github.com/mickelson/attract/blob/v1.0.2/Layouts.md?plain=1#L607
     */
    alpha = 0;

    /**
     * The offset of the element's Filter relative to the current Filter.
     *
     * Use to select content adjacent to the current selection.
     * @default `0`
     * @version AM_1.5.0 https://github.com/mickelson/attract/blob/v1.5.0/Layouts.md?plain=1#L1317
     */
    filter_offset = 0;

    /**
     * The shader applied to the *atlas* texture.
     * @note Glyphs are arranged automatically on the atlas, causing unpredictable Shader results.
     * @version AM_1.2.0 https://github.com/mickelson/attract/blob/v1.2.0/Layouts.md?plain=1#L838
     */
    shader = feShader();

    /**
     * The drawing order of the element.
     * - Higher ordered elements are drawn on top.
     * - Identically ordered elements are drawn in order of creation.
     * @default `0`
     * @version AM_2.0.0-rc1 https://github.com/mickelson/attract/blob/v2.0.0-rc1/Layouts.md?plain=1#L1658
     */
    zorder = 0;

    // #endregion

    // ---------------------------------------------------------------------------------
    // #region PROPS

    /**
     * The red channel level for the background `0...255`.
     * @default `0`
     * @version AM_1.0.2 https://github.com/mickelson/attract/blob/v1.0.2/Layouts.md?plain=1#L610
     */
    bg_red = 0;

    /**
     * The green channel level for the background `0...255`.
     * @default `0`
     * @version AM_1.0.2 https://github.com/mickelson/attract/blob/v1.0.2/Layouts.md?plain=1#L612
     */
    bg_green = 0;

    /**
     * The blue channel level for the background `0...255`.
     * @default `0`
     * @version AM_1.0.2 https://github.com/mickelson/attract/blob/v1.0.2/Layouts.md?plain=1#L614
     */
    bg_blue = 0;

    /**
     * The alpha channel level for the background `0...255`.
     * @default `0`
     * @version AM_1.0.2 https://github.com/mickelson/attract/blob/v1.0.2/Layouts.md?plain=1#L616
     */
    bg_alpha = 0;

    /**
     * The red channel level for the selected option text `0...255`.
     * @default `0`
     * @version AM_1.0.2 https://github.com/mickelson/attract/blob/v1.0.2/Layouts.md?plain=1#L618
     */
    sel_red = 0;

    /**
     * The green channel level for the selected option text `0...255`.
     * @default `0`
     * @version AM_1.0.2 https://github.com/mickelson/attract/blob/v1.0.2/Layouts.md?plain=1#L620
     */
    sel_green = 0;

    /**
     * The blue channel level for the selected option text `0...255`.
     * @default `0`
     * @version AM_1.0.2 https://github.com/mickelson/attract/blob/v1.0.2/Layouts.md?plain=1#L622
     */
    sel_blue = 0;

    /**
     * The alpha channel level for the selected option text `0...255`.
     * @default `0`
     * @version AM_1.0.2 https://github.com/mickelson/attract/blob/v1.0.2/Layouts.md?plain=1#L624
     */
    sel_alpha = 0;

    /**
     * The red channel level for the selected option background `0...255`.
     * @default `0`
     * @version AM_1.0.2 https://github.com/mickelson/attract/blob/v1.0.2/Layouts.md?plain=1#L626
     */
    selbg_red = 0;

    /**
     * The green channel level for the selected option background `0...255`.
     * @default `0`
     * @version AM_1.0.2 https://github.com/mickelson/attract/blob/v1.0.2/Layouts.md?plain=1#L628
     */
    selbg_green = 0;

    /**
     * The blue channel level for the selected option background `0...255`.
     * @default `0`
     * @version AM_1.0.2 https://github.com/mickelson/attract/blob/v1.0.2/Layouts.md?plain=1#L630
     */
    selbg_blue = 0;

    /**
     * The alpha channel level for the selected option background `0...255`.
     * @default `0`
     * @version AM_1.0.2 https://github.com/mickelson/attract/blob/v1.0.2/Layouts.md?plain=1#L632
     */
    selbg_alpha = 0;

    /**
     * The number of options displayed in the element.
     * @default `11`
     * @version AM_1.0.2 https://github.com/mickelson/attract/blob/v1.0.2/Layouts.md?plain=1#L634
     */
    rows = 0;

    /**
     * The font size, in points.
     *
     * Use `<= 0` to auto-size to the option elements.
     * @default `-1`
     * @version AM_1.0.2 https://github.com/mickelson/attract/blob/v1.0.2/Layouts.md?plain=1#L635
     */
    char_size = 0;

    /**
     * The space between characters, as a ratio of the font default.
     * @default `1.0`
     * @version AM_2.4.0 https://github.com/mickelson/attract/blob/v2.4.0/Layouts.md?plain=1#L1739
     */
    char_spacing = 0.0;

    /**
     * The font style for the text, accepts multiple values separated by `|`.
     * @default `Style.Regular`
     * @version AM_1.0.2 https://github.com/mickelson/attract/blob/v1.0.2/Layouts.md?plain=1#L638
     */
    style = Style;

    /**
     * The font style for the selected option text, accepts multiple values separated by `|`.
     * @default `Style.Regular`
     * @version AM_1.0.2 https://github.com/mickelson/attract/blob/v1.0.2/Layouts.md?plain=1#L649
     */
    sel_style = Style;

    /**
     * The alignment of the text within the option elements.
     * @default `Align.Centre`
     * @version AM_1.0.2 https://github.com/mickelson/attract/blob/v1.0.2/Layouts.md?plain=1#L644
     */
    align = Align;

    /**
     * The filename of the option font.
     * @version AM_1.2.0 https://github.com/mickelson/attract/blob/v1.2.0/Layouts.md?plain=1#L836
     */
    font = "";

    /**
     * The space to the left and right of the option text.
     *
     * Use `-1` to auto-size based on `char_size`.
     * @default `-1`
     * @version AM_2.4.0 https://github.com/mickelson/attract/blob/v2.4.0/Layouts.md?plain=1#L1759
     */
    margin = 0;

    /**
     * The option text format, accepts *[MagicTokens]*.
     *
     * When empty `"[Title]"` will be used.
     * @version AM_1.4.1 https://github.com/mickelson/attract/blob/v1.4.1/Layouts.md?plain=1#L1270
     */
    format_string = "";

    /**
     * @ignore
     *
     * @property {integer} glyph_size
     * The height of an uppercase `X`.
     * @version AM_2.4.0 https://github.com/mickelson/attract/blob/v2.4.0/Layouts.md?plain=1#L1738
     *
     * @property {integer} list_size
     * The total number of listbox items.
     * @version AM_2.4.0 https://github.com/mickelson/attract/blob/v2.4.0/Layouts.md?plain=1#L1731
     */
    function _get() {}

    // #endregion

    // ---------------------------------------------------------------------------------
    // #region FUNC

    /**
     * Sets the position of the element.
     * @param {float} x The x position of the element.
     * @param {float} y The y position of the element.
     * @version AM_1.3.0-beta1 https://github.com/mickelson/attract/blob/v1.3.0-beta1/Layouts.md?plain=1#L1008
     */
    function set_pos(x, y) {}

    /**
     * Sets the position and size of the element.
     * @ignore
     * @param {float} x The x position of the element.
     * @param {float} y The y position of the element.
     * @param {float} width The width of the element.
     * @param {float} height The height of the element.
     * @version AM_1.3.0-beta1 https://github.com/mickelson/attract/blob/v1.3.0-beta1/Layouts.md?plain=1#L1009
     */
    function set_pos(x, y, width, height) {}

    /**
     * Sets the colour channel levels for the text.
     * @param {integer} r The red channel level `0...255`.
     * @param {integer} g The green channel level `0...255`.
     * @param {integer} b The blue channel level `0...255`.
     * @version AM_1.0.2 https://github.com/mickelson/attract/blob/v1.0.2/Layouts.md?plain=1#L659
     */
    function set_rgb(r, g, b) {}

    /**
     * Sets the colour channel levels for the background.
     * @param {integer} r The red channel level `0...255`.
     * @param {integer} g The green channel level `0...255`.
     * @param {integer} b The blue channel level `0...255`.
     * @version AM_1.0.2 https://github.com/mickelson/attract/blob/v1.0.2/Layouts.md?plain=1#L661
     */
    function set_bg_rgb(r, g, b) {}

    /**
     * Sets the colour channel levels for the selected option text.
     * @param {integer} r The red channel level `0...255`.
     * @param {integer} g The green channel level `0...255`.
     * @param {integer} b The blue channel level `0...255`.
     * @version AM_1.0.2 https://github.com/mickelson/attract/blob/v1.0.2/Layouts.md?plain=1#L663
     */
    function set_sel_rgb(r, g, b) {}

    /**
     * Sets the colour channel levels for the selected option background.
     * @param {integer} r The red channel level `0...255`.
     * @param {integer} g The green channel level `0...255`.
     * @param {integer} b The blue channel level `0...255`.
     * @version AM_1.0.2 https://github.com/mickelson/attract/blob/v1.0.2/Layouts.md?plain=1#L665
     */
    function set_selbg_rgb(r, g, b) {}

    // #endregion
}
