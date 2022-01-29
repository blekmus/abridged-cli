const { readdir, rename } = require('fs/promises')
const { join } = require('path')

const simpleFormatter = async (formatDir) => {
  try {
    let files = await readdir(formatDir, { withFileTypes: true })
    files = files.filter((file) => file.isDirectory())

    for (const file of files) {
      const filePath = join(formatDir, file.name)

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
      } else if (image.length !== 1) {
        console.log('Error: Contains more than one image')
      }

      // check if video needs to be formatted
      if (video.length == 1 && !video[0].startsWith('1.')) {
        formatVideo = true
      } else if (video.length !== 1) {
        console.log('Error: Has more than one video')
      }

      // check if formatting is needed
      if (!formatImage && !formatVideo) {
        continue
      }

      console.log(`Formatting: ${file.name}`)

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
  } catch (err) {
    console.error(err)
  }
}

module.exports = simpleFormatter