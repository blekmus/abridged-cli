const state = require('./state')

function main(location, entryTypes) {
  const index = entryTypes.indexOf('Other')
  if (index > -1) {
    entryTypes.splice(index, 1)
  }

  state.entryTypes = entryTypes
  state.location = location
  state.menuSelected = state.entryTypes[0]

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

// new method that returns the content of highlighted item
// node_modules/blessed/lib/widgets/list.js:536
// List.prototype.getSelected = function () {
//   return this.items[this.selected].content;
// }

// diables all highlights and keypress elements in blessed.list
// node_modules/blessed/lib/widgets/list.js:544
// List.prototype.interactiveDisable = function() {
//   this.interactive = false
// }

// enables all highlights and keypress elements in blessed.list
// node_modules/blessed/lib/widgets/list.js:548
// List.prototype.interactiveEnable = function () {
//   this.interactive = true
// }

// add process.env.VISUAL env variable
// now supports already existig files with options.filename
// node_modules/blessed/lib/widgets/screen.js:1835
// var self = this
//   , editor = options.editor || process.env.EDITOR || process.env.VISUAL || 'vi'
//   , name = options.name || process.title || 'blessed'
//   , rnd = Math.random().toString(36).split('.').pop()
//   , file = options.filename || '/tmp/' + name + '.' + rnd
//   , args = [file]
//   , opt;

// support for existing files
// don't unlink file if options.filename exists
// node_modules/blessed/lib/widgets/screen.js:1853
// return writeFile(function (err) {
//   if (err) return callback(err);
//   return self.exec(editor, args, opt, function (err, success) {
//     if (err) return callback(err);
//     return fs.readFile(file, 'utf8', function (err, data) {
//       if (options.filename) {
//         if (!success) return callback(new Error('Unsuccessful.'));
//         if (err) return callback(err);
//         return callback(null, data);
//       }
//       return fs.unlink(file, function () {
//         if (!success) return callback(new Error('Unsuccessful.'));
//         if (err) return callback(err);
//         return callback(null, data);
//       });
//     });
//   });
// });