module.exports = {
  publicPath: '/front/',
  assetsDir: 'assets',
  devServer: {
    proxy: {
      '^/socket.io': {
        target: 'https://webrtc.qwertyyb.cn',
        changeOrigin: true,
        ws: true
      },
      '^/api': {
        target: 'https://webrtc.qwertyyb.cn',
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
