const path = require('path')
const fs = require('fs/promises')
const uuid = require('uuid').v4
const open = require('open')
const naturalCompare = require('string-natural-compare')
const { cleanTags } = require('blessed')

const state = require('./state')
const screen = require('./screen')
const contentList = require('./views/content_list_view')
const currentPath = require('./current_path')


const setContentList = async (currentEntry) => {
  let files = await fs.readdir(currentEntry.filename, { withFileTypes: true })
  files = files.filter((filename) => filename.isFile())
  files = files.filter((filename) => !filename.name.match(/\.(gif|jpe?g|tiff?|png|webp|bmp|txt)$/i))
  files = files.sort((a, b) => naturalCompare(a.name, b.name, { caseInsensitive: true }))

  content = files.map((filename) => {
    const name = filename.name
    let type = null
    let itemNum = null
    let title = null
    let tagTitle = ''

    const absPath = path.join(currentEntry.filename, name)

    if (state.menuSelected === 'series') {
      const episode = name.match(/^\bep\S*\s*\d*(?:(?:\.(?=\d))\d)?/ig)
      const ova = name.match(/^\bova\s*\d*(?:(?:\.(?=\d))\d)?/ig)
      const movie = name.match(/^\bmovie\s*\d*(?:(?:\.(?=\d))\d)?/ig)

      title = name
        .replace(/^\bep\S*\s*\d*(?:(?:\.(?=\d))\d)?/ig, '')
        .replace(/^\bova\s*\d*(?:(?:\.(?=\d))\d)?/ig, '')
        .replace(/^\bmovie\s*\d*(?:(?:\.(?=\d))\d)?/ig, '')
        .replace(/^\s*\-*\s*/ig, '')
      
      if (title.match(/^\./ig)) {
        title = null
      }
      
      if (episode) {
        itemNum = episode[0].match(/\d+|\./ig).join('')
        type = 'ep'
      } else if (ova) {
        itemNum = ova[0].match(/\d+|\./ig).join('')
        type = 'ova'
      } else if (movie) {
        type = 'movie'
        itemNum = movie[0].match(/\d+|\./ig).join('')
      }

      let numElement = ''
      let sepElement = ''
      let titleElement = ''

      if (itemNum) {
        numElement = `{cyan-fg}[${type.toUpperCase()}{/cyan-fg}{magenta-fg} ${itemNum}{/magenta-fg}{cyan-fg}]{/cyan-fg}`
      }

      if (type && title) {
        sepElement = '{blue-fg} - {/blue-fg}'
      }

      if (title) {
        titleElement = title
      }

      tagTitle = numElement + sepElement + titleElement
    }

    if (state.menuSelected === 'shots' || state.menuSelected === 'shorts') {
      title = filename.name

      if (state.menuSelected === 'shots') {
        type = 'shot'
      } else {
        type = 'short'
      }

      const identifierElement = `{cyan-fg}[${type.toUpperCase()}]{/cyan-fg}`
      const sepElement = '{blue-fg} - {/blue-fg}'
      const titleElement = title

      tagTitle = identifierElement + sepElement + titleElement
    }

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
