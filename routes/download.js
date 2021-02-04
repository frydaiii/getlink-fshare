const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

router.get('/', async (req, res) => {
    const link = new Buffer.from(req.query.link, 'base64').toString('ascii');
    fetch(link).then(file => {
        file.body.pipe(res);
        file.body.on('end', () => res.status(200).end());
    }).catch(err => {
        res.send(err);
    });
});

module.exports = router;