# Changelog

All notable changes to this project will be documented in this file.

## [0.9.14] - 2025-03-17

### Added

- Launch AM from the status-bar
- Settings for output loglevel and stdout

### Changed

- Magic token snippet definitions
- Log highlighting

## [0.9.13] - 2025-03-13

### Added

- Horizontal rule completion
- Attribute snippet
- Setting for attribute on same line as property

### Fixed

- Syntax highlighting regression
- Metamethod completion regression
- Signal suggestion description

## [0.9.12] - 2025-03-10

### Added

- DocBlock property types
- DocBlock augments completions
- Function parameter completions

### Fixed

- Prevent completions appearing for declaration ids

## [0.9.11] - 2025-03-07

### Added

- Setting to prevent attribute wrapping
- DocBlock augments attribute for completion forwarding

### Changed

- VSCode minimum version bumped to 1.70.0

### Fixed

- Formatter keeps even more parentheses
- Comment formatting inside attributes

## [0.9.10] - 2025-03-06

### Added

- Formatter setting to keep superfluous parentheses
- Formatter setting to condense nested parentheses
- Provider tests

### Changed

- Build pipeline to esbuild
- Massive dist size reduction
- Prettier async tests

### Fixed

- Colour picker placement
- Attribute syntax highlighting
- Sequence-expression formatting
- Space formatting edge-cases
- Activation in older VSCode

## [0.9.9] - 2025-02-27

### Added

- Missing shader file warnings

### Changed

- Downgraded missing file severity from error to warning

### Fixed

- Symlinked paths resolved to fix repeated completions
- Completion details default to the file or folder name instead of relative path
- Log provider scheme updated to fix init warning

## [0.9.8] - 2025-02-26

### Fixed

- Surface completions incorrectly display overloaded methods

## [0.9.7] - 2025-02-26

### Changed

- Reduce VSCode version requirement from 1.95.0 to 1.69.1
- Auto-select completion signature to match the given parameters

## [0.9.6] - 2025-02-25

### Added

- DocBlock documentation

### Changed

- Package name attribute used for completion detail

### Fixed

- File paths constructed with variables no longer reported as missing
- Metamethod snippet kind now shows only within classes

## [0.9.5] - 2025-02-24

### Added

- Settings for default author and url
- DocBlock package @requires completion rebuilds requirements

### Changed

- Colour picker works with fewer args

### Fixed

- Completion documentation links
- Artwork labels should not provide links
- File paths with magic tokens no longer reported as missing
- Module support files should not be classed as modules

## [0.9.4] - 2025-02-22

### Added

- Sidebar for module explorer
- DocBlock package completion, with module and artwork listings
- Colour picker to *_rgb methods
- Problem reporting for missing files and modules

### Fixed

- Drop-edit setting not working

## [0.9.3] - 2025-02-18

### Added

- Setting to scan AM for artwork resource labels
- Setting to check for conflicting extensions

### Fixed

- Staircase indenting caused by lexer logical expression bug

## [0.9.2] - 2025-02-16

### Fixed

- Document links using binary expressions
- Preview build missing packages required to format the document

## [0.9.1] - 2025-02-15

### Added

- Method version numbers with links to online documentation
- Add toFastProperties to AST Nodes
- DocBlock type overrides

### Changed

- All traversal utils to remove parent lookups
- All cache handlers to use WeakSets / WeakMaps

## [0.9.0] - 2025-02-07

### Added

- Squirrel, AM, and AM+ documentation
- Logo images

## [0.8.0] - 2024-11-02

### Added

- README.md
- DocBlock expects completions
- DocBlock meta-method getters and setters
- DocBlock access flags
- Primitive-type lending completions

## [0.7.0] - 2024-10-11

### Added
- Document linking
- MagicToken completions
- DocBlock completions for local files
- DocBlock image previews
- DocBlock snippets
- DocBlock deprecations
- Tests to achieve 100% coverage (excluding prettier)

### Changed

- Grammars for Squirrel edge cases
- Parameter token styling
- Traversal utility improvements

## [0.6.0] - 2024-09-25

### Added

- Grammars for syntax highlighting
- Language configuration
- Snippets
- DocBlock support
- VSCode providers
- Completions
- Member-Completions
- Diagnostics
- Hover tips
- Inlay hints
- Caching
- Configuration
- Prettier formatting options
- AST traversal utilities
- AST tests
- Lexer stress tests

### Changed

- Update Squirrel Lexer to 3.0.7 to match AM

## [0.5.0] - 2024-08-31

### Changed

- Extend language-js as a base for Squirrel formatting

## [0.4.0] - 2024-08-29

### Added

- Rudimentary prettier printing output
- Prettier tests

## [0.3.0] - 2024-08-28

### Added

- Prettier formatting plugin

## [0.2.0] - 2024-08-27

### Added

- AST Node types for Squirrel
- Lexer support utilities

## [0.1.0] - 2024-08-21

### Added

- Start Squirrel 3.0.4 lexer to typescript conversion
- Lexer tests
