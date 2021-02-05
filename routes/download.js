const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const client = require('../services/redis-command').client;
const incrKey = require('../services/redis-command').set.incr;
const decrKey = require('../services/redis-command').set.decr;

router.get('/', async (req, res, next) => {
    let order = await incrKey(client, 'visitors').catch(err => next(err));
    order = Number(order);

    if (order > 20) {
            res.status(201).send('Server full, thử lại lúc khác nhé fen');
            await decrKey(client, 'visitors').catch(err => next(err));
    }
    else {
        const link = new Buffer.from(req.query.link, 'base64').toString('ascii');
        const headResponse = await fetch(link, { method: 'HEAD' }).catch(err => next(err));
        if (!headResponse) {
            res.status(404).send('đù');
            await decrKey(client, 'visitors').catch(err => next(err));
        }
        else {
            const filesize = headResponse.headers.get('content-length');
            if (filesize > 5368709120) {
                res.status(200).send('Tải file dưới 5Gb thôi fen');
                await decrKey(client, 'visitors').catch(err => next(err));
            }
            else {
                fetch(link).then(file => {
                    // ----------limit stream--------------
                    // file.body.on('data', chunk => {
                    //     file.body.pause();
                    //     setTimeout(() => {
                    //         file.body.resume();
                    //         res.write(chunk);
                    //     }, 4)
                    // });
                    file.body.pipe(res);
                    file.body.on('end', async () => {
                        setTimeout(() => {
                            res.status(200).end();
                        }, 100);
                        await decrKey(client, 'visitors').catch(err => next(err));
                    });
                    res.on('close', () => {
                        file.body.unpipe(res);
                        decrKey(client, 'visitors').catch(err => next(err));
                    });
                }).catch(err => next(err));
            }
        }
    }
    
});

module.exports = router;