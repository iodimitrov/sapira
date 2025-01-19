const eslint = require("@eslint/js");
const tseslint = require("typescript-eslint");
const globals = require("globals");

module.exports = tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.eslintRecommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.es2015,
      },
    },
    rules: {
      "@typescript-eslint/interface-name-prefix": "off",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
  {
    ignores: ["node_modules", "eslint.config.*"],
  }
);
