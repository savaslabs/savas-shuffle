Slack integration to report the order of the weekly meeting.

# Installation

Duplicate `conf.example.json` as `conf.json` and add the Slack secret token from the Slack command configuration page (https://savaslabs.slack.com/services/B22JGF3GU). This is also where you would add new team members, or change the channel that the bot responds to.

Then run the app either via node.js or Docker (below), and finally configure the Slack integration.

### Via node.js

Configure the server to map incoming https requests at some URL to localhost:8080.

Run `npm install` to install any node modules necessary

Create the configuration file @ `/conf/conf.json`

Run `npm start` to start listening on port 8080 for incoming requests.

### Using docker

Run `docker run -p 80:8080 -v $PWD/conf:/usr/src/app/conf -d --restart=always savaslabs/savas-shuffle` to pull the docker container image for this app, run it as a daemon, and send traffic from port 80 into the app.

Expose `localhost:port-number` via some external URL.

### Configuring Slack

Edit the Slack command at https://savaslabs.slack.com/services/B22JGF3GU to set up `/savbot` to send a `GET` request to the server URL that the application is listening on.

# Usage

From Slack, type `/savbot` followed by a directive or alias, followed by zero or more space-separated parameters.

| Directive | Aliases | Description | Syntax | Parameters |
| --- | --- | --- | --- | --- |
| `single` | `lunch` |  Selects a random Savasian (excluding any who are absent). | `/savbot single [absentee(s)]` | <dl><dt>absentee(s) [optional]</dt><dd>One or more people referred to by their `knownAs` name, separated by spaces.</dd></dl>  |
| `list` | `meeting` | A randomly ordered list of Savasians (excluding any who are absent). | `/savbot list [absentee(s)]` | <dl><dt>absentee(s) [optional]</dt><dd>One or more people referred to by their `knownAs` name, separated by spaces.</dd></dl>  |
| `quote` | `random` | A randomly chosen silly/irreverent team quote from the Quotes Airtable. | `/savbot quote` |   |
| `teams` |   | Randomly split Savasians into [n] balanced teams (excluding any who are absent). | `/savbot teams [n] [absentee(s)]` | <dl><dt>n [optional]</dt><dd>An integer representing the number of teams. Defaults to `2`.</dd><dt>absentee(s) [optional]</dt><dd>One or more people referred to by their `knownAs` name, separated by spaces.</dd></dl> |
| `savasclause` |   | Randomly and secretly assign Savasians a Savas Claus gift recipient. | `/savbot savasclaus [absentee(s)]` | <dl><dt>absentee(s) [optional]</dt><dd>One or more people referred to by their `knownAs` name, separated by spaces.</dd></dl> |
| `save` |   | Save one or more links to the Savbot Links Airtable, categorized with optional #tags and @mentions. | `/savbot save [message]` | <dl><dt>message</dt><dd>Message containing one or more links, zero or more #tags, and zero or more @mentions.</dd></dl> |


# Development

## Update docker image

Run `docker build -t savaslabs/savas-shuffle .` and `docker push savaslabs/savas-shuffle`.

## Debugging

An example local URL that should yield a successful result: `http://localhost:8080/?command=/savbot&token=[replace with token]&text=meeting%20chris`

# Production Deployment

**Caveat Emptor: a Docker non-expert has documented the following**

Merging an update into the `master` branch, should trigger a Docker image build on the [Docker Hub repository](https://cloud.docker.com/u/savaslabs/repository/registry-1.docker.io/savaslabs/savas-slack-tools). By default, it will get tagged with `latest`. When deploying to production, you'll have to pull the new image and either restart or rebuild the app. Specific instructions are in our internal documentation which resides [here](https://gitlab.com/savaslabs/infrastructure/blob/master/docker.md).