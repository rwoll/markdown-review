import { defineConfig } from 'vite';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// Read core IIFE bundle at build time so it can be inlined into the CLI
let coreBundleContent = '';
try {
  coreBundleContent = readFileSync(
    resolve(__dirname, '../core/dist/plan-review-core.iife.js'),
    'utf-8',
  );
} catch {
  throw new Error(
    'Core IIFE bundle not found at ../core/dist/plan-review-core.iife.js. ' +
    'Build packages/core first.',
  );
}

export default defineConfig({
  build: {
    target: 'node18',
    outDir: 'bin',
    lib: {
      entry: resolve(__dirname, 'src/cli.ts'),
      formats: ['es'],
      fileName: () => 'markdown-review.js',
    },
    rollupOptions: {
      external: ['http', 'fs', 'path', 'url', 'child_process', 'os'],
      output: {
        banner: '#!/usr/bin/env node',
      },
    },
    minify: false,
    sourcemap: false,
  },
  define: {
    __CORE_BUNDLE__: JSON.stringify(coreBundleContent),
  },
});
