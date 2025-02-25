/**
 * Attract-Mode Frontend
 *
 * @package AttractMode
 * @global
 */

// -------------------------------------------------------------------------------------

local audioTags = [
    "Title",
    "Artist",
    "Album",
    "Year",
    "Comment",
    "Track",
    "Genre",
];

// -------------------------------------------------------------------------------------
// Constants

/**
 * The application version as a string.
 * @version AM_1.0.2 https://github.com/mickelson/attract/blob/v1.0.2/Layouts.md?plain=1#L691
 */
FeVersion <- "";

/**
 * The application version as an integer.
 * @version AM_1.0.2 https://github.com/mickelson/attract/blob/v1.0.2/Layouts.md?plain=1#L692
 */
FeVersionNum <- 0;

/**
 * The path to the application's config directory.
 * @external $FeConfigDirectory
 * @version AM_1.3.1 https://github.com/mickelson/attract/blob/v1.3.1/Layouts.md?plain=1#L1115
 */
FeConfigDirectory <- "";

/**
 * Whether the intro is currently playing.
 * @version AM_1.6.0 https://github.com/mickelson/attract/blob/v1.6.0/Layouts.md?plain=1#L1650
 */
IntroActive <- true;

/**
 * The configured language.
 * @version AM_2.5.0 https://github.com/mickelson/attract/blob/v2.5.0/Layouts.md?plain=1#L1897
 */
Language <- "";

/**
 * The Operating System.
 * - `"Windows"`
 * - `"OSX"`
 * - `"FreeBSD"`
 * - `"Linux"`
 * - `"Unknown"`
 * @version AM_1.1.0 https://github.com/mickelson/attract/blob/v1.1.0/Layouts.md?plain=1#L824
 */
OS <- "";

/**
 * The width of the application window.
 * @version AM_1.0.2 https://github.com/mickelson/attract/blob/v1.0.2/Layouts.md?plain=1#L696
 */
ScreenWidth <- 0;

/**
 * The height of the application window.
 * @version AM_1.0.2 https://github.com/mickelson/attract/blob/v1.0.2/Layouts.md?plain=1#L697
 */
ScreenHeight <- 0;

/**
 * The refresh rate of the primary screen in Hz.
 * @version AM_2.6.2 https://github.com/mickelson/attract/blob/v2.6.2/Layouts.md?plain=1#L2044
 */
ScreenRefreshRate <- 0;

/**
 * Whether the internal screen-saver currently displayed.
 * @version AM_1.0.2 https://github.com/mickelson/attract/blob/v1.0.2/Layouts.md?plain=1#L701
 */
ScreenSaverActive <- true;

/**
 * Whether GLSL shaders are available on this system.
 * @version AM_1.2.0 https://github.com/mickelson/attract/blob/v1.2.0/Layouts.md?plain=1#L927
 */
ShadersAvailable <- true;

// -------------------------------------------------------------------------------------
// Enums

/**
 * Alignment options for Text `align`.
 * @constant
 * @enum
 */
