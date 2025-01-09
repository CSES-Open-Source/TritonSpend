const tsParser = require("@typescript-eslint/parser");
module.exports = [
  {
    files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"], // Specify file types
    languageOptions: {
      ecmaVersion: "latest", // Latest JavaScript version
      sourceType: "module", // Support for ES modules
      parser: tsParser, // Ensure parser is set
      parserOptions: {
        ecmaFeatures: {
          jsx: true, // Enable JSX parsing for React projects
        },
      },
    },
    plugins: {
      "@typescript-eslint": require("@typescript-eslint/eslint-plugin"),
      prettier: require("eslint-plugin-prettier"),
    },
    rules: {
      "no-unused-vars": "warn",
      "no-console": "off",
    },
  },
];
