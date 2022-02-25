const { rename } = require('fs/promises')
const { join, basename } = require('path')
const chalk = require('chalk')


const defaultFormatter = async (entryPath, files) => {
  // get image
  let image = files.map((item) => basename(item)).filter((item) => {
    const match = item.match(/\.(gif|jpe?g|tiff?|png|webp|bmp)$/i)
    if (match) {
      return true
    }
  })

  // get video
  const video = files.map((item) => basename(item)).filter((item) => {
    const match = item.match(/\.(mkv|webm|mp4)$/i)
    if (match) {
      return true
    }
  })

  let formatImage
  let formatVideo

  // check if image needs to be formatted
  if (image.length == 1 && !image[0].startsWith('cover.')) {
    formatImage = true
  }

  // check if video needs to be formatted
  if (video.length == 1 && !video[0].startsWith('1.')) {
    formatVideo = true
  }

  // check if formatting is needed
  if (!formatImage && !formatVideo) {
    if (video.length !== 1 || image.length !== 1) {
      console.log(`Formatting: ${chalk.blue(basename(entryPath))}`)
      console.log(chalk.red('Error: Contains invalid number of images or videos'))
    }
    return
  }

  console.log(`Formatting: ${chalk.blue(basename(entryPath))}`)

  // rename image
  if (formatImage) {
    const oldPath = join(entryPath, image[0])
    const newPath = join(entryPath, `cover.${image[0].split('.').at(-1)}`)

    try {
      await rename(oldPath, newPath)
    } catch (err) {
      console.log(err)
    }
  }

  // rename video
  if (formatVideo) {
    const oldPath = join(entryPath, video[0])
    const newPath = join(entryPath, `1.${video[0].split('.').at(-1)}`)

    try {
      await rename(oldPath, newPath)
    } catch (err) {
      console.log(err)
    }
  }
}

module.exports = defaultFormatter