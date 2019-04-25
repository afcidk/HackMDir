const path = require('path')
const webpack = require('webpack')

module.exports = {
    mode: 'production',
    entry: {
        background: ['babel-polyfill', path.resolve('src', 'main.js')],
    },
    output: {
        path: path.resolve('dist'),
        filename: '[name].js',
        publicPath: './',
    },
    plugins: [
        new webpack.optimize.ModuleConcatenationPlugin(),
    ],
    resolve: {extensions: ['.js', '.jsx']},
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