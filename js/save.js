const Airtable = require('airtable')
const linkify = require('linkifyjs')
require('linkifyjs/plugins/hashtag')
require('linkifyjs/plugins/mention')
const checkTag = require('./helpers/checkTag')
const createTag = require('./helpers/createTag')
const checkUser = require('./helpers/checkUser')
const createUser = require('./helpers/createUser')
const checkLink = require('./helpers/checkLink')
const createLink = require('./helpers/createLink')
const craftResponse = require('./helpers/craftResponse')

/**
 * Save link(s) to the Savbot Links Airtable
 * @param {Object} req - ExpressJS request
 * @param {Object} res - ExpressJS response
 * @param {Object} conf - Configuration data from ./conf/conf.json
 * @param {String[]} body - Array of words from Slack message payload, minus directive keyword
 */
module.exports = async (req, res, conf, body) => {

  // set up Airtable instance
  const apiKey = conf.airtable_write_api_key
  const base = new Airtable({ apiKey }).base('appKXVWfshfUMntTv')

  // extract user, channel, links, hashtags, and mentions from req and body for use later
  const author = { type: 'author', value: req.query.user_name }
  const channel = req.query.channel_name
  const message = decodeURIComponent(body.join(' '))
  const nuggets = linkify.find(message)
  let tags = nuggets.filter(nugget => nugget.type === 'hashtag').map(tag => tag.value.substring(1))
  let links = nuggets.filter(nugget => nugget.type === 'url').map(link => link.href)
  let mentions = nuggets.filter(nugget => nugget.type === 'mentions').map(mention => {return { type: 'mention', value: mention.value.substring(1) }})
  let users = [author].concat(mentions)

  // default slack message response text to be overridden later
  let text = 'Hoo. It looks like an error occured :('

  // if there are no links, reply with an informative message
  if (0 === links.length) {
    text = `Hoo? It doesn't look like there's a link in your message for me to save!`
  }

  // if there are links
  else {
    try {

      // check which tags, users and links already exist in the Airtable and create the ones that don't
      tags = await Promise.all(tags.map(tag => checkTag(tag, base)))
      tags = await Promise.all(tags.map(tag => createTag(tag, base)))
      users = await Promise.all(users.map(user => checkUser(user, base)))
      users = await Promise.all(users.map(user => createUser(user, base)))
      links = await Promise.all(links.map(link => checkLink(link, base)))
      links = await Promise.all(links.map(link => createLink(users, channel, tags, link, message, base)))

      // craft response based on the number of new and/or existing links in the original message
      text = craftResponse(links)

    } catch (error) {
      console.log(error)
    }
  }

  // send response text to Slack
  res.json({ text, response_type: 'in_channel' })

}