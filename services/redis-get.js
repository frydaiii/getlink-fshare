module.exports.key = function(client, name) {
    return new Promise((resolve, reject) => {
        client.get(name, (err, reply) => {
            if (err) reject(err);
            else resolve(reply);
        });
    });
}

module.exports.list = function(client, name) {
    return new Promise((resolve, reject) => {
        client.lrange(name, 0, -1, (err, reply) => {
            if (err) reject(err);
            else {
                for (let i = 0; i < reply.length; i++) reply[i] = JSON.parse(reply[i]);
                resolve(reply);
            }
        });
    });
} 