Align <- {
    /**
     * Align Bottom Centre
     * @version AM_2.4.0 https://github.com/mickelson/attract/blob/v2.4.0/Layouts.md?plain=1#L1644
     */
    BottomCentre = 0,
    /**
     * Align Bottom Left
     * @version AM_2.4.0 https://github.com/mickelson/attract/blob/v2.4.0/Layouts.md?plain=1#L1645
     */
    BottomLeft = 0,
    /**
     * Align Bottom Right
     * @version AM_2.4.0 https://github.com/mickelson/attract/blob/v2.4.0/Layouts.md?plain=1#L1646
     */
    BottomRight = 0,
    /**
     * Align Middle Centre
     * @deprecated Use `MiddleCentre` for improved accuracy.
     * @version AM_1.0.2 https://github.com/mickelson/attract/blob/v1.0.2/Layouts.md?plain=1#L570
     */
    Centre = 0,
    /**
     * Align Middle Left
     * @deprecated Use `MiddleLeft` for improved accuracy.
     * @version AM_1.0.2 https://github.com/mickelson/attract/blob/v1.0.2/Layouts.md?plain=1#L571
     */
    Left = 0,
    /**
     * Align Middle Right
     * @deprecated Use `MiddleRight` for improved accuracy.
     * @version AM_1.0.2 https://github.com/mickelson/attract/blob/v1.0.2/Layouts.md?plain=1#L572
     */
    Right = 0,
    /**
     * Align Middle Centre
     * @version AM_2.4.0 https://github.com/mickelson/attract/blob/v2.4.0/Layouts.md?plain=1#L1647
     */
    MiddleCentre = 0,
    /**
     * Align Middle Left
     * @version AM_2.4.0 https://github.com/mickelson/attract/blob/v2.4.0/Layouts.md?plain=1#L1648
     */
    MiddleLeft = 0,
    /**
     * Align Middle Right
     * @version AM_2.4.0 https://github.com/mickelson/attract/blob/v2.4.0/Layouts.md?plain=1#L1649
     */
    MiddleRight = 0,
    /**
     * Align Top Centre
     * @version AM_2.4.0 https://github.com/mickelson/attract/blob/v2.4.0/Layouts.md?plain=1#L1641
     */
    TopCentre = 0,
    /**
     * Align Top Left
     * @version AM_2.4.0 https://github.com/mickelson/attract/blob/v2.4.0/Layouts.md?plain=1#L1642
     */
    TopLeft = 0,
    /**
     * Align Top Right
     * @version AM_2.4.0 https://github.com/mickelson/attract/blob/v2.4.0/Layouts.md?plain=1#L1643
     */
    TopRight = 0,
}

/**
 * Art flags for `get_art`
 * @constant
 * @enum
 */
Art <- {
    /**
     * Return a single artwork filename.
     * @version AM_1.5.2 https://github.com/mickelson/attract/blob/v1.5.2/Layouts.md?plain=1#L584
     */
    Default = 0,
    /**
     * Return all artwork filenames, separated by `;`.
     * @version AM_2.2.0 https://github.com/mickelson/attract/blob/v2.2.0/Layouts.md?plain=1#L718
     */
    FullList = 0,
    /**
     * Return image artwork only.
     * @version AM_1.5.2 https://github.com/mickelson/attract/blob/v1.5.2/Layouts.md?plain=1#L585
     */
    ImagesOnly = 0,
}

/**
 * Presets for `anchor`.
 * @constant
 * @enum
 */
Anchor <- {
    /**
     * Point `x = 0.0` `y = 0.5`
     * @version AM+_3.0.0 https://github.com/oomek/attractplus/blob/3.0.0/Layouts.md?plain=1#L1642
     */
    Left = 0,
    /**
     * Point `x = 0.5` `y = 0.5`
     * @version AM+_3.0.0 https://github.com/oomek/attractplus/blob/3.0.0/Layouts.md?plain=1#L1643
     */
    Centre = 0,
    /**
     * Point `x = 1.0` `y = 0.5`
     * @version AM+_3.0.0 https://github.com/oomek/attractplus/blob/3.0.0/Layouts.md?plain=1#L1644
     */
    Right = 0,
    /**
     * Point `x = 0.5` `y = 0.0`
     * @version AM+_3.0.0 https://github.com/oomek/attractplus/blob/3.0.0/Layouts.md?plain=1#L1645
     */
    Top = 0,
    /**
     * Point `x = 0.5` `y = 1.0`
     * @version AM+_3.0.0 https://github.com/oomek/attractplus/blob/3.0.0/Layouts.md?plain=1#L1646
     */
    Bottom = 0,
    /**
     * Point `x = 0.0` `y = 0.0`
     * @version AM+_3.0.0 https://github.com/oomek/attractplus/blob/3.0.0/Layouts.md?plain=1#L1647
     */
    TopLeft = 0,
    /**
     * Point `x = 1.0` `y = 0.0`
     * @version AM+_3.0.0 https://github.com/oomek/attractplus/blob/3.0.0/Layouts.md?plain=1#L1648
     */
    TopRight = 0,
    /**
     * Point `x = 0.0` `y = 1.0`
     * @version AM+_3.0.0 https://github.com/oomek/attractplus/blob/3.0.0/Layouts.md?plain=1#L1649
     */
    BottomLeft = 0,
    /**
     * Point `x = 1.0` `y = 1.0`
     * @version AM+_3.0.0 https://github.com/oomek/attractplus/blob/3.0.0/Layouts.md?plain=1#L1650
     */
    BottomRight = 0
};

