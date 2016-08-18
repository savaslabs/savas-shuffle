var express = require('express');
var app = express();

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

app.get('/shuffle', function (req, res) {
    console.log(req.query);
    if (req.query.token == 'm6fga9JMwDemJbZhhhfRxq28') {
        var reply = {};
        if (req.query.channel_name != 'monday-meeting') {
            reply.text = "Wrong channel!";
        }
        else {
            // Shuffle team members
            var absent = req.query.text.toLowerCase().split(' ');
            var team = new Array('Anne', 'Chris', 'Dan', 'Kosta', 'Lisa', 'Oksana', 'Ro', 'Yonas');
            reply.text = team.filter(function(i) {
                return absent.indexOf(i.toLowerCase()) < 0;
            }).shuffle().join(", ");
        }
        res.json(reply);
    }
    else {
            // Fail silently?
    }
});

app.listen(8080, function () {
    console.log('Example app listening on port 80!');
});
