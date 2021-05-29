/**
 * Savas Shuffle web app.
 *
 * This app is an Express.js based listener for incoming Slack command GET requests.
 *
 * It listens on `/` for incoming requests, and verifies that they are legitimate
 * Slack requests by checking the value of `req.query.token`.
 */

const express = require('express')
const app = express()
const http = require('http')
const request = require('request')
const helmet = require('helmet')
const airtableJson = require('airtable-json').default
const sanitize = require('sanitize').middleware
const fs = require('fs')

app.use(sanitize)
app.use(helmet())

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

/**
 *
 * @param list
 * @returns {Array}
 *
 * Takes our conf array with lots of other details about people
 * and returns an array with just their first name
 */
function getFirstNames(list) {
    var size = list.length;
    var getFirstNames = [];
    for (i=0; i < size; i++) {
        getFirstNames[i] = list[i].firstName;
    }

    return getFirstNames;
}

/**
 *
 * @param array1
 * @param array2
 * @returns {Array}
 *
 * Combine two arrays and return an array with
 * unique objects
 */
function combineArrays(array1, array2) {
    var result_array = [];
    var arr = array1.concat(array2);
    var len = arr.length;

    while(len--) {
        var item = arr[len];
        var result_length = result_array.length;
        var add = true;
        for (i=0; i<result_length; i++) {
            if(result_array[i].slackID == item.slackID)
            {
                add = false;
            }
        }

        if (add) {
            result_array.unshift(item);
        }
    }

    return result_array;
}

/**
 *
 * @param array1
 * @param array2
 * @returns {*}
 *
 * Checks to see if two lists can be matched with one another
 * to verify no one is gift giving to theirself!
 */
function verifySantaCompatibility(array1, array2) {
    // Verify arrays are the same length
    if (array1.length != array2.length) {
        return FALSE;
    }

    var arrLength = array1.length;
    for(i = 0; i < arrLength; i++) {
        a = array1[i];
        b = array2[i];
        if (a.address == b.address) {
            return false;
        }
    }

    // If we got here, we're good!
    return true;
}

// Define commands.
var list = function(req, res, tokens) {
    var reply = {};
    // Shuffle team members
    var team = getFullTeam();
    var firstNames = getFirstNames(team);
    reply.response_type = "in_channel";
    reply.text = getAbsent(firstNames, tokens).shuffle().join("\n");

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
                            reply.text = quote.contents.quotes[0].quote + " -" + quote.contents.quotes[0].author;
                        }
                        else {
                            reply.text = "Sorry, you've already had too much wisdom for today!";
                        }
                        res.json(reply);
                    }
                );
        });
}

var single = function(req, res, tokens) {
    var reply = {
        response_type: "in_channel",
    };
    var team = getFullTeam();
    var firstNames = getFirstNames(team);
    var filtered = getAbsent(firstNames, tokens);
    reply.text = filtered.shuffle()[0];
    res.json(reply);
}

// This should probably be some soft of inheritance of single
var lunch = function(req, res, tokens) {
    var reply = {
        response_type: "in_channel",
    };
    var team = getDurhamOfficeTeam();
    var firstNames = getFirstNames(team);
    var filtered = getAbsent(firstNames, tokens);
    reply.text = filtered.shuffle()[0];
    res.json(reply);
}

/**
 *
 * @param req
 * @param res
 * @param tokens
 *
 * Command that renders a random quote from the Quotes airtable with
 * attribution if it exists.
 */
const quote = async (req, res, tokens) => {

    let reply = { response_type: "in_channel" }

    const auth_key = conf.airtable_api_key
    const base_name = 'appqDblKeJfBZlCCl'
    const primary = 'Quotes'
    const view = 'Grid view'
    const populate = [{ local: 'Attribution', other: 'People' }]

    const quotes = await airtableJson({ auth_key, base_name, primary, view, populate })

    let selected = quotes[Math.floor(Math.random() * quotes.length)]

    reply.text = `> ${selected.Quote}`
    reply.text += selected.Attribution ? `\n> — ${selected.Attribution[0].Name}` : ''

    res.json(reply)

}

/**
 *
 * @param req
 * @param res
 * @param tokens
 *
 * Command that takes the team and matches gift givers
 * with receivers ensuring no one gets themself. Each giver receives a private
 * Slack message letting them know who they have and where to send the gift
 * if they're not in the office together.
 */
var savasclaus = function(req, res, tokens) {
    var reply = {};
    var givers = getFullTeam();
    var receivers = getFullTeam();

    //  If anyone is giving to themselves, let's reshuffle
    while (verifySantaCompatibility(givers, receivers) == false) {
        receivers.shuffle();
    }

    var lenth = receivers.length;
    for (i=0; i < lenth; i++) {
        var text = "Dearest *" + givers[i].firstName + "*, you will be Savas Claus-ing :santa: for *" + receivers[i].firstName;
        text += "*\n Their address is: " + receivers[i].address;
        text += "\n Remember, spend no more than $1,000.00 :moneybag: on the :gift:. We want to keep things _reasonable_<https://www.youtube.com/watch?v=B6jCMaiTqG0|!>";

        var replyBody = '';
        request.post({
            url: conf.slack_webhook_url,
            body: '{"channel":"@' + givers[i].slackID + '","text":"' + text + '"}'
            // For testing body: '{"channel":"@chris","text":"' + text + '"}'
        }  ,(error, res, body) => {
            if (error) {
                console.error(error);
                return;
            }
            replyBody = body;
        })

    }

    reply.body = replyBody;
    res.json(reply);
}

/**
 *
 * @returns {Array}
 */
function getFullTeam() {
    var remoteTeam = conf.remote_team;
    var durhamOffice = conf.durham_office;
    var fullTeam = combineArrays(remoteTeam, durhamOffice);

    return fullTeam;
}

/**
 *
 * @returns {Array}
 */
function getDurhamOfficeTeam() {
    return conf.durham_office;
}

var commands = {
    'list': list,
    'meeting': list,
    'single': single,
    'lunch': lunch,
    'drinks': lunch,
    'wisdom': wisdom,
    'savasclaus': savasclaus,
    'quote': quote,
    'random': quote,
}

app.get('/', function (req, res) {
    if (req.query.token == conf.token && req.queryString('command') == conf.command) {
        var tokens = req.queryString('text').toLowerCase().split(' ');

        if (commands.hasOwnProperty(tokens[0])) {
            commands[tokens[0]](req, res, tokens.slice(1));
        }
        else {
            var reply = {
                text: "I don't know what you're trying to do! You can say meeting, list, single, lunch, drinks, savasclaus, or quote."
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

module.exports = app;
