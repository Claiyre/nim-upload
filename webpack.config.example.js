const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode: 'development',
  entry: './example/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      { test: /\.js$/, exclude: path.resolve(__dirname, 'node_modules'), loader: 'babel-loader' },
      { test: /\.html$/, include: path.resolve(__dirname, 'example'), loader: 'html-loader' },
      { test: /\.scss$/, include: path.resolve(__dirname, 'example'), use: ['style-loader', 'css-loader', 'sass-loader'] }
    ]
  },
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 9000
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'example/index.html'
    }),
    new CleanWebpackPlugin([
      'dist'
    ])
  ]
}
