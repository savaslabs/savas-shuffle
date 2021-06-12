/**
 * Remove absent Savasians from list
 * @param {Object[]} team - array of person objects
 * @param {String} team[].knownAs - alias of how person is referred to within Savbot directives
 * @param {String[]=} absent - names of absentees (must equal person's knownAs value in ./conf/conf.json)
 */
module.exports = (team, absent) => {
  if (absent.length > 0) {
    let missing = absent.map(person => person.toLowerCase())
    return team.filter(person => missing.indexOf(person.knownAs.toLowerCase()) < 0)
  } else {
    return team
  }
}