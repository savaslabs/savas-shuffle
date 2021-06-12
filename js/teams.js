const shuffleArray = require('./helpers/shuffleArray')
const removeAbsent = require('./helpers/removeAbsent')

// team colors
const colors = ['red', 'blue', 'green', 'purple', 'yellow', 'orange', 'black']

/**
 * Creates balanced teams of present Savasians
 * @param {Object} req - ExpressJS request
 * @param {Object} res - ExpressJS response
 * @param {Object} conf - Configuration data from ./conf/conf.json
 * @param {String[]=} params - An optional number of teams (defaults to 2) followed by zero or more optional names of absentees (must equal person's knownAs value in conf object)
 */
module.exports = (req, res, conf, params) => {

  // determine the number of teams
  let segments = !isNaN(params[0]) ? parseInt(params.shift(),10) : 2

  // remove absentees
  let present = removeAbsent(conf.team, params)

  // randomize order
  let shuffled = shuffleArray(present)

  // make array of names
  let people = shuffled.map(person => person.firstName + ' ' + person.lastName)

  // build teams
  let teams = []
  for (let i = 0; i < people.length; i++) {
    let j = i % segments
    teams[j] = teams[j] || []
    teams[j].push(people[i])
  }

  // build response text
  let text = ''
  for (let i = 0; i < teams.length; i++) {
    text += `:${colors[i]}_circle: *Team*\n${teams[i].join('\n')}\n`
  }

  // send response text to Slack
  res.json({ text, response_type: 'in_channel' })

}