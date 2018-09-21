if (process.env.NODE_ENV === 'production') {
  module.exports = require('./dist/uploader.min.js')
} else {
  module.exports = require('./dist/uploader.js')
}
