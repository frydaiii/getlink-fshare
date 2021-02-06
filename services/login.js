//login to fshare.vn and return token + cookie

const FormData = require('form-data');
const fetch = require('node-fetch');
const Options = require('../methods/request-options');
const originTokenCookie = require('./origin-token-cookie');
const getToken = require('../methods/get-token');
const logger = require('../methods/logger');

async function login(token, cookie, email, password) {
    const form = new FormData();
    form.append('_csrf-app', token);
    form.append('LoginForm[email]', email);
    form.append('LoginForm[password]', password);
    form.append('LoginForm[rememberMe]', 1);

    const options = new Options.POST(form, cookie);

    const response = await fetch('https://www.fshare.vn/site/login', options)
    // const response = await fetch('http://localhost:8081/testurl', options);

    return response;
}

async function main(email, password) {
    try {

        await logger.info('getting token and cookie...');
        let [token, cookie] = await originTokenCookie();
        await logger.info(token + '\n' + cookie);
        await logger.info('logging in ...');
        let response = await login(token, cookie, email, password);
        await logger.info('status: ' + response.status);
        
        
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
        
        let plainHtml = await response.text();
        token = getToken(plainHtml);
        
        return [token, cookie]
    } catch (err) {
        throw new Error('login service: ' + err);
    }
}

module.exports = main;

