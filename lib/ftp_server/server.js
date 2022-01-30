const { spawnSync } = require('child_process')

const ftpServer = (username, password, port, location, serverPath) => {
  spawnSync('python3', [serverPath, `-u${username}`, `-P${password}`, `-p${port}`, `-l${location}`], {
    stdio: "inherit",
  })
}

module.exports = { ftpServer }