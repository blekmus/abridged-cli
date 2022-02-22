const screen = require('./screen')
const state = require('./state')
const { setEntryList, entryList } = require('./entry_list')
const { contentList } = require('./content_list')
const listPage = require('./views/list_page_view')
const { menu, entryMenues } = require('./views/menu_view')
const { search } = require('./search')
const { contentInfo, contentInfoAbsent } = require('./content_info')


// mouse click handler
state.entryTypes.forEach((entryType) => {
  entryMenues[entryType].on('click', () => {
    if (state.menuSelected === entryType) {
      return
    }

    setMenu(state.menuSelected, entryType)
    screen.render()
  })

  // can't seem to focus entrylist any other way
  entryMenues[entryType].on('keypress', (_sender, key) => { 
    if (key.name === 'up') {
      entryList.focus()
      entryList.up()
    }
    if (key.name === 'down') {
      entryList.focus()
      entryList.down()
    }
  })
})

// handle visual and logical aspect of the menu
const setMenu = (oldItem, currentItem) => {

  // remove all styles from old item
  if (oldItem) {
    entryMenues[oldItem].setContent(oldItem)
  }

  // if current page is a content list, take back to entry list
  if (state.currentContentList) {
    state.currentEntry = null
    state.currentContentList = null
    state.infoFileData = null
    listPage.remove(contentList)
    listPage.remove(contentInfo)
    listPage.remove(contentInfoAbsent)

    if (state.searchQuery !== '') {
      listPage.append(search)
    }

    listPage.append(entryList)
    entryList.focus()
  }

  // set the new entry list type file set
  if (state.searchQuery !== '') {
    setEntryList(currentItem, state.searchQuery)
  } else {
    setEntryList(currentItem)
  }

  // select the first entry
  entryList.select(0)

  // set current menu state
  state.menuSelected = currentItem

  // set styles to currentItem
  entryMenues[currentItem].setContent(`{blue-fg}{underline}${currentItem}{/underline}{/blue-bg}`)

  return
}

// default
setMenu(false, state.menuSelected)

module.exports = {setMenu, menu}