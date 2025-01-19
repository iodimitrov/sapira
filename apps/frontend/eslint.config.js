const nextConfig = require('@sapira/eslint-config/next.js');

/** @type {import('eslint').Linter.Config[]} */
module.exports = [
  ...nextConfig,
  {
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
      },
    },
  },
];
