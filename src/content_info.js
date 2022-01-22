const path = require('path')
const fs = require('fs/promises')

const { contentList } = require('./content_list')
const state = require('./state')
const screen = require('./screen')
const {contentInfo, contentInfoText} = require('./views/content_info_view')

// if clicked move focus back to content list
contentInfoText.on('focus', () => {
  contentList.focus()
})

const setContentInfo = async (currentEntry) => {
  const selectedEntry = state.entries[state.menuSelected].filter((item) => (
    item.tagTitle === currentEntry
  ))[0]

  let data

  try {
    data = await fs.readFile(path.join(selectedEntry.filename, 'info.txt'), 'utf8')
    contentInfoText.setContent(data)
  } catch {
    contentInfoText.setContent("Press I to set info file")
  }

  screen.render()
}

module.exports = {contentInfo, setContentInfo}