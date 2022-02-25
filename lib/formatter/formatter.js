const { readdir } = require('fs/promises')
const { join } = require('path')
const defaultFormatter = require('./default')


const entryTypeHandler = async (type, entryPath, files) => {
  switch (type) {
    case 'Series':
      return
    default:
      try {
        await defaultFormatter(entryPath, files)
      } catch (err) {
        console.error(err)
      }
      return
  }
}

// main function
const structureFormatter = async (location) => {
  // get dirs inside abridged folder
  let entryTypes = await readdir(location, { withFileTypes: true })
  entryTypes = entryTypes.filter((dir) => dir.isDirectory())

  // loop through each dir
  for (const entryType of entryTypes) {
    console.log(`Working on: ${entryType.name}`)

    let entries = await readdir(join(location, entryType.name), { withFileTypes: true })
    entries = entries.filter((dir) => dir.isDirectory())

    // loop through entries and read files
    for (const entry of entries) {
      const entryPath = join(location, entryType.name, entry.name)

      // get entry files
      let entryFiles = await readdir(entryPath, { withFileTypes: true })
      entryFiles = entryFiles.filter((file) => file.isFile())
      entryFiles = entryFiles.map((file) => (join(entryPath, file.name)))

      entryTypeHandler(entryType.name, entryPath, entryFiles)
    }
  }
}


module.exports = structureFormatter