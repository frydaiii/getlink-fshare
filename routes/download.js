const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const contentDisposition = require('content-disposition');
const client = require('../services/redis-command').client;
const incrKey = require('../services/redis-command').set.incr;
const decrKey = require('../services/redis-command').set.decr;
const getKey = require('../services/redis-command').get.key;
const logger = require('../methods/logger');

router.get('/', async (req, res, next) => {
    try {
        let order = await getKey(client, 'visitors');
        order = Number(order);
        
        if (order > 8) {
            res.status(201).send('Server full, thử lại lúc khác nhé fen');
            return;
        }

        // let link = decodeURIComponent(req.query.link);
        let link = req.query.link;
        link = new Buffer.from(link, 'base64').toString('ascii');
        const headResponse = await fetch(link, { method: 'HEAD' });

        if (!headResponse) {
            res.status(404).send('đù');
            return;
        }

        let filename = new Buffer.from(req.query.filename, 'base64').toString('ascii');

        fetch(link).then(async (file) => {
            // ----------limit stream--------------
            // file.body.on('data', chunk => {
            //     file.body.pause();
            //     setTimeout(() => {
            //         file.body.resume();
            //         res.write(chunk);
            //     }, 4)
            // });
            logger.info('start download');
            await incrKey(client, 'visitors');
            res.set('Content-Disposition', contentDisposition(filename));
            file.body.pipe(res);
            file.body.on('end', async () => {
                setTimeout(() => { res.status(200).end(); }, 100);
            });
            res.on('close', async () => {
                file.body.unpipe(res);
                logger.info('download done');
                await decrKey(client, 'visitors');
            });
        });
    } catch (err) {
        logger.error('download router: ' + err);
        next(err);
    }
});

module.exports = router;