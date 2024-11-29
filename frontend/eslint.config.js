module.exports = [
  {
    files: ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"], // Specify file types
    languageOptions: {
      ecmaVersion: "latest", // Latest JavaScript version
      sourceType: "module",  // Support for ES modules
      parserOptions: {
        ecmaFeatures: {
          jsx: true, // Enable JSX parsing for React projects
        },
      },
    },
    rules: {
      "no-unused-vars": "warn",
      "no-console": "off",
    },
  },
];
