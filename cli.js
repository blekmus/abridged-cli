#!/usr/bin/env node
const Conf = require('conf')
const fs = require('fs')
const prompt = require('prompt')
const path = require('path');
const meow = require('meow')
require('pretty-error').start();

meow(`
Usage
    abridged-cli

TUI
    q - exit
    / - search
    o - open dir
    i - add/edit info.txt

    Pressing the 'Left' and 'Right' arrows
    navigates through the entry types. Clicking
    the menu items with the mouse also works.

    Press '/' to search. Search only works in the
    entry list. When searching entry list is non
    interactive. To make it interactive again the
    search must be completed by pressing 'Enter'.
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
`)


const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'))

const config = new Conf({
  configName: packageJson.name,
  schema: {
    location: { type: 'string' }
  }
})


if (!config.get('location')) {
  console.log('Abridged directory path not set')
  prompt.message = "Enter Location";
  prompt.delimiter = ""
  prompt.get({
    properties: {
      location: {
        description: " (path):",
        required: true,
        type: 'string',

      }
    }
  }, (_err, result) => {
    config.set('location', result.location)
  })
} else {
  try {
    fs.accessSync(config.get('location'))
  } catch {
    console.log('Cannot access abridged directory')
    console.log('Path: ' + config.get('location'))
    console.log('Config Path: ' + config.path)
    return
  }

  require('./src/blessed')(config.get('location'))
}