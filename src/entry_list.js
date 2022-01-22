const path = require('path')
const fs = require('fs/promises')
const screen = require('./screen')
const uuid = require('uuid').v4
const naturalCompare = require('string-natural-compare')
const { matchSorter } = require('match-sorter')

const state = require('./state')
const entryList = require('./views/entry_list_view')


const setEntryList = async (entryType, query) => {
  // use entry data from state
  let entries = state.entries[entryType]

  // if entry data not already in state bring it in
  if (!entries.length) {
    const page = entryType[0].toUpperCase() + entryType.slice(1)
    const loc = path.join(state.location, page)
  
    let dirs = await fs.readdir(loc, { withFileTypes: true })
    dirs = dirs.filter((filename) => filename.isDirectory())
    

    entries = dirs.map((filename) => {
      const name = filename.name
      
      const title = name.replace(/^\[[^\]]+\] /g, '')
      const creator = name.match(/^\[[^\]]+\]/g)
      const absPath = path.join(loc, name)

      let tagTitle
      if (creator) {
        tagTitle = `{cyan-fg}[{/cyan-fg}{magenta-fg}${creator[0].slice(1, -1)}{/magenta-fg}{cyan-fg}]{/cyan-fg} {white-fg}${title}{/white-fg}`
      } else {
        tagTitle = `{white-fg}${title}{/white-fg}`
      }

      return ({
        id: uuid(),
        title: title,
        tagTitle: tagTitle,
        creator: creator ? creator : null,
        filename: absPath,
      })
    })

    state.entries[entryType] = entries
  }

  // customize entries array before displaying
  if (query) {
    entries = matchSorter(entries, query, { keys: ['filename'] })
  } else {
    entries = entries.sort((a, b) => naturalCompare(a.filename, b.filename, { caseInsensitive: true }))
  }


  entries = entries.map((entry) => {
    return entry.tagTitle
  })

  entryList.setItems(entries)
  screen.render()
}

// default
setEntryList(state.menuSelected)

module.exports = { entryList, setEntryList }


  // entries = [
  //   "[2GS Bootlegged] High School Hot x Barz",
  //   "[2GS Bootlegged] Hustle Art Online",
  //   "[2GS Bootlegged] Vampire + Swaggit",
  //   "[Abridgilliance] Dagashi Kashi Abridged",
  //   "[Baka Oppai] BakaOppai Shorts",
  //   "[Breviator] Another",
  //   "[Chessete] Phoenix Wright Rhythms",
  //   "[eagle8burger] Darker Than Black",
  //   "[Earl of Bassington] HA x HA",
  //   "[Grimmjack] Goblin Slayer",
  //   "[JoyRide Entertainment] Dr. Stone Abridged",
  //   "[Junk House Studios] Kakegurui Shorts",
  //   "[Junk House Studios] The Devil is a Part Timer",
  //   "[Kurosai] Boundary Bridge",
  //   "[Kurosai] Kurosai Shorts",
  //   "[MGXAbridged] Mysterious Girlfriend X",
  //   "[MyToasterIsMoist] Haroohee",
  //   "[MyToasterIsMoist] Jujutsu Kaisen",
  //   "[NUMBSKULLS] Overlord Abridged",
  //   "[PhatDogStudios] That Time I Got Abridged as a Slime",
  //   "[PowerMadOtaku] Parasyte The Maxim",
  //   "[PowerManOtaku] Phoenix Wright",
  //   "[Project Mouthwash] Bleach (S) Abridged",
  //   "[PSWeasel] My Dumb Academia",
  //   "[Scourgemaster] Kotoura-san",
  //   "[The Boiis] Seraph of the End",
  //   "[The Boiis] Your Lie in April",
  //   "[The Dastails] Nisekoi",
  //   "[The Rollin Nolan] Sword Farce Online",
  //   "[The Schmuck Squad] Re Zero Abridged",
  //   "[The Shmuck Squad] Akame Ga Kill!",
  //   "[The Shmuck Squad] MAGI - The Abridged Series of Magic",
  //   "[The Shmuck Squad] The Seven Deadly Schmucks",
  //   "[TheWINChestersInc] Supernatural Abridged",
  //   "[Xcaliborg] The Prince & The Pussy",
  //   "[YaroShien] Abridged + Vampire",
  //   "[YaroShien] How to be an Adventurer",
  //   "[YaroShien] MekakuCity Actors TAS",
  // ]
