const seriesFormatter = require('./series')
const defaultFormatter = require('./default')


function mainFormatter(name, menuSelected) {
  if (menuSelected === 'Series') {
    return seriesFormatter(name)
  } else {
    return defaultFormatter(name)
  }
}

module.exports = mainFormatter