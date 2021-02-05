const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

router.get('/', async (req, res) => {
    const link = new Buffer.from(req.query.link, 'base64').toString('ascii');
    const headResponse = await fetch(link, { method: 'HEAD' });
    const filesize = headResponse.headers.get('content-length');
    if (filesize > 5368709120) res.status(200).send('Chỉ được tải file dưới 5Gb');
    else {
        fetch(link).then(file => {
            file.body.on('data', chunk => {
                file.body.pause();
                setTimeout(() => {
                    file.body.resume();
                    res.write(chunk);
                }, 4)
            });
            file.body.on('end', () => {
                setTimeout(() => {
                    res.status(200).end();
                }, 100);
            });
        }).catch(err => next(err));
    }
});

module.exports = router;