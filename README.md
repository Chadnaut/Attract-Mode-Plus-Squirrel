# Squirrel Attract-Mode Plus

A suite of support tools to enhance your AM+ development experience, built upon a custom Typescript conversion of the original Squirrel 3.0.7 Lexer.

![Squirrel Attract-Mode Plus](https://github.com/Chadnaut/Squirrel-AM-VSCode-Extension/blob/master/assets/images/readme.png)

## Quickstart

- Set your AM+ path
  - VSCode > Settings > Extensions > Squirrel AM+
    - Attract-Mode: Path > Enter your AM+ path
    - Attract-Mode: Integration: Live reload AM+ > Yes
- Enable Live Reload plugin in AM+
  - Attract-Mode Plus > Configure (TAB) > Plug-ins
    - Live Reload > Enabled > Yes
    - Close all menus (ESC)
- Start coding
  - VSCode > Open any Squirrel file
    - Save > AM+ automatically reloads!

## Features

All standard language features are implemented to make coding in Squirrel simple and intuitive.

- IntelliSense - Auto-completion, code-navigation, inlay-hints, hover-info.
- Syntax highlighting - Classes, functions, attributes, namespaces.
- Linting - Inline error highlighting and Problems panel listings.
- Code formatting - Prettier based formatting with bracket and spacing options.
- DocBlock - Integrated documentation displayed in IntelliSense popups.

## Completions

Completions for Squirrel and AM+ functions, with datatype information, parameter descriptions, and overloads.

- Squirrel Language - All built-in functions and datatype methods.
- Squirrel Standard Library - All library classes and properties.
- Attract-Mode Plus - All API functions and constants.

## Enhancements

In addition to providing IntelliSense documentation, DocBlocks can add completions, describe parameter types, create snippets, and more.

- Access control - Public, Protected and Private flags to limit completion visibility.
- Metamethods - Document getter and setter properties to display them as completions.
- Datatypes - Describe or override parameter and return value types.
- Expected values - Completion suggestions for function parameters.
- Snippets - Create custom code snippets.

## Integration

A selection of helpers are included to assist Attract-Mode development workflows.

- Live Reload - Automatically reload AM+ on document save.
- Logging - Show the last_run.log file in the Output tab.
- Imports - Filename completions for import and asset loading methods.
- Previews - Hover over image or video links to see a preview.
- Magic tokens - Completions and highlighting for inline magic tokens.
- Drop edits - Shift + Drop files into the document to create import statements.
- Support files - Syntax highlighting for `.nut`, `.cfg`, `.log`, `.msg`, `.am` files.

## Credits

Credits to the developers, contributors, and community.

- [Attract-Mode Plus](https://github.com/oomek/attractplus) - by Radek Dutkiewicz
- [Attract-Mode](https://github.com/mickelson/attract) - by Andrew Mickelson
- [Squirrel](http://www.squirrel-lang.org/doc/squirrel3.html) - by Alberto Demichelis
- [Prettier](https://github.com/prettier/prettier) - by James Long and contributors
- [Attract-Mode Discord](https://discord.com/channels/373969602784526336) - Join the community!
