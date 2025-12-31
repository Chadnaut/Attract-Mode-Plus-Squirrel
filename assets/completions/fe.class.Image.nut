/**
 * Attract-Mode Frontend
 *
 * @package fe.Image
 * @global
 */

/**
 * An element for displaying images and videos.
 *
 * This class can only be instantiated using:
 * - `fe.add_image()`
 * - `fe.add_artwork()`
 * - `fe.add_clone()`
 *
 * @ignore
 * @class
 * @type {feImage}
 * @alias fe.Image
 * @version AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#feimage
 * @since AM_1.0.2 https://github.com/mickelson/attract/blob/v1.0.2/Layouts.md?plain=1#L453
 */
class feImage {

    // ---------------------------------------------------------------------------------
    // #region PRESENTABLE

    /**
     * The x position of the element.
     * @relative To the top-left corner of the parent Surface.
     * @default `0`
     * @version AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#feimage
     * @since AM_1.0.2 https://github.com/mickelson/attract/blob/v1.0.2/Layouts.md?plain=1#L463
     */
    x = 0.0;

    /**
     * The y position of the element.
     * @relative To the top-left corner of the parent Surface.
     * @default `0`
     * @version AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#feimage
     * @since AM_1.0.2 https://github.com/mickelson/attract/blob/v1.0.2/Layouts.md?plain=1#L464
     */
    y = 0.0;

    /**
     * The width of the element.
     *
     * Use `0.0` to auto-size to the texture width.
     * @default `0.0`
     * @version AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#feimage
     * @since AM_1.0.2 https://github.com/mickelson/attract/blob/v1.0.2/Layouts.md?plain=1#L465
     */
    width = 0.0;

    /**
     * The height of the element.
     *
     * Use `0.0` to auto-size to the texture height.
     * @default `0.0`
     * @version AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#feimage
     * @since AM_1.0.2 https://github.com/mickelson/attract/blob/v1.0.2/Layouts.md?plain=1#L467
     */
    height = 0.0;

    /**
     * The visibility of the element.
     *
     * When not visible the element won't be drawn to the parent Surface.
     * @default `true`
     * @version AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#feimage
     * @since AM_1.0.2 https://github.com/mickelson/attract/blob/v1.0.2/Layouts.md?plain=1#L469
     */
    visible = true;

    /**
     * Rotation of the element in clockwise degrees.
     * @relative To the `origin` or `rotation_origin`.
     * @default `0.0`
     * @version AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#feimage
     * @since AM_1.0.2 https://github.com/mickelson/attract/blob/v1.0.2/Layouts.md?plain=1#L471
     */
    rotation = 0.0;

    /**
     * The red channel level `0...255`.
     *
     * Sent to the shader as `gl_Color.r` `0.0...1.0`.
     * @default `255`
     * @version AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#feimage
     * @since AM_1.0.2 https://github.com/mickelson/attract/blob/v1.0.2/Layouts.md?plain=1#L473
     */
    red = 0;

    /**
     * The green channel level `0...255`.
     *
     * Sent to the shader as `gl_Color.g` `0.0...1.0`.
     * @default `255`
     * @version AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#feimage
     * @since AM_1.0.2 https://github.com/mickelson/attract/blob/v1.0.2/Layouts.md?plain=1#L475
     */
    green = 0;

    /**
     * The blue channel level `0...255`.
     *
     * Sent to the shader as `gl_Color.b` `0.0...1.0`.
     * @default `255`
     * @version AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#feimage
     * @since AM_1.0.2 https://github.com/mickelson/attract/blob/v1.0.2/Layouts.md?plain=1#L477
     */
    blue = 0;

    /**
     * The alpha channel level `0...255`.
     *
     * Sent to the shader as `gl_Color.a` `0.0...1.0`.
     * @default `255`
     * @version AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#feimage
     * @since AM_1.0.2 https://github.com/mickelson/attract/blob/v1.0.2/Layouts.md?plain=1#L479
     */
    alpha = 0;

