const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 2,
    message: '90 phút tải được 2 lần thôi'
});

const get = require('../services/redis-command').get;
const login = require('../services/login');
const logout = require('../services/logout');
const getDownloadLink = require('../services/get-download-link');
const update = require('../services/redis-command').set.mset;
const logger = require('../methods/logger');

const validateLink = async function (req, res, next) {
    try {
        if (req.params.file_url.search('fshare.vn/file') == -1) 
            return next(new Error('Link khong ton tai'));
        const response = await fetch(req.params.file_url);
        const plainHtml = await response.text();
        const fileExist = plainHtml.search('id="linkcode"') == -1 ? false : true;
        
        
        // validate
        if (fileExist == false) res.status(404).send('Không tìm thấy file');
        else {
            // get file size 
            const begin = plainHtml.search(/\((.*)GB\)/) + 1;
            const end = plainHtml.search(/\sGB\)/);
            const filesize = Number(plainHtml.slice(begin, end));
            if (filesize > 6) res.status(406).send('Chỉ tải file dưới 6 Gb');
            else next();
        }
    } catch (err) {
        next(err);
    }
}

router.get('/:file_url', validateLink, limiter, async (req, res, next) => {
    try {
        let linkcode;
        const file_url = req.params.file_url;
        if (file_url.lastIndexOf('?') != -1)
            linkcode = file_url.slice(file_url.lastIndexOf('/') + 1, file_url.lastIndexOf('?'));
        else linkcode = file_url.slice(file_url.lastIndexOf('/') + 1);

        await logger.info(req.ip + ' GET ' + file_url);

        while (true) {
            let download_url = await getDownloadLink(linkcode);
            if (download_url) {
                const base64_url = new Buffer.from(download_url).toString('base64');
                const url = req.protocol + '://' + req.get('host') + '/redirect.html?base64_url=' + base64_url;
                // url = encodeURIComponent(url);
                const shortenRes = await fetch('https://link1s.com/api?api=9fce4a3ce21f62d52b6d8d0d8767d4c344bbfb2a&url=' + url);
                const shorten = await shortenRes.json();

                if (shorten.status == 'error') logger.error('shorten url error: ' + shorten.message);
                else logger.info('shortenUrl: ' + shorten.shortenedUrl);
                res.status(200).send(shorten.shortenedUrl);
                // res.status(200).send(url);
                return;
            } else {
                let current = await get.key("current");
                let accounts = await get.list("accounts");
                current = Number(current);

                if (current == accounts.length - 1) {
                    await logger.info('out of storage per day');
                    res.status(202).send('Account hết lưu lượng cmnr, mai thử lại nhé :))');
                    return;
                }
                else {
                    const cookie = await get.key("cookie");
                    await logout(cookie);
                    await logger.info('logging in with different account...');
                    await login(current + 1);
                }
            }
        }
    } catch (err) {
        logger.error('get-link router: ' + err);
        next(err);
    }
});

module.exports = router;


