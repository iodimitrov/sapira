const baseConfig = require("./base.js");
const globals = require("globals");
const eslintPluginPrettierRecommended = require("eslint-plugin-prettier/recommended");

module.exports = [
  ...baseConfig,
  {
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
  },
  {
    files: ["**/*.{js,ts}"],
    ignores: ["**/dist"],
  },
  eslintPluginPrettierRecommended,
];
