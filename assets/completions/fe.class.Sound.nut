/**
 * Attract-Mode Frontend
 *
 * @package fe.Sound
 * @global
 */

/**
 * An element for playing sounds.
 *
 * This class can only be instantiated using:
 * - `fe.add_sound()`
 *
 * @ignore
 * @class
 * @type {feSound}
 * @alias fe.Sound
 * @version AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#fesound
 * @since AM_1.0.2 https://github.com/mickelson/attract/blob/v1.0.2/Layouts.md?plain=1#L669
 */
class feSound {
    /**
     * The filename of the audio.
     * @version AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#fesound
     * @since AM_1.4.1 https://github.com/mickelson/attract/blob/v1.4.1/Layouts.md?plain=1#L1302
     */
    file_name = "";

    /**
     * The volume of the sound.
     * @default `100.0`
     * @version 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#fesound
     * @since 🔶AM+_3.1.0 https://github.com/oomek/attractplus/blob/3.1.0/Layouts.md?plain=1#L2252
     */
    volume = 0.0;

    /**
     * The audio panning, which positions the sound centre from left to right `-1.0...1.0`.
     * @default `0.0`
     * @version 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#fesound
     * @since 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/3.2.0/Layouts.md?plain=1#1947
     */
    pan = 0.0;

    /**
     * The playback state of the audio.
     * - `true` - Start playing the audio from the beginning.
     * - `false` - Stop the audio.
     * @default `false`
     * @version AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#fesound
     * @since AM_1.4.1 https://github.com/mickelson/attract/blob/v1.4.1/Layouts.md?plain=1#L1303
     */
    playing = false;
    // * @since AM_1.0.2 https://github.com/mickelson/attract/blob/v1.0.2/Layouts.md?plain=1#L677

    /**
     * Restart the audio upon completion.
     * @default `false`
     * @version AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#fesound
     * @since AM_1.4.1 https://github.com/mickelson/attract/blob/v1.4.1/Layouts.md?plain=1#L1304
     */
    loop = false;

    /**
     * The pitch of the audio, which also affects its playback speed.
     * @default `1.0`
     * @version AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#fesound
     * @since AM_1.0.2 https://github.com/mickelson/attract/blob/v1.0.2/Layouts.md?plain=1#L678
     */
    pitch = 1.0;

    /**
     * The x position of spatial audio.
     * @requires - Single channel audio file.
     * @default `0.0`
     * @version AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#fesound
     * @since AM_1.0.2 https://github.com/mickelson/attract/blob/v1.0.2/Layouts.md?plain=1#L679
     */
    x = 0.0;

    /**
     * The y position of spatial audio.
     * @requires - Single channel audio file.
     * @default `0.0`
     * @version AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#fesound
     * @since AM_1.0.2 https://github.com/mickelson/attract/blob/v1.0.2/Layouts.md?plain=1#L680
     */
    y = 0.0;

    /**
     * The z position of spatial audio.
     * @requires - Single channel audio file.
     * @default `0.0`
     * @version AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#fesound
     * @since AM_1.0.2 https://github.com/mickelson/attract/blob/v1.0.2/Layouts.md?plain=1#L681
     */
    z = 0.0;

    // play https://github.com/mickelson/attract/blob/v1.0.2/Layouts.md?plain=1#L685

    /**
     * @ignore
     *
     * @property {integer} duration - The audio duration in milliseconds.
     * @version AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#fesound
     * @since AM_1.4.1 https://github.com/mickelson/attract/blob/v1.4.1/Layouts.md?plain=1#L1309
     *
     * @property {integer} time - The current audio time in milliseconds.
     * @version AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#fesound
     * @since AM_1.4.1 https://github.com/mickelson/attract/blob/v1.4.1/Layouts.md?plain=1#L1310
     */
    function _get() {}

    /**
     * Returns meta data from the audio file, or an empty string if none exists.
     * @param {string(=audioTags)} tag The meta data to retrieve.
     * @returns {string}
     * @version AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#fesound
     * @since AM_1.4.1 https://github.com/mickelson/attract/blob/v1.4.1/Layouts.md?plain=1#L1315
     * @deprecated description
     */
    function get_metadata(tag) {}
}
