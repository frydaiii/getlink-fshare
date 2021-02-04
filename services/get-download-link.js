//get file from fshare.vn and return download link

const fetch = require('node-fetch');
const FormData = require('form-data');
const Options = require('../methods/request-options');
const logger = require('../methods/logger');

async function getDownloadLink(token, cookie, linkCode) {
    await logger.info('getting download link...');
    const form = new FormData();
    form.append('_csrf-app', token);
    form.append('linkcode', linkCode);
    form.append('withFcode5', '0');

    const options = new Options.POST(form, cookie);

    const response = await fetch('https://www.fshare.vn/download/get', options);
    const jsonResponse = await response.json();

    await logger.info(jsonResponse.url);
    if (jsonResponse.url.slice(0, 16) != 'https://download') throw new Error('wrong download url');
    return jsonResponse.url;
}

module.exports = getDownloadLink;