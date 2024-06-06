module.exports = {
  devServer: {
    host: '0.0.0.0',
    port: 3001,
    hot: true,
    liveReload: true,
    client: {
      webSocketURL: 'ws://0.0.0.0:3001/ws',
    },
  },
};
