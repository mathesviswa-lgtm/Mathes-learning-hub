module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        alias: {
          '@components': './src/components',
          '@screens': './src/screens',
          '@services': './src/services',
          '@utils': './src/utils',
          '@hooks': './src/hooks',
          '@styles': './src/styles',
          '@context': './src/context',
          '@navigation': './src/navigation',
          '@config': './src/config',
        },
      },
    ],
  ],
};
