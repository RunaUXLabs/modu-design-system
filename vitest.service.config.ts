import { defineConfig, mergeConfig } from 'vitest/config';
import previewConfig from './.storybook/vite.config.js';

export default mergeConfig(previewConfig, defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['src/test/setup.ts'],
    include: ['stories/service/**/*.test.tsx'],
    maxWorkers: 1,
    minWorkers: 1,
  },
}));