    /**
     * The offset of the element's Game relative to the current Game.
     *
     * Use to select content adjacent to the current selection.
     * @default `0`
     * @version AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#feimage
     * @since AM_1.0.2 https://github.com/mickelson/attract/blob/v1.0.2/Layouts.md?plain=1#L481
     */
    index_offset = 0;

    /**
     * The offset of the element's Filter relative to the current Filter.
     *
     * Use to select content adjacent to the current selection.
     * @default `0`
     * @version AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#feimage
     * @since AM_1.5.0 https://github.com/mickelson/attract/blob/v1.5.0/Layouts.md?plain=1#L1060
     */
    filter_offset = 0;

    /**
     * The Shader applied to the element's texture.
     * @version AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#feimage
     * @since AM_1.2.0 https://github.com/mickelson/attract/blob/v1.2.0/Layouts.md?plain=1#L671
     */
    shader = feShader();

    /**
     * The drawing order of the element.
     * - Higher ordered elements are drawn on top.
     * - Identically ordered elements are drawn in order of creation.
     * @default `0`
     * @version AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#feimage
     * @since AM_2.0.0-rc1 https://github.com/mickelson/attract/blob/v2.0.0-rc1/Layouts.md?plain=1#L1414
     */
    zorder = 0;

    // #endregion

    // ---------------------------------------------------------------------------------
    // #region PROPS

    /**
     * The x position of the origin.
     *
     * The origin is the centre point for positioning, scaling and rotation.
     * @relative To the top-left corner of the element.
     * @default `0.0`
     * @version AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#feimage
     * @since AM_2.2.0 https://github.com/mickelson/attract/blob/v2.2.0/Layouts.md?plain=1#L1403
     */
    origin_x = 0.0;

    /**
     * The y position of the origin.
     *
     * The origin is the centre point for positioning, scaling and rotation.
     * @relative To the top-left corner of the element.
     * @default `0.0`
     * @version AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#feimage
     * @since AM_2.2.0 https://github.com/mickelson/attract/blob/v2.2.0/Layouts.md?plain=1#L1406
     */
    origin_y = 0.0;

    /**
     * The horizontal offset of the texture's bottom edge.
     * @default `0.0`
     * @version AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#feimage
     * @since AM_1.2.2 https://github.com/mickelson/attract/blob/v1.2.2/Layouts.md?plain=1#L652
     */
    skew_x = 0.0;
    // shear_x // https://github.com/mickelson/attract/blob/v1.0.2/Layouts.md?plain=1#L485

    /**
     * The vertical offset of the texture's right edge.
     * @default `0.0`
     * @version AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#feimage
     * @since AM_1.2.2 https://github.com/mickelson/attract/blob/v1.2.2/Layouts.md?plain=1#L655
     */
    skew_y = 0.0;
    // shear_y // https://github.com/mickelson/attract/blob/v1.0.2/Layouts.md?plain=1#L487

    /**
     * The horizontal inset of the texture's bottom corners.
     * @default `0.0`
     * @version AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#feimage
     * @since AM_1.2.2 https://github.com/mickelson/attract/blob/v1.2.2/Layouts.md?plain=1#L658
     */
    pinch_x = 0.0;

    /**
     * The vertical inset of the texture's right corners.
     * @default `0.0`
     * @version AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#feimage
     * @since AM_1.2.2 https://github.com/mickelson/attract/blob/v1.2.2/Layouts.md?plain=1#L661
     */
    pinch_y = 0.0;

    /**
     * The x position of the texture's sub-image.
     *
     * The sub-image is the slice of the texture used for display.
     * @default `0.0`
     * @version AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#feimage
     * @since AM_1.0.2 https://github.com/mickelson/attract/blob/v1.0.2/Layouts.md?plain=1#L491
     */
    subimg_x = 0.0;

    /**
     * The y position of the texture's sub-image.
     *
     * The sub-image is the slice of the texture used for display.
     * @default `0.0`
     * @version AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#feimage
     * @since AM_1.0.2 https://github.com/mickelson/attract/blob/v1.0.2/Layouts.md?plain=1#L493
     */
    subimg_y = 0.0;

