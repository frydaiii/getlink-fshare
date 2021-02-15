const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const contentDisposition = require('content-disposition');
const incrKey = require('../services/redis-command').set.incr;
const decrKey = require('../services/redis-command').set.decr;
const getKey = require('../services/redis-command').get.key;
const logger = require('../methods/logger');

router.get('/', async (req, res, next) => {
    try {
        const available = Number(await getKey('available'));
        
        if (available < 1) {
            res.status(201).send('Server full, thử lại lúc khác nhé fen');
            return;
        }

        const url = new Buffer.from(req.query.base64_url, 'base64').toString('ascii');
        const headResponse = await fetch(url, { method: 'HEAD' });

        if (!headResponse) {
            res.status(404).send('đù');
            return;
        }

        const filename = decodeURIComponent(url.slice(url.lastIndexOf('/')));
        res.set('Content-Disposition', contentDisposition(filename));

        logger.info('start download');
        await decrKey('available');
        
        fetch(url).then(async (file) => {
            file.body.pipe(res);
            file.body.on('end', () => {
                res.status(200).end();
            });
            res.on('close', async () => {
                file.body.unpipe(res);
                file.body.destroy();
                logger.info('download done');
                await incrKey('available');
            });
        });
    } catch (err) {
        logger.error('download router: ' + err);
        next(err);
    }
});

module.exports = router;