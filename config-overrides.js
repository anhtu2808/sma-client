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

    // docx-preview ships .map files pointing at ./src/*.ts that is not in the npm package.
    // CRA 5 registers source-map-loader as a top-level rule (not inside oneOf); patch that.
    const docxPreviewSourceMapExclude = /node_modules[\\/]docx-preview/;
    const patchSourceMapLoaderRule = (rule) => {
      if (!rule || !rule.loader || !String(rule.loader).includes("source-map-loader")) {
        return;
      }
      const extra = docxPreviewSourceMapExclude;
      if (!rule.exclude) {
        rule.exclude = extra;
        return;
      }
      if (Array.isArray(rule.exclude)) {
        if (!rule.exclude.some((e) => String(e) === String(extra))) {
          rule.exclude = [...rule.exclude, extra];
        }
        return;
      }
      rule.exclude = [rule.exclude, extra];
    };

    config.module.rules.forEach((rule) => {
      if (!rule) return;
      patchSourceMapLoaderRule(rule);
      if (Array.isArray(rule.oneOf)) {
        rule.oneOf.forEach(patchSourceMapLoaderRule);
      }
    });
    
    return config;
  }
);
