const redis = require('redis');
const client = redis.createClient();

const getkey = function(client, name) {
    return new Promise((resolve, reject) => {
        client.get(name, (err, reply) => {
            if (err) reject(err);
            else resolve(reply);
        });
    });
}

const getlist = function(client, name) {
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

const incrkey = function(client, name) {
    return new Promise((resolve, reject) => {
        client.incr(name, (err, reply) => {
            if (err) reject(err);
            else resolve(reply);
        })
    });
}

const decrkey = function(client, name) {
    return new Promise((resolve, reject) => {
        client.decr(name, (err, reply) => {
            if (err) reject(err);
            else resolve(reply);
        })
    });
}

function mUpdate(client, data) {
    return new Promise((resolve, reject) => {
        client.mset(data, (err, reply) => {
            if (err) reject(err);
            else resolve(reply);
        })
    });
}

module.exports.get = {
    key: getkey,
    list: getlist
}

module.exports.set = {
    incr: incrkey,
    decr: decrkey,
    mset: mUpdate
}

module.exports.client = client;