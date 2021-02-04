const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 2
});

router.get('/', limiter, (req, res) => {
    const link = req.query.link.replace(/ /g, "+");
    console.log(link);
    fetch(link).then(file => {
        file.body.pipe(res);
        file.body.on('end', () => res.status(200).end());
    }).catch(err => {
        res.send(err);
    });
});

module.exports = router;