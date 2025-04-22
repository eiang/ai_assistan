const path = require('path');
// 移除webpack导入，因为不再需要DefinePlugin
// const webpack = require('webpack');

module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './'),
        '@static': path.resolve(__dirname, './static'),
        '@components': path.resolve(__dirname, './components'),
        '@pages': path.resolve(__dirname, './pages')
      }
    }
    // 移除plugins部分，不再使用webpack.DefinePlugin
  }
} 