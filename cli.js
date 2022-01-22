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
    s - search
    o - open dir
    q - exit
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