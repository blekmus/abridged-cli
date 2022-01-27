const blessed = require('../../lib/blessed')

const contentList = blessed.list({
  keyable: true,
  width: '100%-2',
  align: 'left',
  mouse: true,
  style: {
    selected: {
      bg: '#fcfcfc',
      fg: '#222333',
    },
    scrollbar: {
      bg: 'blue'
    }
  },
  height: '50%',
  shrink: true,
  top: 3,
  left: 2,
  tags: true,
  scrollbar: {
    ch: ' ',
    track: {
      bg: 'black',
    },
  },
})

module.exports = contentList