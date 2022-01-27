const blessed = require('../../lib/blessed')

const contentInfo = blessed.box({
  width: '100%-2',
  height: '25%',
  top: '50%+4',
  left: 2,
})

blessed.text({
  top: 0,
  left: 0,
  parent: contentInfo,
  tags: true,
  content: "{magenta-fg}Info{/magenta-fg}"
})

const contentInfoText = blessed.text({
  width: '100%',
  top: 1,
  parent: contentInfo,
  mouse: true,
  content: '',
  scrollable: true,
  style: {
    selected: {
      bg: '#fcfcfc',
    },
    scrollbar: {
      bg: 'blue'
    }
  },
  scrollbar: {
    ch: ' ',
    track: {
      bg: 'black',
    },
  },
})

module.exports = {contentInfo, contentInfoText}