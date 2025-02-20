// webpack.config.js
const path = require('path');

module.exports = {
  entry: './assets/js/main.js',
  output: {
    filename: 'slice-ops.js',
    path: path.resolve(__dirname, 'assets/dist'),
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  }
};
