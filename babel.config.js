module.exports = {
  presets: ['react-app'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          '@': './src',
          '@components': './src/components',
          '@pages': './src/pages',
          '@utils': './src/utils',
          '@hooks': './src/hooks',
          '@services': './src/services',
          '@store': './src/store',
          '@assets': './src/assets',
        },
      },
    ],
  ],
};
