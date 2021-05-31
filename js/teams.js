const shuffleArray = require('./shuffleArray')
const removeAbsent = require('./removeAbsent')

const colors = ['red', 'blue', 'green', 'purple', 'yellow', 'orange', 'black']

module.exports = (req, res, conf, params) => {
  let segments = !isNaN(params[0]) ? parseInt(params.shift(),10) : 2
  let present = removeAbsent(conf.team, params)
  let shuffled = shuffleArray(present)
  let people = shuffled.map(person => person.firstName + ' ' + person.lastName)
  let remainder = people.length % segments
  let base = (people.length - remainder) / segments
  let teams = []
  for (let i = 0; i < people.length; i++) {
    let j = i % segments
    teams[j] = teams[j] || []
    teams[j].push(people[i])
  }
  let text = ''
  for (let i = 0; i < teams.length; i++) {
    text += `:${colors[i]}_circle: *Team*\n${teams[i].join('\n')}\n`
  }
  res.json({ text, response_type: 'in_channel' })
}