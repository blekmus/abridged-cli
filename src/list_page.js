const screen = require('./screen')
const open = require('open')
const path = require('path')
const { writeFile } = require('fs')

const state = require('./state')
const { menu, setMenu } = require('./menu')
const { entryList } = require('./entry_list')
const { contentList, setContentList, openItem } = require('./content_list')
const listPage = require('./views/list_page_view')
const { search, input, inputListeners } = require('./search.js')
const currentPath = require('./current_path')
const { contentInfo, setContentInfo, contentInfoAbsent } = require('./content_info')
const { exec } = require('child_process')


const openDir = async (loc) => {
  await open(loc)
}

listPage.on('element keypress', (_sender, _ch, key) => {
  // menu navigation
  if (key.name === 'right') {
    const currentIndex = state.entryTypes.indexOf(state.menuSelected)

    if (currentIndex < state.entryTypes.length - 1) {
      setMenu(state.menuSelected, state.entryTypes[currentIndex + 1])
    }
  }
  if (key.name === 'left') {
    const currentIndex = state.entryTypes.indexOf(state.menuSelected)

    if (currentIndex > 0) {
      setMenu(state.menuSelected, state.entryTypes[currentIndex - 1])
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

entryList.on('keypress', async (_sender, key) => {
  // entryList navigation
  if (key.name === 'up') {
    entryList.up()
  }
  if (key.name === 'down') {
    entryList.down()
  }

  // open file explorer
  if (key.name === 'o') {
    openDir(state.location)
  }

  // from entryList into contentList
  if (key.name === 'enter') {
    state.currentEntry = state.entries[state.menuSelected].filter((item) => (
      item.tagTitle === entryList.getSelected()
    ))[0]

    await setContentList(state.currentEntry)
    setContentInfo(listPage, state.currentEntry)
    contentList.select(0)

    entryList.detach()
    search.detach()

    listPage.append(contentList)

    contentList.setScroll(0)
    contentList.focus()
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

  // open file explorer
  if (key.name === 'o') {
    openDir(state.currentEntry.filename)
  }

  // create/edit info file
  if (key.name === 'i') {
    if (!process.env.EDITOR && !process.env.VISUAL) {
      return
    }

    const loc = path.join(state.currentEntry.filename, 'info.txt')
    const filename = (state.infoFileData) ? loc : null

    screen.readEditor({ name: 'info.txt', filename }, (_err, data) => {
      // if editor is empty
      if (!data || data === '') return

      // if there's data save it
      writeFile(loc, data, (err) => {
        if (err) throw err

        // rerender and display new info.txt
        contentInfoAbsent.detach()
        setContentInfo(listPage, state.currentEntry)
      })
    })
  }

  // display mkv description
  if (key.name === 'd') {
    const selectedItem = state.currentContentList.filter((item) => (
      item.tagTitle === contentList.getSelected()
    ))[0]

    if (selectedItem.filename.includes('.mkv')) {
      const loc = path.join(selectedItem.filename)
      // check if ffprobe is installed
      exec('which ffprobe', (err, stdout, stderr) => {
        if (err) {
          // check if bat is installed
          exec('which bat', (err, stdout, stderr) => {
            if (err) {
              screen.spawn(`sh`, ['-c', `clear && echo "ffprobe is not installed" | less`]);
            } else {
              screen.spawn(`sh`, ['-c', `clear && echo "ffprobe is not installed" | bat --paging always`]);
            }
          })
        } else {
          // check if bat is installed
          exec('which bat', (err, stdout, stderr) => {
            if (err) {
              screen.spawn(`sh`, ['-c', `clear && ffprobe -v quiet -print_format json -show_format -show_streams "${loc}" | jq '.format.tags.DESCRIPTION' --raw-output | less`]);
            } else {
              screen.spawn(`sh`, ['-c', `clear && ffprobe -v quiet -print_format json -show_format -show_streams "${loc}" | jq '.format.tags.DESCRIPTION' --raw-output | bat --paging always`]);
            }
          })
        }
      })
    }
  }

  // from contentList back to entryList
  if (key.name === 'backspace') {
    state.currentEntry = null
    state.currentContentList = null
    state.infoFileData = null

    contentList.detach()
    contentInfo.detach()
    contentInfoAbsent.detach()

    if (state.searchQuery !== '') {
      listPage.append(search)
    }

    listPage.append(entryList)
    currentPath.setContent(`Path: ${state.location} (${state.entries[state.menuSelected].length})`)

    entryList.focus()
  }

  screen.render()
})

listPage.append(menu)
listPage.append(currentPath)
listPage.append(entryList)

entryList.focus()


module.exports = listPage