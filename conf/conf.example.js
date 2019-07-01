var conf = {
    // Names need to be single words.
    team: ['Someone', 'Someone-else', 'A-third-person'],
    moffice: ['Someone', 'Someone-else', 'Person-Four'],
    token: 'test',
    meeting_channel: 'monday-meeting',
    port: 8080,
    command: '/savas',
};



var conf = {
    durham_office: [
        {
            firstName: 'Chris',
            lastName: 'Russo',
            address: "Probably somewhere on a bicycle.\n Durham, NC 27701",
            slackID: 'chris'
        },
        {
            firstName: 'Anne',
            lastName: 'Droid',
            address: '88 Street Address.\n Durham, NC 27701',
            slackID: 'drooooooid'
        }
    ],
    distributed_team: [
        {
            firstName: 'Dries',
            lastName: 'Buytaert',
            address: '10 Main Street.\n Boston, MA 02446',
            slackID: 'drupal-uid-1'
        },
        {
            firstName: 'Dan',
            lastName: 'Murphy',
            address: "582 South Street\n Roslindale, MA 02131",
            slackID: 'dmurphy'
        },
    ],
    token: '[String provided by Slack]',
    port: 8080,
    command: '/savbot',
    slack_webhook_url: 'https://hooks.slack.com/services/[Provided by Slack]',
};
