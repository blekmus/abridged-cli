const path = require('path')
const fs = require('fs/promises')
const screen = require('./screen')
const uuid = require('uuid').v4
const naturalCompare = require('string-natural-compare')
const { matchSorter } = require('match-sorter')

const state = require('./state')
const entryList = require('./views/entry_list_view')
const currentPath = require('./current_path')


const setEntryList = async (entryType, query) => {
  // use entry data from state
  let entries = state.entries[entryType]

  // if entry data not already in state bring it in
  if (!entries.length) {
    const page = entryType[0].toUpperCase() + entryType.slice(1)
    const loc = path.join(state.location, page)
  
    let dirs = await fs.readdir(loc, { withFileTypes: true })
    dirs = dirs.filter((filename) => filename.isDirectory())
    

    entries = dirs.map((filename) => {
      const name = filename.name
      
      const title = name.replace(/^\[[^\]]+\] /g, '')
      const creator = name.match(/^\[[^\]]+\]/g)
      const absPath = path.join(loc, name)

      let tagTitle
      if (creator) {
        tagTitle = `{cyan-fg}[{/cyan-fg}{magenta-fg}${creator[0].slice(1, -1)}{/magenta-fg}{cyan-fg}]{/cyan-fg} {white-fg}${title}{/white-fg}`
      } else {
        tagTitle = `{white-fg}${title}{/white-fg}`
      }

      return ({
        id: uuid(),
        title: title,
        tagTitle: tagTitle,
        creator: creator ? creator[0] : null,
        filename: absPath,
      })
    })

    state.entries[entryType] = entries
  }

  // customize entries array before displaying
  if (query) {
    entries = matchSorter(entries, query, { keys: ['filename'] })
  } else {
    entries = entries.sort((a, b) => naturalCompare(a.filename, b.filename, { caseInsensitive: true }))
  }


  entries = entries.map((entry) => {
    return entry.tagTitle
  })

  currentPath.setContent(`Path: ${state.location} (${entries.length})`)
  entryList.setItems(entries)
  screen.render()
}

// default
setEntryList(state.menuSelected)

module.exports = { entryList, setEntryList }