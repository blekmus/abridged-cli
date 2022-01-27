const blessed = require('../../lib/blessed')

const search = blessed.box({
  left: 2,
  width: '100%',
  height: 1,
  top: 3,
  keyable: true,
  mouse: true,
  keys: true
})

const prompt = blessed.text({
  content: '{bold}{red-fg}>{/red-fg}{/bold}',
  tags: true,
})

const input = blessed.textbox({
  left: 2,
  width: 30,
  style: {
    fg: 'yellow',
  },
  keys: true,
  mouse: true,
  name: 'search',
})

search.append(prompt)
search.append(input)

module.exports = { search, input }