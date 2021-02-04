const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

router.get('/', (req, res) => {
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