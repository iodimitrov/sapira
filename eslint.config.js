const libraryConfig = require("@sapira/eslint-config/library.js");

/** @type {import('eslint').Linter.Config[]} */
module.exports = [
  ...libraryConfig,
  {
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
  },
  {
    ignores: ["apps/**", "packages/**"],
  },
];
