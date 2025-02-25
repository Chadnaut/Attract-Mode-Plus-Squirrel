# Squirrel Parser

Code within [./include](./include) and [./squirrel](./squirrel) folders is based on the Squirrel programming language `3.0.7` by *Alberto Demichelis*.

The parser has been ported (with modification) from `C++` to `Typescript` to serve as a code validator and AST (Abstract Syntax Tree) provider.

The generated AST's are based on [ESTree ES5](https://github.com/estree/estree/blob/master/es5.md) grammar, with some extra Squirrel-specific nodes.

## Features

- Folders, filenames, and code structure replicates the original source code
- The `lexer.cpp` is almost identical, with additional handling for comments
- The `compiler.cpp` is mostly identical, with extra instructions for AST nodes
- The `funcstate.cpp` is heavily modified to generate AST's
- All other files contain the bare minimum support functions

To maintain the original structure the code has not been 'prettified' - any additional code is simply appended to existing lines. While not a great practice, it makes debugging and comparing code bases *much* simpler as source and destination lines match.

## Error Handling

The parser is intended to provide AST's for IntelliSense code-completion, which is triggered during edits. For example:

- `object.<property>` - When the *property* is missing the code is invalid, but a valid AST is required to suggest a completion!

While error messages still match the compiler, instead of aborting on error the parser is allowed to continue and provide an *approximate* AST, with some caveats:
  - Only the **first** error is guaranteed to be legitimate
  - There may be knock-on errors - subsequent valid code could be marked as erroneous
  - The resulting AST structure may be invalid

Additional error handling was added to catch expressions that expect a closing character,such as brackets `), ]`, but instead reach an EOF character first.

## Further Reading

- http://squirrel-lang.org
- https://sourceforge.net/projects/squirrel/
- https://github.com/albertodemichelis/squirrel/tree/v3.1
- https://github.com/estree/estree/blob/master/es5.md
