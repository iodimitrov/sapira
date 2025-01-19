const libraryConfig = require('@sapira/eslint-config/library.js');

/** @type {import('eslint').Linter.Config[]} */
module.exports = [
  ...libraryConfig,
  {
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    settings: {
      'import/resolver': {
        typescript: {
          project: './tsconfig.json',
        },
        node: true,
      },
    },
  },
  {
    ignores: ['**/cjs', '**/esm'],
  },
];