/**
 * Texture blending options.
 * @constant
 * @enum
 */
BlendMode <- {
    /**
     * Blend the texture using the alpha channel.
     * @version AM_2.4.0 https://github.com/mickelson/attract/blob/v2.4.0/Layouts.md?plain=1#L1474
     */
    Alpha = 0,
    /**
     * Brighten the base colour by adding the texture colour to it.
     * @version AM_2.4.0 https://github.com/mickelson/attract/blob/v2.4.0/Layouts.md?plain=1#L1475
     */
    Add = 0,
    /**
     * Lighten the base colour by inverting both colours, multiplying them, then inverting the result.
     * @version AM_2.4.0 https://github.com/mickelson/attract/blob/v2.4.0/Layouts.md?plain=1#L1476
     */
    Screen = 0,
    /**
     * Darken the base colour by multiplying it by the texture colour.
     * @version AM_2.4.0 https://github.com/mickelson/attract/blob/v2.4.0/Layouts.md?plain=1#L1477
     */
    Multiply = 0,
    /**
     * Apply `Multiply` or `Screen` depending on the base colour, preserving highlights and shadows.
     * @version AM_2.4.0 https://github.com/mickelson/attract/blob/v2.4.0/Layouts.md?plain=1#L1478
     */
    Overlay = 0,
    /**
     * Blend a pre-multiplied texture, similar to `Alpha` but the colours tend to zero along with the alpha.
     * @version AM_2.4.0 https://github.com/mickelson/attract/blob/v2.4.0/Layouts.md?plain=1#L1479
     */
    Premultiplied = 0,
    /**
     * No blending. Transparent colours are displayed as black.
     * @version AM_2.4.0 https://github.com/mickelson/attract/blob/v2.4.0/Layouts.md?plain=1#L1480
     */
    None = 0,
    /**
     * Darken the base colour by subtracting the texture colour from it.
     * @version AM_2.4.0 https://github.com/mickelson/attract/blob/v2.4.0/Layouts.md?plain=1
     */
    Subtract = 0
};

/**
 * Transition values provided by `StartLayout` and `EndLayout`.
 * @constant
 * @enum
 */
FromTo <- {
    /**
     * Depending on the `Transition`:
     * - `StartLayout` - The application has started.
     * - `EndLayout` - The application is about to stop.
     * @version AM_1.1.0 https://github.com/mickelson/attract/blob/v1.1.0/Layouts.md?plain=1#L285
     */
    Frontend = 0,
    /**
     * Depending on the `Transition`:
     * - `StartLayout` - The screen-saver has stopped.
     * - `EndLayout` - The screen-saver is about to start.
     * @version AM_1.1.0 https://github.com/mickelson/attract/blob/v1.1.0/Layouts.md?plain=1#L286
     */
    ScreenSaver = 0,
    /**
     * The Layout has changed for another reason:
     * - Selecting an alternate Layout.
     * - Editing Layout options.
     * @version AM_1.1.0 https://github.com/mickelson/attract/blob/v1.1.0/Layouts.md?plain=1#L288
     */
    NoValue = 0
};

/**
 * Game information attributes.
 * @constant
 * @enum
 */
