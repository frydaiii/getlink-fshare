const express = require('express');
const router = express.Router();
const redis = require('redis');
const client = redis.createClient();
const fetch = require('node-fetch');

const get = require('../services/redis-get');//get value from redis
const login = require('../services/login');
const logout = require('../services/logout');
const getDownloadLink = require('../services/get-download-link');
const update = require('../services/update-token-cookie-currentacc');
const logger = require('../methods/logger');

checkLink = async function (req, res, next) {
    const linkcode = req.params.linkcode;
    const response = await fetch('https://fshare.vn/file/' + linkcode);
    if (response.status == 200) next();
    else res.status(404).send("File not found.");
}

router.get('/:linkcode', checkLink, async (req, res) => {
    let token = await get.key(client, "token");
    let cookie = await get.key(client, "cookie");
    const linkcode = req.params.linkcode;

    await logger.info(req.ip + ' GET /download/' + linkcode);
    getDownloadLink(token, cookie, linkcode)
        .then(async (link) => {
            link = req.protocol + '://' + req.get('host') + '/download?link=' + link;
            const shortenRes = await fetch('https://megaurl.in/api?api=6137549b1c06c25a2153b4a10f050643aef11f34&url=' + link);
            const shorten = await shortenRes.json();
            if (shorten.status == 'error') logger.error('shorten url error: ' + shorten.message);
            else logger.info('shortenUrl: ' + shorten.shortenedUrl);
            res.status(200).send(shorten.shortenedUrl);
        })
        .catch(async (err) => {
            await logger.error('get link failed: ' + err);
            let current = await get.key(client, "current");
            let accounts = await get.list(client, "accounts");
            current = Number(current);

            if (current == accounts.length - 1) {
                await logger.info('out of storage per day');
                res.status(200).send('da het luu luong tai cua hom nay');
            }
            else {
                await logout(cookie);
                await logger.info('logging in with different account...');
                current++;
                const email = accounts[current].email;
                const password = accounts[current].password;
                [token, cookie] = await login(email, password);
                const data = ["token", token, "cookie", cookie, "current", current];
                await update(client, data);
                res.redirect('/get/' + linkcode);
            }
        });
});

module.exports = router;


