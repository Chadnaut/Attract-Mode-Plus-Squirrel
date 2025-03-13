/**
 * Attract-Mode Frontend
 *
 * @package Snippet
 * @global
 */

/**
 * @keyword add_ticks Add ticks callback snippet
 * @snippet
 * ::fe.add_ticks_callback(this, "on_tick");
 * function on_tick(ttime) {
 *     ${0}
 * }
 */

/**
 * @keyword add_transition Add transition callback snippet
 * @snippet
 * ::fe.add_transition_callback(this, "on_transition");
 * function on_transition(ttype, var, ttime) {
 *     switch (ttype) {
 *         case Transition.ToNewList:
 *             ${0}
 *             break;
 *     }
 * }
 */

/**
 * @keyword add_signal Add signal handler snippet
 * @snippet
 * ::fe.add_signal_handler(this, "on_signal");
 * function on_signal(signal) {
 *     switch (signal) {
 *         case "select":
 *             ${0}
 *             break;
 *     }
 *     return false;
 * }
 */

/**
 * @keyword UserConfig Add UserConfig class snippet
 * @snippet
 * class UserConfig </ help="Description placeholder" /> {
 *     </ label="String", help="Type any text", order=1 /> text = "string"
 *     </ label="Button", help="Press any key", is_input=true, order=3 /> input = "A"
 *     </ label="Choice", help="Choose option", options="Yes,No", order=2 /> option = "Yes"
 *     </ label="Unique", help="Display owned", per_display=true, order=4 /> unique = "string"
 *     </ label="Method", help="Call function", is_function=true, order=5 /> callback = "funcname"
 * }
 */
