const blessed = require('blessed');

const screen = require('../screen')


const listPage = blessed.box({
  parent: screen,
  width: '100%',
  height: '100%',
  keyable: true,
})

module.exports = listPage
