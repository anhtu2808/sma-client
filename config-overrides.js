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
    
    return config;
  }
);