Info <- {
    /**
     * The alternative romname.
     * @version AM_1.5.0 https://github.com/mickelson/attract/blob/v1.5.0/Layouts.md?plain=1#L264
     */
    AltRomname = 0,
    /**
     * The alternative title.
     * @version AM_1.5.0 https://github.com/mickelson/attract/blob/v1.5.0/Layouts.md?plain=1#L265
     */
    AltTitle = 0,
    /**
     * The number of buttons used.
     */
    Buttons = 0,
    /**
     * The category.
     * @version AM_1.0.2 https://github.com/mickelson/attract/blob/v1.0.2/Layouts.md?plain=1#L312
     */
    Category = 0,
    /**
     * The `ShortName` of the original game.
     * @version AM_1.0.2 https://github.com/mickelson/attract/blob/v1.0.2/Layouts.md?plain=1#L309
     */
    CloneOf = 0,
    /**
     * The primary control.
     * @version AM_1.0.2 https://github.com/mickelson/attract/blob/v1.0.2/Layouts.md?plain=1#L315
     */
    Control = 0,
    /**
     * The number of displays.
     * @version AM_1.2.0 https://github.com/mickelson/attract/blob/v1.2.0/Layouts.md?plain=1#L169
     */
    DisplayCount = 0,
    /**
     * The display type.
     * @version AM_1.2.0 https://github.com/mickelson/attract/blob/v1.2.0/Layouts.md?plain=1#L170
     */
    DisplayType = 0,
    /**
     * The game's emulator.
     * @version AM_1.0.2 https://github.com/mickelson/attract/blob/v1.0.2/Layouts.md?plain=1#L308
     */
    Emulator = 0,
    /**
     * The extra information.
     * @version AM_1.5.0 https://github.com/mickelson/attract/blob/v1.5.0/Layouts.md?plain=1#L534
     */
    Extra = 0,
    /**
     * The favourite status.
     * @version AM_2.5.0 https://github.com/mickelson/attract/blob/v2.5.0/Layouts.md?plain=1#L610
     */
    Favourite = 0,
    /**
     * The file availability.
     * @version AM_1.5.0 https://github.com/mickelson/attract/blob/v1.5.0/Layouts.md?plain=1#L539
     */
    FileIsAvailable = 0,
    /**
     * The pause state, `"1"` if paused.
     * @version AM_2.5.0 https://github.com/mickelson/attract/blob/v2.5.0/Layouts.md?plain=1#L685
     */
    IsPaused = 0,
    /**
     * The language.
     */
    Language = 0,
    /**
     * The manufacturer.
     * @version AM_1.0.2 https://github.com/mickelson/attract/blob/v1.0.2/Layouts.md?plain=1#L311
     */
    Manufacturer = 0,
    /**
     * The short name.
     * @version AM_1.0.2 https://github.com/mickelson/attract/blob/v1.0.2/Layouts.md?plain=1#L306
     */
    Name = 0,
    /**
     * Returned by `fe.filters.sort_by` when unsorted.
     * @version AM_1.4.1 https://github.com/mickelson/attract/blob/v1.4.1/Layouts.md?plain=1#L929
     */
    NoSort = 0,
    /**
     * The overview description.
     * @version AM_2.2.0 https://github.com/mickelson/attract/blob/v2.2.0/Layouts.md?plain=1#L201
     */
    Overview = 0,
    /**
     * The total times played.
     * @version AM_1.4.1 https://github.com/mickelson/attract/blob/v1.4.1/Layouts.md?plain=1#L265
     */
    PlayedCount = 0,
    /**
     * The total play time in seconds.
     * @version AM_1.4.1 https://github.com/mickelson/attract/blob/v1.4.1/Layouts.md?plain=1#L263
     */
    PlayedTime = 0,
    /**
     * The number of players.
     * @version AM_1.0.2 https://github.com/mickelson/attract/blob/v1.0.2/Layouts.md?plain=1#L313
     */
    Players = 0,
    /**
     * The rating.
     */
    Rating = 0,
    /**
     * The region.
     */
    Region = 0,
    /**
     * The screen rotation.
     * @version AM_1.0.2 https://github.com/mickelson/attract/blob/v1.0.2/Layouts.md?plain=1#L314
     */
    Rotation = 0,
    /**
     * The game series.
     */
    Series = 0,
    /**
     * The list sorting value.
     * @version AM_1.4.1 https://github.com/mickelson/attract/blob/v1.4.1/Layouts.md?plain=1#L267
     */
    SortValue = 0,
    /**
     * The emulation status.
     * @version AM_1.0.2 https://github.com/mickelson/attract/blob/v1.0.2/Layouts.md?plain=1#L316
     */
    Status = 0,
    /**
     * The first system name for the game's emulator.
     * @version AM_1.4.1 https://github.com/mickelson/attract/blob/v1.4.1/Layouts.md?plain=1#L525
     */
    System = 0,
    /**
     * The tags, separated by `;`.
     * @version AM_1.3.1 https://github.com/mickelson/attract/blob/v1.3.1/Layouts.md?plain=1#L503
     */
    Tags = 0,
    /**
     * The full name.
     * @version AM_1.0.2 https://github.com/mickelson/attract/blob/v1.0.2/Layouts.md?plain=1#L307
     */
    Title = 0,
    /**
     * The year.
     * @version AM_1.0.2 https://github.com/mickelson/attract/blob/v1.0.2/Layouts.md?plain=1#L310
     */
    Year = 0,
}

