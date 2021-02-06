const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const client = require('../services/redis-command').client;
const incrKey = require('../services/redis-command').set.incr;
const decrKey = require('../services/redis-command').set.decr;
const logger = require('../methods/logger');
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 2,
    message: 'Đã nói 15 phút tải được 2 lần thôi'
});

router.get('/', limiter, async (req, res, next) => {
    try {
        let order = await incrKey(client, 'visitors').catch(err => next(err));
        order = Number(order);
        
        if (order > 20) {
            res.status(201).send('Server full, thử lại lúc khác nhé fen');
            await decrKey(client, 'visitors').catch(err => next(err));
            return;
        }

        const link = new Buffer.from(req.query.link, 'base64').toString('ascii');
        const headResponse = await fetch(link, { method: 'HEAD' }).catch(err => next(err));

        if (!headResponse) {
            res.status(404).send('đù');
            await decrKey(client, 'visitors').catch(err => next(err));
            return;
        }

        const filename = new Buffer.from(req.query.filename, 'base64').toString('ascii');

        fetch(link).then(file => {
            // ----------limit stream--------------
            // file.body.on('data', chunk => {
            //     file.body.pause();
            //     setTimeout(() => {
            //         file.body.resume();
            //         res.write(chunk);
            //     }, 4)
            // });
            res.set('Content-Disposition', `attachment; filename=${filename}`);
            file.body.pipe(res);
            file.body.on('end', async () => {
                setTimeout(() => { res.status(200).end(); }, 100);
                await decrKey(client, 'visitors').catch(err => next(err));
            });
            res.on('close', () => {
                file.body.unpipe(res);
                decrKey(client, 'visitors').catch(err => next(err));
            });
        });
    } catch (err) {
        await logger.error('download router: ' + err);
        next(err);
    }
});

module.exports = router;