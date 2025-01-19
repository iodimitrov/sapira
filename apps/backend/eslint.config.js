const nestConfig = require('@sapira/eslint-config/nest.js');

/** @type {import('eslint').Linter.Config[]} */
module.exports = [
  ...nestConfig,
  {
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
      },
    },
  },
];