    /**
     * The width of the texture's sub-image.
     *
     * Negative values flip the texture horizontally.
     *
     * The sub-image is the slice of the texture used for display.
     * @default `texture_width`
     * @version AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#feimage
     * @since AM_1.0.2 https://github.com/mickelson/attract/blob/v1.0.2/Layouts.md?plain=1#L495
     */
    subimg_width = 0.0;

    /**
     * The height of the texture's sub-image.
     *
     * Negative values flip the texture vertically.
     *
     * The sub-image is the slice of the texture used for display.
     * @default `texture_height`
     * @version AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#feimage
     * @since AM_1.0.2 https://github.com/mickelson/attract/blob/v1.0.2/Layouts.md?plain=1#L497
     */
    subimg_height = 0.0;

    /**
     * The textures fitting method.
     * @default `Fit.Fill`
     * @version 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#feimage
     * @since 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/3.2.0/Layouts.md?plain=1#1562
     */
    fit = Fit;

    /**
     * The anchor for textures that don't fill the image.
     * @default `Anchor.Centre`
     * @version 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#feimage
     * @since 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/3.2.0/Layouts.md?plain=1#1567
     */
    fit_anchor = Anchor;

    /**
     * The x position of the texture anchor `0.0...1.0`.
     * @default `0.5`
     * @version 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#feimage
     * @since 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/3.2.0/Layouts.md?plain=1#1568
     */
    fit_anchor_x = 0.5;

    /**
     * The y position of the texture anchor `0.0...1.0`.
     * @default `0.5`
     * @version 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#feimage
     * @since 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/3.2.0/Layouts.md?plain=1#1569
     */
    fit_anchor_y = 0.5;

    /**
     * Whether to crop textures that overlap the image.
     * @default `true`
     * @version 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#feimage
     * @since 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/3.2.0/Layouts.md?plain=1#1574
     */
    crop = true;

    /**
     * Force the texture to display at the given aspect ratio.
     *
     * Has no effect when set to `0`.
     * @default `0.0`
     * @version 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#feimage
     * @since 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/3.2.0/Layouts.md?plain=1#1576
     */
    force_aspect_ratio = 0.0;

    /**
     * Set the origin for position, scale and rotation.
     * @default `Origin.TopLeft`
     * @version 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#feimage
     * @since 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/3.2.0/Layouts.md?plain=1#1580
     */
    transform_origin = Origin;

    /**
     * Set the x position of the origin for position, scale and rotation `0.0...1.0`.
     * @default `0.0`
     * @version 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#feimage
     * @since 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/3.2.0/Layouts.md?plain=1#1610
     */
    transform_origin_x = 0.0;

    /**
     * Set the y position of the origin for position, scale and rotation `0.0...1.0`.
     * @default `0.0`
     * @version 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#feimage
     * @since 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/3.2.0/Layouts.md?plain=1#1611
     */
    transform_origin_y = 0.0;

    /**
     * The audio panning, which positions the sound centre from left to right `-1.0...1.0`.
     * @default `0.0`
     * @version 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#feimage
     * @since 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/3.2.0/Layouts.md?plain=1#1640
     */
    pan = 0.0;

    /**
     * The Fast Fourier Transform array size `2...128`.
     * @default `32`
     * @version 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#feimage
     * @since 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/3.2.0/Layouts.md?plain=1#1647
     */
    fft_bands = 32;

    /**
     * The scaling factor for 9-slice border regions.
     * @default `1.0`
     * @version 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#feimage
     * @since 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/3.2.0/Layouts.md?plain=1#1649
     */
    border_scale = 1.0;

    /**
     * The left 9-slice region size.
     * @default `0`
     * @version 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#feimage
     * @since 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/3.2.0/Layouts.md?plain=1#1652
     */
    border_left = 0;

    /**
     * The top 9-slice region size.
     * @default `0`
     * @version 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#feimage
     * @since 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/3.2.0/Layouts.md?plain=1#1653
     */
    border_top = 0;

