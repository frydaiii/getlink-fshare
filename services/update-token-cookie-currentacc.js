//update token, cookie and current in redis database

function update(client, data) {
    return new Promise((resolve, reject) => {
        client.mset(data, (err, reply) => {
            if (err) reject(err);
            else resolve(reply);
        })
    });
}

module.exports = update;