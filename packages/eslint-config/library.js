require("eslint-plugin-only-warn");
const baseConfig = require("./base.js");
const eslintPluginImport = require("eslint-plugin-import");
const eslintPluginPrettierRecommended = require("eslint-plugin-prettier/recommended");

module.exports = [
  ...baseConfig,
  {
    plugins: {
      import: eslintPluginImport,
    },
    rules: {
      ...eslintPluginImport.flatConfigs.recommended.rules,
    },
  },
  {
    files: ["*.js?(x)", "*.ts?(x)", "*.mjs", "*.cjs"],
    ignores: ["**/dist", "**/cjs", "**/esm"],
  },
  eslintPluginPrettierRecommended,
];
