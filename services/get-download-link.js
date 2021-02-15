//get file from fshare.vn and return download link

const fetch = require('node-fetch');
const FormData = require('form-data');
const Options = require('../methods/request-options');
const logger = require('../methods/logger');
const get = require('./redis-command').get;

async function getDownloadLink(linkCode) {
    try {
        await logger.info('getting download link...');
        const token = await get.key('token');
        const cookie = await get.key('cookie');
        const form = new FormData();
        form.append('_csrf-app', token);
        form.append('linkcode', linkCode);
        form.append('withFcode5', '0');

        const options = new Options.POST(form, cookie);
        const response = await fetch('https://www.fshare.vn/download/get', options);

        try {
            const jsonResponse = await response.json();
            if (jsonResponse.url.slice(0, 16) != 'https://download') throw new Error(jsonResponse.url);
            logger.info(jsonResponse.url);
            return jsonResponse.url;
        } catch (err) {
            await logger.error('get-download-link service, link err: ' + err);
            return '';
        }

    } catch (err) {
        throw new Error('get-download-link service: ' + err);
    }
}

module.exports = getDownloadLink;