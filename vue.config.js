const path = require('path');
const webpack = require('webpack');

module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './'),
        '@static': path.resolve(__dirname, './static'),
        '@components': path.resolve(__dirname, './components'),
        '@pages': path.resolve(__dirname, './pages')
      }
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          VUE_APP_API_BASE_URL: JSON.stringify(process.env.VUE_APP_API_BASE_URL || 'http://localhost:8000'),
          VUE_APP_API_TIMEOUT: JSON.stringify(process.env.VUE_APP_API_TIMEOUT || '30000')
        }
      })
    ]
  }
} 