/**
 * Attract-Mode Frontend
 *
 * @package fe.Text
 * @global
 */

/**
 * An element for displaying textual content.
 *
 * This class can only be instantiated using:
 * - `fe.add_text()`
 *
 * @ignore
 * @class
 * @type {feText}
 * @alias fe.Text
 * @version AM_1.0.2 https://github.com/mickelson/attract/blob/v1.0.2/Layouts.md?plain=1#L509
 */
class feText {

    // ---------------------------------------------------------------------------------
    // #region PRESENTABLE

    /**
     * The x position of the element.
     * @relative To the top-left corner of the parent Surface.
     * @default `0`
     * @version AM_1.0.2 https://github.com/mickelson/attract/blob/v1.0.2/Layouts.md?plain=1#L533
     */
    x = 0.0;

    /**
     * The y position of the element.
     * @relative To the top-left corner of the parent Surface.
     * @default `0`
     * @version AM_1.0.2 https://github.com/mickelson/attract/blob/v1.0.2/Layouts.md?plain=1#L534
     */
    y = 0.0;

    /**
     * The width of the element.
     * @default `0`
     * @version AM_1.0.2 https://github.com/mickelson/attract/blob/v1.0.2/Layouts.md?plain=1#L535
     */
    width = 0.0;

    /**
     * The height of the element.
     * @default `0`
     * @version AM_1.0.2 https://github.com/mickelson/attract/blob/v1.0.2/Layouts.md?plain=1#L536
     */
    height = 0.0;

    /**
     * The visibility of the element.
     *
     * When not visible the element won't be drawn to the parent Surface.
     * @default `true`
     * @version AM_1.0.2 https://github.com/mickelson/attract/blob/v1.0.2/Layouts.md?plain=1#L537
     */
    visible = true;

    /**
     * Rotation of the element in clockwise degrees.
     * @relative To the `origin` or `rotation_origin`.
     * @default `0.0`
     * @version AM_1.0.2 https://github.com/mickelson/attract/blob/v1.0.2/Layouts.md?plain=1#L539
     */
    rotation = 0.0;

    /**
     * The red channel level for the text `0...255`.
     * @default `255`
     * @version AM_1.0.2 https://github.com/mickelson/attract/blob/v1.0.2/Layouts.md?plain=1#L541
     */
    red = 0;

    /**
     * The green channel level for the text `0...255`.
     * @default `255`
     * @version AM_1.0.2 https://github.com/mickelson/attract/blob/v1.0.2/Layouts.md?plain=1#L543
     */
    green = 0;

    /**
     * The blue channel level for the text `0...255`.
     * @default `255`
     * @version AM_1.0.2 https://github.com/mickelson/attract/blob/v1.0.2/Layouts.md?plain=1#L545
     */
    blue = 0;

    /**
     * The alpha channel level for the text `0...255`.
     * @default `255`
     * @version AM_1.0.2 https://github.com/mickelson/attract/blob/v1.0.2/Layouts.md?plain=1#L547
     */
    alpha = 0;

    /**
     * The offset of the element's Game relative to the current Game.
     *
     * Use to select content adjacent to the current selection.
     * @default `0`
     * @version AM_1.0.2 https://github.com/mickelson/attract/blob/v1.0.2/Layouts.md?plain=1#L549
     */
    index_offset = 0;

    /**
     * The offset of the element's Filter relative to the current Filter.
     *
     * Use to select content adjacent to the current selection.
     * @default `0`
     * @version AM_1.5.0 https://github.com/mickelson/attract/blob/v1.5.0/Layouts.md?plain=1#L1247
     */
    filter_offset = 0;

    /**
     * The shader applied to the *atlas* texture.
     * @note Glyphs are arranged automatically on the atlas, causing unpredictable Shader results.
     * @version AM_1.2.0 https://github.com/mickelson/attract/blob/v1.2.0/Layouts.md?plain=1#L754
     */
    shader = feShader();

    /**
     * The drawing order of the element.
     * - Higher ordered elements are drawn on top.
     * - Identically ordered elements are drawn in order of creation.
     * @default `0`
     * @version AM_2.0.0-rc1 https://github.com/mickelson/attract/blob/v2.0.0-rc1/Layouts.md?plain=1#L1561
     */
    zorder = 0;

