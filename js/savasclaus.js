const request = require('request')
const shuffleArray = require('./helpers/shuffleArray')
const removeAbsent = require('./helpers/removeAbsent')

// set to true to locally debug and not ping everyone's slack
const debugMode = false

/**
 * constructs HTML rows of giver/receiver pairs, only for debugging
 * @param {Object[]} givers - Randomized array of givers
 * @param {Object[]} receivers - Randomized array of receivers
 */
const showPairs = (givers, receivers) => {
  let g = givers.map(person => `<td>${person.firstName} ${person.lastName}</td>`)
  let r = receivers.map(person => `<td>${person.firstName} ${person.lastName}</td>`)
  let rows = ''
  for (let i = 0; i < g.length; i++) {
    rows += `<tr>${g[i]} ${r[i]}</tr>`
  }
  return rows
}

/**
 * Checks to see if the giver/reciever sets are incompatible and need another shuffle
 * @param {Object[]} givers - Randomized array of givers
 * @param {Object[]} receivers - Randomized array of receivers
 */
const incompatible = (givers, receivers) => {
  for (let i = 0; i < givers.lenth; i++) {
    if (givers[i].slackID == receivers[i].slackID) {
      return true
    }
  }
  return false
}

/**
 * Creates giver/receiver pairs and secretly notified givers of who their reciever is
 * @param {Object} req - ExpressJS request
 * @param {Object} res - ExpressJS response
 * @param {Object} conf - Configuration data from ./conf/conf.json
 * @param {String[]=} absent - Names of absentees (must equal person's knownAs value in conf object)
 */
module.exports = (req, res, conf, absent) => {

  // get the URL for post requests
  let url = conf.slack_webhook_url

  // declare reply object for feedback to invoker user
  let reply = {}

  // remove absentees
  let present = removeAbsent(conf.team, absent)

  // duplicate into two arrays of givers and receivers
  let givers = present
  let receivers = [...present]

  // shuffle receivers array until givers and receivers are compatible
  do { receivers = shuffleArray(receivers) } while (incompatible(givers, receivers))

  // if not in debug mode, secretly notify each giver
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
          reply.text = body
          return
        }
      })
    }

    // if there were no errors, reply with a success message to the invoker user in Slack
    reply.text = reply.text || "Savas Clause success!"
    res.json({ text: reply.text, response_type: 'in_channel' })

  }

  // if in debug mode, render a table showing the giver and receiver match-ups
  else {
    res.send(`<style>table,td { border: 1px solid #ccc; } td,th {padding: 0.1rem;}</style><table><thead><tr><th>Giver</th><th>Receiver</th></tr></thead><tbody>${showPairs(givers, receivers)}</tbody></table>`)
  }
  
}