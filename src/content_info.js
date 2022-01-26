const path = require('path')
const fs = require('fs/promises')

const { contentList } = require('./content_list')
const state = require('./state')
const screen = require('./screen')
const {contentInfo, contentInfoText} = require('./views/content_info_view')
const contentInfoAbsent = require('./views/content_info_absent_view')

// if clicked move focus back to content list
contentInfoText.on('focus', () => {
  contentList.focus()
})

const setContentInfo = async (listPage, currentEntry) => {
  try {
    const data = await fs.readFile(path.join(currentEntry.filename, 'info.txt'), 'utf8')
    
    if (data === '') {
      throw 'empty info file'
    }

    state.infoFileData = data
    listPage.append(contentInfo)
    contentInfoText.setContent(data)
  } catch {
    listPage.append(contentInfoAbsent)
  }

  screen.render()
}

module.exports = {contentInfo, setContentInfo, contentInfoAbsent}