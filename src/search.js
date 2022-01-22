const { entryList, setEntryList } = require('./entry_list')
const screen = require('./screen')
const state = require('./state')
const { search, input } = require('./views/search_view')

const keypress = (_sender, key) => {
  if (key.name === 'escape' || key.name === 'delete') {
    search.detach()
    state.searchQuery = ''
    state.searchTyping = false

    entryList.position.top = 3
    entryList.interactiveEnable()
    entryList.focus()

    setEntryList(state.menuSelected)
    entryList.select(0)
  }

  if (key.name === 'delete') {
    input.clearValue()
  }

  if (key.name === 'return') {
    if (input.value === '') {
      search.detach()
      entryList.position.top = 3
    }

    input.removeAllListeners()
    entryList.interactiveEnable()
    state.searchTyping = false
    entryList.focus()
    entryList.select(0)
  }

  screen.render()
}

const render = () => {
  if (input.value !== state.searchQuery) {
    state.searchQuery = input.value
    setEntryList(state.menuSelected, state.searchQuery)
  }
}

const focus = () => {
  input.readInput()
}

// keep focus on search bar on list mouse clicks
entryList.on('focus', () => {
  if (state.searchTyping) {
    search.children.at(1).focus()
  }
})

module.exports = {
  search, input, inputListeners: {
    keypress, render, focus
}}