/**
 * Checks to see if a link already exists in Airtable
 * @param {String} link - normalized URL
 * @param {Object} base - Airtable class instance
 */
module.exports = (link, base) => {
  return new Promise((resolve, reject) => {
    base('links').select({
      maxRecords: 1,
      view: 'All',
      fields: ['id', 'url', 'airtable'],
      filterByFormula: `{url} = "${link}"`
    }).eachPage((records) => {
      if (records.length > 0) {
        resolve({
          new: false,
          exists: true,
          airtable: records[0].fields.airtable,
          id: records[0].fields.id,
          url: link
        })
      } else {
        resolve({
          new: true,
          exists: false,
          url: link
        })
      }
    }, (err) => {
      if (err) reject(err)
    })
  })
}