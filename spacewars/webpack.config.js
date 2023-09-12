const path = require('path');

module.exports = {
  entry: {
    main: './gameFiles/main.js',
  },
  output: {
    filename: 'gameBundle.js',
    path: path.resolve(__dirname, 'public')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader'
      }
    ]
  }
};