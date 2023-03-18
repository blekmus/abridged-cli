const screen = require("../screen")

function seriesFormatter(name) {
  let type = null
  let itemNum = null

  const episode = name.match(/^\bep\S*\s*\d*(?:(?:(?:\.|~)(?=\d))\d)?/ig)
  const ova = name.match(/^\bova\s*\d*(?:(?:\.(?=\d))\d)?/ig)
  const movie = name.match(/^\bmovie\s*\d*(?:(?:\.(?=\d))\d)?/ig)

  let title = name
    .replace(/^\bep\S*\s*\d*(?:(?:(?:\.|~)(?=\d))\d)?/ig, '')
    .replace(/^\bova\s*\d*(?:(?:\.(?=\d))\d)?/ig, '')
    .replace(/^\bmovie\s*\d*(?:(?:\.(?=\d))\d)?/ig, '')
    .replace(/^\s*\-*\s*/ig, '')

  if (title.match(/^\./ig)) {
    title = null
  }

  if (episode) {  
    itemNum = episode[0].match(/\d+|\.|~/ig).join('')
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

  const tagTitle = numElement + sepElement + titleElement

  return [tagTitle, type, itemNum, title]
}

module.exports = seriesFormatter
