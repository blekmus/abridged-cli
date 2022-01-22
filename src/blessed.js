const state = require('./state')

function main(location) {
  state.location = location

  const screen = require('./screen')
  const listPage = require('./list_page')

  screen.key(['q', 'C-c'], function () {
    process.exit(0)
  })

  screen.append(listPage)
  screen.render()
}

module.exports = main


// ============ source code changes =============

// edited it so list items don't have full width backgrounds
// node_modules/blessed/lib/widgets/list.js:254
// if (this.shrink) {

// adds a new method that returns the content of highlighted item
// node_modules/blessed/lib/widgets/list.js:536
// List.prototype.getSelected = function () {
//   return this.items[this.selected].content;
// }

// diables all highlights and keypress elements
// node_modules/blessed/lib/widgets/list.js:544
// List.prototype.interactiveDisable = function() {
//   this.interactive = false
// }

// enables all highlights and keypress elements
// node_modules/blessed/lib/widgets/list.js:548
// List.prototype.interactiveEnable = function () {
//   this.interactive = true
// }
