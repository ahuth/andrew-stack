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
    'plugin:jsx-a11y/recommended',
    'plugin:prettier/recommended',
  ],
  reportUnusedDisableDirectives: true,
  ignorePatterns: ['build/'],
  rules: {
    // Ensure types are always imported with `type`, so TypeScript completely removes the imports
    // and other tools don't need to figure out if they should be removed or not.
    '@typescript-eslint/consistent-type-imports': [
      'error',
      {prefer: 'type-imports'},
    ],
    'import/order': ['error', {alphabetize: {order: 'asc'}}],
    // Autofocus has its uses, and may be better than manually sending focus to an input field.
    'jsx-a11y/no-autofocus': 'off',
    // Enforce files with JSX are named wither .jsx or .tsx. This makes it easier for us to do
    // analysis on codebases (since we can find React components by looking at file extensions).
    'react/jsx-filename-extension': [
      'error',
      {allow: 'as-needed', extensions: ['.jsx', '.tsx']},
    ],
    'react/jsx-key': 'error',
    // Don't allow fragments with only a single child. The fragment isn't necessary in that case.
    // The only exception to this is a single expression (e.g. `<>{children}</>`), which is useful
    // when using TypeScript to convert a ReactNode to a ReactElement.
    'react/jsx-no-useless-fragment': ['error', {allowExpressions: true}],
    'react/jsx-sort-props': ['error', {ignoreCase: true}],
    'react/no-array-index-key': 'error',
    'react/no-direct-mutation-state': 'error',
    'react/no-string-refs': 'error',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'error',
    'require-await': 'error',
  },
  overrides: [
    {
      files: ['app/**/*.{spec,test}.{js,jsx,ts,tsx}'],
      extends: ['@remix-run/eslint-config/jest-testing-library'],
    },
  ],
};
