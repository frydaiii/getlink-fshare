const schedule = require('node-schedule');
const client = require('../services/redis-command').client;

schedule.scheduleJob('0 0 0 * * *', () => {
    client.set("current", "-1");
});
