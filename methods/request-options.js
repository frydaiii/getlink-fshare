class PostOptions {
    constructor(form, cookie) {
        this.method = 'POST'; 
        this.headers = {
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.104 Safari/537.36',
            'accept': '*/*',
            'host': 'www.fshare.vn',
            'accept-encoding': 'gzip, deflate, br',
            'connection': 'keep-alive',
            'cookie': cookie,
            'dnt': 1,
            'sec-ch-ua': '"Chromium";v="88", "Google Chrome";v="88", ";Not A Brand";v="99"',
            'sec-ch-ua-mobile': '?0'
        };
        this.body = form;
        this.redirect = 'manual';
    }
}

class GetOptions {
    constructor(cookie) {
        this.method = 'GET'; 
        this.headers = {
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.104 Safari/537.36',
            'accept': '*/*',
            'host': 'www.fshare.vn',
            'accept-encoding': 'gzip, deflate, br',
            'connection': 'keep-alive',
            'cookie': cookie,
            'dnt': 1,
            'sec-ch-ua': '"Chromium";v="88", "Google Chrome";v="88", ";Not A Brand";v="99"',
            'sec-ch-ua-mobile': '?0'
        };
        this.redirect = 'manual';
    }
}

exports.POST = PostOptions;
exports.GET = GetOptions;