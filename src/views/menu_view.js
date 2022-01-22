const blessed = require('blessed')

const menu = blessed.box({
  left: 2,
  width: '100%-2',
  height: 40,
  top: 1,
})

const menuSeries = blessed.text({
  content: 'Series',
  parent: menu,
  clickable: true,
  tags: true,
  keyable: true,
})

const menuShots = blessed.text({
  content: 'Shots',
  parent: menu,
  clickable: true,
  tags: true,
  left: 8,
  keyable: true,
})

const menuShorts = blessed.text({
  content: 'Shorts',
  parent: menu,
  clickable: true,
  tags: true,
  left: 15,
  keyable: true,
})

module.exports = { menu, menuSeries, menuShots, menuShorts }