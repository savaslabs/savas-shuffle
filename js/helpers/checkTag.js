/**
 * Checks to see if a tag already exists in Airtable
 * @param {String} tag - tag name, excluding the hash character
 * @param {Object} base - Airtable class instance
 */
 module.exports = (tag, base) => {
  return new Promise((resolve, reject) => {
    base('tags').select({
      maxRecords: 1,
      view: 'All',
      fields: ['name'],
      filterByFormula: `{name} = "${tag}"`
    }).eachPage((records) => {
      if (records.length > 0) {
        resolve({
          exists: true,
          id: records[0].id
        })
      } else {
        resolve({
          exists: false,
          name: tag
        })
      }
    }, (err) => {
      if (err) reject(err)
    })
  })
}