#!/usr/bin/env node
const Conf = require('conf')
const { access } = require('fs/promises')
const { constants } = require('fs')
const { EntoliPrompt } = require('entoli')
const meow = require('meow')
const { execSync } = require('child_process')
const { join, parse } = require('path')
const simpleFormatter = require('./lib/formatters/simple_formatter')

require('pretty-error').start()

const args = meow(`
Usage
    abridged-cli [OPTIONS]

Abridged Anime. But in the Terminal!

OPTIONS
    -s, --server   
    Springs up a python FTP server on 0.0.0.0 for the abridged folder

    -f, --format
    Formats files in supplied/current path. Only supports Shorts & Shots

TUI
    q - exit
    / - search
    o - open dir
    i - add/edit info.txt

    Press 'Left' and 'Right' arrows to navigate
    through entry types. Clicking menu items with the 
    cursor does the same thing.

    Press '/' to search. Search only works in the
    entry list page. When searching, the entry list 
    is non interactive. To make it interactive again
    the search must be completed by pressing 'Enter'.
    When typing, pressing 'Delete' will clear the
    query.

    Pressing 'o' in the entry list menu opens the
    abridged directory. To visit an entry directory
    press 'o' inside of an entry item when the
    content list is in view.

    Scroll using the mouse to navigate faster
    through a list. However, you cannot open an
    entry nor can you watch a content item by
    clicking on it. You must highlight the item
    and press 'Enter' for it to work.

    Pressing 'i' inside of an entry (content list)
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
      type: 'string',
      alias: 'f',
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

  // run folder formatter
  if (args.flags.format === '' || args.flags.format) {
    const formatDir = join(process.cwd(), args.flags.format)
    const base = parse(formatDir).base

    // if dir not shorts or shots exit
    if (base !== 'Shorts' && base !== 'Shots') {
      return
    }

    // run shorts n shots formatter
    await simpleFormatter(formatDir)

    return
  }

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
      console.log(`Cannot access directory ${response}`)
      return
    }
  }
  else {
    // checking if abridged dir can be accessed
    try {
      const location = config.get('location')
      await access(location, constants.R_OK)
    } catch {
      console.log('Cannot access abridged directory')
      console.log('Path: ' + config.get('location'))
      console.log('Config Path: ' + config.path)
      return
    }
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

    const username = config.get('server_username')
    const password = config.get('server_password')
    const port = config.get('server_port')
    const location = config.get('location')

    const args = `sudo python3 -u ${join(__dirname, '/server/server.py')} -u ${username} -P ${password} -p ${port} -l ${location}`
    console.log('Running Server')
    execSync(args)
    return
  }

  require('./src/blessed')(config.get('location'))
}

main()