    /**
     * The right 9-slice region size.
     * @default `0`
     * @version 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#feimage
     * @since 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/3.2.0/Layouts.md?plain=1#1654
     */
    border_right = 0;

    /**
     * The bottom 9-slice region size.
     * @default `0`
     * @version 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#feimage
     * @since 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/3.2.0/Layouts.md?plain=1#1655
     */
    border_bottom = 0;

    /**
     * The left padding offset, which extends the texture beyond the image boundary.
     * @default `0`
     * @version 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#feimage
     * @since 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/3.2.0/Layouts.md?plain=1#1656
     */
    padding_left = 0;

    /**
     * The top padding offset, which extends the texture beyond the image boundary.
     * @default `0`
     * @version 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#feimage
     * @since 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/3.2.0/Layouts.md?plain=1#1657
     */
    padding_top = 0;

    /**
     * The right padding offset, which extends the texture beyond the image boundary.
     * @default `0`
     * @version 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#feimage
     * @since 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/3.2.0/Layouts.md?plain=1#1658
     */
    padding_right = 0;

    /**
     * The bottom padding offset, which extends the texture beyond the image boundary.
     * @default `0`
     * @version 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#feimage
     * @since 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/3.2.0/Layouts.md?plain=1#1659
     */
    padding_bottom = 0;

    /**
     * Set the anchor preset.
     *
     * The anchor is the centre point for positioning and scaling.
     * @default `Anchor.TopLeft`
     * @version 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#feimage
     * @since 🔶AM+_3.0.0 https://github.com/oomek/attractplus/blob/3.0.0/Layouts.md?plain=1#L1640
     */
    anchor = Anchor;

    /**
     * The x position of the anchor `0.0...1.0`.
     *
     * The anchor is the centre point for positioning and scaling.
     * @relative To the top-left corner of the element.
     * @default `0.0`
     * @version 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#feimage
     * @since 🔶AM+_3.0.5 https://github.com/oomek/attractplus/blob/3.0.5/Layouts.md?plain=1#L1662
     */
    anchor_x = 0.0;

    /**
     * The y position of the anchor `0.0...1.0`.
     *
     * The anchor is the centre point for positioning and scaling.
     * @relative To the top-left corner of the element.
     * @default `0.0`
     * @version 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#feimage
     * @since 🔶AM+_3.0.5 https://github.com/oomek/attractplus/blob/3.0.5/Layouts.md?plain=1#L1664
     */
    anchor_y = 0.0;

    /**
     * Set the rotation_origin preset.
     *
     * The rotation_origin is the centre for rotation.
     * @default `Origin.TopLeft`
     * @version 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#feimage
     * @since 🔶AM+_3.0.5 https://github.com/oomek/attractplus/blob/3.0.5/Layouts.md?plain=1#L1651
     */
    rotation_origin = Origin;

    /**
     * The x position of the rotation_origin `0.0...1.0`.
     *
     * The rotation_origin is the centre for rotation.
     * @relative To the top-left corner of the element.
     * @default `0.0`
     * @version 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#feimage
     * @since 🔶AM+_3.0.5 https://github.com/oomek/attractplus/blob/3.0.5/Layouts.md?plain=1#L1666
     */
    rotation_origin_x = 0.0;

    /**
     * The y position of the rotation_origin `0.0...1.0`.
     *
     * The rotation_origin is the centre for rotation.
     * @relative To the top-left corner of the element.
     * @default `0.0`
     * @version 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#feimage
     * @since 🔶AM+_3.0.5 https://github.com/oomek/attractplus/blob/3.0.5/Layouts.md?plain=1#L1668
     */
    rotation_origin_y = 0.0;

    /**
     * The video playback behaviour
     *
     * Accepts multiple values separated by `|`.
     * @default `Vid.Default`
     * @version AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#feimage
     * @since AM_1.3.0-beta1 https://github.com/mickelson/attract/blob/v1.3.0-beta1/Layouts.md?plain=1#L774
     */
    video_flags = Vid;
    // movie_enabled https://github.com/mickelson/attract/blob/v1.0.2/Layouts.md?plain=1#L499

