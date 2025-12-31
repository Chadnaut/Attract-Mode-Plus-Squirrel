/**
 * Attract-Mode Frontend
 *
 * @package fe.CurrentList
 * @global
 */

/**
 * Current Display settings, available in `fe.list`.
 *
 * @note This class cannot be instantiated.
 * @ignore
 * @class
 * @type {feCurrentList}
 * @alias fe.CurrentList
 * @version AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#fecurrentlist
 * @since AM_1.1.0 https://github.com/mickelson/attract/blob/v1.1.0/Layouts.md?plain=1#L554
 */
class feCurrentList {

    /**
     * The index of the current Filter.
     * @version AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#fecurrentlist
     * @since AM_1.5.0 https://github.com/mickelson/attract/blob/v1.5.0/Layouts.md?plain=1#L949
     */
    filter_index = 0;
    // filter https://github.com/mickelson/attract/blob/v1.1.0/Layouts.md?plain=1#L563

    /**
     * The index of the current Game.
     * @version AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#fecurrentlist
     * @since AM_1.5.0 https://github.com/mickelson/attract/blob/v1.5.0/Layouts.md?plain=1#L948
     */
    index = 0;

    /**
     * The search rule applied to the current List.
     *
     * If the rule yields no results, the full List will be displayed.
     * The rule is cleared when the Display or Filter is changed.
     *
     * Formatted the same as Filter rules: "property predicate expression":
     * - Property - The romlist property to compare.
     * - Predicate - One of `contains`, `not_contains`, `equals`, `not_equals`.
     * - Expression - A string or regular-expression.
     * @version AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#fecurrentlist
     * @since AM_1.6.2 https://github.com/mickelson/attract/blob/v1.6.2/Layouts.md?plain=1#L1124
     * @example
     * ```
     * // Show games containing the string "The" or "the"
     * fe.list.search_rule = "Title contains [Tt]he";
     * ```
     */
    search_rule = "";

    // sort_by https://github.com/mickelson/attract/blob/v1.4.1/Layouts.md?plain=1#L927

    /**
     * @ignore
     *
     * @property {string} name
     * The name of the current Display.
     * @version AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#fecurrentlist
     * @since AM_1.5.0 https://github.com/mickelson/attract/blob/v1.5.0/Layouts.md?plain=1#L948
     *
     * @property {integer} display_index
     * The index of the current Display.
     *
     * Will be `-1` when a custom *Displays Menu* Layout is showing.
     * @version AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#fecurrentlist
     * @since AM_2.0.0-rc1 https://github.com/mickelson/attract/blob/v2.0.0-rc1/Layouts.md?plain=1#L1173
     *
     * @property {boolean} clones_list
     * Whether the current List contains *Group Clones*.
     * @version 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#fecurrentlist
     * @since 🔶AM+_3.0.0 https://github.com/oomek/attractplus/blob/3.0.0/Layouts.md?plain=1#L1394
     *
     * @property {integer} size
     * The length of the current List.
     * @version AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#fecurrentlist
     * @since AM_1.6.2 https://github.com/mickelson/attract/blob/v1.6.2/Layouts.md?plain=1#L1129
     *
     * @property {array(string)} tags
     * The tags used by the current List.
     * @version 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#fecurrentlist
     * @since 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/3.2.0/Layouts.md?plain=1#L1397
     */
    function _get() {}
}
