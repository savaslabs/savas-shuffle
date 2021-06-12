const sayOne = (arr) => `that link! It's in Airtable as <${arr[0].airtable}|record #${arr[0].id}>`
const sayAll = (arr) => `those links! They're in Airtable as ` + arr.map(link => `<${link.airtable}|record #${link.id}>`).join(', ')

/**
 * Ingest links and output appropriate text response
 * @param {Object[]} links - array of checked link objects
 * @param {Boolean} links[].new - true if link didn't already exist
 * @param {String} links[].airtable - URL to link record in Airtable
 * @param {String} links[].id - Serialized id of link recordin Airtable
 */
 module.exports = (links) => {
   let text = ''
   const newLinks = links.filter(link => link.new)
   const oldLinks = links.filter(link => !link.new)
   if (0 === newLinks.length) {
     text = 'Hoo HOO! It looks like someone has already saved '
     text += (1 === oldLinks.length) ? sayOne(oldLinks) : sayAll(oldLinks)
     text += '.'
   } else if (0 === oldLinks.length) {
     text = `Hoo! I've saved `
     text += (1 === newLinks.length) ? sayOne(newLinks) : sayAll(newLinks)
     text += '.'
   } else {
     text = `Hoo hoo! Someone has already saved `
     text += (newLinks.length > 1) ? 'some ' : 'one '
     text += `one of those links. I've saved the new `
     text += (newLinks.length > 1) ? 'ones ' : 'one '
     text += 'as ' + newLinks.map(link => `<${link.airtable}|record #${link.id}>`).join(', ')
     text += '. The old '
     text += (oldLinks.length > 1) ? 'ones are ' : 'one is '
     text += oldLinks.map(link => `<${link.airtable}|record #${link.id}>`).join(', ')
     text += '.'
   }
   return text
 }