const path = require('path');
const webpackConfig = require('./webpack.config');
const babelConfig = require('./babel.config');

module.exports = {
  assetsDir: 'assets/',

  css: {
    sourceMap: true,
    loaderOptions: {
      postcss: {
        plugins: [],
      },
    },
  },

  configureWebpack: webpackConfig,
  lintOnSave: false,

  pluginOptions: {
    i18n: {
      locale: 'en-gb',
      fallbackLocale: 'en-gb',
      localeDir: 'renderer/locales',
      enableInSFC: true,
    },
    electronBuilder: {
      chainWebpackMainProcess: (config) => {
        config.module
          .rule('babel')
          .test(/\.m?js$/)
          .include
          .add(path.resolve(__dirname, 'src/background.js'))
          .add(path.resolve(__dirname, 'src/main/'))
          .end()
          .use('babel')
          .loader('babel-loader')
          .options(babelConfig);
      },
      mainProcessWatch: ['src/main/*'],
    },
  },
};
