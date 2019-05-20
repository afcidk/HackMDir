const path = require('path')
const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')

const DIST_DIR = path.resolve(__dirname, 'dist')
const SRC_DIR = path.resolve(__dirname, 'src')

module.exports = {
  mode: 'production',
  entry: {
    content: ['babel-polyfill', SRC_DIR + '/content.js'],
    background: ['babel-polyfill', SRC_DIR + '/background.js']
  },
  output: {
    path: DIST_DIR,
    filename: '[name].js',
    publicPath: './'
  },
  plugins: [
    new webpack.optimize.ModuleConcatenationPlugin(),
    new CopyWebpackPlugin([
      { from: './src/manifest.json' },
      { from: './src/icons/', to: './icons' }
    ])
  ],
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin({
      terserOptions: {
        output: {
          comments: false
        }
      }
    })]
  },
  resolve: { extensions: ['.js', '.jsx'] },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: ['/node_modules/', '/src/api'],
        include: /src/,
        use: 'babel-loader'
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
