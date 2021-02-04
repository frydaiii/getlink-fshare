const Options = require('../methods/request-options');
const fetch = require('node-fetch');
const logger = require('../methods/logger');

async function logout(cookie) {
    await logger.info('logging out');
    const options = new Options.GET(cookie);
    let response = await fetch('https://fshare.vn/site/logout', options);
    while (response.status > 300 && response.status < 400) {
        if (response.headers.get('set-cookie')) {       
            const setCookie = response.headers.get('set-cookie');
            const cookieBegin = setCookie.search('fshare');
            const cookieEnd = setCookie.search(';');
            cookie = setCookie.slice(cookieBegin, cookieEnd);
        }

        //get redirect link
        const redirectLink = response.headers.get('location');
        await logger.info('redirect link: ' + redirectLink);
        const options = new Options.GET(cookie);
        response = await fetch(redirectLink, options); 
        await logger.info('status: ' + response.status);
    }

}

module.exports = logout;