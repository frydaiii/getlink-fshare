//get cookie and origin token

const fetch = require('node-fetch');
const getToken = require('../methods/get-token');

async function originTokenCookie() {

    const response = await fetch('https://www.fshare.vn/site/login');
    
    const plainHtml = await response.text();
    const token = getToken(plainHtml);
    const setCookie = response.headers.get('set-cookie');
    const cookieBegin = setCookie.search('fshare');
    const cookieEnd = setCookie.search(';');
    const cookie = setCookie.slice(cookieBegin, cookieEnd);
    
    return [token, cookie];
}

module.exports = originTokenCookie;