process.title = `${process.argv[2]}.${process.argv[3]}`
process.on('message', (score) => {
  const { Promise } = global
  const db = require('../config/database')
  const Player = require('../models/player.model')
  const Attendance = require('../models/attendance.model')
  db.connect()
  let playerInstance
  Promise
    .resolve(Player.findById(score.player))
    .then((player) => {
      if (!player) {
        process.send('fail::' + JSON.stringify({
          error: 'No player found',
        }))
      }
      playerInstance = player
      return Attendance.count({ player: player._id })
    })
    .then((count) => {
      return playerInstance.update({
        attendance: count,
      })
    })
    .then((res) => {
      setTimeout(() => {
        process.exit()
      }, 10)
      process.send('success::' + JSON.stringify(res))
    })
    .catch((err) => {
      setTimeout(() => {
        process.exit()
      }, 10)
      process.send('fail::' + JSON.stringify(err))
    })
})

process.on(process.title + ' uncaughtException', function (err) {
  console.log('Caught exception: ' + err)
})
