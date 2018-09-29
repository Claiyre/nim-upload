const path = require('path')
// const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode: 'development',
  entry: './demo/index.js',
  module: {
    rules: [
      { test: /\.js$/, exclude: path.resolve(__dirname, '../node_modules'), loader: 'babel-loader' },
      { test: /\.html$/, include: path.resolve(__dirname, '../demo'), loader: 'html-loader' },
      { test: /\.scss$/, include: path.resolve(__dirname, '../demo'), use: ['style-loader', 'css-loader', 'sass-loader'] }
    ]
  },
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    contentBase: path.join(__dirname, '../dist'),
    compress: true,
    allowedHosts: ['faq.yunxin.163.com'],
    port: 9000
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'demo/index.html'
    })
  ]
}
