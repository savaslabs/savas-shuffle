const shuffleArray = require('./helpers/shuffleArray')
const removeAbsent = require('./helpers/removeAbsent')

/**
 * Creates a randomized list of present Savasians
 * @param {Object} req - ExpressJS request
 * @param {Object} res - ExpressJS response
 * @param {Object} conf - Configuration data from ./conf/conf.json
 * @param {String[]=} absent - Names of absentees (must equal person's knownAs value in conf object)
 */
module.exports = (req, res, conf, absent) => {
  let present = removeAbsent(conf.team, absent)
  let shuffled = shuffleArray(present)
  let text = shuffled.map(person => person.firstName + ' ' + person.lastName).join('\n')
  res.json({ text, response_type: 'in_channel' })
}