/**
 * Presets for `rotation_origin`.
 * @constant
 * @enum
 */
Origin <- {
    /**
     * Point `x = 0.0` `y = 0.5`
     * @version AM+_3.0.0 https://github.com/oomek/attractplus/blob/3.0.0/Layouts.md?plain=1#L1653
     */
    Left = 0,
    /**
     * Point `x = 0.5` `y = 0.5`
     * @version AM+_3.0.0 https://github.com/oomek/attractplus/blob/3.0.0/Layouts.md?plain=1#L1654
     */
    Centre = 0,
    /**
     * Point `x = 1.0` `y = 0.5`
     * @version AM+_3.0.0 https://github.com/oomek/attractplus/blob/3.0.0/Layouts.md?plain=1#L1655
     */
    Right = 0,
    /**
     * Point `x = 0.5` `y = 0.0`
     * @version AM+_3.0.0 https://github.com/oomek/attractplus/blob/3.0.0/Layouts.md?plain=1#L1656
     */
    Top = 0,
    /**
     * Point `x = 0.5` `y = 1.0`
     * @version AM+_3.0.0 https://github.com/oomek/attractplus/blob/3.0.0/Layouts.md?plain=1#L1657
     */
    Bottom = 0,
    /**
     * Point `x = 0.0` `y = 0.0`
     * @version AM+_3.0.0 https://github.com/oomek/attractplus/blob/3.0.0/Layouts.md?plain=1#L1658
     */
    TopLeft = 0,
    /**
     * Point `x = 1.0` `y = 0.0`
     * @version AM+_3.0.0 https://github.com/oomek/attractplus/blob/3.0.0/Layouts.md?plain=1#L1659
     */
    TopRight = 0,
    /**
     * Point `x = 0.0` `y = 1.0`
     * @version AM+_3.0.0 https://github.com/oomek/attractplus/blob/3.0.0/Layouts.md?plain=1#L1660
     */
    BottomLeft = 0,
    /**
     * Point `x = 1.0` `y = 1.0`
     * @version AM+_3.0.0 https://github.com/oomek/attractplus/blob/3.0.0/Layouts.md?plain=1#L1661
     */
    BottomRight = 0
};

/**
 * Overlay menu types.
 * @constant
 * @enum
 */
Overlay <- {
    /**
     * A Custom menu.
     * @version AM_2.0.0-rc1 https://github.com/mickelson/attract/blob/v2.0.0-rc1/Layouts.md?plain=1#L600
     */
    Custom = 0,
    /**
     * The Exit menu.
     * @version AM_2.0.0-rc1 https://github.com/mickelson/attract/blob/v2.0.0-rc1/Layouts.md?plain=1#L601
     */
    Exit = 0,
    /**
     * The Favourite menu.
     * @version AM_2.5.0 https://github.com/mickelson/attract/blob/v2.5.0/Layouts.md?plain=1#L610
     */
    Favourite = 0,
    /**
     * The Displays menu.
     * @version AM_2.0.0-rc1 https://github.com/mickelson/attract/blob/v2.0.0-rc1/Layouts.md?plain=1#L602
     */
    Displays = 0,
    /**
     * The Filters menu.
     * @version AM_2.0.0-rc1 https://github.com/mickelson/attract/blob/v2.0.0-rc1/Layouts.md?plain=1#L603
     */
    Filters = 0,
    /**
     * The Tags menu.
     * @version AM_2.0.0-rc1 https://github.com/mickelson/attract/blob/v2.0.0-rc1/Layouts.md?plain=1#L604
     */
    Tags = 0
};

/**
 * Path test flags.
 * @constant
 * @enum
 */
