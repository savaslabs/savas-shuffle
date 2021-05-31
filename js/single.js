const shuffleArray = require('./shuffleArray')
const removeAbsent = require('./removeAbsent')

module.exports = (req, res, conf, absent) => {
  let present = removeAbsent(conf.team, absent)
  let shuffled = shuffleArray(present)
  let text = shuffled[0].firstName + ' ' + shuffled[0].lastName
  res.json({ text, response_type: 'in_channel' })
}