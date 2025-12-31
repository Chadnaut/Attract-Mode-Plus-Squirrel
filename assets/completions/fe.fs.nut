/**
 * Attract-Mode Frontend
 *
 * @package FileSystem
 * @global
 */

/**
 * File system functions
 * @class
 * @type {fs}
 * @version 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#functions
 * @since 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/3.2.0/Layouts.md?plain=1#2042
 */
fs <- {
    /**
     * @inheritdoc
     */
    path_expand = path_expand1,

    /**
     * @inheritdoc
     */
    path_test = path_test1,

    /**
     * @inheritdoc
     */
    get_file_mtime = get_file_mtime1,

    /**
     * Set the modified time of the given file.
     * @method
     * @param {string} filename The filename to set. Relative to the application, or absolute.
     * @param {integer} time The GMT timestamp in seconds to set.
     * @returns {integer}
     * @version 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#fsset_file_mtime-
     * @since 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/3.2.0/Layouts.md?plain=1#L2103
     */
    set_file_mtime = function(filename, time) {},

    /**
     * Returns an array of files within the given path.
     * @method
     * @param {string} path The folder to list.
     * @returns {array(string)}
     * @version 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#fsget_dir-
     * @since 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/3.2.0/Layouts.md?plain=1#L2121
     */
    get_dir = function(path) {},

    /**
     * Create a folder at the given path, returns `true` on success.
     * @method
     * @param {string} path The folder to create.
     * @returns {boolean}
     * @version 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#fsmake_dir-
     * @since 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/3.2.0/Layouts.md?plain=1#L2139
     */
    make_dir = function(path) {},

    /**
     * Copy a file, returns `true` on success.
     * @method
     * @param {string} src The source file.
     * @param {string} dst The destination file.
     * @returns {boolean}
     * @version 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#fscopy_file-
     * @since 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/3.2.0/Layouts.md?plain=1#L2157
     */
    copy_file = function(src, dst) {}
}