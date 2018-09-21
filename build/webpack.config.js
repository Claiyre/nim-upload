const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
module.exports = {
  mode: 'none',
  entry: {
    uploader: './src/index.js',
    'uploader.min': './src/index.js'
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: '[name].js',
    library: 'Uploader',
    libraryTarget: 'umd'
  },
  optimization: {
    minimize: true,
    minimizer: [
      new UglifyJsPlugin({
        test: /\.min\.js$/
      })
    ]
  },
  module: {
    rules: [
      { test: /\.js$/, include: path.resolve(__dirname, '../src'), loader: 'babel-loader' }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(['dist'], {
      root: process.cwd()
    })
  ]
}