PathTest <- {
    /**
     * Test the path is a directory, and it exists.
     * @version AM_2.4.0 https://github.com/mickelson/attract/blob/v2.4.0/Layouts.md?plain=1#L1048
     */
    IsDirectory = 0,
    /**
     * Test the path is a file, and it exists.
     * @version AM_2.4.0 https://github.com/mickelson/attract/blob/v2.4.0/Layouts.md?plain=1#L1047
     */
    IsFile = 0,
    /**
     * Test the path exists.
     * @version AM_2.4.0 https://github.com/mickelson/attract/blob/v2.4.0/Layouts.md?plain=1#L1046
     */
    IsFileOrDirectory = 0,
    /**
     * Test the path is relative, does *not* check if it exists.
     * @version AM_2.4.0 https://github.com/mickelson/attract/blob/v2.4.0/Layouts.md?plain=1#L1049
     */
    IsRelativePath = 0,
    /**
     * Test the path has a supported archive extension, does *not* check if it exists.
     * @version AM_2.4.0 https://github.com/mickelson/attract/blob/v2.4.0/Layouts.md?plain=1#L1050
     */
    IsSupportedArchive = 0,
    /**
     * Test the path has a supported media extension, does *not* check if it exists.
     * @version AM_2.4.0 https://github.com/mickelson/attract/blob/v2.4.0/Layouts.md?plain=1#L1051
     */
    IsSupportedMedia = 0,
};

/**
 * Screen rotation settings.
 * @constant
 * @enum
 */
RotateScreen <- {
    /**
     * No rotation.
     * @version AM_1.0.2 https://github.com/mickelson/attract/blob/v1.0.2/Layouts.md?plain=1#L447
     */
    None = 0,
    /**
     * Rotate 90-degrees clockwise.
     * @version AM_1.0.2 https://github.com/mickelson/attract/blob/v1.0.2/Layouts.md?plain=1#L448
     */
    Right = 0,
    /**
     * Rotate 180-degrees.
     * @version AM_1.0.2 https://github.com/mickelson/attract/blob/v1.0.2/Layouts.md?plain=1#L449
     */
    Flip = 0,
    /**
     * Rotate 90-degrees counter-clockwise.
     * @version AM_1.0.2 https://github.com/mickelson/attract/blob/v1.0.2/Layouts.md?plain=1#L450
     */
    Left = 0
}

/**
 * Shader types.
 * @constant
 * @enum
 */
Shader <- {
    /**
     * A Vertex and a Fragment Shader.
     * @version AM_1.2.0 https://github.com/mickelson/attract/blob/v1.2.0/Layouts.md?plain=1#L881
     */
    VertexAndFragment = 0,
    /**
     * A Vertex Shader.
     * @version AM_1.2.0 https://github.com/mickelson/attract/blob/v1.2.0/Layouts.md?plain=1#L882
     */
    Vertex = 0,
    /**
     * A Fragment Shader.
     * @version AM_1.2.0 https://github.com/mickelson/attract/blob/v1.2.0/Layouts.md?plain=1#883
     */
    Fragment = 0,
    /**
     * Used to remove an existing Shader.
     * @version AM_1.2.0 https://github.com/mickelson/attract/blob/v1.2.0/Layouts.md?plain=1#884
     */
    Empty = 0
};

/**
 * Text formatting options.
 * @constant
 * @enum
 */
Style <- {
    /**
     * No added emphasis.
     * @version AM_1.0.2 https://github.com/mickelson/attract/blob/v1.0.2/Layouts.md?plain=1#L564
     */
    Regular = 0,
    /**
     * Add weight to the text.
     * @version AM_1.0.2 https://github.com/mickelson/attract/blob/v1.0.2/Layouts.md?plain=1#L565
     */
    Bold = 0,
    /**
     * Add a slight tilt to the text.
     * @version AM_1.0.2 https://github.com/mickelson/attract/blob/v1.0.2/Layouts.md?plain=1#L566
     */
    Italic = 0,
    /**
     * Add a line below the text.
     * @version AM_1.0.2 https://github.com/mickelson/attract/blob/v1.0.2/Layouts.md?plain=1#L567
     */
    Underlined = 0
}

/**
 * Transition types emitted by `add_transition_callback`.
 * @constant
 * @enum
 */