    /**
     * The playback state of the video.
     * - `true` - Play the video from the beginning.
     * - `false` - Stop the video on the current frame.
     * @default `true`
     * @version AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#feimage
     * @since AM_1.3.0-beta1 https://github.com/mickelson/attract/blob/v1.3.0-beta1/Layouts.md?plain=1#L783
     */
    video_playing = true;

    /**
     * The volume of the video.
     * @default `100.0`
     * @version 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#feimage
     * @since 🔶AM+_3.1.0 https://github.com/oomek/attractplus/blob/3.1.0/Layouts.md?plain=1#L1786
     */
    volume = 0.0;

    /**
     * The filename of the image or video to display.
     * @dynamic Updated on `FromOldSelection` and `ToNewList` Transitions.
     * @version AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#feimage
     * @since AM_1.3.0-beta1 https://github.com/mickelson/attract/blob/v1.3.0-beta1/Layouts.md?plain=1#L787
     */
    file_name = "";

    /**
     * The Transition that triggers the @dynamic property updates.
     * - `ToNewSelection` - Updated *after* to this Transition.
     * - `EndNavigation` - Updated *prior* to this Transition.
     * @default `Transition.ToNewSelection`
     * @version AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#feimage
     * @since AM_1.5.0 https://github.com/mickelson/attract/blob/v1.5.0/Layouts.md?plain=1#L1108
     */
    trigger = Transition;

    /**
     * Letterbox the texture within the element to maintain its aspect ratio.
     * @default `false`
     * @version AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#feimage
     * @since AM_1.2.0 https://github.com/mickelson/attract/blob/v1.2.0/Layouts.md?plain=1#L669
     */
    preserve_aspect_ratio = false;

    /**
     * Enable interpolation to give the texture a softer appearance when scaled up.
     * @default `true`
     * @version AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#feimage
     * @since AM_1.5.2 https://github.com/mickelson/attract/blob/v1.5.2/Layouts.md?plain=1#L1204
     */
    smooth = true;

    /**
     * Enable mipmapping to improve the texture quality when scaled down.
     *
     * Required for Shaders to use texture2D `bias` arguments.
     * @default `false`
     * @version AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#feimage
     * @since AM_2.4.0 https://github.com/mickelson/attract/blob/v2.4.0/Layouts.md?plain=1#L1481
     */
    mipmap = false;

    /**
     * Blend the texture with the elements drawn beneath it.
     * @default `BlendMode.Alpha`
     * @version AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#feimage
     * @since AM_2.4.0 https://github.com/mickelson/attract/blob/v2.4.0/Layouts.md?plain=1#L1472
     */
    blend_mode = BlendMode;

    /**
     * Tile the texture sub-image when offset by `subimg` properties.
     *
     * Prevents the clamped edges *stretching* to fill the offset space.
     * @default `false`
     * @version 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#feimage
     * @since 🔶AM+_3.0.0 https://github.com/oomek/attractplus/blob/3.0.0/Layouts.md?plain=1#L1706
     */
    repeat = false;

