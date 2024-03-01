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
  serverDependenciesToBundle: ['smart-invariant'],
  tailwind: true,
  future: {
    v3_fetcherPersist: true,
    v3_relativeSplatPath: true,
    v3_throwAbortReason: true,
  },
};
