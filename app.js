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

var getAbsent = function (team, text) {
    if (text.length > 0) {
        var absent = Array();
        if (text.indexOf(',') < 0) {
            absent = text.toLowerCase().split(' ');
        }
        else {
            absent = text.toLowerCase().split(',');
        }

        return team.filter(function (i) {
            return absent.indexOf(i.toLowerCase()) < 0;
        });
    }
    else {
        return team;
    }
}

app.get('/', function (req, res) {
    if (req.query.token == conf.token) {
        var reply = {};
        switch (req.query.command) {
            case '/meeting':
                if (req.query.channel_name != conf.meeting_channel) {
                    reply.text = "Wrong channel!";
                }
                else {
                    // Shuffle team members
                    var team = conf.team;
                    reply.response_type = "in_channel";
                    reply.text = getAbsent(team, req.query.text).shuffle().join("\n");
                }
                res.json(reply);
                break;

            case '/wisdom':
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
                break;

            case '/lunch':
                var team = conf.moffice;
                reply.response_type = "in_channel";
                var filtered = getAbsent(team, req.query.text);
                reply.text = filtered.shuffle()[0];
                res.json(reply);
                break;

        }
    }
    else {
        // Fail silently?
    }
});

app.listen(conf.port, function () {
    console.log('Savas shuffle listening on port ' + conf.port);
});
