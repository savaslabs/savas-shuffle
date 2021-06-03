const request = require('request')
const shuffleArray = require('./shuffleArray')
const removeAbsent = require('./removeAbsent')

const debugMode = false // set to true to locally debug and not ping everyone's slack

// constructs HTML rows of giver/receiver pairs, only for debugging
const showPairs = (givers, receivers) => {
  let g = givers.map(person => `<td>${person.firstName} ${person.lastName}</td>`)
  let r = receivers.map(person => `<td>${person.firstName} ${person.lastName}</td>`)
  let rows = ''
  for (let i = 0; i < g.length; i++) {
    rows += `<tr>${g[i]} ${r[i]}</tr>`
  }
  return rows
}

// checks to see if the giver/reciever sets are incompatible and need another shuffle
const incompatible = (givers, receivers) => {
  for (let i = 0; i < givers.lenth; i++) {
    if (givers[i].slackID == receivers[i].slackID) {
      return true
    }
  }
  return false
}

module.exports = (req, res, conf, absent) => {
  let url = conf.slack_webhook_url
  let reply = {}
  let present = removeAbsent(conf.team, absent)
  let givers = present
  let receivers = [...present]
  do { receivers = shuffleArray(receivers) } while (incompatible(givers, receivers))
  if (!debugMode) {
    for (let i = 0; i < givers.length; i++) {
      let giver = givers[i]
      let receiver = receivers[i]
      let channel = giver.slackID // change to your slack ID for testing
      let text = `Dearest *${giver.firstName}*, you will be Savas Claus-ing :santa: for *${receiver.firstName}*
                  Their address is: ${receiver.address}
                  Remember, spend no more than $1,000.00 :moneybag: on the :gift:. We want to keep things _reasonable_<https://www.youtube.com/watch?v=B6jCMaiTqG0|!>`
                  .replace(/\n\s+/gm, '\n')
      request.post({
        url,
        body: JSON.stringify({ channel, text })
      }, (error, res, body) => {
        if (error) {
          console.error(error)
          return
        }
        reply.text = body
      })
    }
    reply.text = reply.text || "Savas Clause success!"
    res.json({ text: reply.text, response_type: 'in_channel' })
  } else {
    res.send(`<style>table,td { border: 1px solid #ccc; } td,th {padding: 0.1rem;}</style><table><thead><tr><th>Giver</th><th>Receiver</th></tr></thead><tbody>${showPairs(givers, receivers)}</tbody></table>`)
  }
}