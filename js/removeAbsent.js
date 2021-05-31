module.exports = (team, absent) => {
  if (absent.length > 0) {
    let missing = absent.map(person => person.toLowerCase())
    return team.filter(person => missing.indexOf(person.knownAs.toLowerCase()) < 0)
  } else {
    return team
  }
}