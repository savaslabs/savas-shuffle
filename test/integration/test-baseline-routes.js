var supertest = require('supertest'),
    app = require('../../app'),
    assert = require('assert'),
    fs = require('fs');

eval(fs.readFileSync('conf/conf.js', encoding = "ascii"));

exports.valid_token_should_return_something = function(done) {
    supertest(app)
        .get('/?token=' + conf.token + '&command=/savas&text=foobar')
        .expect(200)
        .end(function(err, response) {
            assert.ok(!err);
            assert.ok(response.body.text === "I don't know what you're trying to do! You can say meeting, lunch or wisdom.");
            return done();
        });
};

exports.lunch_function_returns_a_name = function(done) {
    supertest(app)
        .get('/?token=' + conf.token + '&command=/savas&text=lunch')
        .expect(200)
        .end(function(err, response) {
            assert.ok(!err);
            assert.ok(conf.moffice.indexOf(JSON.parse(response.text).text) >= 0);
            return done();
        });
};

exports.lunch_function_exclusion_works = function(done) {
    supertest(app)
        .get('/?token=' + conf.token + '&command=/savas&text=lunch ' + conf.moffice.slice(1).join(' '))
        .expect(200)
        .end(function(err, response) {
            assert.ok(!err);
            assert.equal(JSON.parse(response.text).text,conf.moffice[0]);
            return done();
        });
};

exports.meeting_function_works = function(done) {
    supertest(app)
        .get('/?token=' + conf.token + '&command=/savas&text=meeting&channel_name=' + conf.meeting_channel)
        .expect(200)
        .end(function(err, response) {
            assert.ok(!err);
            var returnedTeam = JSON.parse(response.text).text.split('\n');
            assert.deepEqual(conf.team.sort(), returnedTeam.sort());
            return done();
        });
};

exports.meeting_function_exclusion_works = function(done) {
    supertest(app)
        .get('/?token=' + conf.token + '&command=/savas&channel_name=' + conf.meeting_channel + '&text=meeting ' + conf.team.slice(1).join(' '))
        .expect(200)
        .end(function(err, response) {
            assert.ok(!err);
            assert.equal(JSON.parse(response.text).text,conf.team[0]);
            return done();
        });
};