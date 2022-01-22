const blessed = require("blessed")
const state = require("./state")

const currentPath = blessed.text({
  content: `Path: ${state.location}`,
  tags: true,
  bottom: 1,
  left: 2,
})

module.exports = currentPath
