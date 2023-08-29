import path from 'node:path';
import type {StorybookConfig} from '@storybook/react-webpack5';

export default {
  addons: ['@storybook/addon-a11y', '@storybook/addon-essentials'],
  core: {
    disableTelemetry: true,
  },
  framework: {
    name: '@storybook/react-webpack5',
    options: {},
  },
  stories: ['../app'],

  babel(config) {
    return {
      ...config,
      sourceType: 'module',
      targets: 'last 2 versions',
      presets: [
        ...(config.presets || []),
        '@babel/preset-env',
        '@babel/preset-typescript',
      ],
    };
  },

  webpackFinal(config) {
    return {
      ...config,

      resolve: {
        ...config.resolve,
        alias: {
          ...config.resolve?.alias,
          // Custom path aliases. Keep in sync with `paths` in tsconfig.json.
          '~': path.resolve(__dirname, '../app'),
          tests: path.resolve(__dirname, '../tests'),
        },
        fallback: {
          ...config.resolve?.fallback,
          // Suppress un-polyfilled module warning from @sinonjs/fake-timers.
          timers: false,
        },
      },

      module: {
        ...config.module,
        rules: [
          ...(config.module?.rules || []),
          // Replace @remix-run/node with an empty file. It should never be used by browser code.
          {
            test: require.resolve('@remix-run/node'),
            use: 'null-loader',
          },
          // Replace `.server.ts` files with an empty file. Remix will never send these to the
          // browser.
          {
            test: /\.server/,
            use: 'null-loader',
          },
          // Integrate Tailwind. Remix handles this when running the app, but we need to configure it
          // ourselves in Storybook.
          {
            test: /\.css$/i,
            use: ['postcss-loader'],
          },
        ],
      },
    };
  },
} satisfies StorybookConfig;
