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

  chainWebpack: (config) => {
    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap((options) => {
        // eslint-disable-next-line no-param-reassign
        options.compilerOptions.whitespace = 'condense';
        return options;
      });
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
      nodeIntegration: true,
      chainWebpackMainProcess: (config) => {
        config.module
          .rule('babel')
          .test(/\.m?js$/)
          .include
          .add(path.resolve(__dirname, 'src/background.js'))
          .add(path.resolve(__dirname, 'src/background/'))
          .end()
          .use('babel')
          .loader('babel-loader')
          .options(babelConfig);
      },
      mainProcessWatch: ['src/background/*'],
    },
  },
};