    // #endregion

    // ---------------------------------------------------------------------------------
    // #region PROPS

    /**
     * The message displayed in the element, accepts *[MagicTokens]*.
     * @version AM_1.0.2 https://github.com/mickelson/attract/blob/v1.0.2/Layouts.md?plain=1#L518
     */
    msg = "";

    /**
     * The red channel level for the background `0...255`.
     * @default `0`
     * @version AM_1.0.2 https://github.com/mickelson/attract/blob/v1.0.2/Layouts.md?plain=1#L552
     */
    bg_red = 0;

    /**
     * The green channel level for the background `0...255`.
     * @default `0`
     * @version AM_1.0.2 https://github.com/mickelson/attract/blob/v1.0.2/Layouts.md?plain=1#L554
     */
    bg_green = 0;

    /**
     * The blue channel level for the background `0...255`.
     * @default `0`
     * @version AM_1.0.2 https://github.com/mickelson/attract/blob/v1.0.2/Layouts.md?plain=1#L556
     */
    bg_blue = 0;

    /**
     * The alpha channel level for the background `0...255`.
     * @default `0`
     * @version AM_1.0.2 https://github.com/mickelson/attract/blob/v1.0.2/Layouts.md?plain=1#L558
     */
    bg_alpha = 0;

    /**
     * The font size, in points.
     *
     * Use `<= 0` to auto-size to the element's height.
     * @default `-1`
     * @version AM_1.0.2 https://github.com/mickelson/attract/blob/v1.0.2/Layouts.md?plain=1#L560
     */
    char_size = 0;

    /**
     * The space between characters, as a ratio of the font default.
     * @default `1.0`
     * @version AM_2.4.0 https://github.com/mickelson/attract/blob/v2.4.0/Layouts.md?plain=1#L1626
     */
    char_spacing = 0.0;

    /**
     * The space between lines, as a ratio of the font default.
     * @default `1.0`
     * @version AM_2.4.0 https://github.com/mickelson/attract/blob/v2.4.0/Layouts.md?plain=1#L1627
     */
    line_spacing = 0.0;

    /**
     * The font outline thickness.
     * @default `0.0`
     * @version 🔶AM+_3.0.0 https://github.com/oomek/attractplus/blob/3.0.0/Layouts.md?plain=1#L1853
     */
    outline = 0.0;

    /**
     * The background outline thickness.
     * @default `0.0`
     * @version 🔶AM+_3.0.0 https://github.com/oomek/attractplus/blob/3.0.0/Layouts.md?plain=1#L1855
     */
    bg_outline = 0.0;

    /**
     * The font style for the message, accepts multiple values separated by `|`.
     * @default `Style.Regular`
     * @version AM_1.0.2 https://github.com/mickelson/attract/blob/v1.0.2/Layouts.md?plain=1#L562
     */
    style = Style;

    /**
     * The alignment of the message within the Text element.
     * @default `Align.Centre`
     * @version AM_1.0.2 https://github.com/mickelson/attract/blob/v1.0.2/Layouts.md?plain=1#L568
     */
    align = Align;

    /**
     * Wrap words to the next line.
     * @default `false`
     * @version AM_1.0.2 https://github.com/mickelson/attract/blob/v1.0.2/Layouts.md?plain=1#L573
     */
    word_wrap = false;

    /**
     * The line of the formatted message that is shown as the first line in the element.
     * @default `0`
     * @version 🔶AM+_3.0.6 https://github.com/oomek/attractplus/blob/3.0.6/Layouts.md?plain=1#L1894
     */
    first_line_hint = 0;

    /**
     * The filename of the message font.
     * @version AM_1.2.0 https://github.com/mickelson/attract/blob/v1.2.0/Layouts.md?plain=1#L752
     */
    font = "";

    /**
     * The space to the left and right of the message.
     *
     * Use `-1` to auto-size based on `char_size`.
     * @default `-1`
     * @version AM_2.4.0 https://github.com/mickelson/attract/blob/v2.4.0/Layouts.md?plain=1#L1657
     */
    margin = 0;

