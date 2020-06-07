const path = require('path');
const StyleLintPlugin = require('stylelint-webpack-plugin');

module.exports = {
  devtool: 'source-map',

  resolve: {
    alias: {
      '@assets': path.resolve(__dirname, 'src/assets/'),
      '@renderer': path.resolve(__dirname, 'src/renderer/'),
      '@components': path.resolve(__dirname, 'src/renderer/components'),
    },
  },

  plugins: [
    new StyleLintPlugin({
      files: ['{src,public}/**/*.{vue,htm,html,css,sss,less,scss,sass}'],
    }),
  ],

};
