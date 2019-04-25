module.exports = {
  devServer: {
    proxy: {
      '^/socket.io': {
        target: 'http://localhost:8443',
        changeOrigin: true,
        ws: true
      },
      '^/api': {
        target: 'http://localhost:8443',
        changeOrigin: true
      }
    }
  }
}
