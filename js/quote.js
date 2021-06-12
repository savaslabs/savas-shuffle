const airtableJson = require('airtable-json').default

/**
 * Gets and replies with a random quote from the Quotes Airtable
 * @param {Object} req - ExpressJS request
 * @param {Object} res - ExpressJS response
 * @param {Object} conf - Configuration data from ./conf/conf.json
 * @param {*} params - Currently unused
 */
module.exports = async (req, res, conf, params) => {
  const auth_key = conf.airtable_read_api_key
  const base_name = 'appqDblKeJfBZlCCl'
  const primary = 'Quotes'
  const view = 'Grid view'
  const populate = [{ local: 'Attribution', other: 'People' }]
  const quotes = await airtableJson({ auth_key, base_name, primary, view, populate })
  let selected = quotes[Math.floor(Math.random() * quotes.length)]
  let text = `> ${selected.Quote}`
  text += selected.Attribution ? `\n> — ${selected.Attribution[0].Name}` : ''
  res.json({ text, response_type: 'in_channel' })
}