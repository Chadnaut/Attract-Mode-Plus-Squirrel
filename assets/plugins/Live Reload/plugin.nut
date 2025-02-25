/**
 * Automatically reload AM+ when saving files in VSCode.
 * @package Live Reload
 * @version 1.0.1
 * @author Chadnaut<https://github.com/Chadnaut> 2024
 * @requires SquirrelAM+ extension for VSCode
 * @see https://github.com/Chadnaut/Attract-Mode-Modules
 */

local watch_file = ::fe.script_dir + "plugin.log";

class UserConfig </ help="Live Reload (v1.0.0) - Automatically reload AM+ when saving files in VSCode." /> {
    </
        label="Frequency",
        options="100ms,250ms,500ms,1000ms,2000ms,5000ms",
        help="How often to check for changes",
        order=1
    />
    watch_frequency = "250ms";
}

class LiveReload {
    watch_frequency = 0;
    watch_message = null;
    watch_time = 0;

    constructor() {
        local config = ::fe.get_config();
        watch_frequency = config["watch_frequency"].tointeger();
        ::fe.add_ticks_callback(this, "on_tick");
    }

    function on_tick(ttime) {
        if (ttime < watch_time) return;

        watch_time = ttime + watch_frequency;
        local message = read_file(watch_file);
        if (!message) return;

        local reload = !!watch_message && watch_message != message;
        watch_message = message;
        if (reload) ::fe.signal("reload");
    }

    function read_file(filename) {
        try {
            local content = "";
            local f = ::file(filename, "rb");
            local b = f.readblob(f.len());
            while (!b.eos()) content += b.readn('b').tochar();
            f.close();
            return content;
        } catch (err) {}
    }
}

::fe.plugin["LiveReload"] <- LiveReload();
