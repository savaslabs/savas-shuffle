const request = require('request')
const shuffleArray = require('./shuffleArray')
const removeAbsent = require('./removeAbsent')

const incompatible = (givers, recievers) => {
  for (let i = 0; i < givers.lenth; i++) {
    if (givers[i].slackID == recievers[i].slackID) {
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
  let recievers = [...present]
  do { recievers = shuffleArray(recievers) } while (incompatible(givers, recievers))
  for (let i = 0; i < givers.length; i++) {
    let giver = givers[i]
    let reciever = recievers[i]
    let channel = giver.slackID // change to your slack ID for testing
    let text = `Dearest *${giver.firstName}*, you will be Savas Claus-ing :santa: for *${reciever.firstName}*
                Their address is: ${reciever.address}
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
}