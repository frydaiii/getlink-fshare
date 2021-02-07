const schedule = require('node-schedule');
const client = require('../services/redis-command').client;

console.log('schedule update is running');

schedule.scheduleJob('0 0 0 * * *', () => {
    console.log('update "current"');
    client.set("current", "-1");
});
