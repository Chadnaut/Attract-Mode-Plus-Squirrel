/**
 * Attract-Mode Frontend
 *
 * @package Snippet
 * @global
 * @version 3.0.9
 */

/**
 * @keyword add_ticks Add ticks callback snippet
 * @snippet
 * ::fe.add_ticks_callback(this, "on_tick")
 * function on_tick(ttime) {
 *     ${0}
 * }
 */

/**
 * @keyword add_transition Add transition callback snippet
 * @snippet
 * ::fe.add_transition_callback(this, "on_transition")
 * function on_transition(ttype, var, ttime) {
 *     switch (ttype) {
 *         case Transition.ToNewList:
 *             ${0}
 *             break
 *     }
 * }
 */

/**
 * @keyword add_signal Add signal handler snippet
 * @snippet
 * ::fe.add_signal_handler(this, "on_signal")
 * function on_signal(signal) {
 *     switch (signal) {
 *         case "select":
 *             ${0}
 *             break
 *     }
 *     return false
 * }
 */

/**
 * @keyword UserConfig Add UserConfig class snippet
 * @snippet
 * class UserConfig </ help="Configuration Description" /> {
 *     </ label=" ", help=" ", options=" ", order=1 />
 *     divider = " "
 *
 *     </ label="Text", help="Allows text entry", order=2 />
 *     text_value = "string"
 *
 *     </ label="Option", help="Select an option", options="Yes,No", order=3 />
 *     option_value = "Yes"
 *
 *     </ label="Input", help="Select an input", is_input=true, order=4 />
 *     input_value = "A"
 *
 *     </ label="Display", help="This setting is unique per display", per_display=true, order=5 />
 *     display_value = "string"
 *
 *     </ label="Func", help="Call a function", is_function=true, order=6 />
 *     func_value = "config_func"
 * }
 *
 * function config_func(config) {
 *     return "done"
 * }
 */
