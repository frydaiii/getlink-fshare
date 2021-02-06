const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

const get = require('../services/redis-command').get;
const client = require('../services/redis-command').client;
const login = require('../services/login');
const logout = require('../services/logout');
const getDownloadLink = require('../services/get-download-link');
const update = require('../services/redis-command').set.mset;
const logger = require('../methods/logger');

const validateLink = async function (req, res, next) {
    const linkcode = req.params.linkcode;
    const response = await fetch('https://www.fshare.vn/file/' + linkcode);
    const plainHtml = await response.text();
    const fileExist = plainHtml.search('id="linkcode"') == -1 ? false : true;

    // get file size 
    const begin = plainHtml.search(/\((.*)GB\)/) + 1;
    const end = plainHtml.search(/\sGB\)/);
    const filesize = Number(plainHtml.slice(begin, end));

    // validate
    if (fileExist == false) res.status(404).send('Không tìm thấy file');
    else if (filesize > 5) res.status(406).send('Chỉ tải file dưới 5 Gb');
    else next();
}

router.get('/:linkcode', validateLink, async (req, res, next) => {
    try {
        let token = await get.key(client, "token");
        let cookie = await get.key(client, "cookie");
        const linkcode = req.params.linkcode;

        await logger.info(req.ip + ' GET /get/' + linkcode);

        let running = true;
        while (running) {
            let [filename, link] = await getDownloadLink(token, cookie, linkcode);
            if (link) {
                const base64link = new Buffer.from(link).toString('base64');
                const base64name = new Buffer.from(filename).toString('base64');
                link = req.protocol + '://' + req.get('host') + '/redirect.html?filename=' + base64name + '&link=' + base64link;
                // const shortenRes = await fetch('https://megaurl.in/api?api=6137549b1c06c25a2153b4a10f050643aef11f34&url=' + link);
                // const shorten = await shortenRes.json();

                // if (shorten.status == 'error') logger.error('shorten url error: ' + shorten.message);
                // else logger.info('shortenUrl: ' + shorten.shortenedUrl);
                // res.status(200).send(shorten.shortenedUrl);
                res.status(200).send(link);
                running = false;
            } else {
                let current = await get.key(client, "current");
                let accounts = await get.list(client, "accounts");
                current = Number(current);

                if (current == accounts.length - 1) {
                    running = false;
                    await logger.info('out of storage per day');
                    res.status(202).send('Account hết lưu lượng cmnr, mai thử lại nhé');
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
                }
            }
        }
    } catch (err) {
        logger.error('get-link router: ' + err);
        next(err);
    }
});

module.exports = router;


