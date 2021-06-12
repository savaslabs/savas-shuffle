/**
 * Checks to see if a link already exists in Airtable
 * @param {Object} user - user object
 * @param {String} user.type - either "author" or "mention"
 * @param {String} user.value - Slack username of user
 * @param {Object} base - Airtable class instance
 */
module.exports = (user, base) => {
  return new Promise((resolve, reject) => {
    base('users').select({
      maxRecords: 1,
      view: 'All',
      fields: ['name'],
      filterByFormula: `{name} = "${user.value}"`
    }).eachPage((records) => {
      if (records.length > 0) {
        resolve({
          exists: true,
          type: user.type,
          id: records[0].id
        })
      } else {
        resolve({
          exists: false,
          type: user.type,
          name: user.value
        })
      }
    }, (err) => {
      if (err) reject(err)
    })
  })
}