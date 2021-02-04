const schedule = require('node-schedule');
const redis = require('redis');

schedule.scheduleJob('0 0 0 * * *', () => {
    const client = redis.createClient();
    client.set("current", "-1");
    client.quit();
});
