require('babel-register')({
  presets: [ 'env' ],
  plugins: ['transform-decorators-legacy']
})

module.exports = require('./MockServer').default
