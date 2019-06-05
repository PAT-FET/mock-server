require('babel-register')({
  presets: [ 'env' ],
  plugins: ['transform-decorators-legacy'],
  ignore: function (filename) {
    if (!filename.includes('node_modules')) return false
    if (filename.includes('node_modules/@pat-fet/mock-server')) return true
    return true
  }
})

module.exports = require('./MockServer').default
