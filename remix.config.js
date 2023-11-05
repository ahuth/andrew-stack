/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  cacheDirectory: './node_modules/.cache/remix',
  ignoredRouteFiles: [
    '**/*.spec.{js,jsx,ts,tsx}',
    '**/*.stories.{js,jsx,ts,tsx}',
    '**/*.test.{js,jsx,ts,tsx}',
  ],
  postcss: true,
  serverModuleFormat: 'cjs',
  tailwind: true,
  future: {
    v3_fetcherPersist: true,
  },
};