    /**
     * @ignore
     *
     * @property {integer} video_duration
     * The video duration in milliseconds.
     * @dynamic Updated on `FromOldSelection` and `ToNewList` Transitions.
     * @version AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#feimage
     * @since AM_1.3.2 https://github.com/mickelson/attract/blob/v1.3.2/Layouts.md?plain=1#L839
     *
     * @property {integer} video_time
     * The current video time in milliseconds.
     * @dynamic Updated on `FromOldSelection` and `ToNewList` Transitions.
     * @version AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#feimage
     * @since AM_1.3.2 https://github.com/mickelson/attract/blob/v1.3.2/Layouts.md?plain=1#L840
     *
     * @property {integer} texture_width
     * The width of the texture.
     * @dynamic Updated on `FromOldSelection` and `ToNewList` Transitions.
     * @version AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#feimage
     * @since AM_1.0.2 https://github.com/mickelson/attract/blob/v1.0.2/Layouts.md?plain=1#L489
     *
     * @property {integer} texture_height
     * The height of the texture.
     * @dynamic Updated on `FromOldSelection` and `ToNewList` Transitions.
     * @version AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#feimage
     * @since AM_1.0.2 https://github.com/mickelson/attract/blob/v1.0.2/Layouts.md?plain=1#L490
     *
     * @property {float} sample_aspect_ratio
     * The pixel aspect ratio of the texture.
     *
     * Non-square ratios require the artwork to be stretched for display.
     * ```
     * // how ratio affects the display size
     * 224x768 @ 2.57143  = 576x768
     * 512x224 @ 0.583333 = 512x384
     * ```
     * @dynamic Updated on `FromOldSelection` and `ToNewList` Transitions.
     * @version AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#feimage
     * @since AM_2.6.1 https://github.com/mickelson/attract/blob/v2.6.1/Layouts.md?plain=1#L1530
     *
     * @property {float} fit_x The rendered texture x position in pixels.
     * @version 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#feimage
     * @since 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/3.2.0/Layouts.md?plain=1#1570
     *
     * @property {float} fit_y The rendered texture y position in pixels.
     * @version 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#feimage
     * @since 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/3.2.0/Layouts.md?plain=1#1571
     *
     * @property {float} fit_width The rendered texture width in pixels.
     * @version 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#feimage
     * @since 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/3.2.0/Layouts.md?plain=1#1572
     *
     * @property {float} fit_height The rendered texture height in pixels.
     * @version 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#feimage
     * @since 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/3.2.0/Layouts.md?plain=1#1573
     *
     * @property {float} vu The mono audio channel VU meter value.
     * @version 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#feimage
     * @since 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/3.2.0/Layouts.md?plain=1#1641
     *
     * @property {float} vu_left The left audio channel VU meter value.
     * @version 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#feimage
     * @since 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/3.2.0/Layouts.md?plain=1#1642
     *
     * @property {float} vu_right The right audio channel VU meter value.
     * @version 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#feimage
     * @since 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/3.2.0/Layouts.md?plain=1#1644
     *
     * @property {array(float)} fft An array of Fast-Fourier-Transform values for the mono audio channel.
     *
     * The array size is controlled using `fft_bands`.
     * @version 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#feimage
     * @since 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/3.2.0/Layouts.md?plain=1#1645
     *
     * @property {array(float)} fft_left An array of Fast-Fourier-Transform values for the left audio channel.
     *
     * The array size is controlled using `fft_bands`.
     * @version 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#feimage
     * @since 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/3.2.0/Layouts.md?plain=1#1646
     *
     * @property {array(float)} fft_right An array of Fast-Fourier-Transform values for the right audio channel.
     *
     * The array size is controlled using `fft_bands`.
     * @version 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#feimage
     * @since 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/3.2.0/Layouts.md?plain=1#1644
     */
    function _get() {}

    // #endregion

    // ---------------------------------------------------------------------------------
    // #region FUNC

    /**
     * Sets the position of the element.
     * @param {float} x The x position of the element.
     * @param {float} y The y position of the element.
     * @version AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#feimage
     * @since AM_1.3.0-beta1 https://github.com/mickelson/attract/blob/v1.3.0-beta1/Layouts.md?plain=1#L797
     */
    function set_pos(x, y) {}

    /**
     * Sets the position and size of the element.
     * @ignore
     * @param {float} x The x position of the element.
     * @param {float} y The y position of the element.
     * @param {float} width The width of the element.
     * @param {float} height The height of the element.
     * @version AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#feimage
     * @since AM_1.3.0-beta1 https://github.com/mickelson/attract/blob/v1.3.0-beta1/Layouts.md?plain=1#L798
     */
    function set_pos(x, y, width, height) {}

    /**
     * Sets the colour channel levels.
     * @param {integer} r The red channel level `0...255`.
     * @param {integer} g The green channel level `0...255`.
     * @param {integer} b The blue channel level `0...255`.
     * @version AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#feimage
     * @since AM_1.0.2 https://github.com/mickelson/attract/blob/v1.0.2/Layouts.md?plain=1#L505
     */
    function set_rgb(r, g, b) {}

