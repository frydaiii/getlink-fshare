const express = require('express');
const router = express.Router();
const redis = require('redis');

router.post('/okela123', (req, res, next) => {
    const client = redis.createClient();
    const data = req.body.map(x => JSON.stringify(x));
    data.unshift("accounts");
    client.rpush(data, (err) => {
        if (err) res.status(200).send(err);
        else res.status(200).send('added successful');
    });
    client.quit();
})

module.exports = router;
