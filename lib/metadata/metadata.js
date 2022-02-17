const { spawnSync } = require('child_process')

const metadataChecker = (scriptPath, location) => {
  spawnSync('python3', [scriptPath, location], {
    stdio: "inherit",
  })
}

module.exports = { metadataChecker }