/** @type {import('@types/eslint').Linter.BaseConfig} */
module.exports = {
  root: true,
  // We're using vitest which has a very similar API to jest (so the linting plugins work nicely),
  // but we have to set the jest version explicitly.
  settings: {
    jest: {
      version: 29,
    },
  },
  plugins: ['prettier'],
  extends: [
    '@remix-run/eslint-config',
    '@remix-run/eslint-config/node',
    'plugin:prettier/recommended',
  ],
  ignorePatterns: ['build/'],
  rules: {
    'import/order': ['error', {alphabetize: {order: 'asc'}}],
  },
  overrides: [
    {
      files: ['app/**/*.{spec,test}.{js,jsx,ts,tsx}'],
      extends: ['@remix-run/eslint-config/jest-testing-library'],
    },
  ],
};
