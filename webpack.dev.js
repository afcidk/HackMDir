const path = require('path')
const webpack = require('webpack')
const ChromeExtensionReloader = require('webpack-extension-reloader')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const DIST_DIR = path.resolve(__dirname, 'dist')
const SRC_DIR = path.resolve(__dirname, 'src')

module.exports = {
  devtool: 'inline-source-map',
  mode: 'development',
  watch: true,
  entry: {
    background: ['babel-polyfill', SRC_DIR + '/background.js'],
    content: ['babel-polyfill', SRC_DIR + '/content.js']
  },
  output: {
    path: DIST_DIR,
    filename: '[name].js',
    publicPath: './',
    libraryTarget: 'umd'
  },
  plugins: [
    new ChromeExtensionReloader({
      manifest: SRC_DIR + '/manifest.json'
    }),
    new webpack.optimize.ModuleConcatenationPlugin(),
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
        exclude: ['/node_modules/', '/src/api'],
        include: /src/,
        use: ['babel-loader']
      },
      {
        test: /\.(scss|sass)$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.(html)$/,
        use: ['html-loader']
      }
    ]
  }
}