    /**
     * @ignore
     *
     * @property {integer} glyph_size
     * The height of an uppercase `X`.
     * @version AM_2.4.0 https://github.com/mickelson/attract/blob/v2.4.0/Layouts.md?plain=1#L1624
     *
     * @property {string} msg_wrapped
     * The value of the formatted message.
     * @version AM_2.6.0 https://github.com/mickelson/attract/blob/v2.6.0/Layouts.md?plain=1#L1622
     *
     * @property {integer} msg_width
     * The width of the formatted message.
     * @version AM_1.6.2 https://github.com/mickelson/attract/blob/v1.6.2/Layouts.md?plain=1#L1471
     *
     * @property {integer} msg_height
     * The height of the formatted message.
     * @version 🔶AM+_3.0.0 https://github.com/oomek/attractplus/blob/3.0.0/Layouts.md?plain=1#L1882
     *
     * @property {integer} lines
     * The number of lines that will fit in the element.
     * @version 🔶AM+_3.0.6 https://github.com/oomek/attractplus/blob/3.0.6/Layouts.md?plain=1#L1891
     *
     * @property {integer} lines_total
     * The number of lines the formatted message has.
     * @version 🔶AM+_3.0.6 https://github.com/oomek/attractplus/blob/3.0.6/Layouts.md?plain=1#L1892
     *
     * @property {integer} line_height
     * The height of a line with spacing.
     * @version 🔶AM+_3.0.6 https://github.com/oomek/attractplus/blob/3.0.6/Layouts.md?plain=1#L1893
    */
    function _get() {}

    // #endregion

    // ---------------------------------------------------------------------------------
    // #region FUNC

    /**
     * Sets the position of the element.
     * @param {float} x The x position of the element.
     * @param {float} y The y position of the element.
     * @version AM_1.3.0-beta1 https://github.com/mickelson/attract/blob/v1.3.0-beta1/Layouts.md?plain=1#L916
     */
    function set_pos(x, y) {}

    /**
     * Sets the position and size of the element.
     * @ignore
     * @param {float} x The x position of the element.
     * @param {float} y The y position of the element.
     * @param {float} width The width of the element.
     * @param {float} height The height of the element.
     * @version AM_1.3.0-beta1 https://github.com/mickelson/attract/blob/v1.3.0-beta1/Layouts.md?plain=1#L917
     */
    function set_pos(x, y, width, height) {}

    /**
     * Sets the colour channel levels for the text.
     * @param {integer} r The red channel level `0...255`.
     * @param {integer} g The green channel level `0...255`.
     * @param {integer} b The blue channel level `0...255`.
     * @version AM_1.0.2 https://github.com/mickelson/attract/blob/v1.0.2/Layouts.md?plain=1#L578
     */
    function set_rgb(r, g, b) {}

    /**
     * Sets the colour channel levels for the background.
     * @param {integer} r The red channel level `0...255`.
     * @param {integer} g The green channel level `0...255`.
     * @param {integer} b The blue channel level `0...255`.
     * @version AM_1.0.2 https://github.com/mickelson/attract/blob/v1.0.2/Layouts.md?plain=1#L580
     */
    function set_bg_rgb(r, g, b) {}

    /**
     * Sets the colour channel levels for the outline.
     * @param {integer} r The red channel level `0...255`.
     * @param {integer} g The green channel level `0...255`.
     * @param {integer} b The blue channel level `0...255`.
     * @version 🔶AM+_3.0.0 https://github.com/oomek/attractplus/blob/3.0.0/Layouts.md?plain=1#L1899
     */
    function set_outline_rgb(r, g, b) {}

    /**
     * Sets the colour channel levels for the background outline.
     * @param {integer} r The red channel level `0...255`.
     * @param {integer} g The green channel level `0...255`.
     * @param {integer} b The blue channel level `0...255`.
     * @version 🔶AM+_3.0.0 https://github.com/oomek/attractplus/blob/3.0.0/Layouts.md?plain=1#L1901
     */
    function set_bg_outline_rgb(r, g, b) {}

    // #endregion
}
