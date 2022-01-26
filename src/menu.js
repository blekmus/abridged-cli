const screen = require('./screen')
const state = require('./state')
const { setEntryList, entryList } = require('./entry_list')
const { contentList } = require('./content_list')
const listPage = require('./views/list_page_view')
const { menu, menuSeries, menuShots, menuShorts } = require('./views/menu_view')
const { search } = require('./search')


// mouse clicks
menuSeries.on('click', () => {
  if (state.menuSelected === 'series') {
    return
  }

  setMenu(state.menuSelected, 'series')
  screen.render()
})
menuShots.on('click', () => {
  if (state.menuSelected === 'shots') {
    return
  }

  setMenu(state.menuSelected, 'shots')
  screen.render()
})
menuShorts.on('click', () => {
  if (state.menuSelected === 'shorts') {
    return
  }

  setMenu(state.menuSelected, 'shorts')
  screen.render()
})

// handle visually setting menu and logic 
// surrounding it, like list changes
const setMenu = (oldItem, currentItem) => {

  // reset
  if (oldItem === 'series') {
    menuSeries.setContent("Series")
  }
  if (oldItem === 'shots') {
    menuShots.setContent("Shots")
  }
  if (oldItem === 'shorts') {
    menuShorts.setContent("Shorts")
  }

  // if current page is inside an entry page (content list)
  // take it back to the entry list 
  if (state.currentContentList) {
    state.currentEntry = null
    state.currentContentList = null
    state.infoFileData = null
    listPage.remove(contentList)

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

  // set menu
  if (currentItem === 'series') {
    menuSeries.setContent("{blue-fg}{underline}Series{/underline}{/blue-bg}")
    return
  }
  if (currentItem === 'shots') {
    menuShots.setContent("{blue-fg}{underline}Shots{/underline}{/blue-bg}")
    return
  }
  if (currentItem === 'shorts') {
    menuShorts.setContent("{blue-fg}{underline}Shorts{/underline}{/blue-bg}")
    return
  }
}


// default
setMenu(false, state.menuSelected)

module.exports = {setMenu, menu}