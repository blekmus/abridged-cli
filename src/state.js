module.exports = {
  entryTypes: [],

  menuSelected: '', // Series | Shorts | Shots

  entries: {},
  // entries.Series = [
  //   "[2GS Bootlegged] High School Hot x Barz",
  //   "[2GS Bootlegged] Hustle Art Online",
  // ]


  currentEntry: null,
  // currentEntry: {
  //   id: uuid,
  //   title: 'Hight School Hot x Barz',
  //   tagTitle: '{cyan-fg}[{/cyan-fg}{magenta-fg}2GS Bootlegged{/magenta-fg}{cyan-fg}]{/cyan-fg} {white-fg}Highschool Hot x Barz{/white-fg}',
  //   creator: '[2GS Bootlegged]',
  //   filename: '/path/to/loc/[2GS Bootlegged] High School Hot x Barz'
  // }


  currentContentList: null,
  // currentContentList = [{
  //   id: uuid,
  //   type: 'ep' | 'ova' | 'movie' | 'short' | 'shot',
  //   num: null | 4,
  //   title: null | 'The End',
  //   tagTitle: '{cyan-fg}[EP{/cyan-fg}{magenta-fg} 5{/magenta-fg}{cyan-fg}]{/cyan-fg} {white-fg}The End{/white-fg}',
  //   filename: '/path/to/loc/[2GS Bootlegged] High School Hot x Barz/Episode 5.mp4'
  // }]

  
  searchTyping: false,
  searchQuery: '',

  infoFileData: null,

  // abridged files parent folder
  location: '',
}