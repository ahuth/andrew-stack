/** @type {import('@types/eslint').Linter.BaseConfig} */
module.exports = {
  env: {
    node: true,
    es6: true,
  },
  settings: {
    'import/resolver': {
      typescript: true,
    },
    react: {
      version: 'detect',
    },
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/errors',
    'plugin:import/typescript',
    'plugin:jsx-a11y/recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  reportUnusedDisableDirectives: true,
  ignorePatterns: ['build/'],
  rules: {
    '@typescript-eslint/no-non-null-assertion': 'error',
    // Allow unused vars when using ...rest property. This is a convenient way of omitting items
    // from an object.
    '@typescript-eslint/no-unused-vars': [
      'error',
      {args: 'none', ignoreRestSiblings: true},
    ],
    eqeqeq: ['error', 'allow-null'],
    'import/first': 'error',
    'import/order': ['error', {alphabetize: {order: 'asc'}}],
    // Autofocus has its uses, and may be better than manually sending focus to an input field.
    'jsx-a11y/no-autofocus': 'off',
    'no-alert': 'error',
    'no-var': 'error',
    radix: 'error',
    // Enforce files with JSX are named wither .jsx or .tsx. This makes it easier for us to do
    // analysis on codebases (since we can find React components by looking at file extensions).
    'react/jsx-filename-extension': [
      'error',
      {allow: 'as-needed', extensions: ['.jsx', '.tsx']},
    ],
    // Don't allow fragments with only a single child. The fragment isn't necessary in that case.
    // The only exception to this is a single expression (e.g. `<>{children}</>`), which is useful
    // when using TypeScript to convert a ReactNode to a ReactElement.
    'react/jsx-no-useless-fragment': ['error', {allowExpressions: true}],
    'react/jsx-sort-props': ['error', {ignoreCase: true}],
    'react/no-array-index-key': 'error',
    'react/no-unescaped-entities': 'off',
    'react/prop-types': 'off',
    'require-await': 'error',
  },
  overrides: [
    {
      files: ['app/**/*.{spec,test}.{js,jsx,ts,tsx}'],
      plugins: ['vitest'],
      extends: ['plugin:vitest/recommended'],
      rules: {
        // Allow non-null (!) in tests. This can make testing more convenient, and if something
        // breaks the test will fail anyway.
        '@typescript-eslint/no-non-null-assertion': 'off',
        'vitest/no-conditional-expect': 'error',
        'vitest/no-focused-tests': 'error',
      },
    },
  ],
};
