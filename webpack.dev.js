const path = require('path')
const webpack = require('webpack')
const ChromeExtensionReloader = require('webpack-reload-extension')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const DIST_DIR = path.resolve(__dirname, 'dist')
const SRC_DIR = path.resolve(__dirname, 'src')

module.exports = {
  devtool: 'inline-source-map',
  mode: 'development',
  watch: true,
  entry: {
    content: ['babel-polyfill', SRC_DIR + '/content.js'],
    background: ['babel-polyfill', SRC_DIR + '/background.js']
  },
  output: {
    path: DIST_DIR,
    filename: '[name].js',
    publicPath: './',
    libraryTarget: 'umd'
  },
  plugins: [
    new ChromeExtensionReloader({
      port: 9090,
      reloadPage: true,
      entries: {
        backgroundScript: 'background',
        contentScript: 'content',
        reloadPage: true
      }
    }),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new CopyWebpackPlugin([
      { from: './src/manifest.json' },
      { from: './src/icons/', to: './icons' },
      { from: './src/svgs', to: './svgs' }
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
        use: ['style-loader', 'css-loader', 'sass-loader', 'postcss-loader']
      },
      {
        test: /\.(html)$/,
        use: ['html-loader']
      }
    ]
  }
}
