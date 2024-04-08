import path from 'path';
import {fileURLToPath} from 'url';
import {FlatCompat} from '@eslint/eslintrc';
import js from '@eslint/js';
import vitest from 'eslint-plugin-vitest';
import typescript from 'typescript-eslint';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

/** @type {import('@types/eslint').Linter.FlatConfig} */
export default [
  {
    ignores: ['build/*', 'storybook-static/*'],
  },
  {
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  {
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
  },

  // JS
  js.configs.recommended,
  {
    rules: {
      eqeqeq: ['error', 'allow-null'],
      'no-alert': 'error',
      'no-var': 'error',
      radix: 'error',
      'require-await': 'error',
    },
  },
  ...compat.plugins('import'),
  {
    rules: {
      'import/export': 'error',
      'import/first': 'error',
      'import/newline-after-import': ['error', {considerComments: true}],
      'import/no-duplicates': 'error',
      'import/order': ['error', {alphabetize: {order: 'asc'}}],
    },
  },

  // TS
  ...typescript.configs.recommended,
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      '@typescript-eslint/no-non-null-assertion': 'error',
      // Allow unused vars when using ...rest property. This is a convenient way of omitting items
      // from an object.
      '@typescript-eslint/no-unused-vars': [
        'error',
        {args: 'none', ignoreRestSiblings: true},
      ],
    },
  },
  {
    files: ['app/**/*.{spec,test}.{js,jsx,ts,tsx}'],
    rules: {
      // Allow non-null (!) in tests. This can make testing more convenient, and if something
      // breaks the test will fail anyway.
      '@typescript-eslint/no-non-null-assertion': 'off',
    },
  },

  // React
  ...compat.extends('plugin:react-hooks/recommended'),
  ...compat.extends('plugin:react/recommended'),
  ...compat.extends('plugin:react/jsx-runtime'),
  {
    rules: {
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
    },
  },
  ...compat.extends('plugin:jsx-a11y/recommended'),
  {
    rules: {
      // Autofocus has its uses, and may be better than manually sending focus to an input field.
      'jsx-a11y/no-autofocus': 'off',
    },
  },

  // Vitest
  {
    files: ['app/**/*.{spec,test}.{js,jsx,ts,tsx}'],
    plugins: {vitest},
    rules: {
      ...vitest.configs.recommended.rules,
      'vitest/no-conditional-expect': 'error',
      'vitest/no-focused-tests': 'error',
    },
  },
];
