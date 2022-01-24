const blessed = require("blessed")

const contentInfoAbsent = blessed.text({
  content: `Info: {green-fg}Press i to add info file{/green-fg}`,
  tags: true,
  bottom: 2,
  left: 2,
})

module.exports = contentInfoAbsent
