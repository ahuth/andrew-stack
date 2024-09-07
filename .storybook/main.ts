import type {StorybookConfig} from '@storybook/react-vite';

export default {
  stories: ['../app'],
  framework: {
    name: '@storybook/react-vite',
    options: {
      builder: {
        viteConfigPath: 'vite.storybook.config.ts',
      },
    },
  },
  core: {
    disableTelemetry: true,
  },
  addons: ['@storybook/addon-a11y', '@storybook/addon-essentials'],
} satisfies StorybookConfig;
