const path = require('path')
const webpack = require('webpack')
const ChromeExtensionReloader = require('webpack-reload-extension')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  devtool: 'inline-source-map',
  mode: 'development',
  watch: true,
  entry: {
    content: ['babel-polyfill', path.resolve('src', 'content.js')],
    background: ['babel-polyfill', path.resolve('src', 'background.js')]
  },
  output: {
    path: path.resolve('dist'),
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
        exclude: /node_modules/,
        include: /src/,
        use: 'babel-loader'
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
