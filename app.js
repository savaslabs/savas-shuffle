/**
 * Savas Shuffle web app.
 *
 * This app is an Express.js based listener for incoming Slack command GET requests.
 *
 * It listens on `/` for incoming requests, and verifies that they are legitimate
 * Slack requests by checking the value of `req.query.token`.
 */

var express = require('express');
var app = express();
var http = require('http');
app.use(require('sanitize').middleware);

var helmet = require('helmet');
app.use(helmet());

var fs = require('fs');
eval(fs.readFileSync('conf/conf.js', encoding = "ascii"));

Array.prototype.shuffle = function () {
    var i = this.length, j, temp;
    if (i == 0) return this;
    while (--i) {
        j = Math.floor(Math.random() * ( i + 1 ));
        temp = this[i];
        this[i] = this[j];
        this[j] = temp;
    }
    return this;
}

var getAbsent = function (team, absent) {
    if (absent.length > 0) {
        return team.filter(function (i) {
            return absent.indexOf(i.toLowerCase()) < 0;
        });
    }
    else {
        return team;
    }
}

// Define commands.
var meeting = function(req, res, tokens) {
    var reply = {};
    if (req.query.channel_name != conf.meeting_channel) {
        reply.text = "Wrong channel!";
    }
    else {
        // Shuffle team members
        var team = conf.team;
        reply.response_type = "in_channel";
        reply.text = getAbsent(team, tokens).shuffle().join("\n");
    }
    res.json(reply);
}

var wisdom = function(req, res, tokens) {
    var reply = {
        response_type: "in_channel",
    };
    http.get(
        {
            hostname: 'quotes.rest',
            port: 80,
            path: '/qod.json',
            agent: false  // create a new agent just for this one request
        },
        function (quotes_res) {
            var body = '';
            quotes_res.on('data', function (d) { body += d; })
                .on('error', function (e) { console.log(e); })
                .on('end', function () {
                        var quote = JSON.parse(body);
                        if (quote.hasOwnProperty("success")) {
                            reply.text = quote.contents.quotes.quote;
                        }
                        else {
                            reply.text = "Sorry, you've already had too much wisdom for today!";
                        }
                        res.json(reply);
                    }
                );
        });
}

var lunch = function(req, res, tokens) {
    var reply = {
        response_type: "in_channel",
    };
    var team = conf.moffice;
    var filtered = getAbsent(team, tokens);
    reply.text = filtered.shuffle()[0];
    res.json(reply);
}

var commands = {
    'meeting': meeting,
    'lunch': lunch,
    'wisdom': wisdom,
}

app.get('/', function (req, res) {
    if (req.query.token == conf.token && req.queryString('command') == '/savas') {
        var tokens = req.queryString('text').toLowerCase().split(' ');

        if (commands.hasOwnProperty(tokens[0])) {
            commands[tokens[0]](req, res, tokens.slice(1));
        }
        else {
            var reply = {
                text: "I don't know what you're trying to do! You can say meeting, lunch or wisdom."
            }
            res.json(reply);
        }
    }
    else {
        // Fail silently?
    }
});

app.listen(conf.port, function () {
    console.log('Savas shuffle listening on port ' + conf.port);
});
