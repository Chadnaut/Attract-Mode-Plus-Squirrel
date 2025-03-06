const esbuild = require('esbuild');
const production = process.argv.includes('--production');
const watch = process.argv.includes('--watch');
const meta = process.argv.includes('--meta');
const fs = require('fs');

async function main() {
  const config = {
    entryPoints: ['src/extension.ts'],
    bundle: true,
    metafile: true,
    format: 'cjs',
    minify: production,
    sourcemap: !production,
    sourcesContent: false,
    platform: 'node',
    outfile: 'dist/extension.js',
    external: ['vscode', 'prettier'],
    logLevel: 'warning',
    plugins: [
      /* add to the end of plugins array */
      esbuildProblemMatcherPlugin
    ]
  };

  const ctx = await esbuild.context(config);

  // copy external dependency
  fs.cpSync('./node_modules/prettier', './dist/node_modules/prettier', { recursive: true });

  // https://esbuild.github.io/analyze/
  if (meta) {
    let result = await esbuild.build(config);
    if (result.metafile) {
        fs.writeFileSync('./dist/metafile.json', JSON.stringify(result.metafile));
    }
  }

  if (watch) {
    await ctx.watch();
  } else {
    await ctx.rebuild();
    await ctx.dispose();
  }
}

/**
 * @type {import('esbuild').Plugin}
 */
const esbuildProblemMatcherPlugin = {
  name: 'esbuild-problem-matcher',

  setup(build) {
    build.onStart(() => {
      console.log('[watch] build started');
    });
    build.onEnd(result => {
      result.errors.forEach(({ text, location }) => {
        console.error(`✘ [ERROR] ${text}`);
        if (location == null) return;
        console.error(`    ${location.file}:${location.line}:${location.column}:`);
      });
      console.log('[watch] build finished');
    });
  }
};

main().catch(e => {
  console.error(e);
  process.exit(1);
});
