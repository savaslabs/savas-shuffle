/**
 * Create link record in airtable if it doesn't exist
 * @param {Object[]} users - array of checked user objects
 * @param {String} users[].type - either "author" or "mention"
 * @param {String} users[].id - Airtable record id of user record
 * @param {String} channel - name of originating Slack channel
 * @param {String[]} tags - Airtable record ids of tag records
 * @param {Object} link - checked link object
 * @param {Boolean} link.exists - true if link already exists in Airtable
 * @param {String} link.url - normalized URL
 * @param {String} message - original Slack message, decoded
 * @param {Object} base - Airtable class instance
 */
module.exports = (users, channel, tags, link, message, base) => {
  return new Promise((resolve, reject) => {
    if (link.exists) {
      resolve(link)
    } else {
      base('links').create({
        user: users.filter(user => user.type === 'author').map(user => user.id),
        mentions: users.filter(user => user.type === 'mention').map(user => user.id),
        url: link.url,
        channel,
        tags,
        message
      }, { typecast: true }, (err, record) => {
        if (err) {
          reject(err)
        } else {
          resolve({
            new: true,
            exists: true,
            airtable: record.fields.airtable,
            id: record.fields.id,
            url: link.url
          })
        }
      })
    }
  })
}