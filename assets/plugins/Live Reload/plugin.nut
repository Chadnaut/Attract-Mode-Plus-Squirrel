/**
 * Automatically reload AM+ when saving files in VSCode.
 *
 * @summary Live Reload
 * @version 1.0.2 2025-04-10
 * @author Chadnaut
 * @url https://github.com/Chadnaut/Attract-Mode-Plus-Squirrel
 *
 * Requires the AM+ Squirrel extension for VS Code
 * @see https://marketplace.visualstudio.com/items?itemName=chadnaut.am-squirrel
 */

/** The file to watch */
local watch_file = ::fe.script_dir + "plugin.log"

class UserConfig
</ help="Live Reload (v1.0.2) - Automatically reload AM+ when saving files in VSCode." />
{
    </ label="Frequency", options="100ms,250ms,500ms,1000ms,2000ms,5000ms", help="How often to check for changes", order=1 /> watch_frequency = "250ms"
}

/** Live Reload plugin class */
class LiveReload {
    interval = 0
    frequency = 0
    watch_content = null
    content_callback = null

    /** Creates an instance of LiveReload. */
    constructor() {
        local config = ::fe.get_config()
        local has_mtime = FeVersionNum >= 310
        content_callback = has_mtime ? get_file_mtime : get_file_contents
        frequency = config["watch_frequency"].tointeger() || 250
        ::fe.add_ticks_callback(this, "on_tick")
    }

    /** Checks the watch_file for changes, and triggers a reload */
    function on_tick(ttime) {
        // Wait until interval
        if (ttime < interval) return
        interval = ttime + frequency

        // Get the file content
        local content = content_callback(watch_file)
        if (!content) return

        // If the content has changed then signal a reload
        local reload = !!watch_content && watch_content != content
        watch_content = content
        if (reload) ::fe.signal("reload")
    }

    /** Return the modified time of a file */
    function get_file_mtime(filename) {
        return ::fe.get_file_mtime(filename)
    }

    /** Return the contents of a file (used when get_file_mtime unavailable) */
    function get_file_contents(filename) {
        try {
            local content = ""
            local f = ::file(filename, "rb")
            local b = f.readblob(f.len())
            while (!b.eos()) content += b.readn('b').tochar()
            f.close()
            return content
        } catch (err) {}
    }
}

::fe.plugin["LiveReload"] <- LiveReload()
