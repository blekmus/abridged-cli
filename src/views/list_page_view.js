const blessed = require('../../lib/blessed')

const listPage = blessed.box({
  width: '100%',
  height: '100%',
  keyable: true,
})

module.exports = listPage
