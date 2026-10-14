import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: { entry: 'build-entry.ts', formats: ['es'], fileName: 'index' },
    rollupOptions: {
      external: (id) => /^(react|react-dom)(\/|$)/.test(id),
      output: { assetFileNames: 'style.[ext]' },
    },
  },
});
