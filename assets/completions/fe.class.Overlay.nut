/**
 * Attract-Mode Frontend
 *
 * @package fe.Overlay
 * @global
 */

/**
 * The Overlay controller, available in `fe.overlay`.
 * @note This class cannot be instantiated.
 * @ignore
 * @class
 * @type {feOverlay}
 * @alias fe.Overlay
 * @version AM_1.4.1 https://github.com/mickelson/attract/blob/v1.4.1/Layouts.md?plain=1#L951
 */
class feOverlay {
    /**
     * @ignore
     *
     * @property {boolean} is_up
     * Whether the Overlay menu is shown.
     *
     * Used for Layout menus, as well as the `Configure` menu.
     * @version AM_1.4.1 https://github.com/mickelson/attract/blob/v1.4.1/Layouts.md?plain=1#L959
     */
    function _get() {}

    /**
     * Sets the elements to use for a custom Overlay menu.
     * @param {fe.Text} text The element to use for the Title.
     * @param {fe.Listbox} listbox The element to use for the Menu.
     * @version AM_2.0.0-rc1 https://github.com/mickelson/attract/blob/v2.0.0-rc1/Layouts.md?plain=1#L1201
     */
    function set_custom_controls(text, listbox) {}

    /**
     * @ignore
     * @variation set_custom_controls
     * @param {fe.Text} text The element to use for the Title.
     * @version AM_2.0.0-rc1 https://github.com/mickelson/attract/blob/v2.0.0-rc1/Layouts.md?plain=1#L1202
     */
    function set_custom_controls(text) {}

    /**
     * @ignore
     * @variation set_custom_controls
     * @version AM_2.0.0-rc1 https://github.com/mickelson/attract/blob/v2.0.0-rc1/Layouts.md?plain=1#L1203
     */
    function set_custom_controls() {}

    /**
     * Reverts the Overlay menu to the built-in style.
     * @version AM_2.0.0-rc1 https://github.com/mickelson/attract/blob/v2.0.0-rc1/Layouts.md?plain=1#L1209
     */
    function clear_custom_controls() {}

    /**
     * Shows the Overlay menu with the given options.
     *
     * Returns the index of the current option upon selection, or the cancel value on escape.
     * @param {string[]} options The array of strings to use for list options.
     * @param {string} title The title message for the Overlay.
     * @param {integer} selection The index of the initially selected option. Defaults to `0`.
     * @param {integer} cancel The value to return on cancel. Defaults to `-1`.
     * @returns {integer}
     * @version AM_1.4.1 https://github.com/mickelson/attract/blob/v1.4.1/Layouts.md?plain=1#L964
     */
    function list_dialog(options, title = "", selection = 0, cancel = -1) {}

    /**
     * Shows a simple prompt for user text input.
     *
     * Returns the entered value upon return, or the original value on escape.
     * @param {string} title The title message for the prompt.
     * @param {string} value The initial value for the text.
     * @returns {string}
     * @version AM_1.4.1 https://github.com/mickelson/attract/blob/v1.4.1/Layouts.md?plain=1#L974
     */
    function edit_dialog(title, value) {}

    /**
     * Shows a simple on-screen message.
     *
     * The message is displayed immediately, then hidden on the next tick.
     *
     * Intended to be used before long running events that block the application.
     * @param {string} title The message text to display, may contain a `$1` placeholder.
     * @param {string} replace The text to replace into the title placeholder.
     * @param {string} footer The footer text to display.
     * @version AM_1.6.2 https://github.com/mickelson/attract/blob/v1.6.2/Layouts.md?plain=1#L1160
     */
    function splash_message(title, replace="", footer="") {}
}
