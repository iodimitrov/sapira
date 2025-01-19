const baseConfig = require("./base.js");
const eslintPluginJsxA11y = require("eslint-plugin-jsx-a11y");
const eslintPluginReact = require("eslint-plugin-react");
const eslintPluginReactHooks = require("eslint-plugin-react-hooks");
const eslintPluginImport = require("eslint-plugin-import");
const eslintPluginNext = require("@next/eslint-plugin-next");
const globals = require("globals");
const eslintPluginPrettierRecommended = require("eslint-plugin-prettier/recommended");

module.exports = [
  ...baseConfig,
  {
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        jsxPragma: null,
      },
      globals: {
        ...globals.browser,
        ...globals.commonjs,
      },
    },
  },
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: {
      react: eslintPluginReact,
      "jsx-a11y": eslintPluginJsxA11y,
      "react-hooks": eslintPluginReactHooks,
      "@next/next": eslintPluginNext,
    },
    rules: {
      ...eslintPluginReact.configs.flat.recommended.rules,
      ...eslintPluginReact.configs.flat["jsx-runtime"].rules,
      // TODO: update using flat configs when available
      ...eslintPluginReactHooks.configs["recommended"].rules,
      ...eslintPluginJsxA11y.flatConfigs.recommended.rules,
      ...eslintPluginNext.configs.recommended.rules,

      // Override specific rules from Next.js config
      "import/no-anonymous-default-export": "warn",
      "react/no-unknown-property": "off",
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "react/jsx-no-target-blank": "off",

      // Next.js specific jsx-a11y rules
      "jsx-a11y/alt-text": [
        "warn",
        {
          elements: ["img"],
          img: ["Image"],
        },
      ],
      "jsx-a11y/aria-props": "warn",
      "jsx-a11y/aria-proptypes": "warn",
      "jsx-a11y/aria-unsupported-elements": "warn",
      "jsx-a11y/role-has-required-aria-props": "warn",
      "jsx-a11y/role-supports-aria-props": "warn",
    },
    settings: {
      react: {
        version: "detect",
      },
      linkComponents: [
        { name: "Link", linkAttribute: "href" },
        { name: "NavLink", linkAttribute: "href" },
      ],
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
        },
        node: {
          extensions: [".js", ".jsx", ".ts", ".tsx"],
        },
      },
    },
  },
  {
    files: ["**/*.{ts,tsx}"],
    plugins: {
      import: eslintPluginImport,
    },
    rules: {
      ...eslintPluginImport.flatConfigs.recommended.rules,
      ...eslintPluginImport.flatConfigs.typescript.rules,
    },
    settings: {
      "import/internal-regex": "^~/",
      "import/resolver": {
        node: {
          extensions: [".ts", ".tsx"],
        },
        typescript: {
          alwaysTryTypes: true,
        },
      },
    },
  },
  {
    ignores: ["**/build", "**/.next", "**/out", "**/dist"],
  },
  eslintPluginPrettierRecommended,
];
