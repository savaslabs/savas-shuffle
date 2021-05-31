// modules
const express  = require('express')
const http     = require('http')
const request  = require('request')
const helmet   = require('helmet')
const sanitize = require('sanitize').middleware
const fs       = require('fs')

// config
const conf = JSON.parse(fs.readFileSync('conf/conf.json', 'utf8'))

// express
const app = express()
app.use(sanitize)
app.use(helmet())

// directives
const single      = require('./js/single')
const list        = require('./js/list')
const teams       = require('./js/teams')
const quote       = require('./js/quote')
const savasclaus  = require('./js/savasclaus')

// aliases
const aliases = {
  single: single,
  lunch: single,
  list: list,
  meeting: list,
  quote: quote,
  random: quote,
  savasclaus: savasclaus,
  // save: save
  teams: teams,
}

// route
app.get('/', function (req, res) {
  if (req.query.token === conf.token && req.queryString('command') === conf.command) {
    let tokens = req.queryString('text').toLowerCase().split(' ')
    let directive = tokens.shift()
    if (aliases.hasOwnProperty(directive)) {
      aliases[directive](req, res, conf, tokens)
    } else {
      res.json({ text: `I don't know what you're trying to do! You can say one of the following:\n\n${Object.getOwnPropertyNames(aliases).join('\n')}` })
    }
  }
})

// port
app.listen(conf.port, function () {
  console.log('Savbot listening on port ' + conf.port)
})

// export
module.exports = app