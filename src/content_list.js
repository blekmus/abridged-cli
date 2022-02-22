const path = require('path')
const fs = require('fs/promises')
const uuid = require('uuid').v4
const open = require('open')
const naturalCompare = require('string-natural-compare')
const { cleanTags } = require('../lib/blessed')

const state = require('./state')
const screen = require('./screen')
const contentList = require('./views/content_list_view')
const currentPath = require('./current_path')

const mainFormatter = require('./content_formatter/main_formatter')

const setContentList = async (currentEntry) => {
  let files = await fs.readdir(currentEntry.filename, { withFileTypes: true })
  files = files.filter((filename) => filename.isFile())
  files = files.filter((filename) => !filename.name.match(/\.(gif|jpe?g|tiff?|png|webp|bmp|txt)$/i))
  files = files.sort((a, b) => naturalCompare(a.name, b.name, { caseInsensitive: true }))

  let content = files.map((filename) => {
    const name = filename.name
    const absPath = path.join(currentEntry.filename, name)
  
    const [tagTitle, type, itemNum, title] = mainFormatter(name, state.menuSelected)

    return ({
      id: uuid(),
      type: type,
      num: itemNum,
      title: title,
      tagTitle: tagTitle,
      filename: absPath,
    })
  })

  state.currentContentList = content

  // customize entries array before displaying
  content = content.map((contentItem) => {
    return contentItem.tagTitle
  })

  contentList.setItems(content)
  currentPath.setContent(`Path: {green-fg}${cleanTags(currentEntry.tagTitle)}{/green-fg}`)

  screen.render()
}

const openItem = async (openedItem) => {
  const selectedItem = state.currentContentList.filter((item) => (
    item.tagTitle === openedItem
  ))[0]

  await open(selectedItem.filename)
}

module.exports = { openItem, contentList, setContentList }
