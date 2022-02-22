#!/usr/bin/env node

const Conf = require('conf')
const { access, readdir } = require('fs/promises')
const { constants } = require('fs')
const { EntoliPrompt } = require('entoli')
const meow = require('meow')
const { join, resolve } = require('path')
const simpleFormatter = require('./lib/formatters/simple_formatter')
const { ftpServer } = require('./lib/ftp_server/server')
const { metadataChecker } = require('./lib/metadata/metadata.js')
const chalk = require('chalk')

require('pretty-error').start()

const args = meow(`
USAGE
    ${chalk.blue('abridged-cli [OPTIONS]')}

Abridged Anime. But in the Terminal!

OPTIONS
    ${chalk.blue('-s, --server')} 
    Spring up FTP server on 0.0.0.0:2121 for the abridged folder

    ${chalk.blue('-f, --format')}
    Format Shorts & Shots entries as per the standard structure

    ${chalk.blue('-m, --metadata')}
    Check and fix video file metadata of all entries
    Optionally, specify a specify path. Entry/Entry type dirs are valid

TUI
    ${chalk.blue('q')} - exit
    ${chalk.blue('/')} - search
    ${chalk.blue('o')} - open dir
    ${chalk.blue('i')} - add/edit info.txt

    Press ${chalk.blue('Left')} and ${chalk.blue('Right')} arrows to navigate
    through entry types. Clicking menu items with the
    cursor does the same thing.

    Press ${chalk.blue('/')} to search. Search only works in the
    entry list page. When searching, the entry list
    is non interactive. To make it interactive again
    the search must be completed by pressing ${chalk.blue('Enter')}.
    When typing, pressing ${chalk.blue('Delete')} will clear the
    query.

    Pressing ${chalk.blue('o')} in the entry list menu opens the
    abridged directory. To visit an entry directory
    press ${chalk.blue('o')} inside of an entry item when the
    content list is in view.

    Scroll using the mouse to navigate faster
    through a list. However, you cannot open an
    entry nor can you watch a content item by
    clicking on it. You must highlight the item
    and press ${chalk.blue('Enter')} for it to work.

    Pressing ${chalk.blue('i')} inside of an entry (content list)
    will open the text editor defined by
    $EDITOR or $VISUAL. You can either edit the
    existing info.txt file or this will create a
    new one.
`, {
  flags: {
    server: {
      type: 'boolean',
      alias: 's'
    },
    format: {
      type: 'boolean',
      alias: 'f',
    },
    metadata: {
      type: 'string',
      alias: 'm',
    }
  }
})

async function main() {
  const config = new Conf({
    schema: {
      location: { type: 'string' },
      server_username: { type: 'string' },
      server_password: { type: 'string' },
      server_port: { type: 'number', default: 21 },
    },
    clearInvalidConfig: true,
  })

  // if location isn't set, set it
  // and check if it can be accessed
  if (!config.get('location')) {
    console.log('Abridged directory path not set')
    const locationPrompt = new EntoliPrompt('Enter location (path):');
    const response = await locationPrompt()

    // checking if input dir can be accessed
    try {
      await access(response, constants.R_OK)
      config.set('location', response)
    } catch {
      console.log(chalk.red(`Error: Cannot access directory ${response}`))
      return
    }
  }
  else {
    // checking if abridged dir can be accessed
    try {
      const location = config.get('location')
      await access(location, constants.R_OK)
    } catch {
      console.log(chalk.red('Error: Cannot access abridged directory'))
      console.log('Abridged Path: ' + chalk.blue(config.get('location')))
      console.log('Config Path:   ' + chalk.blue(config.path))
      return
    }
  }

  // run shots n shots formatter
  if (args.flags.format) {
    await simpleFormatter(config.get('location'))
    return
  }

  // run FTP server
  if (args.flags.server) {
    // set server info if they don't exist
    if (!config.get('server_username')) {
      console.log('Setting up FTP server')
      const usernamePrompt = new EntoliPrompt('Enter username:')
      const passwordPormpt = new EntoliPrompt('Enter password:')
      const portPrompt = new EntoliPrompt('Enter port (21):')

      const username = await usernamePrompt()
      const password = await passwordPormpt()
      const port = await portPrompt()

      config.set('server_username', username)
      config.set('server_password', password)
      config.set('server_port', Number(port))
    }

    // get credentials
    const username = config.get('server_username')
    const password = config.get('server_password')
    const port = config.get('server_port')
    const location = config.get('location')
    const serverPath = join(__dirname, '/lib/ftp_server/server.py')

    ftpServer(username, password, port, location, serverPath)

    return
  }

  // run metadata checker
  if (typeof args.flags.metadata === 'string') {
    const location = config.get('location')
    const scriptPath = join(__dirname, '/lib/metadata/metadata.py')

    if (args.flags.metadata === '') {
      metadataChecker(scriptPath, location)
    } else {
      const specificPath = resolve(args.flags.metadata)
      metadataChecker(scriptPath, specificPath)
    }
    return
  }

  // get entry type directories
  let entryTypes = await readdir(config.get('location'), { withFileTypes: true })
  entryTypes = entryTypes.filter(entry => entry.isDirectory())

  // check if entryTypes is empty
  if (!entryTypes.length) {
    console.log(chalk.red('Error: No entry types found'))
    console.log('Abridged Path: ' + chalk.blue(config.get('location')))
    console.log('Config Path:   ' + chalk.blue(config.path))
    return
  }

  entryTypes = entryTypes.map(entryType => entryType.name)

  // run TUI
  require('./src/blessed')(config.get('location'), entryTypes)
}

main()
