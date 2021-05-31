const shuffleArray = require('./shuffleArray')
const removeAbsent = require('./removeAbsent')

module.exports = (req, res, conf, absent) => {
  let present = removeAbsent(conf.team, absent)
  let shuffled = shuffleArray(present)
  let text = shuffled.map(person => person.firstName + ' ' + person.lastName).join('\n')
  res.json({ text, response_type: 'in_channel' })
}