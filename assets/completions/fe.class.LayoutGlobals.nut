/**
 * Attract-Mode Frontend
 *
 * @package fe.LayoutGlobals
 * @global
 */

/**
 * Global Layout settings, available in `fe.layout`.
 * @note This class cannot be instantiated.
 * @ignore
 * @class
 * @type {feLayoutGlobals}
 * @alias fe.LayoutGlobals
 * @version AM_1.0.2 https://github.com/mickelson/attract/blob/v1.0.2/Layouts.md?plain=1#L433
 */
class feLayoutGlobals {

    /**
     * The width of the Layout.
     * @default `ScreenWidth`.
     * @version AM_1.0.2 https://github.com/mickelson/attract/blob/v1.0.2/Layouts.md?plain=1#L441
     */
    width = 0;

    /**
     * The height of the Layout.
     * @default `ScreenHeight`.
     * @version AM_1.0.2 https://github.com/mickelson/attract/blob/v1.0.2/Layouts.md?plain=1#L442
     */
    height = 0;

    /**
     * The filename of the default font for Text and Listbox elements.
     * @version AM_1.0.2 https://github.com/mickelson/attract/blob/v1.0.2/Layouts.md?plain=1#L443
     */
    font = "";

    /**
     * The user controlled screen rotation value.
     * @example
     * @version AM_1.3.2 https://github.com/mickelson/attract/blob/v1.3.2/Layouts.md?plain=1#L743
     * ```
     * // The complete RotateScreen enum
     * local rotation = (fe.layout.base_rotation + fe.layout.toggle_rotation) % 4;
     * ```
     */
    toggle_rotation = RotateScreen;

    /**
     * The number of Games to increment for `next_page` and `prev_page` signals.
     * @default `5`;
     * @version AM_1.4.1 https://github.com/mickelson/attract/blob/v1.4.1/Layouts.md?plain=1#L905
     */
    page_size = 0;

    /**
     * Letterbox the Layout within the application window to maintain its aspect ratio.
     * @default `false`
     * @version AM_2.0.0-rc1 https://github.com/mickelson/attract/blob/v2.0.0-rc1/Layouts.md?plain=1#L1153
     */
    preserve_aspect_ratio = false;

    /**
     * Whether the system mouse pointer is displayed.
     * @default `false`
     * @version 🔶AM+_3.0.0 https://github.com/oomek/attractplus/blob/3.0.0/Layouts.md?plain=1#L1354
     */
    mouse_pointer = false;

    /**
     * Triggers a Layout redraw.
     *
     * May be useful during long running methods that block the application.
     *
     * Will ***crash*** the application if called within `add_ticks_callback`.
     * @version 🔶AM+_3.0.0 https://github.com/oomek/attractplus/blob/3.0.0/Layouts.md?plain=1#L1358
     */
    function redraw() {}

    /**
     * @ignore
     *
     * @property {RotateScreen} base_rotation
     * The base screen rotation value set in `Configure / General / Screen Rotation`.
     * @version AM_1.3.2 https://github.com/mickelson/attract/blob/v1.3.2/Layouts.md?plain=1#L737
     * @example
     * ```
     * // The complete RotateScreen enum
     * local rotation = (fe.layout.base_rotation + fe.layout.toggle_rotation) % 4;
     * ```
     *
     * @property {integer} time
     * The number of milliseconds the Layout has been showing.
     * @version AM_2.0.0 https://github.com/mickelson/attract/blob/v2.0.0-rc1/Layouts.md?plain=1#L1155
     */
    function _get() {}
}
