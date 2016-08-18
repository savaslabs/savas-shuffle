var express = require('express');
var app = express();

var helmet = require('helmet');
app.use(helmet());

var fs = require('fs');
eval(fs.readFileSync('conf.js', encoding="ascii"));

Array.prototype.shuffle = function() {
    var i = this.length, j, temp;
    if ( i == 0 ) return this;
    while ( --i ) {
        j = Math.floor( Math.random() * ( i + 1 ) );
        temp = this[i];
        this[i] = this[j];
        this[j] = temp;
    }
    return this;
}

app.get('/', function (req, res) {
    if (req.query.token == conf.token) {
        var reply = {};
        if (req.query.channel_name != conf.channel) {
            reply.text = "Wrong channel!";
        }
        else {
            // Shuffle team members
            var absent = new Array();
            if (req.query.text.indexOf(',') < 0) {
                absent = req.query.text.toLowerCase().split(' ');
            }
            else {
                absent = req.query.text.toLowerCase().split(',');
            }
            var team = conf.team;
            reply.response_type = "in_channel";
            reply.text = team.filter(function(i) {
                return absent.indexOf(i.toLowerCase()) < 0;
            }).shuffle().join("\n");
        }
        res.json(reply);
    }
    else {
            // Fail silently?
    }
});

app.listen(8080, function () {
    console.log('Savas shuffle listening on port 8080');
});
