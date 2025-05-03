module.exports = function (api) {
  api.cache(true);

  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "babel-plugin-dotenv-import",
        {
          moduleName: "@env", // Import name (you can change it if you like)
          path: ".env", // Path to the .env file
        },
      ],
    ],
  };
};
