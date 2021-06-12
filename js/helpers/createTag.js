/**
 * Create tag record in Airtable if it doesn't exist
 * @param {Object} tag - checked tag object
 * @param {Boolean} tag.exists - true if tag already exists in Airtable
 * @param {Object} tag.name - tag name, excluding the hash character
 */
 module.exports = (tag, base) => {
  return new Promise((resolve, reject) => {
    if (tag.exists) {
      resolve(tag.id)
    } else {
      base('tags').create({
        name: tag.name
      }, (err, record) => {
        if (err) {
          reject(err)
        } else {
          resolve(record.id)
        }
      })
    }
  })
}