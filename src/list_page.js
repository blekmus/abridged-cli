const screen = require('./screen')
const open = require('open')


const state = require('./state')
const { menu, setMenu } = require('./menu')
const { entryList } = require('./entry_list')
const  { contentList, setContentList, openItem } = require('./content_list')
const listPage = require('./views/list_page_view')
const { search, input, inputListeners } = require('./search.js')
const currentPath = require('./current_path')

const openDir = async (loc) => {
  await open(loc)
}

listPage.on('element keypress', (_sender, _ch, key) => {
  // menu navigation
  if (key.name === 'right') {
    if (state.menuSelected === 'shorts') {
      return
    } else if (state.menuSelected === 'series') {
      setMenu(state.menuSelected, 'shots')
      state.menuSelected = 'shots'
    } else if (state.menuSelected === 'shots') {
      setMenu(state.menuSelected, 'shorts')
      state.menuSelected = 'shorts'
    }
  }
  if (key.name === 'left') {
    if (state.menuSelected === 'series') {
      return
    } else if (state.menuSelected === 'shorts') {
      setMenu(state.menuSelected, 'shots')
      state.menuSelected = 'shots'
    } else if (state.menuSelected === 'shots') {
      setMenu(state.menuSelected, 'series')
      state.menuSelected = 'series'
    }
  }

  // activate search
  if (key.full === '/' && contentList.detached) {
    if (search.detached) {
      listPage.insert(search, 2)
      entryList.position.top = 4
    }

    // listeners are here to stop duplicate inputs bug
    input.on('focus', inputListeners.focus)
    input.on('render', inputListeners.render)
    input.on('keypress', inputListeners.keypress)

    entryList.interactiveDisable()
    state.searchTyping = true
    input.focus()
  }

  screen.render()
})

entryList.on('keypress', (_sender, key) => {
  // entryList navigation
  if (key.name === 'up') {
    entryList.up()
  }
  if (key.name === 'down') {
    entryList.down()
  }

  // from entryList into contentList
  if (key.name === 'enter') {
    state.currentEntry = entryList.getSelected()
    setContentList(state.currentEntry)
    contentList.select(0)

    entryList.detach()
    search.detach()
    listPage.append(contentList)

    contentList.focus()
  }

  // open file explorer
  if (key.name === 'o') {
    openDir(state.location)
  }
  screen.render()
})

contentList.on('keypress', (_sender, key) => {
  // entryList navigation
  if (key.name === 'up') {
    contentList.up()
  }
  if (key.name === 'down') {
    contentList.down()
  }

  // opening content file
  if (key.name === 'enter') {
    openItem(contentList.getSelected())
  }

  // from contentList back to entryList
  if (key.name === 'backspace') {
    state.currentEntry = null
    state.currentContentList = null

    contentList.detach()

    if (state.searchQuery !== '') {
      listPage.append(search)
    }

    listPage.append(entryList)
    currentPath.setContent(`Path: ${state.location}`)

    entryList.focus()
  }

  // open file explorer
  if (key.name === 'o') {
    const selectedEntry = state.entries[state.menuSelected].filter((item) => (
      item.tagTitle === state.currentEntry
    ))[0].filename
    openDir(selectedEntry)
  }

  screen.render()
})

listPage.append(menu)
listPage.append(currentPath)
listPage.append(entryList)

entryList.focus()


module.exports = listPage