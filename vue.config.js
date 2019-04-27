module.exports = {
  publicPath: '',
  assetsDir: 'assets',
  devServer: {
    proxy: {
      '^/socket.io': {
        target: 'http://webrtc.qwertyyb.cn',
        changeOrigin: true,
        ws: true
      },
      '^/api': {
        target: 'http://webrtc.qwertyyb.cn',
        changeOrigin: true
      }
      // '^/socket.io': {
      //   target: 'http://localhost:8443',
      //   changeOrigin: true,
      //   ws: true
      // },
      // '^/api': {
      //   target: 'http://localhost:8443',
      //   changeOrigin: true
      // }
    }
  }
}
