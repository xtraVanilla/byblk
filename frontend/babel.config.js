module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module-resolver",
        {
          alias: {
            components: "./src/components/index.ts",
            screens: "./src/screens/index.ts",
            appcontext: "./appcontext.ts",
            theme: "./theme.ts",
            types: "./src/types/index.ts",
          },
        },
      ],
    ],
  };
};
