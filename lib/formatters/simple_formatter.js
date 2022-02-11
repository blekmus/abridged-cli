const { readdir, rename } = require('fs/promises')
const { join } = require('path')
const chalk = require('chalk')

// format files
const formatFiles = async (files, location) => {
  for (const file of files) {
    const filePath = join(location, file.name)

    // get all files
    let items = await readdir(filePath)

    // get image
    const image = items.filter((item) => {
      const match = item.match(/\.(gif|jpe?g|tiff?|png|webp|bmp)$/i)
      if (match) {
        return true
      }
    })

    // get video
    const video = items.filter((item) => {
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
        console.log(`Formatting: ${chalk.blue(file.name)}`)
        console.log(chalk.red('Error: Contains invalid number of images or videos'))
      }
      continue
    }

    console.log(`Formatting: ${chalk.blue(file.name)}`)

    // rename image
    if (formatImage) {
      const oldPath = join(filePath, image[0])
      const newPath = join(filePath, `cover.${image[0].split('.').at(-1)}`)

      try {
        await rename(oldPath, newPath)
      } catch (err) {
        console.log(err)
      }
    }

    // rename video
    if (formatVideo) {
      const oldPath = join(filePath, video[0])
      const newPath = join(filePath, `1.${video[0].split('.').at(-1)}`)

      try {
        await rename(oldPath, newPath)
      } catch (err) {
        console.log(err)
      }
    }
  }
}


const simpleFormatter = async (location) => {
  console.log('Starting formatter')

  // get shots
  console.log('Getting Shots')
  let shotFiles = await readdir(join(location, 'Shots'), { withFileTypes: true })
  shotFiles = shotFiles.filter((file) => file.isDirectory())

  // format shotfiles
  try {
    await formatFiles(shotFiles, join(location, 'Shots'))
    console.log('Finished formatting Shots')
  } catch (err) {
    console.error(err)
  }

  // get shorts
  console.log('Getting Shorts')
  let shortFiles = await readdir(join(location, 'Shorts'), { withFileTypes: true })
  shortFiles = shortFiles.filter((file) => file.isDirectory())

  // format shortfiles
  try {
    await formatFiles(shortFiles, join(location, 'Shorts'))
    console.log('Finished formatting Shorts')
  } catch (err) {
    console.error(err)
  }

  console.log(chalk.green('Formatting complete!'))
}

module.exports = simpleFormatter