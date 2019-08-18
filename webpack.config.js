const path = require('path');

module.exports = {
  entry: {
    AnyChat: './src/core/ChatBase.ts',
    TawkTo: './src/chats/tawkto/TawkTo.ts'
  },
  // devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  mode: 'production'
}
