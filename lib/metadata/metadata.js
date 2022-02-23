const { spawnSync } = require('child_process')

const metadataChecker = (scriptPath, location, specific) => {
  spawnSync('python3', [scriptPath, location, specific], {
    stdio: "inherit",
  })
}

module.exports = { metadataChecker }