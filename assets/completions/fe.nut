/**
 * Attract-Mode Frontend
 *
 * @package AttractMode
 * @global
 */

/**
 * All the functions, objects and classes that Attract-Mode exposes to Squirrel.
 * @class
 * @type {fe}
 * @version AM_1.0.2 https://github.com/mickelson/attract/blob/v1.0.2/Layouts.md?plain=1#L46
 */
fe <- {
    // ---------------------------------------------------------------------------------
    // #region HELPERS

    /**
     * @inheritdoc
     * @version AM_1.0.2 https://github.com/mickelson/attract/blob/v1.0.2/Layouts.md?plain=1#L65
     */
    add_image = add_image1,
    /**
     * @inheritdoc
     * @version AM_1.0.2 https://github.com/mickelson/attract/blob/v1.0.2/Layouts.md?plain=1#L66
     */
    add_image = add_image2,
    /**
     * @inheritdoc
     * @version AM_1.0.2 https://github.com/mickelson/attract/blob/v1.0.2/Layouts.md?plain=1#L67
     */
    add_image = add_image3,
    /**
     * @inheritdoc
     * @version AM_1.0.2 https://github.com/mickelson/attract/blob/v1.0.2/Layouts.md?plain=1#L94
     */
    add_artwork = add_artwork1,
    /**
     * @inheritdoc
     * @version AM_1.0.2 https://github.com/mickelson/attract/blob/v1.0.2/Layouts.md?plain=1#L95
     */
    add_artwork = add_artwork2,
    /**
     * @inheritdoc
     * @version AM_1.0.2 https://github.com/mickelson/attract/blob/v1.0.2/Layouts.md?plain=1#L96
     */
    add_artwork = add_artwork3,
    /**
     * @inheritdoc
     * @version AM_1.0.2 https://github.com/mickelson/attract/blob/v1.0.2/Layouts.md?plain=1#L126
     */
    add_clone = add_clone1,
    /**
     * @inheritdoc
     * @version AM_1.0.2 https://github.com/mickelson/attract/blob/v1.0.2/Layouts.md?plain=1#L145
     */
    add_text = add_text1,
    /**
     * @inheritdoc
     * @version AM_1.0.2 https://github.com/mickelson/attract/blob/v1.0.2/Layouts.md?plain=1#L181
     */
    add_listbox = add_listbox1,
    /**
     * @inheritdoc
     * @version 🔶AM+_3.1.0 https://github.com/oomek/attractplus/blob/3.1.0/Layouts.md?plain=1#L577
     */
    add_music = add_music1,
    /**
     * @inheritdoc
     * @version AM_1.3.0-beta1 https://github.com/mickelson/attract/blob/v1.3.0-beta1/Layouts.md?plain=1#L173
     */
    add_surface = add_surface1,
    /**
     * @inheritdoc
     * @version 🔶AM+_3.1.0 https://github.com/oomek/attractplus/blob/3.1.0/Layouts.md?plain=1#L364
     */
    add_surface = add_surface2,
    /**
     * @inheritdoc
     * @version 🔶AM+_3.0.0 https://github.com/oomek/attractplus/blob/3.0.0/Layouts.md?plain=1#L451
     */
    add_rectangle = add_rectangle1,
    /**
     * @inheritdoc
     * @version AM_1.0.2 https://github.com/mickelson/attract/blob/v1.0.2/Layouts.md?plain=1#L202
     */
    add_sound = add_sound1,
    /**
     * @inheritdoc
     * @version AM_1.6.0 https://github.com/mickelson/attract/blob/v1.6.0/Layouts.md?plain=1#L472
     */
    add_sound = add_sound2,
    /**
     * @inheritdoc
     * @version AM_1.2.0 https://github.com/mickelson/attract/blob/v1.2.0/Layouts.md?plain=1#L209
     */
    add_shader = add_shader1,
    /**
     * @inheritdoc
     * @version AM_1.2.0 https://github.com/mickelson/attract/blob/v1.2.0/Layouts.md?plain=1#L208
     */
    add_shader = add_shader2,
    /**
     * @inheritdoc
     * @version AM_1.2.0 https://github.com/mickelson/attract/blob/v1.2.0/Layouts.md?plain=1#L207
     */
    add_shader = add_shader3,

    // #endregion

    // ---------------------------------------------------------------------------------
    // #region FUNC

    /**
     * Registers a function to be called when the application emits a Tick.
     *
     * Ticks are emitted prior to drawing each Layout frame.
     * @method
     * @param {string} name The name of the callback function.
     * @version AM_1.0.2 https://github.com/mickelson/attract/blob/v1.0.2/Layouts.md?plain=1#L219
     * @example
     * ```
     * add_ticks_callback("on_tick");
     * function on_tick(ttime) {
     *     fe.log(ttime); // milliseconds since the Layout started
     * }
     * ```
     */
    function add_ticks_callback(name) {}

    /**
     * @ignore
     * @variation add_ticks_callback
     * @param {*} env The object to use as the current environment.
     * @param {string} name The name of the callback function.
     * @version AM_1.4.1 https://github.com/mickelson/attract/blob/v1.4.1/Layouts.md?plain=1#L387
     * @example
     * ```
     * add_ticks_callback(this, "on_tick");
     * function on_tick(ttime) {
     *     fe.log(ttime); // milliseconds since the Layout started
     * }
     * ```
     */
    function add_ticks_callback(env, name) {}

    /**
     * Registers a function to be called when the application emits a Transition.
     *
     * Transitions are emitted when the application state has changed, such as selecting a new Game, Filter, or Display.
     *
     * The callback may return `true` to postpone the Transition, but must eventually return `false` or the application will ***crash***.
     *
     * @method
     * @param {string} name The name of the callback function.
     * @version AM_1.0.2 https://github.com/mickelson/attract/blob/v1.0.2/Layouts.md?plain=1#L244
     * @example
     * ```
     * fe.add_transition_callback("on_transition");
     * function on_transition(ttype, var, ttime) {
     *     fe.log(ttype); // A Transition.* enum value
     *     fe.log(var);   // Value depends on the Transition
     *     fe.log(ttime); // Milliseconds since first emit, will be 0 unless postponed
     *     return false;  // true to postpone, false to continue
     * }
     * ```
     */
    add_transition_callback = function (name) {},

    /**
     * @ignore
     * @variation add_transition_callback
     * @param {*} env The object to use as the current environment.
     * @param {string} name The name of the callback function.
     * @version AM_1.4.1 https://github.com/mickelson/attract/blob/v1.4.1/Layouts.md?plain=1#L416
     * @example
     * ```
     * fe.add_transition_callback(this, "on_transition");
     * function on_transition(ttype, var, ttime) {
     *     fe.log(ttype); // A Transition.* enum value
     *     fe.log(var);   // Value depends on the Transition
     *     fe.log(ttime); // Milliseconds since first emit, will be 0 unless postponed
     *     return false;  // true to postpone, false to continue
     * }
     * ```
     */
    add_transition_callback = function (env, name) {},

    /**
     * Returns romlist information for a Game.
     * @method
     * @param {Info} info The information attribute to get.
     * @returns {string}
     * @version AM_1.0.2 https://github.com/mickelson/attract/blob/v1.0.2/Layouts.md?plain=1#L297
     */
    game_info = function(info) {},

    /**
     * @ignore
     * @variation game_info
     * @param {Info} info The information attribute to get.
     * @param {integer} index_offset The offset relative to the current Game. Defaults to `0`.
     * @returns {string}
     * @version AM_1.0.2 https://github.com/mickelson/attract/blob/v1.0.2/Layouts.md?plain=1#L298
     */
    game_info = function(info, index_offset = 0) {},

    /**
     * @ignore
     * @variation game_info
     * @param {Info} info The information attribute to get.
     * @param {integer} index_offset The offset relative to the current Game. Defaults to `0`.
     * @param {integer} filter_offset The offset relative to the current Filter. Defaults to `0`.
     * @returns {string}
     * @version AM_1.5.0 https://github.com/mickelson/attract/blob/v1.5.0/Layouts.md?plain=1#L511
     */
    game_info = function(info, index_offset = 0, filter_offset = 0) {},

    /**
     * Returns the artwork filename for a Game.
     * @method
     * @param {string(=artworkLabels)} label The artwork resource label as defined in Emulator settings.
     * @param {integer} index_offset The offset relative to the current Game. Defaults to `0`.
     * @param {integer} filter_offset The offset relative to the current Filter. Defaults to `0`.
     * @param {Art} flags The type of artwork to return, accepts multiple values separated by `|`. Defaults to `Art.Default`.
     * @returns {string}
     * @version AM_1.5.2 https://github.com/mickelson/attract/blob/v1.5.2/Layouts.md?plain=1#L558
     */
    get_art = function(label, index_offset = 0, filter_offset = 0, flags = Art.Default) {}

    /**
     * Returns the pressed state of an input:
     * - Keyboard keys and modifiers
     * - Joystick buttons and directions
     * - Mouse buttons
     * - Signals
     * @method
     * @param {string(=keyStrings|=joyStrings|=mouseStrings|=signalActions)} input The input to sample.
     * @returns {boolean}
     * @version AM_1.2.0 https://github.com/mickelson/attract/blob/v1.2.0/Layouts.md?plain=1#L425
     */
    get_input_state = function(input) {},

    /**
     * Returns the position of an analog input.
     * - Joystick axis - Range `0...100`.
     * - Mouse position - Distance from application window's top-left corner.
     * - Mouse wheel delta - Range `-10...10`.
     * @method
     * @param {string(=joyStrings|=mouseStrings)} input The input to sample.
     * @returns {integer}
     * @version AM_1.2.0 https://github.com/mickelson/attract/blob/v1.2.0/Layouts.md?plain=1#L447
     */
    get_input_pos = function (input) {},

    /**
     * Signals an action programmatically, as opposed to a user-control signalled action.
     *
     * The action is processed normally, passing through `fe.add_signal_handler()` before being executed.
     * @method
     * @param {string(=signalActions)} action The signal action to trigger.
     * @version AM_1.4.1 https://github.com/mickelson/attract/blob/v1.4.1/Layouts.md?plain=1#L582
     */
    signal = function (action) {},

    /**
     * Sets the current Display by index, updating `fe.list`. Clamps to the available range.
     * @method
     * @param {integer} index The index to set.
     * @version AM_2.0.0-rc1 https://github.com/mickelson/attract/blob/v2.0.0-rc1/Layouts.md?plain=1#L824
     */
    set_display = function (index) {},

    /**
     * @ignore
     * @method
     * @variation set_display
     * @param {integer} index The index to set.
     * @param {boolean} stack Add the current Display to the history stack. Defaults to `false`.
     * @version AM_2.3.0 https://github.com/mickelson/attract/blob/v2.3.0/Layouts.md?plain=1#L838
     */
    set_display = function (index, stack = false) {},

    /**
     * @ignore
     * @method
     * @variation set_display
     * @param {integer} index The index to set.
     * @param {boolean} stack Add the current Display to the history stack. Defaults to `false`.
     * @param {boolean} reload Force the Layout to reload. Defaults to `true`.
     * @version 🔶AM+_3.0.0 https://github.com/oomek/attractplus/blob/3.0.0/Layouts.md?plain=1#L912
     */
    set_display = function (index, stack = false, reload = true) {},

    /**
     * Registers a function to be called when the application is signalled an action.
     *
     * Actions are signalled by user-controls, or by calling `fe.signal()`.
     *
     * The callback may return `true` to cancel the action.
     * @method
     * @param {string} name The name of the callback function.
     * @version AM_1.4.1 https://github.com/mickelson/attract/blob/v1.4.1/Layouts.md?plain=1#L633
     * @example
     * ```
     * add_signal_handler("on_signal");
     * function on_signal(action) {
     *     fe.log(action); // The signalled action
     *     return false;   // true to cancel, false to execute
     * }
     * ```
     */
    add_signal_handler = function (name) {},

    /**
     * @ignore
     * @variation add_signal_handler
     * @param {*} env The object to use as the current environment.
     * @param {string} name The name of the callback function.
     * @version AM_1.4.1 https://github.com/mickelson/attract/blob/v1.4.1/Layouts.md?plain=1#L632
     * @example
     * ```
     * add_signal_handler(this, "on_signal");
     * function on_signal(action) {
     *     fe.log(action); // The signalled action
     *     return false;   // true to cancel, false to execute
     * }
     * ```
     */
    add_signal_handler = function (env, name) {},

    /**
     * Removes a previously registered signal handler.
     * @method
     * @param {string} name The name of the callback function to deregister.
     * @version AM_1.4.1 https://github.com/mickelson/attract/blob/v1.4.1/Layouts.md?plain=1#L678
     */
    remove_signal_handler = function (name) {},

    /**
     * @ignore
     * @variation remove_signal_handler
     * @param {*} env The object to use as the current environment.
     * @param {string} name The name of the callback function to deregister.
     * @version AM_1.4.1 https://github.com/mickelson/attract/blob/v1.4.1/Layouts.md?plain=1#L677
     */
    remove_signal_handler = function (env, name) {},

    /**
     * Imports a Squirrel file to the current environment.
     *
     * All root objects become globally available:
     * - `class foo {}` - Class declarations.
     * - `function bar() {}` - Function declarations.
     * - `slot <- "value"` - Root members.
     * @method
     * @param {string($nut)} filename The filename of the script to import. Relative to Layout/Plugin, or absolute.
     * @version AM_1.0.2 https://github.com/mickelson/attract/blob/v1.0.2/Layouts.md?plain=1#L402
     */
    do_nut = function (filename) {},

    /**
     * Imports a Module to the current environment, returning `true` on success.
     *
     * A Module is a reusable Squirrel library, located in the `/modules` directory.
     *
     * All root objects become globally available:
     * - `class foo {}` - Class declarations.
     * - `function bar() {}` - Function declarations.
     * - `slot <- "value"` - Root members.
     * @method
     * @param {string($module)} name The name of the Module to import.
     * @returns {boolean}
     * @version AM_1.3.1 https://github.com/mickelson/attract/blob/v1.3.1/Layouts.md?plain=1#L573
     */
    load_module = function (name) {},

    /**
     * Executes a system command, blocking the application until it completes.
     * @method
     * @param {string} command The command to run.
     * @param {string} args The arguments for the command.
     * @version AM_1.1.0 https://github.com/mickelson/attract/blob/v1.1.0/Layouts.md?plain=1#L441
     */
    plugin_command = function (command, args) {},

    /**
     * @ignore
     * @variation plugin_command
     * @param {string} command The command to run.
     * @param {string} args The arguments for to the command.
     * @param {string} callback The name of the callback function.
     * @version AM_1.1.0 https://github.com/mickelson/attract/blob/v1.1.0/Layouts.md?plain=1#L442
     * @example
     * ```
     * plugin_command("command.bat", "-arg", "on_command");
     * function on_command(stdout) {
     *     fe.log(stdout); // stdout may arrive in multiple parts
     * }
     * ```
     */
    plugin_command = function (command, args, callback) {},

    /**
     * @ignore
     * @variation plugin_command
     * @param {string} command The command to run.
     * @param {string} args The arguments to append to the command.
     * @param {*} env The object to use as the current environment.
     * @param {string} callback The name of the callback function.
     * @version AM_1.4.1 https://github.com/mickelson/attract/blob/v1.4.1/Layouts.md?plain=1#L733
     * @example
     * ```
     * plugin_command("command.bat", "-arg", this, "on_command");
     * function on_command(stdout) {
     *     fe.log(stdout); // stdout may arrive in multiple parts
     * }
     * ```
     */
    plugin_command = function (command, args, env, callback) {},

    /**
     * Executes a system command in the background.
     * @method
     * @param {string} command The command to run.
     * @param {string} args The arguments for the command.
     * @version AM_1.1.0 https://github.com/mickelson/attract/blob/v1.1.0/Layouts.md?plain=1#L467
     */
    plugin_command_bg = function (command, args) {},

    /**
     * Substitutes leading system tokens in the given path.
     * - `~` or `$HOME` - The User's home directory.
     * - `%SYSTEMROOT%` - The Windows directory.
     * - `%PROGRAMFILES%` - The "Program Files" directory.
     * - `%PROGRAMFILESx86%` - The "Program Files (x86)" directory.
     * @method
     * @param {string} path The path to expand.
     * @returns {string}
     * @version AM_1.1.0 https://github.com/mickelson/attract/blob/v1.1.0/Layouts.md?plain=1#L480
     */
    path_expand = function (path) {},

    /**
     * Checks the given path has the status indicated by the flag.
     * @method
     * @param {string} path The path to check. Relative to the application, or absolute.
     * @param {PathTest} flag The status to check.
     * @returns {boolean}
     * @version AM_2.4.0 https://github.com/mickelson/attract/blob/v2.4.0/Layouts.md?plain=1#L1038
     */
    path_test = function (path, flag) {},

    /**
     * Returns the modified time of the given file as a GTM timestamp.
     * @method
     * @param {string} filename The filename to check. Relative to the application, or absolute.
     * @returns {integer}
     * @version 🔶AM+_3.1.0 https://github.com/oomek/attractplus/blob/3.1.0/Layouts.md?plain=1#L1182
     */
    get_file_mtime = function (filename) {},

    /**
     * Returns user configurable values defined by the `UserConfig` class.
     *
     * Layouts, Plugins, Screensavers and Intros may contain this class.
     * @method
     * @returns {table}
     * @version AM_1.2.0 https://github.com/mickelson/attract/blob/v1.2.0/Layouts.md?plain=1#L533
     */
    get_config = function () {},

    /**
     * Returns the text translated into the user's configured language, or the given text if none available.
     * @method
     * @param {string} value The text to translate.
     * @returns {string}
     * @version AM_2.5.0 https://github.com/mickelson/attract/blob/v2.5.0/Layouts.md?plain=1#L1099
     */
    get_text = function (value) {},

    /**
     * Saves the response from the given url to a file, returning `true` on success.
     *
     * Blocks the application until the response is complete.
     * @method
     * @param {string} url The url to download.
     * @param {string} filename The filename to save to. Relative to Layout/Plugin, or absolute.
     * @returns {boolean}
     * @version 🔶AM+_3.0.0 https://github.com/oomek/attractplus/blob/3.0.0/Layouts.md?plain=1#L1189
     */
    get_url = function (url, filename) {},

    /**
     * Prints the given value to the standard output.
     *
     * Adds a newline and flushes the buffer for immediate display.
     * @method
     * @param {*} value The value to print.
     * @version 🔶AM+_3.0.9 https://github.com/oomek/attractplus/blob/3.0.9/Layouts.md?plain=1#L1211
     */
    log = function (value) {},


    // fe.is_keypressed( keycode ) // AM_1.0.2 https://github.com/mickelson/attract/blob/v1.0.2/Layouts.md?plain=1#L328
    // fe.is_joybuttonpressed( joy_id, button_num ) // AM_1.0.2 https://github.com/mickelson/attract/blob/v1.0.2/Layouts.md?plain=1#L363
    // fe.get_joyaxispos( joy_id, axis_id ) // AM_1.0.2 https://github.com/mickelson/attract/blob/v1.0.2/Layouts.md?plain=1#L379

    // #endregion

    // ---------------------------------------------------------------------------------
    // #region PROPS

    /**
     * The *Ambient Soundtrack* Sound instance.
     * @version AM_1.4.1 https://github.com/mickelson/attract/blob/v1.4.1/Layouts.md?plain=1#L825
     */
    ambient_sound = fe.Music,

    /**
     * The Global Layout settings.
     * @version AM_1.0.2 https://github.com/mickelson/attract/blob/v1.0.2/Layouts.md?plain=1#L418
     */
    layout = fe.LayoutGlobals,

    /**
     * The current Display settings.
     * @version AM_1.1.0 https://github.com/mickelson/attract/blob/v1.1.0/Layouts.md?plain=1#L505
     */
    list = fe.CurrentList,

    /**
     * The Image cache settings
     * @version AM_2.6.2 https://github.com/mickelson/attract/blob/v2.6.2/Layouts.md?plain=1#L1187
     */
    image_cache = fe.ImageCache,

    /**
     * The Overlay controller
     * @version AM_1.4.1 https://github.com/mickelson/attract/blob/v1.4.1/Layouts.md?plain=1#L846
     */
    overlay = fe.Overlay,

    /**
     * The draw list, containing all added Layout elements.
     * @version AM_1.3.2 https://github.com/mickelson/attract/blob/v1.3.2/Layouts.md?plain=1#L699
     */
    obj = [],
    // objs // AM_1.0.2 https://github.com/mickelson/attract/blob/v1.0.2/Layouts.md?plain=1#L426

    /**
     * The available Displays.
     * @version AM_2.0.0-rc1 https://github.com/mickelson/attract/blob/v2.0.0-rc1/Layouts.md?plain=1#L1076
     */
    displays = [fe.Display],

    /**
     * The Filters for the current Display.
     * @version AM_1.5.0 https://github.com/mickelson/attract/blob/v1.5.0/Layouts.md?plain=1#L878
     */
    filters = [fe.Filter],

    /**
     * The available Monitors.
     *
     * The first entry is the system's primary monitor.
     * @note OSX does not support multiple monitors.
     * @version AM_1.5.2 https://github.com/mickelson/attract/blob/v1.5.2/Layouts.md?plain=1#L932
     */
    monitors = [fe.Monitor],

    /**
     * The current Layout or Plugin directory.
     * @external $script_dir
     * @version AM_1.3.1 https://github.com/mickelson/attract/blob/v1.3.1/Layouts.md?plain=1#L705
     */
    script_dir = "",

    /**
     * The current Layout or Plugin filename.
     * @external $script_file
     * @version AM_1.3.1 https://github.com/mickelson/attract/blob/v1.3.1/Layouts.md?plain=1#L712
     */
    script_file = "",
    // init_name https://github.com/mickelson/attract/blob/v1.1.0/Layouts.md?plain=1#L517
    // uconfig https://github.com/mickelson/attract/blob/v1.1.0/Layouts.md?plain=1#L523

    /**
     * The current Module directory.
     * @external $module_dir
     * @version AM_2.6.2 https://github.com/mickelson/attract/blob/v2.6.2/Layouts.md?plain=1#L1255
     */
    module_dir = "",

    /**
     * Non-volatile storage that persists between application restarts.
     *
     * The table is written to `script.nv`, which is loaded on startup and saved on shutdown.
     * @note Only primitive data types can be stored.
     * @version AM_1.6.0 https://github.com/mickelson/attract/blob/v1.6.0/Layouts.md?plain=1#L1054
     */
    nv = {},

    // #endregion

    // ---------------------------------------------------------------------------------
    // #region CLASSES

    /**
     * @inheritdoc
     */
    LayoutGlobals = class extends feLayoutGlobals {},
    /**
     * @inheritdoc
     */
    CurrentList = class extends feCurrentList {},
    /**
     * @inheritdoc
     */
    ImageCache = class extends feImageCache {},
    /**
     * @inheritdoc
     */
    Overlay = class extends feOverlay {},
    /**
     * @inheritdoc
     */
    Display = class extends feDisplay {},
    /**
     * @inheritdoc
     */
    Filter = class extends feFilter {},
    /**
     * @inheritdoc
     */
    Monitor = class extends feMonitor {},
    /**
     * @inheritdoc
     */
    Music = class extends feMusic {},
    /**
     * @inheritdoc
     */
    Image = class extends feImage {},
    /**
     * @inheritdoc
     */
    Surface = class extends feSurface {},
    /**
     * @inheritdoc
     */
    Text = class extends feText {},
    /**
     * @inheritdoc
     */
    ListBox = class extends feListBox {},
    /**
     * @inheritdoc
     */
    Rectangle = class extends feRectangle {},
    /**
     * @inheritdoc
     */
    Sound = class extends feSound {},
    /**
     * @inheritdoc
     */
    Shader = class extends feShader {},

    // #endregion
}
