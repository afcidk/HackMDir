module.exports = {
  plugins: [
    require('postcss-pxtorem')({
      replace: process.env.NODE_ENV === 'production',
      rootValue: 10,
      minPixelValue: 1.1,
      propWhiteList: [],
      unitPrecision: 5
    })
  ]
}