Transition <- {
    /**
     * A new Layout has started.
     * @var `FromTo` reason for the Transition.
     * @version AM_1.0.2 https://github.com/mickelson/attract/blob/v1.0.2/Layouts.md?plain=1#L265
     */
    StartLayout = 0,
    /**
     * The current Layout is about to stop.
     * @var `FromTo` reason for the Transition.
     * @version AM_1.0.2 https://github.com/mickelson/attract/blob/v1.0.2/Layouts.md?plain=1#L266
     */
    EndLayout = 0,
    /**
     * The Game selection is about to change.
     * @var `offset` to the next `fe.list.index`.
     * @version AM_1.0.2 https://github.com/mickelson/attract/blob/v1.0.2/Layouts.md?plain=1#L267
     */
    ToNewSelection = 0,
    /**
     * The Game selection has changed.
     * @var `offset` to the previous `fe.list.index`.
     * @version AM_1.2.0 https://github.com/mickelson/attract/blob/v1.2.0/Layouts.md?plain=1#L335
     */
    FromOldSelection = 0,
    /**
     * The Game selection key has been released.
     *
     * Use to detect the end of long key-presses.
     * @var *unused*.
     * @version AM_1.5.0 https://github.com/mickelson/attract/blob/v1.5.0/Layouts.md?plain=1#L448
     */
    EndNavigation = 0,
    /**
     * The Game is about to start.
     * @var *unused*.
     * @version AM_1.0.2 https://github.com/mickelson/attract/blob/v1.0.2/Layouts.md?plain=1#L268
     */
    ToGame = 0,
    /**
     * The Game has stopped.
     * @var *unused*.
     * @version AM_1.0.2 https://github.com/mickelson/attract/blob/v1.0.2/Layouts.md?plain=1#L269
     */
    FromGame = 0,
    /**
     * The current List has changed.
     *
     * Triggered by Display, Filter or Tag changes.
     * @var `offset` to the previous `fe.list.filter_index`.
     * @version AM_1.1.0 https://github.com/mickelson/attract/blob/v1.1.0/Layouts.md?plain=1#L273
     */
    ToNewList = 0,
    /**
     * The Overlay is about to be shown.
     * @var `Overlay` type.
     * @version AM_2.0.0-rc1 https://github.com/mickelson/attract/blob/v2.0.0-rc1/Layouts.md?plain=1#L565
     */
    ShowOverlay = 0,
    /**
     * The Overlay has been hidden.
     * @var *unused*.
     * @version AM_2.0.0-rc1 https://github.com/mickelson/attract/blob/v2.0.0-rc1/Layouts.md?plain=1#L566
     */
    HideOverlay = 0,
    /**
     * The Overlay menu selection has changed.
     * @var `index` of the menu item.
     * @version AM_2.0.0-rc1 https://github.com/mickelson/attract/blob/v2.0.0-rc1/Layouts.md?plain=1#L567
     */
    NewSelOverlay = 0,
    /**
     * A Game Tag has been changed.
     * @var `Info.Favourite` or `Info.Tags`.
     * @version AM_2.5.0 https://github.com/mickelson/attract/blob/v2.5.0/Layouts.md?plain=1#L575
     */
    ChangedTag = 0
};

/**
 * Video playback behaviors for `video_flags`.
 * @constant
 * @enum
 */
Vid <- {
    /**
     * Display video when available, otherwise display image.
     *
     * Takes effect on next `ToNewList` or `FromOldSelection` Transition.
     * @version AM_1.3.0-beta1 https://github.com/mickelson/attract/blob/v1.3.0-beta1/Layouts.md?plain=1#L778
     */
    Default = 0,
    /**
     * Display image artwork only.
     *
     * Takes effect on next `ToNewList` or `FromOldSelection` Transition.
     * @version AM_1.3.0-beta1 https://github.com/mickelson/attract/blob/v1.3.0-beta1/Layouts.md?plain=1#L779
     */
    ImagesOnly = 0,
    /**
     * Mute video sound.
     * @version AM_1.3.0-beta1 https://github.com/mickelson/attract/blob/v1.3.0-beta1/Layouts.md?plain=1#L780
     */
    NoAudio = 0,
    /**
     * Do not automatically play videos, display a black texture until started.
     * @version AM_1.3.0-beta1 https://github.com/mickelson/attract/blob/v1.3.0-beta1/Layouts.md?plain=1#L781
     */
    NoAutoStart = 0,
    /**
     * Do not restart videos upon completion, display the last frame when finished.
     * @version AM_1.3.0-beta1 https://github.com/mickelson/attract/blob/v1.3.0-beta1/Layouts.md?plain=1#L782
     */
    NoLoop = 0
};