    /**
     * Sets the position of the anchor.
     *
     * The anchor is a point relative to the element used as the centre for positioning and scaling.
     * @param {float} x The x position of the anchor `0.0...1.0`.
     * @param {float} y The y position of the anchor `0.0...1.0`.
     * @version 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#feimage
     * @since 🔶AM+_3.0.0 https://github.com/oomek/attractplus/blob/3.0.0/Layouts.md?plain=1#L1721
     */
    function set_anchor(x, y) {}

    /**
     * Set the position of the rotation_origin.
     *
     * The rotation_origin is a point relative to the element used as the centre for rotation.
     * @param {float} x The x position of the rotation_origin `0.0...1.0`.
     * @param {float} y The y position of the rotation_origin `0.0...1.0`.
     * @version 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#feimage
     * @since 🔶AM+_3.0.5 https://github.com/oomek/attractplus/blob/3.0.5/Layouts.md?plain=1#L1731
     */
    function set_rotation_origin(x, y) {}

    /**
     * Swaps this element's texture with given element's texture.
     * - Includes video properties, allowing uninterrupted playback.
     * - Cloned elements update to reflect their source element.
     * @param {fe.Image} element The element to swap textures with.
     * @version AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#feimage
     * @since AM_1.4.1 https://github.com/mickelson/attract/blob/v1.4.1/Layouts.md?plain=1#L1064
     */
    function swap(element) {}

    /**
     * Set the index offset without triggering an update.
     * @param {integer} value The index offset to set.
     * @version AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md
     * @since AM_2.6.1 https://github.com/mickelson/attract/blob/v2.6.1/Layouts.md?plain=1
     */
    function rawset_index_offset(value) {}

    /**
     * Set the filter offset without triggering an update.
     * @param {integer} value The filter offset to set.
     * @version AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md
     * @since AM_2.6.1 https://github.com/mickelson/attract/blob/v2.6.1/Layouts.md?plain=1
     */
    function rawset_filter_offset(value) {}

    /**
     * Makes all texture colours matching the top-left pixel transparent.
     * @version AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#feimage
     * @since AM_1.5.0 https://github.com/mickelson/attract/blob/v1.5.0/Layouts.md?plain=1#L1123
     */
    function fix_masked_image() {}

    /**
     * Set the texture fit anchor position `0.0...1.0`.
     * @param {float} x The x position of the fit anchor.
     * @param {float} y The y position of the fit anchor.
     * @version 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#feimage
     * @since 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/3.2.0/Layouts.md?plain=1#L1666
     */
    function set_fit_anchor(x, y) {}

    /**
     * Set the transform origin for position, scale, and rotation `0.0...1.0`.
     * @param {float} x The x position of the transform origin.
     * @param {float} y The y position of the transform origin.
     * @version 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#feimage
     * @since 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/3.2.0/Layouts.md?plain=1#L1667
     */
    function set_transform_origin(x, y) {}

    /**
     * Set the 9-slice border region in pixels.
     * @param {integer} left The left 9-slice region size.
     * @param {integer} top The top 9-slice region size.
     * @param {integer} right The right 9-slice region size.
     * @param {integer} bottom The bottom 9-slice region size.
     * @version 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#feimage
     * @since 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/3.2.0/Layouts.md?plain=1#L1671
     */
    function set_border(left, top, right, bottom) {}

    /**
     * Set the padding offset, which extends the texture beyond the image boundary.
     * @param {integer} left The left padding size.
     * @param {integer} top The top padding size.
     * @param {integer} right The right padding size.
     * @param {integer} bottom The bottom padding size.
     * @version 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/master/Layouts.md#feimage
     * @since 🔶AM+_3.2.0 https://github.com/oomek/attractplus/blob/3.2.0/Layouts.md?plain=1#L1666
     */
    function set_padding(left, top, right, bottom) {}

    // #endregion
}
