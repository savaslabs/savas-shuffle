const shuffleArray = require('./helpers/shuffleArray')
const removeAbsent = require('./helpers/removeAbsent')

/**
 * Randomly select a single Savasian, minus any who are absent
 * @param {Object} req - ExpressJS request
 * @param {Object} res - ExpressJS response
 * @param {Object} conf - Configuration data from ./conf/conf.json
 * @param {String[]=} absent - Names of absentees (must equal person's knownAs value in conf object)
 */
module.exports = (req, res, conf, absent) => {
  let present = removeAbsent(conf.team, absent)
  let shuffled = shuffleArray(present)
  let text = shuffled[0].firstName + ' ' + shuffled[0].lastName
  res.json({ text, response_type: 'in_channel' })
}