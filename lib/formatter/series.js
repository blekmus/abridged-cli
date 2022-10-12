const { rename } = require('fs/promises')
const { join, basename } = require('path')
const chalk = require('chalk')


const seriesFormatter = async (entryPath, files) => {
  // get images from entry path
  let image = files.map((item) => basename(item)).filter((item) => {
    const match = item.match(/\.(gif|jpe?g|tiff?|png|webp|bmp)$/i)
    if (match) {
      return true
    }
  })

  // check if formatting is needed
  if (image.length !== 0) {
      console.log(`Formatting: ${chalk.blue(basename(entryPath))}`)
      console.log(chalk.red('Error: Contains images in entry directory'))
    return
  }
}

module.exports = seriesFormatter