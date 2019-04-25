const path = require('path')
const webpack = require('webpack')
const CopyWebpackPlugin = require("copy-webpack-plugin")

module.exports = {
  mode: 'production',
  entry: {
    content: ['babel-polyfill', path.resolve('src', 'content.js')],
    background: ['babel-polyfill', path.resolve('src', 'background.js')]
  },
  output: {
    path: path.resolve('dist'),
    filename: '[name].js',
    publicPath: './'
  },
  plugins: [
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false,
      }
    }),
    new CopyWebpackPlugin([
      { from: './src/manifest.json' },
      { from: './src/icons/', to: './icons' }
    ])
  ],
  resolve: { extensions: ['.js', '.jsx'] },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        include: /src/,
        use: 'babel-loader'
      },
      {
        test: /\.(scss|sass)$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      }
    ]
  }
}
