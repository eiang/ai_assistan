module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        '@': require('path').resolve(__dirname, './'),
        '@static': require('path').resolve(__dirname, './static'),
        '@components': require('path').resolve(__dirname, './components'),
        '@pages': require('path').resolve(__dirname, './pages')
      }
    }
  }
} 