const path = require('path');

module.exports = [
  {
    entry: './src/script-ts.js',
    mode: 'production',
    output: {
      filename: 'index.js',
      path: path.resolve(__dirname, 'dist')
    }
  },
  {
    entry: './src/script-ts.js',
    mode: 'development',
    output: {
      filename: 'index-dev.js',
      path: path.resolve(__dirname, 'dist')
    }
  }
];

