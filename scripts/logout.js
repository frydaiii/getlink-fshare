const get = require('../services/redis-command').get;
const Options = require('../methods/request-options');
const fetch = require('node-fetch');
const cookie = get.key("cookie");

async function logout(cookie) {
    await console.log('logging out');
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
        await console.log('redirect link: ' + redirectLink);
        const options = new Options.GET(cookie);
        response = await fetch(redirectLink, options); 
        await console.log('status: ' + response.status);
    }
    
}
logout(cookie);