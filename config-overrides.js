const { override, addWebpackAlias } = require('customize-cra');
const path = require('path');

module.exports = override(
  addWebpackAlias({
    '@': path.resolve(__dirname, 'src'),
    '@components': path.resolve(__dirname, 'src/components'),
    '@pages': path.resolve(__dirname, 'src/pages'),
    '@utils': path.resolve(__dirname, 'src/utils'),
    '@hooks': path.resolve(__dirname, 'src/hooks'),
    '@services': path.resolve(__dirname, 'src/services'),
    '@store': path.resolve(__dirname, 'src/store'),
    '@assets': path.resolve(__dirname, 'src/assets'),
    '@routes': path.resolve(__dirname, 'src/routes'),
  })
);