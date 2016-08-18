Slack integration to report the order of the weekly meeting.

# Installation

Copy `conf.example.js` into `conf.js` and add the Slack secret token from the Slack command configuration page (https://savaslabs.slack.com/services/B22JGF3GU). This is also where you would add new team members, or change the channel that the bot responds to.

Then run the app either via node.js or Docker (below), and finally configure the Slack integration.

### Via node.js

Configure the server to map incoming https requests at some URL to localhost:8080.

Run `npm start` to start listening on port 8080 for incoming requests.

### Using docker

Run `docker run -p port-number:8080 -v /path/to/this/directory/conf:/usr/src/app/conf -d savaslabs/savas-shuffle` to pull the docker container image for this app, run it as a daemon, and send traffic from localhost:port-number into the app.

Expose `localhost:port-number` via some external URL.

### Configuring Slack

Edit the Slack command at https://savaslabs.slack.com/services/B22JGF3GU to set up `/meeting` to send a `GET` request to the server URL that the application is listening on.

# Usage

From slack, type `/meeting` to get a shuffled list of the full team.

Type `/meeting Name1 Name2 Name3` or `/meeting Name1,Name2,Name3` to get a shuffled list of the team excluding Name1, Name2, and Name3.

Type `/lunch` to get a random name of someone who's in the #moffice.
Type `/lunch Name1 Name2 Name3` to exclude Name1, Name2 and Name3 as absent.

Type '/wisdom' to get a random quote.

# Development

## Update docker image

Run `docker build -t savaslabs/savas-shuffle .` and `docker push savaslabs/savas-shuffle`.
