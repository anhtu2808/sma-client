const { override, addBabelPlugin, addWebpackAlias } = require("customize-cra");
const path = require("path");

module.exports = override(
  addBabelPlugin([
    "module-resolver",
    {
      alias: {
        "@": "./src",
      },
    },
  ]),
  addWebpackAlias({
    "@": path.resolve(__dirname, "src"),
  }),
  (config) => {
    // Cho phép import file .ts và .tsx
    config.resolve.extensions = [
      ...config.resolve.extensions,
      ".ts",
      ".tsx"
    ];

    // Suppress noisy source-map warnings from docx-preview's published package.
    config.module.rules.forEach((rule) => {
      if (Array.isArray(rule.oneOf)) {
        rule.oneOf.forEach((oneOfRule) => {
          if (
            oneOfRule &&
            oneOfRule.loader &&
            oneOfRule.loader.includes("source-map-loader")
          ) {
            oneOfRule.exclude = [
              ...(Array.isArray(oneOfRule.exclude)
                ? oneOfRule.exclude
                : oneOfRule.exclude
                  ? [oneOfRule.exclude]
                  : []),
              /node_modules\/docx-preview/
            ];
          }
        });
      }
    });
    
    return config;
  }
);
