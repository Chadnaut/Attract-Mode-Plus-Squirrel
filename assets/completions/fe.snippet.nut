/**
 * Attract-Mode Frontend
 *
 * @package Snippet
 * @global
 */

/**
 * @keyword add_ticks Add ticks callback snippet
 * @snippet
 * fe.add_ticks_callback(this, "on_tick")
 * function on_tick(ttime) {
 *     ${0}
 * }
 */

/**
 * @keyword add_transition Add transition callback snippet
 * @snippet
 * fe.add_transition_callback(this, "on_transition")
 * function on_transition(ttype, var, ttime) {
 *     switch (ttype) {
 *         case ${1:Transition.ToNewList}:
 *             ${0}
 *             break
 *     }
 * }
 */

/**
 * @keyword add_signal Add signal handler snippet
 * @snippet
 * fe.add_signal_handler(this, "on_signal")
 * function on_signal(signal) {
 *     switch (signal) {
 *         case "${1:select}":
 *             ${0}
 *             break
 *     }
 *     return false
 * }
 */

/**
 * @keyword UserConfig Add UserConfig class snippet
 * @snippet
 * class UserConfig </ help="Description placeholder" /> {
 *     </ label="String", help="Type any text", order=1 /> text = "string"
 *     </ label="Button", help="Press any key", is_input=true, order=2 /> input = "A"
 *     </ label="—— Info ——", help="Info section", is_info=true, order=3 /> info = "————"
 *     </ label="Choice", help="Choose option", options="Yes,No", order=4 /> option = "Yes"
 *     </ label="Unique", help="Display owned", per_display=true, order=5 /> unique = "string"
 *     </ label="Method", help="Call function", is_function=true, order=6 /> callback = "funcname"
 * }
 */

/**
 * @keyword Plugin Add Plugin class snippet
 * @snippet
 * class ${1:Plugin} {
 *     /** @type {UserConfig} *\/
 *     config = null
 *
 *     constructor() {
 *         config = fe.get_config()${0}
 *     }
 * }
 *
 * fe.plugin["${1}"] <- ${1}()
 */