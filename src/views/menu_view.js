const blessed = require('../../lib/blessed')
const state = require('../state')

const menu = blessed.box({
  left: 2,
  width: '100%-2',
  height: 40,
  top: 1,
})

entryMenues = state.entryTypes.reduce((acc, current) => {
  let marginLeft

  // resolve margin
  if (state.entryTypes.indexOf(current) === 0) {
    marginLeft = 0
  } else {
    // calculate the length + 3 of all previous entry
    const entries_to_left = state.entryTypes.slice(0, state.entryTypes.indexOf(current))
    marginLeft = entries_to_left.reduce((acc, current) => acc + current.length + 2, 0)
  }

  return {
    ...acc,
    [current]: blessed.text({
      content: current,
      parent: menu,
      clickable: true,
      tags: true,
      left: marginLeft,
      keyable: true,
    })
  }
}, {})

module.exports = { menu, entryMenues }