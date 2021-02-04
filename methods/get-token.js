//get token from html plain string

function getToken(plain) {
    const key = '<meta name="csrf-token" content="';
    const keyBegin = plain.search(key);
    const keyEnd = keyBegin + key.length;
    
    const tokenBegin = plain.indexOf('"', keyEnd - 1) + 1;
    const tokenEnd = plain.indexOf('"', tokenBegin + 1);
    const token = plain.slice(tokenBegin, tokenEnd);

    return token;
}

module.exports = getToken;