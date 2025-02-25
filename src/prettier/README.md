# Squirrel Prettier

Code within this folder is based on the Prettier `language-js` printer by *James Long and contributors*.

The printer is mostly identical to `Javascript`, with modifications to support Squirrel syntax.

## Features

- Folders, filenames, and code structure replicates the original source code
- Utils have been modified to use exposed methods from the imported prettier package
- Additional options for **C-style** formatting (ie: opening brace on newline)

To maintain the original structure the code has not been 'prettified', and any additional code has been inserted following the existing format. There is a lot of *unreachable* code due to the reduced scope, which will likely be left as-is. While not a great practice, it makes debugging and comparing code bases *much* simpler.

## Further Reading

- https://www.npmjs.com/package/prettier
- https://prettier.io/playground
- https://github.com/prettier/prettier/tree/main/src/language-js
- https://github.com/prettier/prettier/blob/main/commands.md
