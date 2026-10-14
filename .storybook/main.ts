import { fileURLToPath } from 'node:url';
import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../stories/**/*.mdx', '../stories/**/*.stories.tsx'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y'],
  framework: '@storybook/react-vite',
  staticDirs: [{ from: '../docs/design-system', to: '/guidelines' }],
  core: {
    builder: {
      name: '@storybook/builder-vite',
      options: { viteConfigPath: fileURLToPath(new URL('./vite.config.ts', import.meta.url)) },
    },
    disableTelemetry: true,
  },
  typescript: { reactDocgen: 'react-docgen-typescript' },
};

export default config;
