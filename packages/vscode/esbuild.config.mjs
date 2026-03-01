import * as esbuild from 'esbuild';
import * as fs from 'fs';
import * as path from 'path';

await esbuild.build({
  entryPoints: ['src/extension.ts'],
  bundle: true,
  outfile: 'dist/extension.js',
  external: ['vscode'],
  format: 'cjs',
  platform: 'node',
  target: 'node18',
  sourcemap: true,
});

// Copy core bundle into dist/ so it ships with the VSIX
const coreSrc = path.resolve('..', 'core', 'dist', 'plan-review-core.iife.js');
const coreDst = path.resolve('dist', 'plan-review-core.iife.js');
fs.copyFileSync(coreSrc, coreDst);
