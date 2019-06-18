module.exports = {
  lintOnSave: false,
  devServer: {
    proxy: {
      // 配置跨域
      '/api': {
        target: 'http://192.168.11.26:3000/api/',
        ws: true,
        changOrigin: true,
        pathRewrite: {
          '^/api': '/'
        }
      }
    }
  }
}
