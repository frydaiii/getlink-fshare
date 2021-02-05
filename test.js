const client = require('./services/redis-command').client;
const incrKey = require('./services/redis-command').set.incr;

async function main() {
    // const visitors = await client.incr('visitors');
    // console.log('visitors: ', visitors);
    const order = await incrKey(client, 'visitors').catch(err => console.log(err));
}

main();

