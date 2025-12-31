/**
 * Attract-Mode Frontend
 *
 * @package fe.Music
 * @global
 */

/**
 * An element for playing music.
 *
 * This class can only be instantiated using:
 * - `fe.add_music()`
 *
 * @ignore
 * @class
 * @type {feMusic}
 * @alias fe.Music
 * @version 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#femusic-
 * @since 🔶AM+_3.1.0 https://github.com/oomek/attractplus/blob/3.1.0/Layouts.md?plain=1
 */
class feMusic {
    /**
     * The filename of the audio.
     * @version 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#femusic-
     * @since 🔶AM+_3.1.0 https://github.com/oomek/attractplus/blob/3.1.0/Layouts.md?plain=1#L2275
     */
    file_name = "";

    /**
     * The volume of the sound.
     * @default `100.0`
     * @version 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#femusic-
     * @since 🔶AM+_3.1.0 https://github.com/oomek/attractplus/blob/3.1.0/Layouts.md?plain=1#L2276
     */
    volume = 0.0;

    /**
     * The audio panning, which positions the sound centre from left to right `-1.0...1.0`.
     * @default `0.0`
     * @version 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#femusic-
     * @since 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/3.2.0/Layouts.md?plain=1#1994
     */
    pan = 0.0;

    /**
     * The playback state of the audio.
     * - `true` - Start playing the audio from the beginning.
     * - `false` - Stop the audio.
     * @default `false`
     * @version 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#femusic-
     * @since 🔶AM+_3.1.0 https://github.com/oomek/attractplus/blob/3.1.0/Layouts.md?plain=1#L2277
     */
    playing = false;

    /**
     * Restart the audio upon completion.
     * @default `false`
     * @version 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#femusic-
     * @since 🔶AM+_3.1.0 https://github.com/oomek/attractplus/blob/3.1.0/Layouts.md?plain=1#L2278
     */
    loop = false;

    /**
     * The pitch of the audio, which also affects its playback speed.
     * @default `1.0`
     * @version 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#femusic-
     * @since 🔶AM+_3.1.0 https://github.com/oomek/attractplus/blob/3.1.0/Layouts.md?plain=1#L2279
     */
    pitch = 1.0;

    /**
     * The x position of spatial audio.
     * @requires - Single channel audio file.
     * @default `0.0`
     * @version 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#femusic-
     * @since 🔶AM+_3.1.0 https://github.com/oomek/attractplus/blob/3.1.0/Layouts.md?plain=1#L2280
     */
    x = 0.0;

    /**
     * The y position of spatial audio.
     * @requires - Single channel audio file.
     * @default `0.0`
     * @version 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#femusic-
     * @since 🔶AM+_3.1.0 https://github.com/oomek/attractplus/blob/3.1.0/Layouts.md?plain=1#L2281
     */
    y = 0.0;

    /**
     * The z position of spatial audio.
     * @requires - Single channel audio file.
     * @default `0.0`
     * @version 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#femusic-
     * @since 🔶AM+_3.1.0 https://github.com/oomek/attractplus/blob/3.1.0/Layouts.md?plain=1#L2282
     */
    z = 0.0;

    /**
     * The Fast Fourier Transform array size `2...128`.
     * @default `32`
     * @version 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#femusic-
     * @since 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/3.2.0/Layouts.md?plain=1#2009
     */
    fft_bands = 32;

    /**
     * @ignore
     *
     * @property {integer} duration - The audio duration in milliseconds.
     * @version 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#femusic-
     * @since 🔶AM+_3.1.0 https://github.com/oomek/attractplus/blob/3.1.0/Layouts.md?plain=1#L2283
     *
     * @property {integer} time - The current audio time in milliseconds.
     * @version 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#femusic-
     * @since 🔶AM+_3.1.0 https://github.com/oomek/attractplus/blob/3.1.0/Layouts.md?plain=1#L2284
     *
     * @property {float} vu The mono audio channel VU meter value.
     * @version 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#femusic-
     * @since 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/3.2.0/Layouts.md?plain=1#2003
     *
     * @property {float} vu_left The left audio channel VU meter value.
     * @version 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#femusic-
     * @since 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/3.2.0/Layouts.md?plain=1#2004
     *
     * @property {float} vu_right The right audio channel VU meter value.
     * @version 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#femusic-
     * @since 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/3.2.0/Layouts.md?plain=1#2005
     *
     * @property {array(float)} fft An array of Fast-Fourier-Transform values for the mono audio channel.
     *
     * The array size is controlled using `fft_bands`.
     * @version 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#femusic-
     * @since 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/3.2.0/Layouts.md?plain=1#2006
     *
     * @property {array(float)} fft_left An array of Fast-Fourier-Transform values for the left audio channel.
     *
     * The array size is controlled using `fft_bands`.
     * @version 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#femusic-
     * @since 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/3.2.0/Layouts.md?plain=1#2007
     *
     * @property {array(float)} fft_right An array of Fast-Fourier-Transform values for the right audio channel.
     *
     * The array size is controlled using `fft_bands`.
     * @version 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#femusic-
     * @since 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/3.2.0/Layouts.md?plain=1#2008
     */
    function _get() {}

    /**
     * Returns meta data from the audio file, or an empty string if none exists.
     * @param {string(=audioTags)} tag The meta data to retrieve.
     * @returns {string}
     * @version 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#femusic-
     * @since 🔶AM+_3.1.0 https://github.com/oomek/attractplus/blob/3.1.0/Layouts.md?plain=1#L2289
     */
    function get_metadata(tag) {}
}
