/**
 * Attract-Mode Frontend
 *
 * @package fe.ImageCache
 * @global
 */

/**
 * The Image cache, available at `fe.image_cache`.
 *
 * @note This class cannot be instantiated.
 * @ignore
 * @class
 * @type {feImageCache}
 * @alias fe.ImageCache
 * @version AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#feimagecache
 * @since AM_2.6.2 https://github.com/mickelson/attract/blob/v2.6.2/Layouts.md?plain=1#L1346
 */
class feImageCache {

    /**
     * @ignore
     *
     * @property {integer} count
     * The number of images in the cache.
     * @version AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#feimagecache
     * @since AM_2.6.2 https://github.com/mickelson/attract/blob/v2.6.2/Layouts.md?plain=1#L1354
     *
     * @property {integer} size
     * The current size of the cache in bytes.
     * @version AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#feimagecache
     * @since AM_2.6.2 https://github.com/mickelson/attract/blob/v2.6.2/Layouts.md?plain=1#L1355
     *
     * @property {integer} max_size
     * The maximum size of the cache in bytes.
     * @version AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#feimagecache
     * @since AM_2.6.2 https://github.com/mickelson/attract/blob/v2.6.2/Layouts.md?plain=1#L1356
     */
    function _get() {}

    /**
     * Load images using a background thread.
     *
     * @note Reduces skipped frames, but may cause flicker.
     * @default `false`
     * @version AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#feimagecache
     * @since AM_2.6.2 https://github.com/mickelson/attract/blob/v2.6.2/Layouts.md?plain=1#L1358
     */
    bg_load = false;

    /**
     * Adds the given file to the cache, or flags it as recently used.
     *
     * Images that have not been recently used are removed when space is needed.
     * @param {string} filename The filename of the image to cache.
     * @version AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#feimagecache
     * @since AM_2.6.2 https://github.com/mickelson/attract/blob/v2.6.2/Layouts.md?plain=1#L1364
     */
    function add_image(filename) {}

    /**
     * Returns the filename of the image at the given index.
     * @param {integer} index The index of the cached image.
     * @version AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#feimagecache
     * @since AM_2.6.2 https://github.com/mickelson/attract/blob/v2.6.2/Layouts.md?plain=1#L1368
     */
    function name_at(index) {}

    /**
     * Returns the size in bytes of the image at the given index.
     * @param {integer} index The index of the cached image.
     * @version AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#feimagecache
     * @since AM_2.6.2 https://github.com/mickelson/attract/blob/v2.6.2/Layouts.md?plain=1#L1370
     */
    function size_at(index) {}
}
