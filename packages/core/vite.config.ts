import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';

export default defineConfig({
  plugins: [preact()],
  build: {
    lib: {
      entry: 'src/index.tsx',
      name: 'PlanReview',
      formats: ['iife'],
      fileName: () => 'plan-review-core.iife.js',
    },
    rollupOptions: {
      output: {
        extend: true,
      },
    },
    minify: 'terser',
    sourcemap: true,
  },
});
