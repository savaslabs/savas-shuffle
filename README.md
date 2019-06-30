Slack integration to report the order of the weekly meeting.

# Installation

Copy `conf.example.js` into `conf.js` and add the Slack secret token from the Slack command configuration page (https://savaslabs.slack.com/services/B22JGF3GU). This is also where you would add new team members, or change the channel that the bot responds to.

Then run the app either via node.js or Docker (below), and finally configure the Slack integration.

### Via node.js

Configure the server to map incoming https requests at some URL to localhost:8080.

Run `npm install` to install any node modules necessary

Create the configuration file @ `/conf/conf.js`

Run `npm start` to start listening on port 8080 for incoming requests.

### Using docker

Run `docker run -p 80:8080 -v $PWD/conf:/usr/src/app/conf -d --restart=always savaslabs/savas-shuffle` to pull the docker container image for this app, run it as a daemon, and send traffic from port 80 into the app.

Expose `localhost:port-number` via some external URL.

### Configuring Slack

Edit the Slack command at https://savaslabs.slack.com/services/B22JGF3GU to set up `/meeting` to send a `GET` request to the server URL that the application is listening on.

# Usage

From slack, type `/savbot meeting` to get a shuffled list of the full team.

Type `/savbot meeting Name1 Name2 Name3` or `/meeting Name1,Name2,Name3` to get a shuffled list of the team excluding Name1, Name2, and Name3.

Type `/savbot lunch` to get a random name of someone who's in the #moffice.
Type `/savbot lunch Name1 Name2 Name3` to exclude Name1, Name2 and Name3 as absent.

Type '/savbot wisdom' to get a random quote.

# Development

## Update docker image

Run `docker build -t savaslabs/savas-shuffle .` and `docker push savaslabs/savas-shuffle`.

## Debugging

An example local URL that should yield a successful result: `http://localhost:8080/?command=/savbot&token=[replace with token]&text=meeting%20chris`

# Production Deployment

**Caveat Emptor: a Docker non-expert has documented the following**

Merging an update into the `master` branch, should trigger a Docker image build on the [Docker Hub repository](https://cloud.docker.com/u/savaslabs/repository/registry-1.docker.io/savaslabs/savas-slack-tools). By default, it will get tagged with `latest`. When deploying to production, you'll have to pull the new image and either restart or rebuild the app. Specific instructions are in our internal documentation which resides [here](https://gitlab.com/savaslabs/infrastructure/blob/master/docker.md).