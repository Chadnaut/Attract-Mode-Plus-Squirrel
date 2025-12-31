# Development

## Quickstart

- Install node [24.12.0](https://nodejs.org/en/download)
  - Allow `npm.ps1` to run `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned`
- `npm i` install project packages
- `F5` to launch extension `Run and Debug`
  - Starts the `dev` script, which builds the extension `dist` on-save
  - Opens the `Extension Development Host` which runs the extension
- `Ctrl + r` in host window to reload
  - *Caution* - reload does not prompt to save changes!
- `npm install -g @vscode/vsce` install globally
  - `npm run package` to build `vsix` for deployment

### Updates

- `"to-fast-properties": "=3.0.1"` must remain at this version for prettier
- `"@types/vscode": "=1.70.0"` must remain at this version for older vscode support

## Scripts

- `npm run clean` - Delete the dist path
- `npm run check` - Check the code is valid typescript
- `npm run dev` - Build dist on-save
- `npm run build` - Build dist
- `npm run build:prod` - Build dist for production (minify)
- `npm run build:meta` - Build dist with meta-data for [analysis](https://esbuild.github.io/analyze/)
- `npm run test` - Run tests
- `npm run test:watch` - Run tests on-save
- `npm run coverage` - Run coverage
- `npm run coverage:watch` - Run coverage on-save
- `npm run prepackage` - Run clean, check, build:prod
- `npm run package` - Build `vsix` package for deployment

## Debugging

### Profiling

- Command Palette (`Ctrl + Shift + P`) > Developer: Show Running Extensions
  - (Right Click) > Start Extension Host Profile
  - Trigger an event which runs extension code to profile
  - (Right Click) > Stop Extension Host Profile
  - (Right Click) > Open Extension Host Profile (prompt to save)
  - Show flame graph (fire icon)

### Inspecting Semantic Tokens

- Command Palette (`Ctrl + Shift + P`) > Developer: Inspect Editor Tokens and Scopes
  - Displays token information under the cursor for debugging syntax highlighting and tokens

### Debug Console

- `console` log messages within the development host window will be displayed in the *editor* `Debug Console` tab

## Known Issues

### On-Type Formatting

On-type formatting has been *disabled permanently*, as it is problematic for several reasons:

- An AST is required for the prettier formatter
- Code must be valid to create an AST
- In-progress code is usually invalid

Additionally the formatter fights the user, as it:

- Removes extra newlines
- Collapses empty blocks
- Shifts the cursor

Work-around's to limit *when* on-type formatting is applied makes the feature appear erratic, so rather than working under extremely limited conditions, it's simpler to just let the user apply code formatting manually.

### Re-declared Variables

Squirrel allows multiple declarations of the same variable, but only the *first declaration* will be used for typing and completions. Later assignments to the variable will also be ignored.

```cpp
local x = "string"; // `x` is now scoped as a string
local x = 123; // re-declared variables are ignored
x = true; // re-assigned variables are also ignored

x.len(); // `x` will suggest string-type completions
// HOWEVER `x` is actually a boolean at this point
```

Detecting variable re-assignments is practically impossible, short of running the code in full. Re-using variables in this manner is not recommended.

## Further Reading

- Prettier
  - https://www.npmjs.com/package/prettier
  - https://prettier.io/playground
  - https://github.com/prettier/prettier/tree/main/src/language-js
  - https://github.com/prettier/prettier/blob/main/commands.md
- Squirrel
  - http://squirrel-lang.org
  - https://sourceforge.net/projects/squirrel/
  - https://github.com/albertodemichelis/squirrel/tree/v3.1
  - https://github.com/estree/estree/blob/master/es5.md
- VSCode
  - https://code.visualstudio.com/api/working-with-extensions/publishing-extension
