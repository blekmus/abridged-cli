function defaultFormatter(name) {
  let itemNum = null
  let title = name
  const type = 'entry'

  title = name
    .replace('.mkv', '').replace('.mp4', '').replace('.webm', '')


  const identifierElement = `{cyan-fg}[${type.toUpperCase()}]{/cyan-fg}`
  const sepElement = '{blue-fg} - {/blue-fg}'
  const titleElement = title

  const tagTitle = identifierElement + sepElement + titleElement

  return [tagTitle, type, itemNum, title]
}

module.exports = defaultFormatter
