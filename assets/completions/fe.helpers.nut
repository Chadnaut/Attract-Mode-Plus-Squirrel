/**
 * Attract-Mode Frontend
 *
 * @package AttractMode
 * @global
 */

// -------------------------------------------------------------------------------------
// Helpers

/**
 * Creates a new Image element.
 *
 * When *[MagicTokens]* are used *@dynamic* properties get updated automatically.
 * @ignore
 * @method
 * @param {string($image|$video)} filename The filename of the image or video, accepts *[MagicTokens]*. Relative to Layout/Plugin, or absolute.
 * @returns {feImage}
 */
function add_image1(filename) {}

/**
 * @ignore
 * @method
 * @variation add_image1
 * @param {string($image|$video)} filename The filename of the image or video, accepts *[MagicTokens]*. Relative to Layout/Plugin, or absolute.
 * @param {float} x The x position of the element.
 * @param {float} y The y position of the element.
 * @returns {feImage}
 */
function add_image2(filename, x, y) {}

/**
 * @ignore
 * @method
 * @variation add_image1
 * @param {string($image|$video)} filename The filename of the image or video, accepts *[MagicTokens]*. Relative to Layout/Plugin, or absolute.
 * @param {float} x The x position of the element.
 * @param {float} y The y position of the element.
 * @param {float} width The width of the element. Use `0.0` to auto-size to the texture width.
 * @param {float} height The height of the element. Use `0.0` to auto-size to the texture height.
 * @returns {feImage}
 */
function add_image3(filename, x, y, width, height) {}

/**
 * Creates a new Artwork element.
 *
 * Artwork element's *@dynamic* properties get updated automatically.
 * @ignore
 * @method
 * @param {string($artwork)} label The artwork resource label.
 * @returns {feImage}
 */
function add_artwork1(label) {}

/**
 * @ignore
 * @method
 * @variation add_artwork1
 * @param {string($artwork)} label The artwork resource label.
 * @param {float} x The x position of the element.
 * @param {float} y The y position of the element.
 * @returns {feImage}
 */
function add_artwork2(label, x, y) {}

/**
 * @ignore
 * @method
 * @variation add_artwork1
 * @param {string($artwork)} label The artwork resource label.
 * @param {float} x The x position of the element.
 * @param {float} y The y position of the element.
 * @param {float} width The width of the element. Use `0.0` to auto-size to the texture width.
 * @param {float} height The height of the element. Use `0.0` to auto-size to the texture height.
 * @returns {feImage}
 */
function add_artwork3(label, x, y, width, height) {}

/**
 * Creates a new Surface element.
 *
 * The texture will be created at the same size as the element.
 * @ignore
 * @method
 * @param {float} width The width of the element.
 * @param {float} height The height of the element.
 * @returns {feSurface}
 */
function add_surface1(width, height) {}

/**
 * @ignore
 * @method
 * @variation add_surface1
 * @param {float} x The x position of the element.
 * @param {float} y The y position of the element.
 * @param {float} width The width of the element.
 * @param {float} height The height of the element.
 * @returns {feSurface}
 */
function add_surface2(x, y, width, height) {}

/**
 * Creates a new Image element that shares the `texture` of the given element.
 *
 * Properties of the texture can be modified by either element:
 * `file_name` `filter_offset` `index_offset` `mipmap` `sample_aspect_ratio` `shader` `smooth` `texture_height` `texture_width` `trigger` `video_duration` `video_flags` `video_playing` `video_time`
 *
 * All other properties are copied to the clone at creation time.
 * @ignore
 * @method
 * @param {fe.Image} element The Image, Artwork or Surface to clone.
 */
function add_clone1(element) { return element }

/**
 * Creates a new Text element.
 *
 * When *[MagicTokens]* are used *@dynamic* properties get updated automatically.
 * @ignore
 * @method
 * @param {string} msg The message displayed in the element, accepts *[MagicTokens]*.
 * @param {float} x The x position of the element.
 * @param {float} y The y position of the element.
 * @param {float} width The width of the element.
 * @param {float} height The height of the element.
 * @returns {feText}
 */
function add_text1(msg, x, y, width, height) {}

/**
 * Creates a new Listbox element.
 * @ignore
 * @method
 * @param {float} x The x position of the element.
 * @param {float} y The y position of the element.
 * @param {float} width The width of the element.
 * @param {float} height The height of the element.
 * @returns {feListBox}
 */
function add_listbox1(x, y, width, height) {}

/**
 * Creates a new Rectangle element.
 * @ignore
 * @method
 * @param {float} x The x position of the element.
 * @param {float} y The y position of the element.
 * @param {float} width The width of the element.
 * @param {float} height The height of the element.
 * @returns {feRectangle}
 */
function add_rectangle1(x, y, width, height) {}

/**
 * Creates a new Shader.
 *
 * Shader code should target `#version 120` for best cross-platform compatibility.
 * @ignore
 * @method
 * @param {Shader} type The type of shader to create.
 * @returns {feShader}
 */
function add_shader1(type) {}

/**
 * @ignore
 * @method
 * @variation add_shader1
 * @param {Shader} type The type of shader to create.
 * @param {string($shader)} name The filename of the vertex or fragment shader.
 * @returns {feShader}
 */
function add_shader2(type, name) {}

/**
 * @ignore
 * @method
 * @variation add_shader1
 * @param {Shader} type The type of shader to create.
 * @param {string($shader)} vert The filename of the vertex shader.
 * @param {string($shader)} frag The filename of the fragment shader.
 * @returns {feShader}
 */
function add_shader3(type, vert, frag) {}

/**
 * Creates a new Sound element.
 *
 * Sound audio is stored in RAM.
 * @ignore
 * @method
 * @param {string($audio)} filename The filename of the audio.
 * @returns {feSound}
 */
function add_sound1(filename) {}

/**
 * @ignore
 * @method
 * @variation add_sound1
 * @param {string($audio)} filename The filename of the audio.
 * @param {boolean} reuse Re-use audio if already loaded. Defaults to `true`.
 * @returns {feSound}
 * @deprecated
 */
function add_sound2(filename, reuse = true) {}

/**
 * Creates a new Music element.
 *
 * Music audio is streamed from the disk.
 * @ignore
 * @method
 * @param {string($audio)} filename The filename of the audio.
 * @returns {feMusic}
 */
function add_music1(filename) {}
