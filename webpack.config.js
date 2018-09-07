const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin')

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      { test: /\.js$/, include: path.resolve(__dirname, 'src'), loader: 'babel-loader' }
    ]
  },
  plugins: [
    new CleanWebpackPlugin([
      'dist'
    ])
  ]
}
