/**
 * Create user record in Airtable if it doesn't exist
 * @param {Object} user - checked user object
 * @param {Boolean} user.exists - true if user already exists in Airtable
 * @param {String=} user.id - Airtable record id of existing tag record
 * @param {String=} user.name - Slack username of user
 */
module.exports = (user, base) => {
  return new Promise((resolve, reject) => {
    if (user.exists) {
      resolve(user)
    } else {
      base('users').create({
        name: user.name
      }, (err, record) => {
        if (err) {
          reject(err)
        } else {
          resolve({
            exists: true,
            type: user.type,
            id: record.id
          })
        }
      })
    }
  })
}